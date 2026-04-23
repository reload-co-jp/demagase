---
description: DemaGase の myth-check 記事 JSON を data/articles/ に追加・更新する。新しい日本語トリビア/俗説検証記事の作成、Article スキーマへの変換、verdict ラベルの選択、重複 ID 回避、記事データの検証に使用する。
---

# Add Dema Article

## Workflow

1. `data/articles/`、`types/article.ts`、`lib/articles.ts` が存在することを確認する。
2. `types/article.ts` と近くの記事 JSON ファイルを 1〜2 件読んでから編集する。スキーマとトーンが異なる場合はリポジトリの現行仕様を優先する。
3. `rg -n "<topic>|<candidate_id>" data/articles README.md app` で重複を検索する。
4. 現在の情報や重要な事実が必要な場合は、執筆前に一次情報源や権威ある情報源を参照する。辞書、公的機関、学術論文、信頼できる百科事典、専門家の見解を優先し、まとめブログは避ける。
5. ユーザーが複数記事を求めない限り、`data/articles/<id>.json` に UTF-8 JSON ファイルを 1 つだけ作成する。
6. JSON バリデーションとプロジェクトチェックを実行する。

## Article Rules

- ID は `coffee_dehydration` のような snake_case ASCII を使用し、ファイル名と完全に一致させる。
- 日本語で記述し、1〜3 分で読める分量にする。
- タイトルは自然な場合に疑問形にする: `「...」は本当か？`
- `claim` は結論ではなく、議論されている主張のみを記載する。
- verdict は `true`、`false`、`partial`、`unconfirmed`、`unknown` のいずれか 1 つを選ぶ。
- 対応する日本語の `verdict_label` を使用する（下記参照）。
- 可能な限り 2 つ以上の出典を含める。Web でアクセス可能な場合は `url` を追加する。
- 出典を捏造しない。確認していない出典は確認するか、省略する。
- `created_at` は今日の日付を `YYYY-MM-DD` 形式で設定する。

## JSON Schema

`data/articles/<id>.json` に配置する。ファイル名のステムは記事の `id` と一致させること。

```json
{
  "id": "snake_case_id",
  "title": "「俗説」は本当か？",
  "category": "語源",
  "claim": "検証対象の主張",
  "verdict": "false",
  "verdict_label": "誤り",
  "common_belief": "一般に語られる説明や俗説。",
  "explanation": "検証結果。どこが誤りか、どの条件なら成り立つか。",
  "truth": "現時点でより妥当な説明や有力説。",
  "why_spread": "なぜ広まったか。語感、単純化、SNS、テレビなど。",
  "how_to_identify": "読者が似た俗説を見分けるための実用的な観点。",
  "sources": [
    { "title": "出典名", "url": "https://example.com", "author": "著者・機関名" }
  ],
  "tags": ["語源", "食べ物"],
  "created_at": "2026-04-23"
}
```

## Verdict Mapping

- `false` → `誤り`
- `partial` → `一部誤り`
- `unconfirmed` → `有力説だが確定ではない`
- `true` → `正しい`
- `unknown` → `不明`

`partial`: 俗説に事実の核があるが結論が誇張されている場合。
`unconfirmed`: 証拠不十分な競合する有力説が存在する場合。
`unknown`: 信頼できる証拠が乏しすぎて判断できない場合のみ。

## Suggested Categories

`語源` / `食べ物` / `科学・医学` / `日本文化` / `歴史` / `言葉` / `生活`

リポジトリ既存のカテゴリを優先する。

## Writing Checklist

- `common_belief`: 俗説を否定する前に公平に提示する。
- `explanation`: 証拠とその限界を説明する。信じていた人を嘲らない。
- `truth`: 適切な不確実性を持って、より正確な説明を述べる。
- `why_spread`: その話が広まったメカニズムを特定する。
- `how_to_identify`: トピック固有の注意ではなく、再利用できる検証習慣を示す。
- `sources`: 安定した名前付き出典を優先する。URL のない辞書や論文は `title` と `author` を含める。
- `tags`: 2〜5 個の短いタグを使用し、既存のタグ/カテゴリを再利用する。

## Quality Bar

- 確信を誇張しない。`可能性が高い`、`現時点では`、`とされる` などの表現は出典が確定的でない場合に適切。
- 長い出典引用は避け、自分の言葉で要約する。
- フィールドはプレーンな JSON 文字列のみ。アプリが既にサポートしている場合を除き、フィールド内で Markdown を使用しない。
- 有効な JSON: ダブルクォート、末尾カンマなし、`sources` と `tags` は配列。

## Validation

編集後に実行する:

```bash
node -e "const fs=require('fs'); for (const f of fs.readdirSync('data/articles')) JSON.parse(fs.readFileSync('data/articles/'+f,'utf8'));"
pnpm typecheck
pnpm lint
```

静的エクスポートを使用している場合は `pnpm build` も実行する。
