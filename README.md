# 事業所図鑑

エンジョイント株式会社の相談支援専門員が使う、障害福祉サービス事業所の情報管理PWAアプリです。

## ファイル構成

```
enjoint-directory/
├── index.html     # アプリ本体（単一ファイル）
├── manifest.json  # PWA マニフェスト
├── sw.js          # サービスワーカー
├── icon.svg       # アプリアイコン
└── README.md      # このファイル
```

---

## 1. Azure ポータル — リダイレクト URI の追加

**初回セットアップ時に必ず実施してください。**

1. [Azure ポータル](https://portal.azure.com) にサインイン
2. **Azure Active Directory** → **アプリの登録** を開く
3. アプリ「（既存のアプリ名）」をクリック（クライアント ID: `405cc58b-abd1-44da-a6b8-6d26d044164e`）
4. 左メニュー → **認証** をクリック
5. **プラットフォームを追加** → **シングルページ アプリケーション (SPA)** を選択
6. リダイレクト URI に以下を入力して **構成** をクリック：
   ```
   https://（GitHubユーザー名）.github.io/enjoint-directory/
   ```
   例: `https://torigemasahiro.github.io/enjoint-directory/`
7. **保存** をクリック

> ローカル開発時は `http://localhost:5500/` なども追加しておくと便利です。

---

## 2. GitHub Pages へのデプロイ

### 初回（リポジトリ未作成の場合）

```bash
# リポジトリのディレクトリに移動
cd ~/enjoint-directory

# Git 初期化
git init
git add .
git commit -m "initial commit"

# GitHub でリポジトリ「enjoint-directory」を作成後、リモートを追加
git remote add origin https://github.com/（GitHubユーザー名）/enjoint-directory.git
git branch -M main
git push -u origin main
```

### GitHub Pages の有効化

1. GitHubのリポジトリページを開く
2. **Settings** → **Pages** を開く
3. **Source** を `Deploy from a branch` に設定
4. **Branch** を `main`、フォルダを `/ (root)` に設定して **Save**
5. 数分後に `https://（GitHubユーザー名）.github.io/enjoint-directory/` で公開される

### 更新時のデプロイ

```bash
cd ~/enjoint-directory
git add .
git commit -m "update"
git push
```

---

## 3. 初回ログイン・初期設定

1. `https://（GitHubユーザー名）.github.io/enjoint-directory/` にアクセス
2. **「Microsoftアカウントでサインイン」** ボタンをタップ
3. エンジョイントの Microsoft 365 アカウントでサインイン
4. **初回のみ**：OneDrive に `enjoint-directory/事業所データ.xlsx` が自動作成されます
5. 右下の **＋ボタン** から事業所を追加してください

### スマホのホーム画面に追加

**iOS（Safari）**
1. Safari でアプリURLを開く
2. 下部の共有ボタン → **「ホーム画面に追加」** をタップ
3. **「追加」** をタップ

**Android（Chrome）**
1. Chrome でアプリURLを開く
2. アドレスバー右の **「⋮」** → **「ホーム画面に追加」** をタップ

---

## 技術仕様

| 項目 | 内容 |
|------|------|
| フロントエンド | HTML / CSS / JavaScript（単一ファイル） |
| 認証 | MSAL.js v3 + Microsoft Azure AD |
| データ | OneDrive上の Excel（Microsoft Graph API） |
| ホスティング | GitHub Pages |
| PWA | Service Worker + Web App Manifest |
| 対応 OS | iOS 15+ / Android 9+ |

### Azure アプリ情報

- クライアント ID: `405cc58b-abd1-44da-a6b8-6d26d044164e`
- テナント ID: `f0796f06-778d-4183-b5d9-4cce701de452`
- 必要なスコープ: `User.Read`, `Files.ReadWrite.All`

### OneDrive ファイル構成

```
OneDrive ルート/
└── enjoint-directory/
    └── 事業所データ.xlsx
        ├── シート1: 事業所データ
        └── シート2: レビューデータ
```

---

## トラブルシューティング

**「ログインできない」**
→ Azure ポータルでリダイレクト URI が正しく登録されているか確認してください。

**「Excelファイルが作成されない」**
→ `Files.ReadWrite.All` スコープの権限が付与されているか、Azure ポータルで確認してください。管理者の同意が必要な場合があります。

**「データが保存されない」**
→ 複数人が同時に編集すると上書きが発生する場合があります。時間をずらして再試行してください。

**「アイコンが表示されない（iOS）」**
→ Safari からホーム画面に追加し直してください。SVGアイコンはiOS 13.4以降で対応しています。
