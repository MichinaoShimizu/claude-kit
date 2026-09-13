# verify-docs-checklist

対象範囲: `AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`、`README.md`、`agent-layout/README.md`、および `verify-docs/` の `README.md`、`CONTRIBUTING.md`、`docs/*.md`、`.agents/skills/**/*.md`。各パッケージルートで検査する。

## verify-docs — 2026-09-13T18:50:12+0900

- [x] リポジトリルート: `AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`、`README.md` — 2026-09-13 / 参照・孤立・サイズ・機械的重複の違反なし
- [x] `agent-layout/README.md` — 2026-09-13 / 参照・孤立・サイズ・機械的重複の違反なし
- [x] `verify-docs/` の20文書: `README.md`、`CONTRIBUTING.md`、`docs/*.md`、`.agents/skills/**/*.md` — 2026-09-13 / 参照・孤立・サイズ・機械的重複の違反なし

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 25文書（ルート4件・agent-layout 1件・verify-docs 20件） |
| 実施 | 3つのルートで構造検査 |
| 最終検査 | `node verify-docs/scripts/verify-docs.mjs`、`--root=agent-layout`、`verify-docs/` で違反0件 |
| 判断保留 | なし |

## dedupe-docs — 2026-09-13T18:50:12+0900

- [x] リポジトリルート: `AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`、`README.md` — 2026-09-13 / 役割が異なるため統合対象なし
- [x] `agent-layout/README.md` — 2026-09-13 / パッケージ固有の導入・同期手順であり統合対象なし
- [x] `verify-docs/` の20文書: `README.md`、`CONTRIBUTING.md`、`docs/*.md`、`.agents/skills/**/*.md` — 2026-09-13 / 正本とポインタの役割分担を確認。確信できる意味的重複なし

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 25文書（ルート4件・agent-layout 1件・verify-docs 20件） |
| 実施 | AST抽出結果と原文を照合し、意味的重複を確認 |
| 最終検査 | 3ルート再検査で重複・準一致重複・リンク・サイズ違反0件 |
| 判断保留 | なし |

## tighten-docs — 2026-09-13T18:50:12+0900

- [x] リポジトリルート: `AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`、`README.md` — 2026-09-13 / 入口・ルーティング情報として必要。安全に削れる表現なし
- [x] `agent-layout/README.md` — 2026-09-13 / 導入・同期の条件と手順は必要。安全に削れる表現なし
- [x] `verify-docs/` の20文書: `README.md`、`CONTRIBUTING.md`、`docs/*.md`、`.agents/skills/**/*.md` — 2026-09-13 / 語句・重複・Markdown表現のパターンを確認。意味を変えずに削れる表現なし

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 25文書（ルート4件・agent-layout 1件・verify-docs 20件） |
| 実施 | 分割済みの典型パターンを文書ごとに確認 |
| 最終検査 | 3ルート再検査で構造違反0件 |
| 判断保留 | なし |

## 完了レコード

更新: 2026-09-13T18:53:54+0900

| 項目 | 結果 |
| --- | --- |
| 検査範囲 | 25文書 / 見出し112件 / 段落261件 / 73,696B |
| 検出・是正 | 構造違反0件、機械的重複0件、意味的重複0件、最終違反0件 |
| 作業時間 | 18:50〜18:53（3分42秒） |
| TODO | なし |

#### 変更

| 対象 | 操作 | サイズ変化 | 根拠 |
| --- | --- | ---: | --- |
| 文書構造 | 変更なし | 変更なし | 3ルートの構造検査で違反0件 |

#### 残件・注記

- なし
