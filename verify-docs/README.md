# verify-docs

生成AIエージェント（Claude Code など）が読む CLAUDE.md・README・docs ディレクトリ・
`.claude/skills/` のような階層的な文書群を、**「必要な時にだけ必要な文書が
読まれる」構造に直し、その構造を機械の検査で維持し続ける**ための一式。

これさえ入れれば文書管理が整然と維持されやすい状態を目指している。
やることは2つだけで、**しくみ（自動で判定できること）とふるまい（判断が要ること）を
分けて管理する**。

1. **しくみ**（`scripts/verify-docs.mjs`）—— 3つを検査する
   - 参照切れ・孤立文書（参照整合性）
   - 文書のサイズ超過（読む量の予算）
   - 複数の文書に同じ説明がそのまま重複していないか（コピーして片方だけ直した
     結果、矛盾した説明が残る事故を防ぐ）
2. **ふるまい**（`.claude/skills/verify-docs/SKILL.md`）—— 見つかったものを
   どう直すかの手順（太った文書の分け方、重複の解消のしかた、TODO の書き方）

エージェントも、フックも要らない。検査スクリプトを CI と push 前検証に
差し込むだけで効く。

**守ること: 直すのは構造だけで、内容は変えない。** 太った文書を分ける・
重複を解消するときは「移動」と「ポインタ化」だけで行い、要約や言い換えで
意味を変えない（数値・条件・免責文言はとくに一字一句動かさない）。
詳しくは [SKILL.md「守ること」](.claude/skills/verify-docs/SKILL.md#守ること)。

## 入れる

このディレクトリ（`verify-docs/` 一式）の中身を、対象のリポジトリの**直下**に
コピーする（`verify-docs/` という入れ子は作らない。中身をそのまま展開する）。

```
your-repo/
├── scripts/verify-docs.mjs               ← このディレクトリの scripts/ をコピー
├── .claude/skills/verify-docs/           ← このディレクトリの .claude/ をコピー（SKILL.md と references/）
└── verify-docs.config.json               ← 要るなら作る（無くても動く）
```

設定の中身は [references/config.md](.claude/skills/verify-docs/references/config.md)。
既定値のまま試して、`entryPoints`・`docsDir`・`skillsDir` が自分のリポジトリの
構成と違うところだけ `verify-docs.config.json` で上書きする。

## 使う

### 真っさらなリポジトリ

そのまま検査を走らせる。既定では違反は無いはずなので、そのまま通る。

```bash
node scripts/verify-docs.mjs
```

### すでに肥大化しているリポジトリ（本題はこっち）

**このツールが本当に効くのは、これから書く文書より、すでにある文書のほう。**
だが既存の大きい文書を、導入した初日に全部分割するのは無理がある。

そこで導入は2段階にする。

**1. いまの違反をまとめて申告する。**

```bash
node scripts/verify-docs.mjs --init-todo
```

サイズ上限を超えている文書を全部拾って `verify-docs.todo.json` に書き出す
（[TODO の管理方法](#todo-の管理方法)を参照）。これで検査はいったん通る状態になる
—— **見逃しているのではなく、認めたうえで一覧に出し続ける状態にする。**

**2. CI に差し込む。** 以後、新しく書く文書・書き足す文書は上限を守る。
TODO に載っている文書は、都合のいいときに分割して、直したらエントリを消す。
[SKILL.md](.claude/skills/verify-docs/SKILL.md) の「太った文書を見つける」の
手順で分ける。

**この2段階が無いと、既存リポジトリへの導入は「初日に大量の文書を全部
その場で分割する」か「検査を無効にする」の二択になり、どちらも続かない。**
段階的に借金を返す形にすることで、導入のハードルと維持の仕組みを両立させる。

**重複はサイズと違って TODO 化しない。** 導入した瞬間に既存の文書間で
重複が見つかったら、その場でどちらか一方に寄せてポインタに置き換えるか、
意図した重複なら `<!-- verify-docs:allow-duplicate -->` を置く
（[SKILL.md](.claude/skills/verify-docs/SKILL.md) の「3. 重複を見つける」）。
サイズ超過と違って「あとで直す」を許すと、矛盾した説明がそのまま残り続ける。

## CI に足す

GitHub Actions の例（`.github/workflows/verify-docs.yml`。このリポジトリの
[.github/workflows/verify-docs.yml](.github/workflows/verify-docs.yml) をそのまま使える）。

```yaml
name: verify-docs
on:
  pull_request:
    paths:
      - '**/*.md'
      - 'verify-docs.config.json'
      - 'verify-docs.todo.json'
      - 'scripts/verify-docs.mjs'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/verify-docs.mjs
```

`paths` は自分のリポジトリの CI 振り分けに合わせて調整する。**文書だけの変更でも
必ず走らせること。** ビルドや依存関係の検査と束ねて「文書だけの回だから」と
飛ばすと、そこが誰にも見られなくなる。

push 前にローカルでも通しておきたいなら、既存の検証コマンド列（lint・
typecheck・test など）の1本として `node scripts/verify-docs.mjs` を足す。

## TODO の管理方法

このツールにおける「TODO」は2種類あるので混同しない。

- **`verify-docs.todo.json`（このツールが読む、運用上の TODO）。**
  「サイズ上限を超えているとわかっていて、いまは分割しない」という申告。
  [references/config.md](.claude/skills/verify-docs/references/config.md) に
  書き方がある。**空にしていく方向にだけ動かす。** 増やす方向（新しく書いた
  文書が超過したのでここに足す）は本来やらないほうがよく、それをやりたく
  なった時点で「その文書の分け方が悪い」を疑う。**重複はここには書けない**
  （重複は先送りにすると矛盾した説明が残り続けるので、その場で解消するか
  `allow-duplicate` で意図を宣言するかの二択にしてある）
- **このツール自身の開発 TODO（[TODO.md](TODO.md)）。** ツールの機能追加・
  未対応のケースを追う、ふつうの意味の TODO。運用上の TODO とは無関係

前者を後者と同じ感覚で「あとで直す一覧」として無限に積み増すと、
このツールを入れた意味が無くなる（肥大化を検知する仕組み自体が
肥大化した借金リストを許容する仕組みに変わってしまう）。**目安として、
`verify-docs.todo.json` が導入直後より増えていたら、それは退行。**

## この一式に手を入れるときの作法

ここまでは「これを使う側」の話。ここからは `verify-docs.mjs` 自体・
`SKILL.md`・`references/config.md` を直す側の話。

- **直したら、自分自身に対して検査を通す（ドッグフーディング）。** この
  リポジトリ（claude-kit）では `node verify-docs/scripts/verify-docs.mjs
  --root=verify-docs` で自己検査できる。CI も同じコマンドを走らせる
  （[../.github/workflows/ci.yml](../.github/workflows/ci.yml)）
- **挙動を変えたら、`SKILL.md`・`references/config.md`・このファイルの
  該当箇所も同じコミットで直す。** コードだけ直して説明が古いまま残ると、
  この一式自身が「文書の重複・不整合」を起こす（このツールが検査したい
  対象そのもの）
- **新しい検査・オプションを足す前に、まず [TODO.md](TODO.md) に
  やりたいことと理由を書く。** 「機械的に真偽が決まるか」を越える判断
  （表記ゆれの許容・意味的な類似判定など）は、実装するかどうかを保留のまま
  書き残す（[TODO.md](TODO.md) の重複検査の項を参照）
- **「守ること」はこの一式自身にも適用される。** 既存の説明を書き直すときも、
  意味を変える書き換えと構造を直すだけの変更は分けてコミットする

## 対象にしないこと

- **文章の質・正確さの検査。** 内容が正しいかは見ない
- **「何を MUST にすべきか」の判断。** 構造（参照・サイズ・重複）は見るが、
  中身の編集方針までは踏み込まない
- **文章を機械的にタイトに詰める提案。** 冗長さの判定は主観が入るので、
  このツールでは自動化しない。判断は書いた本人か、そのリポジトリの原則審査に
  委ねる（[SKILL.md](.claude/skills/verify-docs/SKILL.md) の「1. 入口を軽くする」）
