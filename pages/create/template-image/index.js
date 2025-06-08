import { drawCanvas2d } from './canvas'
import baseConfig from './config'

Page({
  data: {
    ...baseConfig,
    mainImage: '', // 主图片url
    titleText: '连续早起',
    subtitleText: '今日早起',
    descText: '你笑时\n雷声温柔，暴雨无声',
    qrcodeUrl: '', // 二维码图片url
    showQrcode: true,
    showPreview: false,
    activeTab: 'image', // 当前tab
    avatar:'https://s.coze.cn/t/fy2LU3qEpD8/',
    images: [], // 多图预览
    captionText: '',
    sticker: '',
    selectedImage: '',
    images: baseConfig.defaultImages
  },

  onLoad() {
    // 可在此初始化主图片、二维码等
    this.setData({
      mainImage: '/static/home/image.png',
      qrcodeUrl: '/assets/default-qrcode.png',
    }, this.initCanvas);
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },
  handleImageItemClick(e) {
    const path = e.currentTarget.dataset.path;
    this.setData({
      selectedImage: path,
      mainImage: path
    }, this.initCanvas);
  },

  onSave() {
    // 导出canvas图片并保存到相册
    wx.canvasToTempFilePath({
      canvasId: 'mainCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '保存成功', icon: 'success' }),
        });
      },
      fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
    }, this);
  },

  onShare() {
    // 导出canvas图片并触发分享
    wx.canvasToTempFilePath({
      canvasId: 'mainCanvas',
      success: (res) => {
        wx.showShareImageMenu({
          path: res.tempFilePath
        });
      },
      fail: () => wx.showToast({ title: '分享失败', icon: 'none' })
    }, this);
  },

  onReady() {
    this.initCanvas();
  },

  async initCanvas() {
    const query = this.createSelectorQuery();
    query.select('#mainCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const { windowWidth,pixelRatio } = wx.getSystemInfoSync();
        console.log(windowWidth, pixelRatio)
        canvas.width = 512 * pixelRatio
        canvas.height = 512 * pixelRatio;
        ctx.scale(pixelRatio,pixelRatio);
        await drawCanvas2d(ctx, canvas, this.data);
      });
  },



  // 监听数据变更自动重绘
  onShow() {
    this.initCanvas();
  },

  // 预留：各tab内容区的交互方法
  // ...
}); 