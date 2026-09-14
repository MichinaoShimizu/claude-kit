# verify-docs CLIリファレンス

以下のコマンドは配布先リポジトリのルートで実行する。

## 文書構造の検査

```bash
node .verify-docs/scripts/verify-docs.mjs
```

## PR差分の検査

基準ブランチから変更したパスに関係する違反だけを失敗として返す。リンク解決などは
リポジトリ全体を解析するため、変更していない文書へのリンク切れも、変更で起きた場合は
検出する。Gitで文書を移動した場合は、移動元・移動先の両方を変更パスとして扱うため、
移動元を参照したままの文書も検出できる。

```bash
node .verify-docs/scripts/verify-docs.mjs --changed-base=origin/main
```

## AST情報のJSON出力

dedupe-docs / tighten-docs で対象文書を調べるときは、CommonMarkの見出し階層と段落を
JSON出力できる。意味的な重複や冗長性は判定しない。

```bash
node .verify-docs/scripts/extract-doc-blocks.mjs --root=. README.md docs/guide.md
```

見出し階層・段落・位置・バイト数を返す。出力項目の使い方は各スキルの手順を参照。

## 既存のサイズ超過のTODO記録

既存文書に違反があるリポジトリでは、最初に次を実行する。

```bash
node .verify-docs/scripts/verify-docs.mjs --init-todo
```

## 検査結果のJSON出力

```bash
node .verify-docs/scripts/verify-docs.mjs --json
```
