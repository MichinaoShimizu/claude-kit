# agent-layout

Claude Code・Codex・Kiroでスキルとカスタムエージェントを共有するために、
リポジトリ内の配置と形式を補正する。

## 導入

macOS/Linuxでは、対象リポジトリの直下で次を実行する。

```bash
curl -fsSL https://raw.githubusercontent.com/MichinaoShimizu/claude-kit/main/agent-layout/install.sh | bash
```

`scripts/sync-agent-layout.mjs` を配置する。既に異なる内容の同名ファイルがある場合、
インストーラーは上書きせず停止する。

## 既存構成の同期

配置済みのスキル・カスタムエージェントを正本へ補正するには、次を実行する。

```bash
node scripts/sync-agent-layout.mjs --write
```

`--write` を外すと変更せず、同期状態だけを検査する。CI ではこの形式を使う。

```bash
node scripts/sync-agent-layout.mjs
```

## 新規リポジトリの初期化

空のリポジトリに正本ディレクトリ、Claude Code・Kiro の互換リンク、同期を検査する
GitHub Actions ワークフローを作るには、次を一度だけ実行する。既存ファイルは
上書きしない。

```bash
node scripts/sync-agent-layout.mjs --init
```

## スキルの正本と互換入口

`.agents/skills/`を正本とする。`.claude/skills`と`.kiro/skills`は正本を指す
シンボリックリンクに補正する。

ClaudeやKiroが互換入口の下へ新しいスキルを作ると、シンボリックリンクを介して
最初から正本へ保存される。既存の実ディレクトリがある場合、`--write`は内容を
正本へ移して互換リンクに置き換える。同じ相対パスに異なる内容があれば停止する。

## カスタムエージェントの生成

製品ごとに形式が異なるため、`.agents/agents/*.json`を共通仕様の正本とし、次を
生成する。

| 製品 | 生成先 |
| --- | --- |
| Claude Code | `.claude/agents/*.md` |
| Kiro | `.kiro/agents/*.md` |
| Codex | `.codex/agents/*.toml` |

ClaudeまたはKiroが新規作成したMarkdownエージェントは、正本に同名の定義がない
場合に取り込む。共通化する項目は`name`・`description`・本文・`tools`で、ツールは
`read`・`write`・`shell`・`web`・`subagent`の能力へ変換する。Claudeの`model`は
Claude用設定として正本に保持する。

生成ファイルの直接編集は差分として検出する。更新は`.agents/agents/*.json`へ行い、
再度`--write`を実行する。

安全に変換できないfrontmatter項目は、推測で捨てずエラーにする。共通仕様へ
移せない項目を使う場合は、生成後の個別設定を扱う仕組みを追加する。

## CIでの同期検査

```yaml
- run: node scripts/sync-agent-layout.mjs
```

CIは未同期を検出して失敗する。リポジトリへ自動コミットは行わない。
