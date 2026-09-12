/**
 * 層2（R2）から受け取ったプロフィールを検査する。
 *
 * スキーマの正本は層2（R2 の schema.json）にあり、これはその検査を走らせる側。
 * 送り出す側（正本リポジトリの CI）も同じ schema.json で検査してからアップロードする。
 * 片側だけの検査は、もう片側が黙って形を変えられることを意味するため意味がない。
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

    if (spec.type === 'string' && typeof value !== 'string') {
      problems.push(`${path}: 文字列であるべき（実際は ${describe(value)}）`);
    }
  };

  check(data, schema, '$');

  if (schema.schemaVersion && data?.schemaVersion !== schema.schemaVersion) {
    problems.push(
      `$.schemaVersion: スキーマは ${schema.schemaVersion} を期待しているが、` +
      `データは ${data?.schemaVersion ?? '（無し）'}`
    );
  }

  return problems;
};

const describe = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return '配列';
  return typeof value;
};
