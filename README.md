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
