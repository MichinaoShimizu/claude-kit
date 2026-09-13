# verify-docs-checklist

対象範囲: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md)、[agent-layout/README.md](../../agent-layout/README.md)、および [verify-docs/](../../verify-docs/) の Markdown 文書。各パッケージルートで検査する。

作業単位: リポジトリ Markdown の文章補正と検証記録の整備
開始: 2026-09-13T18:50:12+0900
最終更新: 2026-09-13T23:15:58+0900

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

## verify-docs

最終実行: 2026-09-13T23:15:58+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 構造検査を完了
- [x] [agent-layout/README.md](../../agent-layout/README.md) — 2026-09-13 / 構造検査を完了
- [x] [verify-docs/](../../verify-docs/) の20文書 — 2026-09-13 / タスク管理機能の説明を削除し、構造検査を完了

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 参照整合性 | Markdownリンク・画像リンク・断片リンク、設定した `pathRoots` に一致するバッククォート内のパスが解決できる | `node verify-docs/scripts/verify-docs.mjs` | リンク違反0件 |
| 孤立文書 | 入口文書または他の検査対象文書から到達できる | `node verify-docs/scripts/verify-docs.mjs` | 孤立違反0件 |
| 文書サイズ | `maxDocBytes` 以下、または TODO に理由を記録済みである | `node verify-docs/scripts/verify-docs.mjs` | サイズ違反0件 |
| 機械的重複 | 完全一致と、有効時の準一致の段落重複を検出・是正済みである | `node verify-docs/scripts/verify-docs.mjs` | 重複違反0件 |

最終検査: `node verify-docs/scripts/verify-docs.mjs`、`node verify-docs/scripts/verify-docs.mjs --root=agent-layout`、`cd verify-docs && node scripts/verify-docs.mjs` — 違反0件

## dedupe-docs

最終実行: 2026-09-13T23:15:58+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 意味的重複なし
- [x] [agent-layout/README.md](../../agent-layout/README.md) — 2026-09-13 / 意味的重複なし
- [x] [verify-docs/](../../verify-docs/) の20文書 — 2026-09-13 / 意味的重複なし

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味的重複 | 言い換えによる同一の主張・手順・判断基準を確認した | 原文と抽出結果の照合 | 重複なし |
| 正本の配置 | 統合対象は詳細度と読者に合う文書を正本にした | 正本と統合元の原文 | 該当なし |
| ポインタ | 統合元から正本への案内が解決でき、内容を重ねていない | `node verify-docs/scripts/verify-docs.mjs` | 該当なし |
| 検査範囲外 | ルート `README.md` と `verify-docs/README.md` の説明重複 | `excludePaths` の設定 | 今回の意味的重複検査の対象外 |
| 判断保留 | 統合の確信が持てない候補を人の判断へ残した | 一時作業記録 | なし |

最終検査: 3ルート再検査 — 重複・準一致重複・リンク・サイズ違反0件

## tighten-docs

最終実行: 2026-09-13T23:15:58+0900

- [x] リポジトリルート: [AGENTS.md](../../AGENTS.md)、[CLAUDE.md](../../CLAUDE.md)、[CONTRIBUTING.md](../../CONTRIBUTING.md)、[README.md](../../README.md) — 2026-09-13 / 安全に削れる表現なし
- [x] [agent-layout/README.md](../../agent-layout/README.md) — 2026-09-13 / 安全に削れる表現なし
- [x] [verify-docs/](../../verify-docs/) の20文書 — 2026-09-13 / タスク管理機能の説明を削除

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味の保持 | 数値・条件・手順順序・免責文言を変えていない | 変更前後の原文照合 | 通過 |
| 語句と文法 | 冗長な語句、形式名詞、不要な受け身などを確認した | 典型パターンと原文 | 通過 |
| 重複と文体 | 同一理由の反復、重言、文体の混在を確認した | 典型パターンと原文 | 通過 |
| Markdown表現 | 空行、強調、リンクテキスト、表、装飾の冗長さを確認した | 典型パターンと原文 | 通過 |

### ファイル別サイズ

