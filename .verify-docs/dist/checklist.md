# verify-docs-checklist

## verify-docs — 2026-09-13T09:59:42+0900

- [x] README.md — 2026-09-13 / 入口・参照・サイズに違反なし
- [x] AGENTS.md — 2026-09-13 / MUSTとルーティング表に限定、構造違反なし
- [x] CLAUDE.md — 2026-09-13 / AGENTS.mdへの入口のみ、構造違反なし
- [x] CONTRIBUTING.md — 2026-09-13 / README・AGENTS.mdへの参照に違反なし
- [x] agent-layout/README.md — 2026-09-13 / 参照先とサイズを手動確認、違反なし
- [x] verify-docs/README.md — 2026-09-13 / 導入後に実行方法を読む順序へ再構成、参照・サイズ・重複に違反なし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 参照・サイズ・重複に違反なし
- [x] verify-docs/docs/adoption.md — 2026-09-13 / 参照・サイズ・重複に違反なし
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / サイズ超過は既存TODOで明示、その他違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 違反なし
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / 違反なし

### 総評

- 検査対象: 18ファイル（機械検査はルート4件 + verify-docs 13件、agent-layout 1件は手動確認）
- 検出した違反: 0件（既存TODO例外1件）
- 作業にかかった時間: 2026-09-13 09:59:42 〜 10:01:15（所要1分33秒）
- 全体のサイズ変化: サイズ変更なし（合計62,173B）
- 常時読み込み→オンデマンド化: 該当なし
## dedupe-docs — 2026-09-13T13:00:46+0900

- [x] verify-docs/scripts/verify-docs.mjs — 2026-09-13 / AST段落収集へ移行、既存判定を維持
- [x] verify-docs/scripts/markdown-structure.mjs — 2026-09-13 / 強調差は正規化、リンク先・コードは区別
- [x] verify-docs/scripts/verify-docs.test.mjs — 2026-09-13 / 4ケース追加、35テスト通過
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / AST比較仕様を反映
- [x] verify-docs/README.md — 2026-09-13 / AST重複比較を記載
- [x] verify-docs/ci-selfcheck.sh・install.sh — 2026-09-13 / 既存の同梱・自己検査対象で実行確認

### 総評

- 検査対象: 5文書（コードの回帰検証は verify-docs 35テスト）
- 検出した意味的重複: 対象外（チェッカー改修であり、文書間の意味探索は未実施）
- 作業にかかった時間: 2026-09-13 13:00:46 〜 13:05:59（所要5分13秒）
- 全体のサイズ変化: 28,838B → 29,310B（472B増）
- 常時読み込み→オンデマンド化: 該当なし

### 総評

- 検査対象: 18ファイル
- 検出した意味的重複: 2件（いずれも正本へのポインタ化で解消）
- 作業にかかった時間: 2026-09-13 10:02:01 〜 10:02:51（所要50秒）
- 全体のサイズ変化: 62,173B → 61,242B（931B減、1.5%減）
- 常時読み込み→オンデマンド化: 該当なし
## tighten-docs — 2026-09-13T13:00:46+0900

- [ ] verify-docs/scripts/markdown-structure.mjs — 見出し配下のサイズ集計と階層規則を確認
- [ ] verify-docs/scripts/extract-doc-blocks.mjs — 集計結果の出力形式と既存CLI互換性を確認
- [ ] verify-docs/scripts/extract-doc-blocks.test.mjs — 空文書・入れ子見出し・バイト数のテストを確認
- [ ] verify-docs/.agents/skills/tighten-docs/SKILL.md — サイズ集計の用途と意味判断の境界を確認
- [ ] verify-docs/README.md — tighten向け集計機能の説明を確認
- [ ] verify-docs/ci-selfcheck.sh・install.sh — インストールと自己検査の対象を確認

### 総評

- 検査対象: 18ファイル
- 検出した冗長表現: 4件（2ファイル、すべて是正）。共通実行方法の明記1件
- 作業にかかった時間: 2026-09-13 10:03:27 〜 10:04:41（所要1分14秒）
- 全体のサイズ変化: 61,242B → 60,931B（311B減、0.5%減）
- 常時読み込み→オンデマンド化: 該当なし
