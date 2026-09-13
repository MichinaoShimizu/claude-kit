# verify-docs-checklist

対象範囲: リポジトリルート、verify-docs/、agent-layout/ の各Markdown文書。チェッカーは各ルートで実行する。

## verify-docs — 2026-09-13T14:42:28+0900

- [x] AGENTS.md — 2026-09-13 / 構造違反なし
- [x] CLAUDE.md — 2026-09-13 / 構造違反なし
- [x] CONTRIBUTING.md — 2026-09-13 / 構造違反なし
- [x] README.md — 2026-09-13 / 構造違反なし
- [x] agent-layout/README.md — 2026-09-13 / 構造違反なし（パッケージルートで検査）
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/config-validation.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/remediation.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/README.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/docs/adoption.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/docs/advanced-usage.md — 2026-09-13 / 構造違反なし
- [x] verify-docs/docs/structure.md — 2026-09-13 / 構造違反なし

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 22文書（ルート4件・verify-docs 17件・agent-layout 1件） |
| 実施 | 各リポジトリ／パッケージのルートで構造検査 |
| 最終検査 | 3ルート合計 22文書・108見出し・251段落・71,927B、違反0件 |
| 判断保留 | なし |

## dedupe-docs — 2026-09-13T14:47:49+0900

- [x] AGENTS.md — 2026-09-13 / MUSTを正本とする
- [x] CLAUDE.md — 2026-09-13 / AGENTS.mdへの入口ポインタ
- [x] CONTRIBUTING.md — 2026-09-13 / 2箇所のMUST重複をポインタ化
- [x] README.md — 2026-09-13 / パッケージ一覧と詳細ガイドで役割が異なる
- [x] agent-layout/README.md — 2026-09-13 / 独自の導入・同期手順
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 意味重複探索の手順
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 簡潔化の手順
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / 削減パターンの正本
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / 構造是正のプレイブック
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 互換構成の詳細
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 完了記録の正本
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 重複記録規則を正本へのポインタに集約
- [x] verify-docs/.agents/skills/verify-docs/references/config-validation.md — 2026-09-13 / 設定入力検証の詳細
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 設定項目の正本
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 重複検査の細目
- [x] verify-docs/.agents/skills/verify-docs/references/remediation.md — 2026-09-13 / 是正手順の詳細
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / TODO形式の正本
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / パッケージ改修の固有ルール
- [x] verify-docs/README.md — 2026-09-13 / 利用案内と詳細資料で役割が異なる
- [x] verify-docs/docs/adoption.md — 2026-09-13 / 導入・CI・TODO運用
- [x] verify-docs/docs/advanced-usage.md — 2026-09-13 / CLI実行例
- [x] verify-docs/docs/structure.md — 2026-09-13 / ASTとチェッカーの技術詳細

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 22文書（ルート4件・verify-docs 17件・agent-layout 1件） |
| 実施 | AST段落を照合し、同じ規則の言い換えを2箇所でポインタ化。構成図・一覧・詳細手順は役割別の記述として維持 |
| 最終検査 | 3ルート再検査: 重複・準一致重複・リンク・サイズ違反 0件 |
| 判断保留 | なし |

#### 変更

| 対象 | 操作 | サイズ変化 | 根拠 |
| --- | --- | ---: | --- |
| `CONTRIBUTING.md` > 新規パッケージ追加・文書の分割移動 | MUSTの繰り返しをポインタ化し、固有の別コミット指示を保持 | 1,254B → 1,084B（13.6%減） | 6〜8行・17〜20行 |
| `verify-docs/.agents/skills/verify-docs/references/checklist.md` > 完了記録規則 | `checklist-summary.md`を正本として重複説明をポインタ化 | 6,824B → 5,849B（14.3%減） | 76行・124行 |

## tighten-docs — 2026-09-13T14:49:38+0900

