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

## dedupe-docs — 2026-09-13T20:38:01+0900

- [x] `README.md > パッケージ`（5〜11行目） — 2026-09-13 / `verify-docs/README.md` は `excludePaths` により今回の探索範囲外。範囲内の文書との意味的重複なし
- [x] `AGENTS.md` — 2026-09-13 / ルーティング指示として固有。意味的重複なし
- [x] `CLAUDE.md` — 2026-09-13 / `AGENTS.md` への互換ポインタのみ。重複説明なし
- [x] `CONTRIBUTING.md` — 2026-09-13 / `AGENTS.md` への参照と貢献手順であり、意味的重複なし

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | `README.md`、`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md` |
| 実施 | 設定の検査範囲で意味的重複を探索。是正なし |
| 最終検査 | `node verify-docs/scripts/verify-docs.mjs --json` — 違反0件 |
| 判断保留 | ルート `README.md` と `verify-docs/README.md` の説明重複は、後者が `excludePaths` により範囲外のため本実行では判定対象外 |

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
