# Maintenance Report

対象範囲: リポジトリ全体の Markdown 文書36件。

作業単位: リポジトリ全体の自律正本化・自律圧縮
開始: 2026-09-15T10:50:43+0900
最終更新: 2026-09-15T10:54:00+0900

## 実行履歴

| 試行 | 実行 | スキル | 主な変更 | 最終検査 |
| ---: | --- | --- | --- | --- |
| 1 | 10:50 | 文書重複解消スキル | [docs/adoption.md](../../docs/adoption.md) のCI構成例を [docs/ci-integration.md](../../docs/ci-integration.md) へ正本化 | 違反0件 |
| 2 | 10:52 | 文書簡潔化スキル | [README.md](../../README.md) の設定生成案内を設定節へ集約 | 698B削減、違反0件 |
| 3 | 10:53 | 文書構造検証器・自己検査 | 36文書の構造検査とパッケージ自己検査 | 成功 |

## 文書構造是正スキル

（未実施）

## 文書重複解消スキル

実行モード: 自律正本化

- [x] [docs/adoption.md](../../docs/adoption.md) > CIへの組み込み（40行目） — 2026-09-15 / GitHub Actionsの構成例と `paths` の説明は [docs/ci-integration.md](../../docs/ci-integration.md) に全てあるため、導入・運用の読者には正本へのポインタだけを残した
- [x] 全36文書 — 2026-09-15 / 原文と構造抽出結果を照合。各文書は読者、責務、または参照時点が異なるため、内容統合・ポインタ化・新規正本・削除は不要

保護対象: 数値、コマンド、設定値、リンク、法的・安全・契約上の注意。

残したリスク: 意味的重複の判定は人・エージェントによる。正本化しなかった説明は読者経路または責務が異なると判断した。

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味的重複 | 言い換えによる同一の主張・手順・判断基準を確認した | 原文と構造抽出結果の照合 | [docs/adoption.md](../../docs/adoption.md) のCI構成例を正本化 |
| 正本の配置 | 詳細なCI構成例を専用文書に置き、導入文書から到達できる | 原文と [docs/ci-integration.md](../../docs/ci-integration.md) の照合 | 是正済み |
| ポインタ | 正本への案内と断片リンクが解決できる | `node scripts/document-structure-verifier.mjs --json` | リンク違反0件 |
| 利用者の判断 | 自律正本化モードで対象内を処理した | 作業記録と会話 | 回答待ちなし |

## 文書簡潔化スキル

実行モード: 自律圧縮

- [x] [README.md](../../README.md) > 設定ファイル（97行目） — 2026-09-15 / インストーラーの設定生成を設定節へ集約。設定生成の事実と設定変更の導線を保持
- [x] [docs/adoption.md](../../docs/adoption.md) > CIへの組み込み（40行目） — 2026-09-15 / 文書重複解消スキルによる正本へのポインタ化後、重複したYAMLと説明を残さないことを確認
- [x] 残り34文書 — 2026-09-15 / 保護対象を保ったまま削れる重複・冗長表現を探索。追加の変更なし

変更リスク: [README.md](../../README.md) の設定生成案内を設定節へ移した。意味の完全保持は保証しないが、設定生成の事実と設定変更の導線は原文照合で確認した。

保護対象: 数値、コマンド、設定値、リンク、法的・安全・契約上の注意。

### 最終検査結果

| 観点 | 検査・保証内容 | 検査根拠 | 結果 |
| --- | --- | --- | --- |
| 意味の保持 | 数値・条件・手順順序・免責文言を変えていない | 変更前後の原文照合 | 通過 |
| 語句と文法 | 冗長な語句、形式名詞、不要な受け身を確認した | 典型パターンと原文 | 通過 |
| 重複と文体 | 同一理由の反復、重言、文体の混在を確認した | 典型パターンと原文 | 通過 |
| Markdown表現 | 空行、強調、リンクテキスト、表、装飾の冗長さを確認した | 典型パターンと原文 | 通過 |
| 構造と配布物 | 文書構造検査とパッケージ自己検査を通過した | `node scripts/document-structure-verifier.mjs --json`、`bash ci-selfcheck.sh` | 成功 |

### ファイル別サイズ

