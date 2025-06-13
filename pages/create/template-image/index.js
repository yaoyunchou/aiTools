import { drawCanvas2d } from './canvas'
import request from '~/api/request'
import baseConfig from './config'

Page({
  data: {
    ...baseConfig,
    mainImage: '', // 主图片url
    titleText: '连续早起',
    subtitleText: '今日早起',
    descText: '你笑时\n雷声温柔，暴雨无声',
    qrcodeUrl: 'https://cdn.xfysj.top/zaoan/qrcode/zaoancode.jpg', // 二维码图片url
    showQrcode: true,
    showPreview: false,
    activeTab: 'image', // 当前tab
    avatar:'https://s.coze.cn/t/fy2LU3qEpD8/',
    images: [], // 多图预览
    captionText: '',
    sticker: '',
    selectedImage: '',
    images: baseConfig.defaultImages,
    textColor: '#fff', // 新增，默认白色
    showCropper: false, // 新增
    cropperSrc: '', // 新增
    // 新增显示配置
    showTitleText: true,
    showSubtitleText: true,
    showDescText: true,
    showAvatar: true,
    showDay: true,
    showQrcode: true,
  },

  async onLoad(option) {
    const { time, continuousCheckInCount } = option
    const userInfo = wx.getStorageSync('userInfo')

    if(time && continuousCheckInCount) {
      this.setData({
          day: continuousCheckInCount,
          timeStr: time
      })
    }
    const newData = {
      mainImage: 'https://s.coze.cn/t/fy2LU3qEpD8/',
      avatar: userInfo.avatar
    }
    // 可在此初始化主图片、二维码等
    // 获取图鉴图片信息
    const baseImagesRes = await request('/api/v1/file-resource/recommend/list?page=1&pageSize=1000')
    console.log(baseImagesRes)
    if(baseImagesRes.code === 0) {
      const baseImages = baseImagesRes.data.list.map(item => item.url)
      newData.images = baseImages
      newData.scene = baseImagesRes.data.scene
      newData.descTextOptions = baseImagesRes.data.descTextOptions || []
      if(newData.scene !== '早安') {
        newData.titleText="晚上连续打卡"
        newData.subtitleText = '晚安, 好梦'
      }
    }

    this.setData(newData, this.initCanvas);
    // 检查是今天已经打过卡了， 如果没有打卡，则调用接口打卡。
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
    console.log('onSave called', this.canvas);
    const saveImage = (filePath) => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => wx.showToast({ title: '保存成功', icon: 'success' }),
        fail: (err) => {
          console.error('saveImageToPhotosAlbum fail:', err);
          if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
            wx.showModal({
              title: '提示',
              content: '需要授权保存到相册，是否去设置？',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting();
                }
              }
            });
          }
        }
      });
    };

    wx.canvasToTempFilePath({
      canvas: this.canvas,
      x: 0,
      y: 0,
      width: 512,
      height: 512,
      destWidth: 512,
      destHeight: 512,
      success: (res) => {
        console.log('canvasToTempFilePath success', res);
        wx.getSetting({
          success(settingRes) {
            if (!settingRes.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  saveImage(res.tempFilePath);
                },
                fail() {
                  wx.showModal({
                    title: '提示',
                    content: '需要授权保存到相册，是否去设置？',
                    success: (modalRes) => {
                      if (modalRes.confirm) {
                        wx.openSetting();
                      }
                    }
                  });
                }
              });
            } else {
              saveImage(res.tempFilePath);
            }
          }
        });
      },
      fail: (err) => {
        wx.showToast({ title: '保存失败', icon: 'none' });
        console.error('canvasToTempFilePath fail:', err);
      }
    });
  },

  onShare() {
    if (!this.canvas) {
      wx.showToast({ title: 'canvas未初始化', icon: 'none' });
      return;
    }
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      x: 0,
      y: 0,
      width: 512,
      height: 512,
      destWidth: 512,
      destHeight: 512,
      success: (res) => {
        wx.showShareImageMenu({
          path: res.tempFilePath
        });
      },
      fail: (err) => {
        wx.showToast({ title: '分享失败', icon: 'none' });
        console.error('canvasToTempFilePath fail:', err);
      }
    });
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
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        const { windowWidth, pixelRatio } = wx.getWindowInfo();
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
  onColorPick(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ textColor: color }, this.initCanvas);
  },
  onDescTextPick(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({ descText: text }, this.initCanvas);
  },
  onChooseImage(){
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          this.setData({
            showCropper: true,
            cropperSrc: res.tempFiles[0].tempFilePath
          });
        } else {
          wx.showToast({ title: '未选择图片', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '选择图片失败', icon: 'none' });
        console.error('chooseMedia fail:', err);
      }
    });
  },
  onCropperDone(e) {
    // e.detail 里有裁剪后的图片路径
    const imgPath = e.detail.path || e.detail.tempFilePath || e.detail.url;
    this.setData({
      mainImage: imgPath,
      showCropper: false
    }, this.initCanvas);
  },
  onCropperCancel() {
    this.setData({ showCropper: false });
  },
  onSwitchChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    }, this.initCanvas);
  },
}); 