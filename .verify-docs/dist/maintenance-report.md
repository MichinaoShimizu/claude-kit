# Maintenance Report

対象範囲: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md)、[packages/agent-layout/README.md](../../packages/agent-layout/README.md)、および [packages/verify-docs/](../../packages/verify-docs/) の Markdown 文書。各パッケージルートで検査する。

作業単位: リポジトリ Markdown の文章補正と検証記録の整備
開始: 2026-09-13T18:50:12+0900
最終更新: 2026-09-14T11:29:09+0900

## 実行履歴

| 試行 | 実行 | スキル | 主な変更 | 最終検査 |
| ---: | --- | --- | --- | --- |
| 1 | 18:50 | japanese-tech-writing | 見出し・用語・論理のつながりを補正 | 構造違反0件 |
| 2 | 22:26 | verify-docs・dedupe-docs・tighten-docs | 観点別の実行結果とファイル別サイズを記録 | 構造違反0件 |
| 3 | 22:35 | verify-docs・dedupe-docs・tighten-docs | 再実行の累積成果を保持する記録規約を追加 | 構造違反0件 |
| 4 | 22:45 | verify-docs・dedupe-docs・tighten-docs | パーマネントリンク方針、検査根拠、最終検査結果へ整理 | 構造違反0件 |
| 5 | 22:55 | verify-docs・dedupe-docs・tighten-docs | レビュー指摘を是正し、最終値を再計測 | 構造違反0件 |
| 6 | 23:07 | verify-docs・dedupe-docs・tighten-docs | 重複説明と旧形式例を削除し、参照先を正本へ集約 | 構造違反0件 |
| 7 | 23:15 | verify-docs・dedupe-docs・tighten-docs | タスク管理機能の記述を削除し、一時作業記録を正本化 | 構造違反0件 |
| 8 | 23:24 | verify-docs・dedupe-docs・tighten-docs | インストーラーで一時作業記録を除外し、自己検査を追加 | 構造違反0件 |
| 9 | 23:41 | verify-docs・dedupe-docs・tighten-docs | 文書単位の冗長性を削る規則と判断評価ケースを追加 | 構造違反0件 |
| 10 | 23:45 | verify-docs・dedupe-docs・tighten-docs | 同一文書内の節削除・節結合を圧縮手段として追加 | 構造違反0件 |
| 11 | 23:59 | verify-docs・dedupe-docs・tighten-docs | サイズ表を削減量・削減率で表示し、削減量順に整理 | 構造違反0件 |
| 12 | 00:20 | verify-docs・dedupe-docs・tighten-docs | 作業単位の定義を導入・運用文書へ集約 | 構造違反0件 |
| 13 | 10:39 | japanese-tech-writing | オブジェクトの和名・英名・ファイル名と参照規約を追加 | 構造違反0件 |
| 14 | 10:59 | 文書構造是正・文書重複解消・文書簡潔化スキル | 運用オブジェクトを定義し、文書内の呼称を和名リンクへ統一（agent-layoutは対象外） | 構造違反0件 |
| 15 | 11:06 | 文書構造是正・文書重複解消・文書簡潔化スキル | 最終の構造・意味的重複・冗長性を確認。追加是正なし | 構造違反0件 |
| 16 | 11:29 | japanese-tech-writing・文書構造是正スキル | ファイル名を basename にし、リポジトリ内パスと配布先パスを分離 | 構造違反0件 |

## 文書構造是正スキル

最終実行: 2026-09-14T11:29:09+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 構造検査を完了
- [x] [packages/agent-layout/README.md](../../packages/agent-layout/README.md) — 2026-09-13 / 構造検査を完了
- [x] [packages/verify-docs/](../../packages/verify-docs/) の22文書 — 2026-09-14 / 運用オブジェクトの定義と和名リンクの規約を整備
- [x] [README.md](../../README.md) と [packages/verify-docs/](../../packages/verify-docs/) — 2026-09-14 / ルート4文書・パッケージ22文書を再検査し、違反なし
- [x] [packages/verify-docs/docs/](../../packages/verify-docs/docs/) と [packages/verify-docs/.agents/skills/](../../packages/verify-docs/.agents/skills/) — 2026-09-14 / 正本・配布先・非配布の扱いを実装に合わせて定義

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 参照整合性 | Markdownリンク・画像リンク・断片リンク、設定した `pathRoots` に一致するバッククォート内のパスが解決できる | `node packages/verify-docs/scripts/document-structure-verifier.mjs` | リンク違反0件 |
| 孤立文書 | 入口文書または他の検査対象文書から到達できる | `node packages/verify-docs/scripts/document-structure-verifier.mjs` | 孤立違反0件 |
| 文書サイズ | `maxDocBytes` 以下、または文書サイズ例外一覧に理由を記録済みである | `node packages/verify-docs/scripts/document-structure-verifier.mjs` | サイズ違反0件 |
| 機械的重複 | 完全一致と、有効時の準一致の段落重複を検出・是正済みである | `node packages/verify-docs/scripts/document-structure-verifier.mjs` | 重複違反0件 |

