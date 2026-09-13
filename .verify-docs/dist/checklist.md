# verify-docs-checklist

## verify-docs — 2026-09-13T09:59:42+0900

- [x] README.md — 2026-09-13 / 入口・参照・サイズに違反なし
- [x] AGENTS.md — 2026-09-13 / MUSTとルーティング表に限定、構造違反なし
- [x] CLAUDE.md — 2026-09-13 / AGENTS.mdへの入口のみ、構造違反なし
- [x] CONTRIBUTING.md — 2026-09-13 / README・AGENTS.mdへの参照に違反なし
- [x] agent-layout/README.md — 2026-09-13 / 参照先とサイズを手動確認、違反なし
- [x] verify-docs/README.md — 2026-09-13 / 参照・サイズ・重複に違反なし
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
## dedupe-docs — 2026-09-13T10:02:01+0900

- [x] README.md — 2026-09-13 / 意味的重複なし
- [x] AGENTS.md — 2026-09-13 / 意味的重複なし
- [x] CLAUDE.md — 2026-09-13 / AGENTS.mdへのポインタのみ
- [x] CONTRIBUTING.md — 2026-09-13 / AGENTS.mdのMUST再掲をポインタ化 / 1,424B → 1,317B（7.5%減）
- [x] agent-layout/README.md — 2026-09-13 / 互換構成の説明は単体配布に必要、重複なし
- [x] verify-docs/README.md — 2026-09-13 / 導入手順の正本として維持
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/docs/adoption.md — 2026-09-13 / READMEの導入手順再掲をポインタ化 / 3,582B → 2,758B（23.0%減）
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 単体配布に必要な互換詳細、重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 意味的重複なし
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / 意味的重複なし

### 総評

- 検査対象: 18ファイル
- 検出した意味的重複: 2件（いずれも正本へのポインタ化で解消）
- 作業にかかった時間: 2026-09-13 10:02:01 〜 10:02:51（所要50秒）
- 全体のサイズ変化: 62,173B → 61,242B（931B減、1.5%減）
- 常時読み込み→オンデマンド化: 該当なし
## tighten-docs — 2026-09-13T10:03:27+0900

- [x] README.md — 2026-09-13 / 見出し直後の同語反復を削減 / 1,635B → 1,600B（2.1%減）
- [x] AGENTS.md — 2026-09-13 / 該当パターンなし
- [x] CLAUDE.md — 2026-09-13 / 該当パターンなし
- [x] CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] agent-layout/README.md — 2026-09-13 / 冗長な条件・可能表現を削減 / 2,360B → 2,229B（5.6%減）
- [x] verify-docs/README.md — 2026-09-13 / 3スキルの連続実行方法を全エージェント共通の依頼として明記 / 3,354B → 3,209B（4.3%減）
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/docs/adoption.md — 2026-09-13 / 番号付き手順の動詞見出しは操作を明示するため維持
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / 判定基準の正本として維持

### 総評

- 検査対象: 18ファイル
- 検出した冗長表現: 4件（2ファイル、すべて是正）。共通実行方法の明記1件
- 作業にかかった時間: 2026-09-13 10:03:27 〜 10:04:41（所要1分14秒）
- 全体のサイズ変化: 61,242B → 60,931B（311B減、0.5%減）
- 常時読み込み→オンデマンド化: 該当なし
