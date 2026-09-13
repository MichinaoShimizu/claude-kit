# verify-docs の高度な使い方

## 文書構造を検査する

```bash
node scripts/verify-docs.mjs
```

## PR差分だけを検査する

基準ブランチから変更したパスに関係する違反だけを失敗として返す。リンク解決などは
リポジトリ全体を解析するため、変更していない文書へのリンク切れも、変更で起きた場合は
検出する。

```bash
node scripts/verify-docs.mjs --changed-base=origin/main
```

## AST情報をJSONで取得する

dedupe-docs / tighten-docs で対象文書を調べるときは、CommonMarkの見出し階層と段落を
JSON出力できる。意味的な重複や冗長性は判定しない。

```bash
node scripts/extract-doc-blocks.mjs --root=. README.md docs/guide.md
```

見出し階層・段落・位置・バイト数を返す。出力項目の使い方は各スキルの手順を参照。

## 既存のサイズ超過をTODOに記録する

既存文書に違反があるリポジトリでは、最初に次を実行する。

```bash
node scripts/verify-docs.mjs --init-todo
```

## 検査結果をJSONで取得する

```bash
node scripts/verify-docs.mjs --json
```
