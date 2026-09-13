# verify-docs-checklist

## verify-docs — 2026-09-13T13:44:29+0900

- [x] README.md > 使い方（11〜23行）
- [x] AGENTS.md > MUST（6〜19行）
- [x] AGENTS.md > 話題別の参照先（20〜28行）
- [x] CLAUDE.md（1行目）
- [x] CONTRIBUTING.md > 新規パッケージの追加（6〜11行）
- [x] CONTRIBUTING.md > 既存パッケージの改修（12〜17行）
- [x] CONTRIBUTING.md > ドキュメントの分割・移動（18〜22行）
- [x] CONTRIBUTING.md > PR 提出前（23〜30行）

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | README.md、AGENTS.md、CLAUDE.md、CONTRIBUTING.md |
| 実施 | ASTで抽出した章・段落を確認。リンク、入口、文書サイズ、構造違反を検査 |
| 最終検査 | `node verify-docs/scripts/verify-docs.mjs --root=.` — 違反 0 件 |
| 判断保留 | なし |

## dedupe-docs — 2026-09-13T13:54:21+0900

- [x] README.md・verify-docs/README.md・verify-docs/docs/structure.md の意味的重複候補

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | README.md、verify-docs/README.md、verify-docs/docs/structure.md |
| 実施 | AST段落一覧で、AST解析・チェッカー・構造抽出CLI・スキルの説明を照合 |
| 最終検査 | 統合対象 0 件。入口の要約・READMEの利用案内・詳細文書の技術仕様は役割が異なる |
| 判断保留 | なし |

## tighten-docs — 2026-09-13T13:44:29+0900

- [x] README.md・AGENTS.md・CLAUDE.md・CONTRIBUTING.md の冗長表現

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | README.md、AGENTS.md、CLAUDE.md、CONTRIBUTING.md |
| 実施 | AST章単位で重複語、不要な導入、曖昧語、過剰な箇条書きを確認 |
| 最終検査 | 意味を保ったまま削れる表現は検出されず、本文変更なし |
| 判断保留 | なし |

## 完了レコード

更新: 2026-09-13T13:46:29+0900

| 項目 | 結果 |
| --- | --- |
| 検査範囲 | 4 文書 / 12 見出し / 25 段落 / 4,785 B |
| 検出・是正 | 構造違反 0 件、統合対象 0 件、簡潔化 0 件 |
| 作業時間 | 2026-09-13T13:44:29+0900 〜 2026-09-13T13:46:29+0900 |
| TODO | なし |

#### 変更

本文変更なし。実行結果をこのチェックリストへ記録。

#### 残件・注記

- 4 文書はすべてファイル上限 7,000 B 未満。最大の葉セクションは AGENTS.md > MUST（920 B）で、分割検討の補助指標として記録。