最終検査: `bash packages/verify-docs/ci-selfcheck.sh`、`node packages/verify-docs/scripts/document-structure-verifier.mjs --root=.`、`git diff --check` — 違反0件

## 文書重複解消スキル

最終実行: 2026-09-14T11:06:47+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 意味的重複なし
- [x] [packages/agent-layout/README.md](../../packages/agent-layout/README.md) — 2026-09-13 / 意味的重複なし
- [x] [packages/verify-docs/](../../packages/verify-docs/) の22文書 — 2026-09-14 / 定義元を正本にし、他文書の和名リンクを確認
- [x] [README.md](../../README.md) と [packages/verify-docs/](../../packages/verify-docs/) — 2026-09-14 / 構造抽出した15文書を照合し、正本化が必要な意味的重複なし

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味的重複 | 言い換えによる同一の主張・手順・判断基準を確認した | 原文と抽出結果の照合 | 重複なし |
| 正本の配置 | 統合対象は詳細度と読者に合う文書を正本にした | 正本と統合元の原文 | 該当なし |
| ポインタ | 統合元から正本への案内が解決でき、内容を重ねていない | `node packages/verify-docs/scripts/document-structure-verifier.mjs` | 該当なし |
| 検査範囲外 | ルート `README.md` と `verify-docs/README.md` の説明重複 | `excludePaths` の設定 | 今回の意味的重複検査の対象外 |
| 判断保留 | 統合の確信が持てない候補を人の判断へ残した | 一時作業記録 | なし |

最終検査: 構造抽出した15文書の原文照合、`node packages/verify-docs/scripts/document-structure-verifier.mjs --root=packages/verify-docs` — 意味的重複・構造違反0件

## 文書簡潔化スキル

最終実行: 2026-09-14T11:06:47+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 安全に削れる表現なし
- [x] [packages/agent-layout/README.md](../../packages/agent-layout/README.md) — 2026-09-13 / 安全に削れる表現なし
- [x] [packages/verify-docs/](../../packages/verify-docs/) の22文書 — 2026-09-14 / 表記統一に伴う冗長な英名呼称を削除
- [x] [README.md](../../README.md) と [packages/verify-docs/](../../packages/verify-docs/) — 2026-09-14 / 意味を変えずに削れる冗長表現はなく、追加変更なし

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味の保持 | 数値・条件・手順順序・免責文言を変えていない | 変更前後の原文照合 | 通過 |
| 語句と文法 | 冗長な語句、形式名詞、不要な受け身などを確認した | 典型パターンと原文 | 通過 |
| 重複と文体 | 同一理由の反復、重言、文体の混在を確認した | 典型パターンと原文 | 通過 |
| 文書単位の冗長性 | 固有情報を持たない導入・参照案内・旧形式例の削除と、同役割の節結合の条件を定めた | パターン資料、実施手順、判断評価ケース | 通過 |
| Markdown表現 | 空行、強調、リンクテキスト、表、装飾の冗長さを確認した | 典型パターンと原文 | 通過 |

### ファイル別サイズ

