# agent-layout

Claude Code・Codex・Kiroでスキルとカスタムエージェントを共有するために、
リポジトリ内の配置と形式を補正する。

## 導入

このディレクトリの中身を対象リポジトリの直下へコピーする。

```text
your-repo/
└── scripts/sync-agent-layout.mjs
```

補正を適用する。

```bash
node scripts/sync-agent-layout.mjs --write
```

変更を加えず、同期状態だけを検査する場合は`--write`を外す。CIではこの形式を
使用する。

```bash
node scripts/sync-agent-layout.mjs
```

## スキル

`.agents/skills/`を正本とする。`.claude/skills`と`.kiro/skills`は正本を指す
シンボリックリンクに補正する。

ClaudeやKiroが互換入口の下へ新しいスキルを作ると、シンボリックリンクを介して
最初から正本へ保存される。既存の実ディレクトリがある場合、`--write`は内容を
正本へ移して互換リンクに置き換える。同じ相対パスに異なる内容があれば停止する。

## カスタムエージェント

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

既存の正本がある場合、生成ファイルを直接編集すると検査で差分として検出する。
更新は`.agents/agents/*.json`へ行い、再度`--write`を実行する。

プロバイダー固有で安全に変換できないfrontmatter項目は、推測で捨てずエラーにする。
その項目を正本の共通仕様へ移せない場合は、生成後の個別設定として扱う仕組みを
追加してから利用する。

## CI

```yaml
- run: node scripts/sync-agent-layout.mjs
```

CIは未同期を検出して失敗する。リポジトリへ自動コミットは行わない。
