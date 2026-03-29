# ☕ Cafe Radar Map

以 Google Maps 為基礎的本機前端原型，用來整理使用者附近 5 公里內的咖啡廳，並依評分與評論數排序展示。

## ✨ 功能

- 📍 取得目前位置，或退回展示中心點
- 🗺️ 顯示地圖，支援「搜尋這個區域」
- ☕ 搜尋附近咖啡廳並渲染卡片清單
- ⭐ 依評分優先、評論數次之排序
- 📝 顯示前 3 則可取得評論
- 🔗 顯示地址、電話、營業時間、網站與 Google Maps 連結
- 🧯 Places API 失敗時，自動退回示範資料模式
- 🚀 提供 Windows 雙擊啟動器

## 🖼️ 目前介面

![Cafe Radar UI](./cafe-map-home-30s.png)

## 🧱 專案結構

```text
vibe_message/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ server.js
├─ package.json
├─ .env.example
├─ .env.local
├─ .gitignore
├─ Launch-CafeRadar.vbs
├─ Launch-CafeRadar.cmd
├─ Launch-CafeRadar.ps1
└─ cafe-map-home-30s.png