| ファイル | 開始時点 | 最終 | 累積圧縮率 | 直前試行との差分 | 結果 |
| --- | ---: | ---: | ---: | ---: | --- |
| [AGENTS.md](../../AGENTS.md) | 2,582B | 2,554B | 1.1% | 0B | 文章補正後、追加の削減なし |
| [CLAUDE.md](../../CLAUDE.md) | 11B | 11B | 0.0% | 0B | 変更なし |
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | 1,176B | 1,214B | -3.2% | 0B | 参照先の見出し変更を反映 |
| [README.md](../../README.md) | 879B | 870B | 1.0% | 0B | 文章補正後、追加の削減なし |
| [agent-layout/README.md](../../agent-layout/README.md) | 2,832B | 2,944B | -4.0% | 0B | 構成を明確化 |
| [verify-docs/.agents/skills/dedupe-docs/SKILL.md](../../verify-docs/.agents/skills/dedupe-docs/SKILL.md) | 6,876B | 6,106B | 11.2% | -687B | 重複導入を短縮し、発動条件を維持 |
| [verify-docs/.agents/skills/tighten-docs/SKILL.md](../../verify-docs/.agents/skills/tighten-docs/SKILL.md) | 4,709B | 4,551B | 3.4% | +66B | 抽出対象とサイズ記録を正確化 |
| [verify-docs/.agents/skills/tighten-docs/references/patterns-duplication-and-style.md](../../verify-docs/.agents/skills/tighten-docs/references/patterns-duplication-and-style.md) | 2,085B | 2,085B | 0.0% | 0B | 変更なし |
| [verify-docs/.agents/skills/tighten-docs/references/patterns-markdown.md](../../verify-docs/.agents/skills/tighten-docs/references/patterns-markdown.md) | 1,112B | 1,112B | 0.0% | 0B | 変更なし |
| [verify-docs/.agents/skills/tighten-docs/references/patterns-wording.md](../../verify-docs/.agents/skills/tighten-docs/references/patterns-wording.md) | 2,060B | 2,060B | 0.0% | 0B | 変更なし |
| [verify-docs/.agents/skills/verify-docs/SKILL.md](../../verify-docs/.agents/skills/verify-docs/SKILL.md) | 6,490B | 6,036B | 7.0% | -544B | リンクだけの手順見出しを是正手順へ集約 |
| [verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md](../../verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md) | 1,692B | 1,698B | -0.4% | 0B | 見出しを補正 |
| [verify-docs/.agents/skills/verify-docs/references/checklist-summary.md](../../verify-docs/.agents/skills/verify-docs/references/checklist-summary.md) | 3,888B | 4,724B | -21.5% | -184B | 作業手順の重複を削除 |
| [verify-docs/.agents/skills/verify-docs/references/checklist.md](../../verify-docs/.agents/skills/verify-docs/references/checklist.md) | 5,849B | 5,083B | 13.1% | -314B | タスク管理機能の説明を削除 |
| [verify-docs/.agents/skills/verify-docs/references/config-validation.md](../../verify-docs/.agents/skills/verify-docs/references/config-validation.md) | 680B | 680B | 0.0% | 0B | 変更なし |
| [verify-docs/.agents/skills/verify-docs/references/config.md](../../verify-docs/.agents/skills/verify-docs/references/config.md) | 6,711B | 6,660B | 0.8% | 0B | 作業記録の説明を補正 |
| [verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md](../../verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md) | 2,144B | 2,175B | -1.4% | +22B | 重複特定の参照先を是正手順へ変更 |
| [verify-docs/.agents/skills/verify-docs/references/remediation.md](../../verify-docs/.agents/skills/verify-docs/references/remediation.md) | 4,105B | 4,119B | -0.3% | 0B | 継続的な検査を明確化 |
| [verify-docs/.agents/skills/verify-docs/references/todo.md](../../verify-docs/.agents/skills/verify-docs/references/todo.md) | 2,261B | 2,289B | -1.2% | +22B | TODO手順の参照先を是正手順へ変更 |
| [verify-docs/CONTRIBUTING.md](../../verify-docs/CONTRIBUTING.md) | 2,954B | 2,948B | 0.2% | 0B | 見出しを補正 |
| [verify-docs/README.md](../../verify-docs/README.md) | 6,851B | 6,922B | -1.0% | +9B | 図中の名称をチェックリストへ統一 |
| [verify-docs/docs/adoption.md](../../verify-docs/docs/adoption.md) | 2,836B | 2,835B | 0.0% | +72B | 導入時の参照先を是正手順へ変更 |
| [verify-docs/docs/advanced-usage.md](../../verify-docs/docs/advanced-usage.md) | 1,348B | 1,303B | 3.3% | 0B | 見出しを具体化 |
| [verify-docs/docs/structure.md](../../verify-docs/docs/structure.md) | 1,902B | 1,889B | 0.7% | -21B | 完了レコードを廃止 |
| [verify-docs/evals/README.md](../../verify-docs/evals/README.md) | 803B | 797B | 0.7% | 0B | 表現を簡潔化 |

最終検査: 3ルート再検査 — 構造違反0件
