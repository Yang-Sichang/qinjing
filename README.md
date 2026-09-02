# 琴境 · 古琴练习第一版

这是一个可直接部署的静态网站原型。将 `index.html` 部署到任意静态托管即可访问。

## 当前能力
- 古琴曲目与章节进度
- 练习段落解锁画卷
- 画卷填色
- 语印：难点、易错、节奏、指法、意境、我的点评
- 本地浏览器保存语印与填色状态（localStorage）
- 图片/PDF/音频/视频选择入口（第一版仅本地预览，不上传云端）

## 部署
### GitHub Pages
把 `index.html` 放进仓库根目录，在 Settings → Pages 中选择 GitHub Actions 或 Deploy from branch。

### Vercel / Netlify
直接导入这个文件夹，Build Command 留空，发布目录选择项目根目录。

## 下一阶段
若要实现多人共享语印，需要接入数据库和对象存储，例如 Supabase/Firebase/自建 API；当前 localStorage 数据不会在不同用户之间共享。
