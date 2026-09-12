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
- [x] verify-docs/README.md — 2026-09-13 / SKILL.mdと「チェッカー/プレイブックの分離」の説明が概念的に重なる（下記参照）→ 人へ報告後、マージ指示を受け「## チェッカー・プレイブック」見出しを追加した上でSKILL.md側からポインタ化して統合
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-13 / 上記README.mdの項目と概念重複 → 一覧の再掲を削除しREADME.mdへのポインタに置換。SKILL.md固有の「同一の回で両方を兼務させない」ルールは維持
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 重複なし
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-13 / 重複なし（本セッションで追加したパターンは他文書に存在しないことをgrepで確認済み）
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-13 / 重複なし

### 総評

- 検査したファイル数: 11件
- 検出した違反・重複の件数: 1件（人へ報告後、マージ指示を受け統合済み）。詳細:
  verify-docs/README.md「チェッカー・プレイブック」の説明と
  verify-docs/.claude/skills/verify-docs/SKILL.md「チェッカーとプレイブックの分離」の説明が、
  チェッカーの検査3点（参照切れ・孤立、サイズ超過、重複）とプレイブックの役割という同じ
  概念を別の言葉で説明していた。README側にのみあった「読む量の予算」という導入判断の
  観点・tighten-docsへのポインタは維持しつつ本来の説明として残し、SKILL.md側は
  一覧の再掲を削除してREADME.mdへのポインタに置換。SKILL.md固有の「同一の回で両方を
  兼務させない（判断軸の精度低下を防ぐ）」という実行時の理由は本文に維持した
  （固有情報を落とさず統合）
- 作業にかかった時間: 2026-09-13 01:15 〜 01:25（所要10分程度）
- 全体のサイズ変化: README.md に見出し追加（+11B）、SKILL.mdの一覧をポインタに置換
  （約280B減）。統合により正本が1箇所に
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