| ファイル | 開始時点 | 最終 | 削減バイト数 | 開始時点からの削減率 |
| --- | ---: | ---: | ---: | ---: |
| [README.md](../../README.md) | 6,983B | 6,868B | 115B | 1.6% |
| [docs/adoption.md](../../docs/adoption.md) | 3,076B | 2,493B | 583B | 19.0% |
| [.agents/skills/dedupe-docs/SKILL.md](../../.agents/skills/dedupe-docs/SKILL.md) | 6,984B | 6,984B | 0B | 0.0% |
| [.agents/skills/tighten-docs/SKILL.md](../../.agents/skills/tighten-docs/SKILL.md) | 6,928B | 6,928B | 0B | 0.0% |
| [.agents/skills/verify-docs/SKILL.md](../../.agents/skills/verify-docs/SKILL.md) | 6,909B | 6,909B | 0B | 0.0% |
| [AGENTS.md](../../AGENTS.md) | 2,457B | 2,457B | 0B | 0.0% |
| [CLAUDE.md](../../CLAUDE.md) | 11B | 11B | 0B | 0.0% |
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | 3,575B | 3,575B | 0B | 0.0% |
| [docs/advanced-usage.md](../../docs/advanced-usage.md) | 3,199B | 3,199B | 0B | 0.0% |
| [docs/agent-compatibility.md](../../docs/agent-compatibility.md) | 2,243B | 2,243B | 0B | 0.0% |
| [docs/autonomous-canonicalization.md](../../docs/autonomous-canonicalization.md) | 4,601B | 4,601B | 0B | 0.0% |
| [docs/autonomous-compression.md](../../docs/autonomous-compression.md) | 2,215B | 2,215B | 0B | 0.0% |
| [docs/canonical-selection.md](../../docs/canonical-selection.md) | 3,261B | 3,261B | 0B | 0.0% |
| [docs/ci-integration.md](../../docs/ci-integration.md) | 720B | 720B | 0B | 0.0% |
| [docs/config-validation.md](../../docs/config-validation.md) | 804B | 804B | 0B | 0.0% |
| [docs/config.md](../../docs/config.md) | 4,647B | 4,647B | 0B | 0.0% |
| [docs/document-size-exceptions.md](../../docs/document-size-exceptions.md) | 2,784B | 2,784B | 0B | 0.0% |
| [docs/duplicate-handling.md](../../docs/duplicate-handling.md) | 2,432B | 2,432B | 0B | 0.0% |
| [docs/judgement-and-escalation.md](../../docs/judgement-and-escalation.md) | 2,083B | 2,083B | 0B | 0.0% |
| [docs/maintenance-report-format.md](../../docs/maintenance-report-format.md) | 5,603B | 5,603B | 0B | 0.0% |
| [docs/mode-comparison.md](../../docs/mode-comparison.md) | 3,301B | 3,301B | 0B | 0.0% |
| [docs/object-naming.md](../../docs/object-naming.md) | 2,630B | 2,630B | 0B | 0.0% |
| [docs/operations.md](../../docs/operations.md) | 5,240B | 5,240B | 0B | 0.0% |
| [docs/patterns-duplication-and-style.md](../../docs/patterns-duplication-and-style.md) | 3,773B | 3,773B | 0B | 0.0% |
| [docs/patterns-markdown.md](../../docs/patterns-markdown.md) | 1,112B | 1,112B | 0B | 0.0% |
| [docs/patterns-wording.md](../../docs/patterns-wording.md) | 2,060B | 2,060B | 0B | 0.0% |
| [docs/progressive-disclosure.md](../../docs/progressive-disclosure.md) | 4,326B | 4,326B | 0B | 0.0% |
| [docs/remediation.md](../../docs/remediation.md) | 4,398B | 4,398B | 0B | 0.0% |
| [docs/scan-targets.md](../../docs/scan-targets.md) | 3,267B | 3,267B | 0B | 0.0% |
| [docs/skill-references.md](../../docs/skill-references.md) | 961B | 961B | 0B | 0.0% |
| [docs/structure.md](../../docs/structure.md) | 4,647B | 4,647B | 0B | 0.0% |
| [docs/verification-boundaries.md](../../docs/verification-boundaries.md) | 532B | 532B | 0B | 0.0% |
| [docs/work-record-lifecycle.md](../../docs/work-record-lifecycle.md) | 938B | 938B | 0B | 0.0% |
| [docs/work-records-and-report.md](../../docs/work-records-and-report.md) | 6,749B | 6,749B | 0B | 0.0% |
| [docs/workflow.md](../../docs/workflow.md) | 4,673B | 4,673B | 0B | 0.0% |
| [evals/README.md](../../evals/README.md) | 904B | 904B | 0B | 0.0% |
| **合計** | **121,026B** | **120,328B** | **698B** | **0.6%** |

最終検査: `node scripts/document-structure-verifier.mjs --json`、`bash ci-selfcheck.sh`、原文と構造抽出結果の照合 — 構造違反0件、自己検査成功。
