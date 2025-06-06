Page({
  data: {
    originImage: [],
    resultImage: '',
    isProcessing: false,
    uploadConfig: {
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 图片上传成功
  onImageUpload(e) {
    const { files } = e.detail;
    this.setData({
      originImage: files,
      resultImage: ''
    });
  },

  // 删除图片
  onImageRemove() {
    this.setData({
      originImage: [],
      resultImage: ''
    });
  },

  // 去除背景
  onRemoveBackground() {
    if (!this.data.originImage.length) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }

    this.setData({ isProcessing: true });

    // 这里应该调用实际的AI去背景API
    // 为了演示，我们使用setTimeout模拟API调用
    setTimeout(() => {
      // 假设这是处理后的图片URL（实际项目中需要替换为真实API返回的URL）
      // 在实际项目中，您需要集成真实的图片去背景API
      this.setData({
        resultImage: this.data.originImage[0].url,
        isProcessing: false
      });

      wx.showToast({
        title: '背景去除成功',
        icon: 'success'
      });
    }, 2000);
  },

  // 预览结果图片
  previewResult() {
    if (this.data.resultImage) {
      wx.previewImage({
        urls: [this.data.resultImage]
      });
    }
  },

  // 保存图片到相册
  saveImage() {
    if (!this.data.resultImage) return;
    
    wx.showLoading({
      title: '保存中...',
    });
    
    wx.downloadFile({
      url: this.data.resultImage,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '已保存到相册',
                icon: 'success'
              });
            },
            fail: (err) => {
              console.error('保存失败', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '下载图片失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
}); 