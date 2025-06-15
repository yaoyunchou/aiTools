import runWorkFlow from "../utils/baseWorkFlow";
// import request from '~/api/request';
Page({
  data: {
    originalImage: '',
    resultImage: '',
    isProcessing: false,
    loading: false,
    visible:false,
    tab: 'bg',
    tabTips: {
      'bg': '去背景',
      'pretty': '美颜',
      'expand': '图片扩展'
    }
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  onChooseOriginal() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          originalImage: res.tempFilePaths[0]
        })
      }
    });
  },

  // tab 切换
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      tab,
      originalImage: '',
      referenceImage: '',
      resultImage: ''
    });
  },

  // 去除背景
  async onConfirm() {
    if (!this.data.originalImage) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }
    this.setData({ bgLoading: true });
    const result = await runWorkFlow("7515738729680568372", {type: this.data.tab}, [{
      key: "input",
      url: this.data.originalImage
    }])
    this.setData({
      resultImage: result.output,
      bgLoading: false
    })
  },

  previewImage(){
    this.setData({
      visible:true
    })
  },
  onClose(){
    this.setData({
      visible:false
    })
  }
}); 