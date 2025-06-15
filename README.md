# TDesign 通用页面模板

基于 TDesign 打造的通用页面模板，包含通用的登陆注册、个人中心、设置中心、信息流等等功能。

## 技术栈

- 框架：微信小程序原生框架
- UI 组件库：TDesign 小程序组件库 (tdesign-miniprogram v1.8.6)
- 开发工具：微信开发者工具
- 代码规范：
  - ESLint
  - Prettier
  - Airbnb JavaScript Style Guide
- 包管理：npm
- 最低基础库版本：^2.6.5

## 项目结构

```
├── api/                # API 接口定义
├── behaviors/         # 小程序 behaviors
├── components/        # 自定义组件
├── config/           # 配置文件
├── custom-tab-bar/   # 自定义底部导航栏
├── doc/              # 项目文档
├── mock/             # 模拟数据
├── pages/            # 页面文件
│   ├── home/        # 首页
│   ├── message/     # 消息中心
│   ├── my/          # 个人中心
│   ├── search/      # 搜索页面
│   ├── chat/        # 聊天页面
│   ├── login/       # 登录页面
│   ├── setting/     # 设置中心
│   ├── release/     # 信息发布
│   └── create/      # AI创作工具
│       ├── emoji/   # 表情包创作
│       └── remove-bg/ # 图片去背景
├── static/          # 静态资源
│   ├── images/      # 公共图片资源
├── utils/           # 工具函数
├── app.js           # 小程序入口文件
├── app.json         # 小程序全局配置
├── app.less         # 全局样式
└── project.config.json # 项目配置文件
```

## 功能模块

### 1. 核心功能
- 首页信息流展示
- 消息中心
- 个人中心
- 搜索功能
- 信息发布
- 用户登录注册
- 设置中心
- 分享功能

### 2. 分包结构
- 主包：
  - 首页 (pages/home)
  - 消息中心 (pages/message)
  - 个人中心 (pages/my)
- 分包：
  - 搜索模块 (pages/search)
  - 个人信息编辑 (pages/my/info-edit)
  - 聊天模块 (pages/chat)
  - 登录模块 (pages/login, pages/loginCode)
  - 数据中心 (pages/dataCenter)
  - 设置中心 (pages/setting)
  - 信息发布 (pages/release)
  - AI创作工具 (pages/create)

### 3. 自定义组件
- 底部导航栏 (custom-tab-bar)
- TDesign 组件库集成

## 开发指南

### 环境要求
- Node.js
- 微信开发者工具
- npm 或 yarn

### 安装和运行
```bash
# 安装依赖
npm install

# 在微信开发者工具中导入项目
# 构建 npm 包
```

### 开发规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Airbnb JavaScript 代码规范

## 模版功能预览

### 首页

<div style="display: flex">
  <img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/home-1.png">
  <img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/home-2.png">
</div>

### 信息发布

<img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/publish-1.png">

### 搜索页

<img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/search-1.png">

### 个人中心
<div style="display: flex">
  <img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/user-1.png">
  <img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/user-2.png">
  <img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/user-3.png">
</div>


### 设置中心

<img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/setting-1.png">

### 消息中心

<img width="375" alt="image" src="https://tdesign.gtimg.com/miniprogram/template/message-1.png">

### AI创作工具

#### 1. 表情包创作
表情包创作功能允许用户输入文案，选择卡通人物，快速生成个性化表情包。

#### 2. 图片去背景
图片去背景功能允许用户上传图片，一键去除图片背景，生成透明背景的图片。
- 支持从相册或拍照获取图片
- 一键去除背景
- 支持预览和保存结果图片到相册

### 新增：描述文本自动换行与手动换行支持
- 现在 descText 支持自动换行，超出最大宽度会自动分行显示。
- 支持在 descText 中使用 `\n` 进行手动换行。
- 示例：
  - 自动换行："这是一个很长的描述文本，会根据宽度自动换行。"
  - 手动换行："第一行内容\n第二行内容"

## 最近更新

### 2023-XX-XX
1. 添加首页分享功能
   - 支持分享到微信好友
   - 支持分享到朋友圈
   - 自定义分享标题和图片
   - 添加卡片分享按钮，点击即可分享当前内容

