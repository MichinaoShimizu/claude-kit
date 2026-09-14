# 配布元と配布先の配置

本パッケージは`packages/verify-docs/`から配布する。配布元のファイルと、導入後に
対象リポジトリへ置かれるファイルの対応は次のとおり。

| 役割 | 配布元 | 配布先 |
| --- | --- | --- |
| 検査CLI | `packages/verify-docs/.verify-docs/scripts/` | `.verify-docs/scripts/` |
| 既定設定 | `packages/verify-docs/.verify-docs/config/verify-docs.config.json` | `.verify-docs/config/verify-docs.config.json` |
| TODO | `packages/verify-docs/.verify-docs/config/verify-docs.todo.json` | `.verify-docs/config/verify-docs.todo.json` |
| 利用者向け文書 | `packages/verify-docs/.verify-docs/docs/` | `.verify-docs/docs/` |
| スキルの正本 | `packages/verify-docs/.agents/skills/` | `.agents/skills/` |
| Claude Code・Kiroの入口 | `packages/verify-docs/.claude/skills`・`.kiro/skills` | `.claude/skills/<skill-name>`・`.kiro/skills/<skill-name>` |
| 評価セット | `packages/verify-docs/evals/` | 配布しない |
| パッケージ自己検査 | `packages/verify-docs/ci-selfcheck.sh` | 配布しない |

以降のコマンドは、配布先リポジトリのルートで実行するものとして記載する。
