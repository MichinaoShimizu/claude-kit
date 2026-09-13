# 導入と運用

[README.md](../README.md)から参照される。既存リポジトリへの導入、CIへの
組み込み、`verify-docs.todo.json`の運用を扱う。

## 既存のサイズ超過文書への導入

既存文書では、導入初日にすべてを分割できないことがある。その場合は、
例外を明示しながら2段階で導入する。

先に[README.md「導入」](../README.md#導入)に従ってインストールする。

### 1. 現状の違反を一括で申告する

```bash
node scripts/verify-docs.mjs --init-todo
```

サイズ上限を超えている文書を全て抽出し`verify-docs.todo.json`に書き出す。
これらのサイズ超過は例外扱いとなり、検査結果の一覧には出続ける。リンク切れ・孤立・重複など
他の違反は例外にならないため、別途是正する。

### 2. CIに組み込む

以降、新規に書く文書・追記する文書は上限を遵守する。TODOに記載された文書は
任意のタイミングで分割し、是正後にエントリを削除する。分割手順は
[文書構造の是正手順「2. 肥大化文書の特定」](../.agents/skills/verify-docs/references/remediation.md#2-肥大化文書の特定)
を参照する。

重複はサイズ超過と異なりTODO化しない。導入時に検出された場合は一方へ統合して
ポインタに置換する。意図した重複には`<!-- verify-docs:allow-duplicate -->`を
付与する。詳しくは
[文書構造の是正手順「3. 重複特定」](../.agents/skills/verify-docs/references/remediation.md#3-重複特定)
を参照する。

## チェックリストの作業単位

`checklist.md` は、現在の作業単位だけを記録する。作業単位は、同じ目的・対象範囲に
対する一連の変更と、その変更を含む1つの PR のレビュー対応・再検査を指す。

同じ作業単位では、実行履歴と開始時点のサイズを引き継ぐ。PR 作成後のレビュー対応、
同じ目的に対する追加の是正、同じ変更系列の再検査は、同じ作業単位として扱う。

前の作業単位を含む PR が merge 済みである場合、または目的・対象範囲を変えて新しい
PR の作業を始める場合は、新しい作業単位とする。新しい作業単位の一時記録を統合するときは、
既存の `checklist.md` を新しい作業単位の記録で置き換える。前の記録は merge 済みの
コミットと PR に残るため、`checklist.md` へ再掲しない。

## CIへの組み込み

GitHub Actionsの構成例。本パッケージの
[ワークフロー](../.github/workflows/verify-docs.yml)も利用できる。

```yaml
name: verify-docs
on:
  pull_request:
    paths:
      - '**/*.md'
      - 'verify-docs.config.json'
      - 'verify-docs.todo.json'
      - 'scripts/**'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/verify-docs.mjs
```

`paths` は対象リポジトリのCI構成に合わせる。文書だけの変更でも実行する。
push前にも検証する場合は、既存のlint・typecheck・testなどに
`node scripts/verify-docs.mjs`を追加する。

## TODOの管理

`verify-docs.todo.json` は、上限を超過している文書を後で是正するための一覧である。
記述形式と運用ルールの正本は
[references/todo.md](../.agents/skills/verify-docs/references/todo.md)を参照する。

TODOは導入直後から削減する方向にのみ運用する。際限なく増やすと、肥大化検知が
負債を許容する仕組みに変わる。導入直後より件数が増えていれば退行の目安となる。
