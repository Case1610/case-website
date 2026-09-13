/**
 * 層1（原本）と 層3（サイト）の境界で、層2 を流れるデータを検査する。
 *
 * スキーマの正本は層2（R2 の schema.json）にあり、このファイルはその検査を走らせる側。
 * **同じ内容のものが、送り出す側と受け取る側の両方にある。**
 * 片側だけの検査は、もう片側が黙って形を変えられることを意味するため意味がない。
 *
 * 検査は2種類ある。向きが逆なので、どちらか片方では足りない。
 *
 * - `required` / `type` / `pattern` … **入っているべきものが入っているか**
 * - `x-forbiddenKeys`           … **入っていてはいけないものが入っていないか**
 *
 * 後者が無いと、原本の側で新しい項目を足したときに、公開してよいかの判断を
 * 誰も通さないまま配信経路に乗る。スキーマは「あるべき形」だけを書くと、
 * 「書かれていないものは何でも通る」という意味になってしまう。
 *
 * ライブラリを入れずに書いているのは、検査したい形が小さいため。
 * 入れ子の深い検証が必要になったら ajv などに置き換えてよい。
 */

/** 検査に失敗した理由を全部集めて返す。最初の1件で止めない */
export const validateAgainstSchema = (data, schema) => {
  const problems = [];

  const check = (value, spec, path) => {
    if (spec.type === 'object') {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        problems.push(`${path}: オブジェクトであるべき（実際は ${describe(value)}）`);
        return;
      }
      for (const key of spec.required ?? []) {
        if (!(key in value)) {
          problems.push(`${path}.${key}: 必須だが存在しない`);
        }
      }
      for (const [key, childSpec] of Object.entries(spec.properties ?? {})) {
        if (key in value) check(value[key], childSpec, `${path}.${key}`);
      }
      return;
    }

    if (spec.type === 'array') {
      if (!Array.isArray(value)) {
        problems.push(`${path}: 配列であるべき（実際は ${describe(value)}）`);
        return;
      }
      if (spec.items) value.forEach((item, i) => check(item, spec.items, `${path}[${i}]`));
      return;
    }

    if (spec.type === 'string') {
      if (typeof value !== 'string') {
        problems.push(`${path}: 文字列であるべき（実際は ${describe(value)}）`);
        return;
      }
      // 形の制約。たとえば生年は「年だけ」であって、完全な生年月日が
      // 入ってきたら通してはいけない。キーの名前だけでは区別がつかない
      if (spec.pattern && !new RegExp(spec.pattern).test(value)) {
        problems.push(`${path}: 形が ${spec.pattern} に合わない（実際は "${value}"）`);
      }
    }
  };

  check(data, schema, '$');

  // 入っていてはいけないキーを、入れ子の全階層で探す。
  // 「公開しないと決めたもの」は決定であって、忘れたころに別の経路から
  // 戻ってくる。その戻り道を機械が塞ぐ
  for (const key of schema['x-forbiddenKeys'] ?? []) {
    for (const path of findKey(data, key)) {
      problems.push(`${path}: このキーは配信してはいけない（x-forbiddenKeys）`);
    }
  }

  if (schema.schemaVersion && data?.schemaVersion !== schema.schemaVersion) {
    problems.push(
      `$.schemaVersion: スキーマは ${schema.schemaVersion} を期待しているが、` +
      `データは ${data?.schemaVersion ?? '（無し）'}`
    );
  }

  return problems;
};

/** value の中から key という名前のプロパティを全部探して、その場所を返す */
const findKey = (value, key, path = '$') => {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, i) => found.push(...findKey(item, key, `${path}[${i}]`)));
    return found;
  }
  if (value === null || typeof value !== 'object') return found;
  for (const [k, v] of Object.entries(value)) {
    if (k === key) found.push(`${path}.${k}`);
    found.push(...findKey(v, key, `${path}.${k}`));
  }
  return found;
};

const describe = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return '配列';
  return typeof value;
};
