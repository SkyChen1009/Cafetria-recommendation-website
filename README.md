# ☕ 最強咖啡廳雷達 (CafeRadar PWA) 🚀

歡迎來到地表最強的咖啡廳搜尋專案！本應用是一個基於 **React + Vite** 打造的現代化「漸進式網頁應用程式 (PWA)」。
專案結合了 Google Maps 的 `AdvancedMarker` 技術與極致質感的 **Glassmorphism (毛玻璃)** UI 設計，並針對行動裝置 (RWD) 進行了深度最佳化，提供使用者如同操作獨立手機 App 般的沉浸式體驗！📲✨

## ✨ 開發亮點與核心架構 (Key Features & Architecture)

- 📍 **地理定位與智慧演算法**：整合 Google Places API (`nearbySearch` 與 `getDetails`)，自動讀取裝置座標，精準撈取方圓 5 公里內的咖啡聽，並於前端實現**依據 Google 評分降冪排序**。
- 📱 **頂級 PWA 與 完美 RWD 響應式佈局**：
  - **電腦版 (Desktop)**：高顏值的左側靜態毛玻璃側邊欄。
  - **手機版 (Mobile)**：無縫過渡為 Native App 邏輯的 **Floating Bottom Sheet (懸浮底部抽屜)**，讓地圖元件延展至 100% 畫面！
  - **PWA Ready**：導入 `vite-plugin-pwa`，支援多尺寸系統級圖標，使用者可一鍵「加到螢幕主畫面」，移除預設劉海與網址列！
- 🖼️ **進階互動 InfoWindow 與 原生街景**：
  - 地圖點擊彈出卡片後，我們利用 CSS `scroll-snap` 打造了支援橫向滑動的 **動態照片輪播牆 (Photo Carousel)**。
  - 捨棄老舊的桌機版小橘人 (Pegman)，轉而在資訊視窗內嵌入一鍵 **「🚶‍♂️ 進入街景 (Street View)」** 獨立按鈕！
- 🗺️ **最新的聲明式地圖套件**：導入 `@vis.gl/react-google-maps`，全面以 React Hook 模式 (`useMap`, `useMapsLibrary`) 精準抽離、管理地圖與 Places API 生命週期，告別老派的 Callback 地獄！

## 🛠️ 技術疊代 (Tech Stack)

*   **基礎框架**：React 18 + Vite (極速啟動與熱重載)
*   **地圖生態系**：Google Maps JavaScript API, Places API
*   **視覺系統**：純 Vanilla CSS (無痛跨裝置實踐高複雜度的 Glassmorphism 與流暢動態，不依賴龐大 UI 庫)
*   **PWA 套件**：`vite-plugin-pwa`

## 🚀 開發者快速啟動指南 (Quick Start)

### 1. 安裝環境與相依性套件
請確保您的開發機已搭載 Node.js (建議 v18 以上)，打開終端機並執行：
```bash
git clone https://github.com/SkyChen1009/Cafetria-recommendation-website.git
cd Cafetria-recommendation-website
npm install
```

### 2. 環境變數設定配置 (.env)
本專案的命脈在於有效的 Google Maps API Key（需至開通 Maps JavaScript API 及 Places API）。
請於專案根目錄建立一隻名為 `.env.local` 的檔案，並寫入：
```env
VITE_GOOGLE_MAPS_API_KEY=在此填入您的_API_KEY
```
*(注意：Vite 打包工具只會讀取以 `VITE_` 開頭的環境變數)*

### 3. 上線起飛！
```bash
npm run dev
```
🎉 接著開啟您的瀏覽器狂奔至 `http://localhost:3000` ，接受瀏覽器定位權限的請求，马上就能驗證專案的傲人成果！

## 💡 開發者維護筆記 (Developer Notes)
*   **地圖控制項魔改**：為了完全對標各大手機地圖 App 的質感，我們啟用了 `disableDefaultUI={true}` 隱藏所有原生預設按鈕，並在右上角自刻了 `🗺️ / 🛰️` 專屬樣式的浮動地圖圖層切換鈕。
*   **非同步載入策略**：資料請求機制已設定為取前 15 家高評分名單後觸發非同步的 `getDetails`，以保護 API 配額不過度損耗。

---
*Built with ❤️, logic, and maximum vibe.* 💻✨
