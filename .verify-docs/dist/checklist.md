# verify-docs-checklist

## verify-docs — 2026-09-13T14:02:08+0900

- [x] .agents/skills/verify-docs/SKILL.md > 手順（74〜148行）
- [x] .agents/skills/verify-docs/references/remediation.md
- [x] verify-docs.todo.json のサイズ超過TODO

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | `.agents/skills/verify-docs/SKILL.md`、`references/remediation.md`、`verify-docs.todo.json` |
| 実施 | 手順1〜6の本文を参照文書へ移動し、SKILL.mdには既存見出しと詳細へのポインタを残した。SKILL.mdから各参照文書への直接リンクも維持 |
| 最終検査 | `verify-docs/ci-selfcheck.sh`（40テスト）・`node verify-docs/scripts/verify-docs.mjs --root=verify-docs` — 違反 0 件 |
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