- [x] AGENTS.md — 2026-09-13 / MUSTと参照先を保ち、削れる表現なし
- [x] CLAUDE.md — 2026-09-13 / 入口ポインタのみ
- [x] CONTRIBUTING.md — 2026-09-13 / 重複是正後の固有手順は必要
- [x] README.md — 2026-09-13 / 入口案内と一覧の情報量は必要
- [x] agent-layout/README.md — 2026-09-13 / 手順・安全条件は固有
- [x] verify-docs/.agents/skills/dedupe-docs/SKILL.md — 2026-09-13 / 手順と判断条件は固有
- [x] verify-docs/.agents/skills/tighten-docs/SKILL.md — 2026-09-13 / 守ることと抽出情報の説明は固有
- [x] verify-docs/.agents/skills/tighten-docs/references/patterns.md — 2026-09-13 / パターンと対比例は固有
- [x] verify-docs/.agents/skills/verify-docs/SKILL.md — 2026-09-13 / 構造是正の手順・完了条件は必要
- [x] verify-docs/.agents/skills/verify-docs/references/agent-compatibility.md — 2026-09-13 / 互換方法の条件は固有
- [x] verify-docs/.agents/skills/verify-docs/references/checklist-summary.md — 2026-09-13 / 実行記録の様式・フィールド定義は必要
- [x] verify-docs/.agents/skills/verify-docs/references/checklist.md — 2026-09-13 / 重複是正後のチェック手順は必要
- [x] verify-docs/.agents/skills/verify-docs/references/config-validation.md — 2026-09-13 / 入力値の制約は固有
- [x] verify-docs/.agents/skills/verify-docs/references/config.md — 2026-09-13 / 正本の設定表・対象範囲の説明は必要
- [x] verify-docs/.agents/skills/verify-docs/references/duplicate-handling.md — 2026-09-13 / 重複の検出条件・例外は固有
- [x] verify-docs/.agents/skills/verify-docs/references/remediation.md — 2026-09-13 / 是正判断と手順は固有
- [x] verify-docs/.agents/skills/verify-docs/references/todo.md — 2026-09-13 / TODOの各フィールド・運用条件は必要
- [x] verify-docs/CONTRIBUTING.md — 2026-09-13 / コード改修の固有ルールは必要
- [x] verify-docs/README.md — 2026-09-13 / 利用案内と出力の区分は必要
- [x] verify-docs/docs/adoption.md — 2026-09-13 / 導入・CI・TODOの手順は固有
- [x] verify-docs/docs/advanced-usage.md — 2026-09-13 / 各CLIの実行例は必要
- [x] verify-docs/docs/structure.md — 2026-09-13 / AST解析・検査出力の技術仕様は固有

### 実行結果

| 項目 | 結果 |
| --- | --- |
| 対象 | 22文書（ルート4件・verify-docs 17件・agent-layout 1件） |
| 実施 | 削減パターンを文書ごとに確認。意味・条件・手順を変えずに削れる表現はなし |
| 最終検査 | 3ルート再検査で構造違反0件 |
| 判断保留 | なし |

## 完了レコード

更新: 2026-09-13T14:51:37+0900

| 項目 | 結果 |
| --- | --- |
| 検査範囲 | 22文書 / 107見出し / 249段落 / 70,864B |
| 検出・是正 | 構造違反0件、機械的重複0件、意味的重複2箇所をポインタ化、最終違反0件 |
| TODO | なし |

#### 変更

| 対象 | 操作 | サイズ変化 | 根拠 |
| --- | --- | ---: | --- |
| `CONTRIBUTING.md` | MUSTの言い換えを2箇所ポインタ化 | 1,254B → 1,084B（13.6%減） | 新規パッケージ追加・文書の分割移動 |
| `verify-docs/.agents/skills/verify-docs/references/checklist.md` | 完了記録の重複を正本へのポインタに統合 | 6,824B → 5,849B（14.3%減） | 「実行結果と完了レコード」「完了時の記録」 |
| `.github/workflows/ci.yml` | agent-layoutのルートでも文書検査を実行 | — | ルート設定はパッケージ内の相対パスを解釈できないため、個別ルートで検査 |
| `agent-layout/verify-docs.config.json` | パッケージ内の実在するスクリプトパスのみ検査 | — | 生成先の互換ディレクトリは導入時に作られるため |

#### 残件・注記

- なし
