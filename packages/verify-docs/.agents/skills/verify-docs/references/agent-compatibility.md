# エージェント間の互換構成

入口文書とスキルを Claude Code・Codex・Kiro などで共有する場合に参照する。

## 入口文書の既定値

`entryPoints` の既定値には `CLAUDE.md` と `AGENTS.md` の両方を含める。
いずれもエージェント向け入口ファイルという同一の役割を持つ。重複を避ける
場合は AGENTS.md を正本とし、CLAUDE.md から `@AGENTS.md` で取り込む。
片方しか無いリポジトリでも既定値のまま動作する（存在しない側は
`entryPoints.filter(existsSync)`
により自然に除外される）。

共通する原則の詳細は [SKILL.md](../SKILL.md)「1. 入口軽量化」を
参照する。本検査はサイズと重複のみを検査するため、「ルーティングテーブル
に徹しているか」自体は機械では判定できず、人が検出する。

## スキルディレクトリ

`.agents/skills/` は Agent Skills 対応エージェント向けの正本であり、同梱の
`.claude/skills` はそこを指すシンボリックリンクである。Windows でシンボリック
リンクを利用できない場合は、`.agents/skills/` の内容を `.claude/skills/` に
コピーして Claude Code 用の互換入口を作る。既存の `.claude/skills` 構成も
文書構造検証器が自動認識する。

Kiro は `AGENTS.md` を直接読み、スキルは `.kiro/skills/` から読み込む。
同梱の `.kiro/skills` は `.agents/skills/` を指す。シンボリックリンクを
利用できない場合は、同じ内容を `.kiro/skills/` にコピーする。既存の
`.kiro/skills` 構成も文書構造検証器が自動認識する。
