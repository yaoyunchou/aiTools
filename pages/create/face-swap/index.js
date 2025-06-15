import runWorkFlow from "../utils/baseWorkFlow";
import request from '~/api/request';
Page({
  data: {
    title: '照片换脸',
    originalImage: '',      // 原图本地预览
    referenceImage: '',     // 参考图本地预览
    originalFileId: '',     // 原图上传后 file_id
    referenceFileId: '',    // 参考图上传后 file_id
    resultImage: '',        // 换脸结果图
    loading: false,
    visible:false,
    tab: 'face', // 0: 换脸, 1: 换背景
    tabTips: {
     'face': '换脸需要使用真人图片',
      "bg":'换背景时，参考图推荐为背景图最佳'
    }
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

  // 选择图片并上传 type: 'original' | 'reference'
  chooseAndUpload(type) {
    wx.chooseImage({
      count: 1,
      success: res => {
        const filePath = res.tempFilePaths[0];
        this.setData({ [`${type}Image`]: filePath });      
        wx.uploadFile({
          url: 'https://nestapi.xfysj.top/xcx/api/v1/creations/coze/upload-file', //仅为示例，非真实的接口地址
          filePath:filePath,
          name: 'file',
          success (res){
            const data = JSON.parse(res.data)
            //do something
            console.log( data)
            if(data.code === 0) {
                console.log(data.data.data.id, '=============id===')
            }
          }
        })
      }
    });
  },
  onChooseOriginal() {
    this.chooseAndUpload('original');
  },
  onChooseReference() {
    this.chooseAndUpload('reference');
  },

  // 换脸, 换背景逻辑
  async onConfirm() {
    if (!this.data.originalImage || !this.data.referenceImage) {
      wx.showToast({ title: '请先上传两张图片', icon: 'none' });
      return;
    }
    const result = await runWorkFlow("7455563134293229608", {type: this.data.tab}, [{
        key: "input",
        url: this.data.originalImage
      },{
        key: "reference",
        url:this.data.referenceImage
      }])
    console.log('============', result)
    this.setData({
      resultImage: result.output
    })
    // 创建图片
    await request(`/api/v1/creations`, "POST", {
      title: 'coze 换脸',
      prompt: '',
      type: 'change-face',
      images: [result.output],
      status: 2, // 这里是私密的
    });
    this.setData({ loading: true });
  },
  // 结果图长按分享/保存
  onShareResult() {
    wx.showActionSheet({
      itemList: ['保存到相册'],
      success: res => {
        if (res.tapIndex === 0) {
          wx.saveImageToPhotosAlbum({ filePath: this.data.resultImage });
        }
      }
    });
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