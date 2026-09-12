# この一式を改修する際の作法

本ファイルは `verify-docs.mjs` 自体・`SKILL.md`・`references/config.md` を
改修する側の作法を扱う。利用側の手順は [README.md](README.md) を参照する。

- **改修後、自身に対して検査を通過させる（ドッグフーディング）。** 本
  リポジトリ（claude-kit）では [ci-selfcheck.sh](ci-selfcheck.sh) を
  実行すればよい。CI がこれをどう自動探索して実行するかは
  [../README.md「本リポジトリ自身の CI」](../README.md#本リポジトリ自身の-ci)
  を参照する
- **挙動を変更した場合、`SKILL.md`・`references/config.md`・README.md の
  該当箇所を同一コミットで更新する。** コードのみ改修し説明が旧状態の
  まま残ると、本一式自体が「文書の重複・不整合」を発生させる（本ツールが
  検査対象とする事象そのもの）。**`DEFAULTS` にキーを追加した場合は、
  設定項目名の正本である `references/config.md` の表への追記を
  `verify-docs.test.mjs`（「every DEFAULTS key is documented in
  config.md」）が機械的に検査する。** README.md 側は個々のキー名を
  列挙しない（正本の位置づけは [config.md](.claude/skills/verify-docs/references/config.md)
  を参照）
- **「機械的に真偽が判定できるか」を超える判断**（表記ゆれの許容、
  意味的な類似判定など）は、チェッカー（`scripts/verify-docs.mjs`）には
  組み込まない。必要であれば [dedupe-docs スキル](.claude/skills/dedupe-docs/SKILL.md)
  のような別スキルに切り出す
- **「守ること」は本一式自体にも適用する。** 既存説明の書き直しにおいても、
  意味を変える書き換えと構造のみの是正は別コミットとする

## 対象外とする範囲

- **文章の品質・正確性の検査。** 内容の正否は検査対象外とする
- **「何を MUST とすべきか」の判断。** 構造（参照・サイズ・重複）は検査するが、
  内容面の編集方針への介入は行わない
- **文章を機械的に簡潔化する提案。** 冗長性の判定は主観を伴うため、本
  ツールでは自動化しない。判断は執筆者本人、または対象リポジトリの原則
  審査に委ねる（[SKILL.md](.claude/skills/verify-docs/SKILL.md) の
  「1. 入口を軽くする」を参照）
- **Markdown 以外（`.mdx`・`.rst` など）の検査。** 対象読者（生成AIエージェント
  が読む CLAUDE.md・README・`.claude/skills/`）は Markdown への統一を前提と
  する構成のため、他形式への対応はスコープ外とする
- **CLAUDE.md のような「索引の表」と実体（`.claude/skills/` 配下のスキルや
  サブエージェント定義など）の突合。** 見出し名がリポジトリ固有になりやすく、
  汎用検査への適用が困難である。個別リポジトリで必要な場合は、専用スクリプト
  （investment-analysis の `verify-doc-links.mjs` 相当）で対応する
- **`verify-docs.todo.json` への期限・優先度等のフィールド追加。**
  `path` と `reason` のみに限定することで、運用上の TODO 自体の肥大化を
  防止している（[README.md「TODO の管理方法」](README.md#todo-の管理方法)を参照）
