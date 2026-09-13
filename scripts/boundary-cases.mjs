/**
 * 境界の検査そのものを検査する。
 *
 * `schema.json` は層2 を流れるデータの契約で、その契約を実際に効かせているのは
 * `validateAgainstSchema` の実装である。**実装は送り出す側と受け取る側に1つずつあり、
 * どちらも同じように振る舞わなければ「検査が両側にある」は嘘になる。**
 * そこでこのファイルも両側に同じものを置き、両方の CI で走らせる。
 *
 * ここで使うスキーマもデータも、全部この中で作る。実物を読みに行かないのは、
 * 検査の正しさが「いまたまたま入っている値」や「いま R2 にある契約」に
 * 依存しないようにするため。ここが見ているのは**実装が契約の書き方を
 * 正しく解釈するか**であって、契約の中身そのものではない。
 *
 * 期待する振る舞いが変わったら、**両側のこのファイルを直すこと。**
 * 片方だけ直すと、片方だけが通る状態になる（この状態は今のところ機械では検出できない）。
 */

/** 本物の契約と同じ書き方だけを含む、検査用のスキーマ */
export const TEST_SCHEMA = {
  schemaVersion: '9.9.9',
  'x-forbiddenKeys': ['gender', 'nationality', 'all_ranking', 'address'],
  type: 'object',
  required: ['schemaVersion', 'basicInfo', 'biography', 'career'],
  properties: {
    schemaVersion: { type: 'string' },
    basicInfo: {
      type: 'object',
      required: ['name', 'birthday'],
      properties: {
        name: { type: 'object', required: ['ja'] },
        birthday: { type: 'string', pattern: '^[0-9]{4}$' },
      },
    },
    biography: { type: 'object', required: ['short'], properties: { short: { type: 'string' } } },
    career: {
      type: 'array',
      items: { type: 'object', required: ['organization'] },
    },
  },
};

/** TEST_SCHEMA を満たす最小のデータ */
export const buildMinimalValid = () => ({
  schemaVersion: TEST_SCHEMA.schemaVersion,
  basicInfo: { name: { ja: { first: '太郎', last: '見本' } }, birthday: '2000' },
  biography: { short: '見本' },
  career: [{ organization: '見本株式会社' }],
});

/** 期待する振る舞い。`expect` は 'pass' か、問題の文言に必ず含まれるべき文字列 */
export const cases = [
  { name: '最小の正しいデータは通る', mutate: () => {}, expect: 'pass' },
  {
    name: '公開しないと決めた項目（gender）は落ちる',
    mutate: (d) => { d.basicInfo.gender = 'なにか'; },
    expect: 'gender',
  },
  {
    name: '深い階層に紛れ込んだ禁止キーも見つかる',
    mutate: (d) => { d.career[0].address = '東京都〜'; },
    expect: 'address',
  },
  {
    name: 'スキーマに書かれていない枝の中でも禁止キーは見つかる',
    mutate: (d) => { d.strengths_finder = { all_ranking: ['1', '2'] }; },
    expect: 'all_ranking',
  },
  {
    name: '生年に完全な生年月日が入っていたら落ちる',
    mutate: (d) => { d.basicInfo.birthday = '2000-07-04'; },
    expect: '形が',
  },
  {
    name: '必須が欠けていたら落ちる',
    mutate: (d) => { delete d.biography; },
    expect: 'biography',
  },
  {
    name: 'スキーマの版が違えば落ちる',
    mutate: (d) => { d.schemaVersion = '0.0.1'; },
    expect: 'schemaVersion',
  },
  {
    name: '配列であるべきところがオブジェクトなら落ちる',
    mutate: (d) => { d.career = { organization: '見本' }; },
    expect: '配列であるべき',
  },
];

/** 全ケースを走らせ、期待どおりでなかったものを返す */
export const runCases = (validate, schema = TEST_SCHEMA) => {
  const failures = [];

  for (const c of cases) {
    const data = buildMinimalValid();
    c.mutate(data);
    const problems = validate(data, schema);

    if (c.expect === 'pass') {
      if (problems.length > 0) {
        failures.push(`${c.name}: 通るはずが落ちた → ${problems.join(' / ')}`);
      }
      continue;
    }

    if (problems.length === 0) {
      failures.push(`${c.name}: 落ちるはずが通った`);
    } else if (!problems.some((p) => p.includes(c.expect))) {
      failures.push(`${c.name}: 落ちたが理由が違う（「${c.expect}」を含むはず） → ${problems.join(' / ')}`);
    }
  }

  return failures;
};

/**
 * 実際の契約（schema.json）に、守らせたい条項が残っているかを見る。
 *
 * 上のケースは実装を見ているだけなので、契約から `x-forbiddenKeys` を
 * 消されたら何も言わずに通る。**消せることが問題**なので、ここで別に見る。
 */
export const checkContract = (schema) => {
  const problems = [];
  const forbidden = schema['x-forbiddenKeys'] ?? [];

  for (const key of ['gender', 'nationality', 'all_ranking']) {
    if (!forbidden.includes(key)) {
      problems.push(`x-forbiddenKeys から "${key}" が消えている（公開しないと決めた項目）`);
    }
  }

  const birthday = schema.properties?.basicInfo?.properties?.birthday;
  if (birthday?.pattern !== '^[0-9]{4}$') {
    problems.push(`basicInfo.birthday の pattern が年だけの形になっていない（実際は ${birthday?.pattern ?? '（無し）'}）`);
  }

  return problems;
};
