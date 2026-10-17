/** スキーマの最小表現。層2の schema.json がこの形をしている */
export interface SchemaSpec {
  type: 'object' | 'array' | 'string';
  required?: string[];
  properties?: Record<string, SchemaSpec>;
  items?: SchemaSpec;
  schemaVersion?: string;
  'x-forbiddenKeys'?: string[];
  /** 場所で禁止する。`[*]` は配列の任意の要素 */
  'x-forbiddenPaths'?: string[];
}

/** 検査に失敗した理由をすべて返す。空配列なら合格 */
export declare const validateAgainstSchema: (data: unknown, schema: SchemaSpec) => string[];
