# docs-lazy-load

生成AIエージェント（Claude Code など）が読む CLAUDE.md・README・docs ディレクトリ・
`.claude/skills/` のような階層的な文書群を、**「必要な時にだけ必要な文書が
読まれる」構造に直し、その構造を機械の検査で維持し続ける**ための一式。

やることは2つだけ。

1. **検査スクリプト**（`scripts/verify-doc-structure.mjs`）—— 参照切れ・孤立文書・
   文書のサイズ超過を検査する
2. **スキル定義**（`.claude/skills/docs-lazy-load/SKILL.md`）—— 太った文書を
   見つけたときに、どう分けるかの手順

エージェントも、フックも要らない。検査スクリプトを CI と push 前検証に
差し込むだけで効く。

## 入れる

このリポジトリの中身を、対象のリポジトリ直下にコピーする。

```
your-repo/
├── scripts/verify-doc-structure.mjs      ← コピー
├── .claude/skills/docs-lazy-load/        ← コピー（SKILL.md と references/）
└── docs-structure.config.json            ← 要るなら作る（無くても動く）
```

設定の中身は [references/config.md](.claude/skills/docs-lazy-load/references/config.md)。
既定値のまま試して、`entryPoints`・`docsDir`・`skillsDir` が自分のリポジトリの
構成と違うところだけ `docs-structure.config.json` で上書きする。

## 使う

### 真っさらなリポジトリ

そのまま検査を走らせる。既定では上限超過は無いはずなので、そのまま通る。

```bash
node scripts/verify-doc-structure.mjs
```

### すでに肥大化しているリポジトリ（本題はこっち）

**このスキルが本当に効くのは、これから書く文書より、すでにある文書のほう。**
だが既存の大きい文書を、導入した初日に全部分割するのは無理がある。

そこで導入は2段階にする。

**1. いまの違反をまとめて申告する。**

```bash
node scripts/verify-doc-structure.mjs --init-todo
```

上限を超えている文書を全部拾って `docs-structure.todo.json` に書き出す
（[TODO の管理方法](#todo-の管理方法)を参照）。これで検査はいったん通る状態になる
—— **見逃しているのではなく、認めたうえで一覧に出し続ける状態にする。**

**2. CI に差し込む。** 以後、新しく書く文書・書き足す文書は上限を守る。
TODO に載っている文書は、都合のいいときに分割して、直したらエントリを消す。
[SKILL.md](.claude/skills/docs-lazy-load/SKILL.md) の「太った文書を見つける」の
手順で分ける。

**この2段階が無いと、既存リポジトリへの導入は「初日に大量の文書を全部
その場で分割する」か「検査を無効にする」の二択になり、どちらも続かない。**
段階的に借金を返す形にすることで、導入のハードルと維持の仕組みを両立させる。

## CI に足す

GitHub Actions の例（`.github/workflows/verify-docs.yml`。このリポジトリの
[.github/workflows/verify-docs.yml](.github/workflows/verify-docs.yml) をそのまま使える）。

```yaml
name: verify-docs
on:
  pull_request:
    paths:
      - '**/*.md'
      - 'docs-structure.config.json'
      - 'docs-structure.todo.json'
      - 'scripts/verify-doc-structure.mjs'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/verify-doc-structure.mjs
```

`paths` は自分のリポジトリの CI 振り分けに合わせて調整する。**文書だけの変更でも
必ず走らせること。** ビルドや依存関係の検査と束ねて「文書だけの回だから」と
飛ばすと、そこが誰にも見られなくなる。

push 前にローカルでも通しておきたいなら、既存の検証コマンド列（lint・
typecheck・test など）の1本として `node scripts/verify-doc-structure.mjs` を足す。

## TODO の管理方法

このツールにおける「TODO」は2種類あるので混同しない。

- **`docs-structure.todo.json`（このツールが読む、運用上の TODO）。**
  「上限を超えているとわかっていて、いまは分割しない」という申告。
  [references/config.md](.claude/skills/docs-lazy-load/references/config.md) に
  書き方がある。**空にしていく方向にだけ動かす。** 増やす方向（新しく書いた
  文書が超過したのでここに足す）は本来やらないほうがよく、それをやりたく
  なった時点で「その文書の分け方が悪い」を疑う
- **このツール自身の開発 TODO（[TODO.md](TODO.md)）。** ツールの機能追加・
  未対応のケースを追う、ふつうの意味の TODO。運用上の TODO とは無関係

前者を後者と同じ感覚で「あとで直す一覧」として無限に積み増すと、
このツールを入れた意味が無くなる（肥大化を検知する仕組み自体が
肥大化した借金リストを許容する仕組みに変わってしまう）。**目安として、
`docs-structure.todo.json` が導入直後より増えていたら、それは退行。**

## 対象にしないこと

- 文章の質・正確さの検査（内容が正しいかは見ない）
- 「何を MUST にすべきか」の判断（構造は見るが、中身の編集方針までは踏み込まない）
