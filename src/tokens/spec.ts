/**
 * デザインシステム（別リポジトリ）のトークンの数値。**写しであって原本ではない。**
 *
 * 原本は向こうの `public/tokens.json` で、
 * https://design-system.1610-case.workers.dev/tokens.json として配信されている。
 *
 * **このファイルは手で書かない。** `npm run sync:tokens` が原本から作り直す。
 * ずれたまま配られないよう、CI が `npm run verify:tokens` で突き合わせて落とす。
 *
 * なぜ依存（npm パッケージ）にしないか: 依存を先に張ると、片方を触るたびに
 * 両方を動かす羽目になる。デザインシステムはまだ毎週かたちが変わる段階なので、
 * いまは写しで受け、ずれたら揃える。**揃える回数が増えてきた時点が、依存に切り替える合図。**
 */
export const spec = {
  "$comment": [
    "トークンの数値の正本。ここが原本で、themes.css.ts はこれを読んで oklch() を組む。",
    "public/ に置いてあるのは、ビルドせずにそのまま /tokens.json として配信されるため。",
    "写しを持つ側（いまはポートフォリオサイト）は、この URL と自分の写しを CI で突き合わせる。",
    "l は明度のパーセント、c は彩度、色相は色相スロット名で持つ（実行時に差し替わるため値で書けない）。"
  ],
  "specVersion": 1,
  "hue": {
    "default": 265,
    "cssVar": "--ds-hue"
  },
  "chroma": {
    "neutral": 0.008,
    "brand": 0.17
  },
  "statusHue": {
    "danger": 27,
    "warning": 70,
    "success": 150,
    "info": 245
  },
  "statusHueVar": {
    "danger": "--ds-hue-danger",
    "warning": "--ds-hue-warning",
    "success": "--ds-hue-success",
    "info": "--ds-hue-info"
  },
  "color": {
    "light": {
      "roles": {
        "bg": {
          "on": "neutral",
          "l": 97
        },
        "surface": {
          "on": "neutral",
          "l": 100
        },
        "border": {
          "on": "neutral",
          "l": 88
        },
        "textMuted": {
          "on": "neutral",
          "l": 54
        },
        "text": {
          "on": "neutral",
          "l": 35
        },
        "textStrong": {
          "on": "neutral",
          "l": 20
        },
        "brand": {
          "on": "brand",
          "l": 55
        },
        "brandHover": {
          "on": "brand",
          "l": 45
        },
        "onBrand": {
          "on": "neutral",
          "l": 100
        },
        "brandSubtle": {
          "on": "brand",
          "l": 95,
          "c": 0.03
        },
        "onStatus": {
          "on": "neutral",
          "l": 100
        }
      },
      "status": {
        "l": 45,
        "c": 0.15,
        "subtleL": 94,
        "subtleC": 0.04
      }
    },
    "dark": {
      "roles": {
        "bg": {
          "on": "neutral",
          "l": 15
        },
        "surface": {
          "on": "neutral",
          "l": 21
        },
        "border": {
          "on": "neutral",
          "l": 32
        },
        "textMuted": {
          "on": "neutral",
          "l": 62
        },
        "text": {
          "on": "neutral",
          "l": 85
        },
        "textStrong": {
          "on": "neutral",
          "l": 96
        },
        "brand": {
          "on": "brand",
          "l": 65,
          "c": 0.15
        },
        "brandHover": {
          "on": "brand",
          "l": 80,
          "c": 0.15
        },
        "onBrand": {
          "on": "neutral",
          "l": 15
        },
        "brandSubtle": {
          "on": "brand",
          "l": 28,
          "c": 0.05
        },
        "onStatus": {
          "on": "neutral",
          "l": 15
        }
      },
      "status": {
        "l": 72,
        "c": 0.13,
        "subtleL": 27,
        "subtleC": 0.05
      }
    }
  },
  "fluid": {
    "minVw": 320,
    "maxVw": 1440,
    "root": 16
  },
  "text": {
    "xs": [
      12,
      13
    ],
    "sm": [
      14,
      15
    ],
    "base": [
      16,
      17
    ],
    "lg": [
      18,
      21
    ],
    "xl": [
      22,
      27
    ],
    "2xl": [
      27,
      35
    ],
    "3xl": [
      33,
      45
    ]
  },
  "space": {
    "3xs": "0.125rem",
    "2xs": "0.25rem",
    "xs": "0.5rem",
    "sm": "0.75rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  }
} as const;
