# この一式の改修作法

本ファイルは `document-structure-verifier.mjs` 自体・`SKILL.md`・`references/config.md` を
改修する側の作法を扱う。利用側の手順は [README.md](README.md) を参照する。

- 改修後、自身に対して検査を通過させる（ドッグフーディング）。本リポジトリ
  （claude-kit）では [ci-selfcheck.sh](ci-selfcheck.sh) を実行すればよい。
  CI の自動探索方法は
  [リポジトリのCI定義](../../.github/workflows/ci.yml)
  を参照する
- 挙動を変更した場合、`SKILL.md`・`references/config.md`・README.md の
  該当箇所を同一コミットで更新する（コードのみ改修し説明が旧状態のまま
  残ると、本一式自体が文書の重複・不整合を起こす）。`DEFAULTS` にキーを
  追加した場合、正本である `references/config.md` の表への追記を
  `document-structure-verifier.test.mjs`（「every DEFAULTS key is documented in
  config.md」）が機械的に検査する。README.md 側は個々のキー名を列挙しない
  （正本は [config.md](.agents/skills/verify-docs/references/config.md)）
- 「機械的に真偽が判定できるか」を超える判断（表記ゆれの許容、意味的な
  類似判定など）は[文書構造検証器](docs/structure.md#文書構造検証器)に組み込まない。必要なら
  [dedupe-docs スキル](.agents/skills/dedupe-docs/SKILL.md) のような
  別スキルに切り出す
- 「不変条件」は本一式自体にも適用する。既存説明の書き直しでも、意味を
  変える書き換えと構造のみの是正は別コミットとする

## 制約と対象外

- 文章の品質・正確性の検査（内容の正否は検査対象外）
- 「何を MUST とすべきか」の判断（構造は検査するが、内容面の編集方針への
  介入は行わない）
- 文章を機械的に簡潔化する提案（冗長性の判定は主観を伴うため自動化しない。
  判断は執筆者本人、または対象リポジトリの原則審査に委ねる。
  [SKILL.md](.agents/skills/verify-docs/SKILL.md)「1. 入口を軽くする」参照）
- Markdown 以外（`.mdx`・`.rst` など）の検査（対象読者が読む文書は Markdown
  への統一を前提とする構成のため、他形式への対応はスコープ外）
- CLAUDE.md のような「索引の表」と実体（`.agents/skills/` 配下のスキルや
  サブエージェント定義など）の突合（見出し名がリポジトリ固有になりやすく
  汎用検査への適用が困難。個別リポジトリで必要な場合は専用スクリプトで
  対応する）
- `document-size-exceptions.json` への期限・優先度等のフィールド追加（`path` と
  `reason` のみに限定し、運用上の文書サイズ例外一覧自体の肥大化を防止する。
  [導入と運用「文書サイズ例外の管理」](docs/adoption.md#文書サイズ例外の管理)参照）