### 2024-06-09
1. 【兼容性升级】个人中心上传头像功能，pages/my/index.js：
   - 将已停止维护的 `wx.chooseImage` 替换为官方推荐的 `wx.chooseMedia`。
   - 适配新 API，图片路径获取方式由 `res.tempFilePaths[0]` 改为 `res.tempFiles[0].tempFilePath`。
   - 参考：[微信小程序 chooseImage 停止维护公告](https://developers.weixin.qq.com/miniprogram/dev/api/media-picture/wx.chooseImage.html)

### 2024-06-10
1. 【UI优化】AI创作工具 - 图片增强、去背景、换脸（pages/create/enhance、remove-bg、face-swap）：
   - 上传图片区域，未上传时中间显示加号按钮，点击加号可上传图片，上传后显示图片本身。
   - 优化上传交互体验，提升用户指引。
2. 【功能优化】AI创作工具 - 换脸（pages/create/face-swap）：
   - 支持假tab切换"换脸/换背景"，切换时自动清空原图和参考图。
   - tab下方增加功能说明tip：换脸需真人图，换背景推荐背景图。
   - 操作按钮合并为"确定"，根据tab自动调用对应功能。

## 开发预览
### 目录结构（TODO: 生成目录结构树）


### 在开发者工具中预览

```bash
# 安装项目依赖
npm install

```

打开[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，导入整个项目，构建 npm 包，就可以预览示例了。

### 基础库版本

最低基础库版本`^2.6.5`


## 贡献成员

<a href="https://github.com/TDesignOteam/tdesign-miniprogram-starter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=TDesignOteam/tdesign-miniprogram-starter" />
</a>

## 反馈

有任何问题，建议通过 [Github issues](https://github.com/TDesignOteam/tdesign-miniprogram-starter/issues) 反馈。

## 开源协议

TDesign 遵循 [MIT 协议](https://github.com/TDesignOteam/tdesign-miniprogram-starter/blob/main/LICENSE)。

# Canvas 图片编辑器模块

## 模块简介
本模块为一个基于 Canvas 的图片编辑器，主要用于生成 512x512 的正方形图片，支持自定义文案、二维码、图片等元素，并提供多种编辑功能。界面参考见上方截图。

## 功能说明
1. **正方形画布**：
   - 画布尺寸为 512x512 像素。
   - 主图片为正方形，可自定义上传或更换。

2. **可替换元素**：
   - **主图片**：支持用户上传/更换。
   - **文案**：如"连续早起"、"今日早起"、"你笑时 雷声温柔，暴雨无声"等，均可自定义编辑。
   - **二维码**：支持自定义上传/更换。

3. **功能按钮（Tab 切换）**：
   - **换图**：更换主图片。
   - **换文字**：编辑图片上的文案内容。
   - **版式贴纸**：添加/切换贴纸或装饰元素。
   - **发圈文案**：生成/编辑用于分享的文案。
   - **去二维码**：移除或更换二维码。
   - Tab 切换时，下方内容区随之切换，展示对应的编辑功能。

4. **图片保存与分享**：
   - 支持保存生成的图片到本地。
   - 支持一键分享给好友。

## 主要技术实现思路
- 使用 `canvas` API 绘制主图片、文案、二维码等元素，保证所有内容合成在一张图片上。
- 所有可编辑元素（图片、文字、二维码）均以配置项形式管理，便于动态替换。
- Tab 区域采用状态管理（如 React useState 或小程序 setData）切换当前功能区，渲染不同的编辑面板。
- 提供图片上传、文字输入、二维码上传等交互。
- 生成图片时，统一在 canvas 上绘制所有元素，最后导出为图片文件。

## 文件结构建议
- `/template-image/` 目录下：
  - `index.js`/`index.tsx`：主逻辑与渲染
  - `canvasUtil.js`：canvas 绘图相关工具
  - `config.js`：默认文案、样式等配置
  - `components/`：各功能区子组件（如图片上传、文字编辑、二维码管理等）

## 交互流程
1. 用户进入页面，默认展示主图片和文案。
2. 通过下方 Tab 切换不同编辑功能。
3. 编辑完成后，点击"保存图片"或"发给好友"导出图片。

---

如需详细 API 或组件设计，可进一步补充。
