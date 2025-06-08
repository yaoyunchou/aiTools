Page({
  data: {
    createList: [
      {
        id: 'emoji',
        title: '表情包创作',
        icon: 'emoji',
        desc: '快速制作有趣的表情包',
        path: '/pages/create/emoji/index'
      },
      {
        id: 'emoji',
        title: '表情包创作',
        icon: 'emoji',
        desc: '快速制作有趣的表情包',
        path: '/pages/create/template-image/index'
      },
      {
        id: 'editImage',
        title: '修改图片(开发中）',
        icon: 'image',
        desc: '你说，我改！',
        path: '/pages/create/edit-image/index'
      },
      {
        id: 'remove-bg',
        title: '图片去背景（开发中）',
        icon: 'image',
        desc: '一键去除图片背景',
        path: '/pages/create/remove-bg/index'
      },
      {
        id: 'face-swap',
        title: '照片换脸（开发中）',
        icon: 'user',
        desc: '轻松实现照片换脸',
        path: '/pages/create/face-swap/index'
      },
      {
        id: 'enhance',
        title: '照片变清晰（开发中）',
        icon: 'image',
        desc: '提升照片清晰度',
        path: '/pages/create/enhance/index'
      }
    ]
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  handleItemClick(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path
    });
  }
}); 