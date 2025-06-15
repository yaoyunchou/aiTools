import runWorkFlow from "../utils/baseWorkFlow";
// import request from '~/api/request';
Page({
  data: {
    originalImage: '',
    resultImage: '',
    isProcessing: false,
    bgLoading: false,
    beautifyLoading: false,
    expandLoading: false,
    visible:false
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

  // 去除背景
  async makePictureClear() {
    if (!this.data.originalImage) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }
    this.setData({ bgLoading: true });
    const result = await runWorkFlow("7515738729680568372", {type:'clear'}, [{
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