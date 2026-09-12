# verify-docs-checklist

## verify-docs — 2026-09-13T01:15:56+0900

### リポジトリ直下（node scripts/verify-docs.mjs, 3件）

- [x] README.md — 2026-09-13 / 違反なし
- [x] CLAUDE.md — 2026-09-13 / 違反なし
- [x] CONTRIBUTING.md — 2026-09-13 / 違反なし

### verify-docs パッケージ単体（ci-selfcheck.sh 経由, 8件）

- [x] verify-docs/README.md — 2026-09-13 / 違反なし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-13 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-13 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-13 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 違反なし
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-13 / 違反なし（本セッションでパターンを19件→23件に拡充後も上限内）
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-13 / 違反なし（本セッションでパターンを1件追加後も上限内）

### 総評

- 検査したファイル数: リポジトリ直下 3件 + verify-docsパッケージ単体 8件（重複無しの別スコープ、合計11件）
- 検出した違反・重複の件数: 0件（両スコープとも「文書構造: すべて通過」）
- 作業にかかった時間: 2026-09-13 01:15 〜 01:16（所要1分程度）
- 全体のサイズ変化: サイズ変更なし（本回はチェック実行のみ）
- 常時読み込み→オンデマンド化: 該当なし

## dedupe-docs — 2026-09-13T01:15:56+0900

- [x] README.md — 2026-09-13 / 重複なし
- [x] CLAUDE.md — 2026-09-13 / 重複なし
- [x] CONTRIBUTING.md — 2026-09-13 / 重複なし
- [x] verify-docs/README.md — 2026-09-13 / SKILL.mdと「チェッカー/プレイブックの分離」の説明が概念的に重なる（下記参照）→ 確信持てず人へ報告、統合しない
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-13 / 上記README.mdの項目と概念重複あり（確信持てず報告のみ）
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-13 / 重複なし（本セッションで追加したパターンは他文書に存在しないことをgrepで確認済み）
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-13 / 重複なし

### 総評

- 検査したファイル数: 11件
- 検出した違反・重複の件数: 1件（確信が持てず人への報告のみ。統合は未実施）。詳細:
  verify-docs/README.md「1. チェッカー・2. プレイブック」の説明と
  verify-docs/.claude/skills/verify-docs/SKILL.md「チェッカーとプレイブックの分離」の説明が、
  チェッカーの検査3点（参照切れ・孤立、サイズ超過、重複）とプレイブックの役割という同じ
  概念を別の言葉で説明している。ただしREADME側は「読む量の予算」という導入判断の
  観点・tighten-docsへのポインタを追加で持ち、SKILL.md側は「同一の回で両方を兼務させない
  （判断軸の精度低下を防ぐ）」という実行時の理由を追加で持ち、対象読者（導入検討者 vs
  実行するエージェント）も異なる。「意味が重なるのは一部だけ」に該当し、統合すると
  どちらかの固有情報を失うため、確信できる重複とは判断せず、統合は見送り本欄で報告する
  に留める。要判断: 統合するか、意図的な重複として `allow-duplicate` を付与するか、
  このままでよいか
- 作業にかかった時間: 2026-09-13 01:15 〜 01:20（所要5分程度）
- 全体のサイズ変化: サイズ変更なし（統合を見送ったため）
- 常時読み込み→オンデマンド化: 該当なし

## tighten-docs — 2026-09-13T01:15:56+0900

- [x] README.md — 2026-09-13 / 該当パターンなし
- [x] CLAUDE.md — 2026-09-13 / 該当パターンなし
- [x] CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/README.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-13 / 該当パターンなし（本セッションで新規追加した23パターン自体が該当箇所を含まないことを確認）
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-13 / 該当パターンなし

### 総評

- 検査したファイル数: 11件
- 検出した違反・重複の件数: 0件（該当パターンなし）
- 作業にかかった時間: 2026-09-13 01:15 〜 01:22（所要7分程度）
- 全体のサイズ変化: サイズ変更なし（合計 54,600B台、本回で変更した文書なし）
- 常時読み込み→オンデマンド化: 該当なし
