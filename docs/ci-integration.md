# CIへの組み込み

push・PR の前に必ず文書構造検証器を通過するよう構成する。

```yaml
name: verify-docs
on:
  pull_request:
    paths:
      - '**/*.md'
      - 'verify-docs.config.json'
      - 'document-size-exceptions.json'
      - 'scripts/**'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
      - run: node scripts/document-structure-verifier.mjs
```

`paths` は対象リポジトリのCI構成に合わせる。文書だけの変更でも実行する。push前にも検証する場合は、既存のlint・typecheck・testなどに `node scripts/document-structure-verifier.mjs` を追加する。
