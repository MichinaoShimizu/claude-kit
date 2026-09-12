# verify-docs-checklist

## verify-docs — 2026-09-12T23:45:02+0900

### リポジトリ直下（node scripts/verify-docs.mjs, 3件）

- [x] README.md — 2026-09-12 / 違反なし
- [x] CLAUDE.md — 2026-09-12 / 違反なし
- [x] CONTRIBUTING.md — 2026-09-12 / 違反なし

### verify-docs パッケージ単体（node scripts/verify-docs.mjs --root=verify-docs, 8件）

- [x] verify-docs/README.md — 2026-09-12 / 違反なし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-12 / 違反なし
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-12 / 違反なし

### 総評

- 検査したファイル数: リポジトリ直下 3件 + verify-docsパッケージ単体 8件（重複無しの別スコープ、合計11件）
- 検出した違反・重複の件数: 0件（両スコープとも「文書構造: すべて通過」）
- 作業にかかった時間: 開始・終了ともに 2026-09-12 内、数分程度（是正作業無しのため計測省略）
- 全体のサイズ変化: サイズ変更なし（本回は検査のみで是正対象なし）
- 常時読み込み→オンデマンド化: 該当なし

## dedupe-docs

（未実施）

## tighten-docs — 2026-09-13T00:03:15+0900

- [x] README.md — 2026-09-13 / 該当パターンなし
- [x] CLAUDE.md — 2026-09-13 / 該当パターンなし
- [x] CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/README.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/SKILL.md — 2026-09-13 / 該当パターンなし（既存の圧縮履歴あり、checklist-summary.md 参照）
- [x] verify-docs/.claude/skills/verify-docs/references/config.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/verify-docs/references/checklist.md — 2026-09-13 / 「自分のセクションだけ書き換え、他は触らない」という同じ説明が3箇所に重複 → 2箇所を削除し1箇所に集約 / 5,704B → 5,579B（2.2%減）
- [x] verify-docs/.claude/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 該当パターンなし（総評見出し変更後も該当なし）
- [x] verify-docs/.claude/skills/tighten-docs/SKILL.md — 2026-09-13 / 該当パターンなし
- [x] verify-docs/.claude/skills/dedupe-docs/SKILL.md — 2026-09-13 / 該当パターンなし（既存の圧縮履歴あり、checklist-summary.md 参照）

### 総評

- 検査したファイル数: 11件（リポジトリ直下3件 + verify-docsパッケージ単体8件）
- 検出した違反・重複の件数: 1件（checklist.md内の「自分のセクションだけ書き換え、他は触らない」の3重説明。他10件は該当パターンなし）
- 作業にかかった時間: 2026-09-13 内、数分程度
- 全体のサイズ変化: checklist.md 5,704B → 5,579B（125B減、2.2%減）。合計 54,637B → 54,512B
- 常時読み込み→オンデマンド化: 該当なし
