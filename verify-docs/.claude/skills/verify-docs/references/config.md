# 設定ファイルの中身

`.claude/skills/verify-docs/SKILL.md` から参照される。検査スクリプトの設定を
変更する場合に参照する。TODO ファイルの記述形式は
[references/todo.md](todo.md)、準一致重複・意図した重複の許可方法は
[references/duplicate-handling.md](duplicate-handling.md) を参照する。

## `verify-docs.config.json`

リポジトリ直下に配置する。存在しない場合は全項目が既定値で動作する。
設定項目名と意味は下表を正本とする。README.md・CONTRIBUTING.md など
他の文書では個々のキー名を列挙せず本表を指すだけにとどめる（キー追加時の
更新漏れを防ぐ。追加時は本表への追記漏れを `verify-docs.test.mjs` が
機械的に検査する）。

```json
{
  "entryPoints": ["README.md", "CLAUDE.md", "AGENTS.md"],
  "docsDir": "docs",
  "skillsDir": ".claude/skills",
  "pathRoots": ["src/", "docs/", "scripts/", ".claude/", ".github/"],
  "excludePaths": ["node_modules/", ".git/", "vendor/", "dist/", "build/", ".verify-docs/"],
  "maxDocBytes": 7000,
  "minDuplicateChars": 60,
  "checkDuplicates": true,
  "checkNearDuplicates": false,
  "todoFile": "verify-docs.todo.json"
}
```

| キー                  | 意味                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| `entryPoints`         | 索引となる文書。他から参照されていなくてよい起点（CLAUDE.md・AGENTS.md はルーティングテーブルに徹する。下記「入口の既定値」を参照） |
| `docsDir`             | 話題ごとの詳細文書を配置するディレクトリ                             |
| `skillsDir`           | スキル定義を配置するディレクトリ（`<skillsDir>/<name>/SKILL.md` を想定） |
| `pathRoots`           | 本文中のバッククォート表記をパスとして検査する接頭辞                 |
| `excludePaths`        | 検査対象から除外するディレクトリ（下記「検査対象の集め方」を参照）。既定に含まれる `.verify-docs/` は作業チェックリストの保管先（[checklist.md「物理ファイル作成」](checklist.md#物理ファイル作成必須)を参照） |
| `maxDocBytes`         | 1文書あたりの上限（バイト数）。超過時は分割するか TODO に記載する    |
| `minDuplicateChars`   | 重複検査の対象とする段落の最小文字数。値が小さいほど誤検知が増加する |
| `checkDuplicates`     | 完全一致の重複検査の有効・無効。既定は有効                           |
| `checkNearDuplicates` | 準一致の重複検査の有効・無効。既定は無効（下記「準一致重複」を参照） |
| `todoFile`            | 例外リストの配置先                                                   |

### 検査対象の集め方

`entryPoints`・`docsDir`・`skillsDir` に置かれた文書だけを見る方式（許可
リスト）は採らない。そこに置き忘れた文書が検査から漏れたまま気づかれない
事故を防ぐため（例: 新規`CONTRIBUTING.md`がどちらにも登録されず孤立・
重複チェックの対象外になる）。

そのため `excludePaths` に列挙したディレクトリ（既定は `node_modules/`・
`.git/`・`vendor/`・`dist/`・`build/`）を除き、リポジトリ全体の `*.md` を
検査対象とする（除外リスト方式）。`entryPoints`・`docsDir`・`skillsDir` は
検査対象への出し入れではなく、「その文書に何を期待するか」（孤立チェック
免除の起点か、`SKILL.md` の目次に載るべき補助文書か）を決めるためだけに
使う。

モノレポで各パッケージを個別に `--root=packages/<name>`（詳細は
[verify-docs.mjs](../../../../scripts/verify-docs.mjs) の `--root` オプション
説明を参照）で検査する場合は、リポジトリ直下の検査からパッケージの
ディレクトリを `excludePaths` で除外し二重検査を避ける。

孤立チェックだけは、この「走査対象」よりさらに狭い範囲にしか適用されない。
`.claude/` 配下（`skillsDir` 自身の SKILL.md 一式を除く）で `docsDir` にも
属さない文書（エージェント定義など、スキル以外の設定ファイル）は、走査
（リンク切れ・サイズ超過・重複の検査）には含まれたまま、孤立チェックのみ
免除される。README・SKILL.md から参照されない運用が前提の設定ファイルまで
「孤立」として毎回検出し続けるのを避けるための意図的な例外であり、実装漏れ
ではない。チェックリストを作る際は、孤立チェックの結果と照合する前提の
項目からはこの種の文書を除いて考える（詳細な判定ロジックは
[verify-docs.mjs](../../../../scripts/verify-docs.mjs)「検査対象の集め方」の
コメントを正本とする）。

`maxDocBytes` の設定方針: 初期段階から厳格にしない。まず上限なしで検査し、
現存する文書の最大サイズで「問題ない」と判断できるものより1〜2割大きい
値を初期値とする。過度に厳格だと正当な理由のある文書まで分割を強制する。

`minDuplicateChars` の設定方針: 既定値60は短い定型句レベルの一致を検出
しないための下限。誤検知が多ければ上げ、見逃しが多ければ下げる。
`checkNearDuplicates` を有効化した場合も同一の値が適用される。準一致重複の
挙動詳細は [references/duplicate-handling.md](duplicate-handling.md) を
参照する。

### 入口の既定値

`entryPoints` の既定値には `CLAUDE.md` と `AGENTS.md` の両方を含める。
いずれもエージェント向け入口ファイルという同一の役割を持ち、使用する
CLI・エージェントによって名称が異なるだけである。片方しか無いリポジトリ
でも既定値のまま動作する（存在しない側は `entryPoints.filter(existsSync)`
により自然に除外される）。

共通する原則の詳細は [SKILL.md](../SKILL.md)「1. 入口軽量化」を
参照する。本検査はサイズと重複のみを検査するため、「ルーティングテーブル
に徹しているか」自体は機械では判定できず、人が検出する。

`excludePaths` の既定値に `.verify-docs/` を含めている理由（作業チェック
リストの保管先であること）は
[checklist.md「物理ファイル作成」](checklist.md#物理ファイル作成必須)
を参照する。