| ファイル | 開始時点 | 最終 | 削減バイト数 | 開始時点からの削減率 |
| --- | ---: | ---: | ---: | ---: |
| [packages/verify-docs/.agents/skills/verify-docs/references/work-records-and-report.md](../../packages/verify-docs/.agents/skills/verify-docs/references/work-records-and-report.md) | 5,849B | 5,068B | 781B | 13.4% |
| [packages/verify-docs/.agents/skills/dedupe-docs/SKILL.md](../../packages/verify-docs/.agents/skills/dedupe-docs/SKILL.md) | 6,876B | 6,106B | 770B | 11.2% |
| [packages/verify-docs/.agents/skills/verify-docs/SKILL.md](../../packages/verify-docs/.agents/skills/verify-docs/SKILL.md) | 6,490B | 6,036B | 454B | 7.0% |
| [packages/verify-docs/README.md](../../packages/verify-docs/README.md) | 6,851B | 6,559B | 292B | 4.3% |
| [packages/verify-docs/.agents/skills/verify-docs/references/config.md](../../packages/verify-docs/.agents/skills/verify-docs/references/config.md) | 6,711B | 6,660B | 51B | 0.8% |
| [packages/verify-docs/docs/advanced-usage.md](../../packages/verify-docs/docs/advanced-usage.md) | 1,348B | 1,303B | 45B | 3.3% |
| [AGENTS.md](../../AGENTS.md) | 2,582B | 2,554B | 28B | 1.1% |
| [README.md](../../README.md) | 879B | 870B | 9B | 1.0% |
| [packages/verify-docs/CONTRIBUTING.md](../../packages/verify-docs/CONTRIBUTING.md) | 2,954B | 2,948B | 6B | 0.2% |
| [packages/verify-docs/evals/README.md](../../packages/verify-docs/evals/README.md) | 803B | 797B | 6B | 0.7% |
| [CLAUDE.md](../../CLAUDE.md) | 11B | 11B | 0B | 0.0% |
| [packages/verify-docs/.agents/skills/tighten-docs/references/patterns-markdown.md](../../packages/verify-docs/.agents/skills/tighten-docs/references/patterns-markdown.md) | 1,112B | 1,112B | 0B | 0.0% |
| [packages/verify-docs/.agents/skills/tighten-docs/references/patterns-wording.md](../../packages/verify-docs/.agents/skills/tighten-docs/references/patterns-wording.md) | 2,060B | 2,060B | 0B | 0.0% |
| [packages/verify-docs/.agents/skills/verify-docs/references/config-validation.md](../../packages/verify-docs/.agents/skills/verify-docs/references/config-validation.md) | 680B | 680B | 0B | 0.0% |
| [packages/verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md](../../packages/verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md) | 1,692B | 1,698B | -6B | -0.4% |
| [packages/verify-docs/.agents/skills/verify-docs/references/remediation.md](../../packages/verify-docs/.agents/skills/verify-docs/references/remediation.md) | 4,105B | 4,119B | -14B | -0.3% |
| [packages/verify-docs/.agents/skills/verify-docs/references/document-size-exceptions.md](../../packages/verify-docs/.agents/skills/verify-docs/references/document-size-exceptions.md) | 2,261B | 2,289B | -28B | -1.2% |
| [packages/verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md](../../packages/verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md) | 2,144B | 2,175B | -31B | -1.2% |
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | 1,176B | 1,214B | -38B | -3.2% |
| [packages/agent-layout/README.md](../../packages/agent-layout/README.md) | 2,832B | 2,944B | -112B | -4.0% |
| [packages/verify-docs/docs/structure.md](../../packages/verify-docs/docs/structure.md) | 1,902B | 2,620B | -718B | -37.7% |
| [packages/verify-docs/.agents/skills/tighten-docs/SKILL.md](../../packages/verify-docs/.agents/skills/tighten-docs/SKILL.md) | 4,709B | 5,460B | -751B | -16.0% |
| [packages/verify-docs/.agents/skills/verify-docs/references/maintenance-report-format.md](../../packages/verify-docs/.agents/skills/verify-docs/references/maintenance-report-format.md) | 3,888B | 4,726B | -838B | -21.6% |
| [packages/verify-docs/docs/adoption.md](../../packages/verify-docs/docs/adoption.md) | 2,836B | 3,773B | -937B | -33.0% |
| [packages/verify-docs/.agents/skills/tighten-docs/references/patterns-duplication-and-style.md](../../packages/verify-docs/.agents/skills/tighten-docs/references/patterns-duplication-and-style.md) | 2,085B | 3,586B | -1,501B | -72.0% |

最終検査: 原文照合、`node packages/verify-docs/scripts/document-structure-verifier.mjs --root=packages/verify-docs` — 構造違反0件
