import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    service: [],
    personalInfo: {},
    gridList: [
      {
        name: '我的作品',
        icon: 'root-list',
        type: 'all',
        url: '',
      },
      {
        name: '收藏',
        icon: 'task-marked',
        type: 'collection',
        url: '',
      },
      // {
      //   name: '已发布',
      //   icon: 'upload',
      //   type: 'published',
      //   url: '',
      // },
      // {
      //   name: '喜欢',
      //   icon: 'heart', 
      //   type: 'draft',
      //   url: '',
      // },
    ],
    activeType: 'all', // 当前高亮tab
    cardList: [], // 当前展示的作品列表
    page: 1,
    pageSize: 10,
    hasMore: true,
    loadingMore: false,
    settingList: [
      { name: '联系客服', icon: 'service', type: 'service' },
      { name: '设置', icon: 'setting', type: 'setting', url: '/pages/setting/index' },
    ],
    showAvatarActionSheet: false,
    avatarActions: [
      { name: '获取系统头像', value: 'system' },
      { name: '上传图片', value: 'upload' }
    ],
    showCropper: false, // 头像剪切
    cropperRatio: 1,  // 
    showImageViewer:false, //预览弹框
    imageViewerSrc:[]
  },

  onLoad() {
    this.setData({
      personalInfo:  wx.getStorageSync('userInfo'),
      activeType: 'all',
      page: 1,
      cardList: [],
      hasMore: true
    });
    this.fetchCardList('all', 1);
  },

  async onShow() {
    const Token = wx.getStorageSync('access_token');
    const personalInfo =  await this.getPersonalInfo()
    if (Token) {
      this.setData({
        isLoad: true,
        personalInfo,
      });
    }
  },

  getServiceList() {
    request('/api/getServiceList').then((res) => {
      const { service } = res.data.data;
      this.setData({ service });
    });
  },

  async getPersonalInfo() {
    const {id} = wx.getStorageSync("userInfo") || {}
    if(!id) {
      wx.navigateTo({
        url: '/pages/login/login?redirectUrl=' + encodeURIComponent('/pages/my/index'),
      });
      return;
    };
    const info = await request(`/api/v1/user/${id}`)
    if(info.code === 0) {
      wx.setStorageSync('userInfo',  info.data);
      return info.data;

    }
  },

  onLogin(e) {
    wx.navigateTo({
      url: '/pages/login/login?redirectUrl=' + encodeURIComponent('/pages/my/index'),
    });
  },

  onNavigateTo() {
    wx.navigateTo({ url: `/pages/my/info-edit/index` });
  },

  // 切换tab
  onEleClick(e) {
    const { type } = e.currentTarget.dataset.data;
    if (type === this.data.activeType) return;
 
    this.setData({
      activeType: type,
      page: 1,
      cardList: [],
      hasMore: true
    });
    this.fetchCardList(type, 1);
  },

  // 拉取作品列表
  async fetchCardList(type, page) {
    this.setData({ loadingMore: true });
    const activeTypeUrl = {
      'all': '/api/v1/creations',
      'collection':'/api/v1/creations/users/personal/collections',
      'heart':'/api/v1/creations/users/personal/likes'
    }
    // 假设接口 /api/v1/works?type=xxx&page=xxx&pageSize=xxx
    const res = await request(activeTypeUrl[type], 'GET', {
      page,
      pageSize: this.data.pageSize
    });
    if (res.code === 0) {
      const list = res.data.list || [];
      const hasMore = list.length === this.data.pageSize;
      this.setData({
        cardList: page === 1 ? list : this.data.cardList.concat(list),
        hasMore,
        page,
        loadingMore: false
      });
    } else {
      this.setData({ loadingMore: false });
    }
  },

  // 下拉加载更多
  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    const nextPage = this.data.page + 1;
    this.fetchCardList(this.data.activeType, nextPage);
  },

  onChangeAvatar() {
    ActionSheet.show({
      theme: ActionSheetTheme.List,
      selector: '#t-action-sheet',
      context: this,
      items: [
        { label: '获取系统头像', value: 'system' },
        { label: '上传图片', value: 'upload' }
      ],
    });
  },

  handleSelected(e) {
    const { value } = e.detail.selected;
    if (value === 'system') {
      this.getSystemAvatar();
    } else if (value === 'upload') {
      this.uploadAndCropAvatar();
    }
  },

  onAvatarActionClose() {
    this.setData({ showAvatarActionSheet: false });
  },

  getSystemAvatar() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: async(res) => {
        console.log('---res', res)
        this.setData({
          'personalInfo.avatar': res.userInfo.avatarUrl
        });
        wx.setStorageSync('userInfo', {
          ...this.data.personalInfo,
          avatar: res.userInfo.avatarUrl
        });
        // TODO: 可在此调用后端接口保存头像
        await this.updateAvatar(res.userInfo.avatarUrl)
      }
    });
  },

  uploadAndCropAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ showCropper: true, cropperSrc: tempFilePath });
      }
    })
  },

  async onCropperDone(e) {
    const imgPath = e.detail.url;

    this.setData({
      'personalInfo.avatar': imgPath,
      showCropper: false
    });
    wx.setStorageSync('userInfo', {
      ...this.data.personalInfo,
      avatar: imgPath
    });
    const that = this
    console.log(imgPath,'-------------imagePath')
    wx.uploadFile({
      url: 'https://nestapi.xfysj.top/xcx/api/v1/file/upload/no-auth', //仅为示例，非真实的接口地址
      filePath:imgPath,
      name: 'file',
      success (res){
        const data = JSON.parse(res.data)

        //do something
        console.log( data)
        if(data.code === 0) {
          that.updateAvatar(data.data.url)
        }

      }
    })
    // TODO: 可在此调用后端接口保存头像

  },

  onCropperCancel() {
    this.setData({ showCropper: false });
  },

  //  更新头像
  async updateAvatar(imgPath) {
    const result = await request(`/api/v1/user/${this.data.personalInfo.id}`,"PUT",{
        avatar: imgPath
   })
   if(result.code === 0) {
       wx.setStorageSync('userInfo', this.data.personalInfo);
     wx.showToast({
       title: '修改头像成功',
       icon: 'none'
     });
   }
  },

  // 删除作品
  async onDeleteCard(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该作品吗？',
      success: async (res) => {
        if (res.confirm) {
          const delRes = await request(`/api/v1/creations/${id}`, 'DELETE');
          if (delRes.code === 0) {
            wx.showToast({ title: '删除成功', icon: 'none' });
            this.setData({
              page: 1,
              cardList: [],
              hasMore: true
            });
            this.fetchCardList(this.data.activeType, 1);
          } else {
            wx.showToast({ title: delRes.message || '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 分享作品
  onShareCard(e) {
    const id = e.currentTarget.dataset.id;
    console.log(id,'-------------id')
    const item = this.data.cardList.find(i => i.id === id);
    if (!item) return;
     wx.showShareImageMenu({
      path: item.images[0]
    })
  },

  // 预览图片
  onPreview(e) {
    const id = e.currentTarget.dataset.id;
    console.log(id,'-------------id')
    const item = this.data.cardList.find(i => i.id === id);
    this.setData({ showImageViewer: true, 
      imageViewerSrc: item.images 
     });

  },
  onImageViewerClose() {
    this.setData({ showImageViewer: false, 
      imageViewerSrc:[]
     });
  },
  onCancelCollect(e) {
    const id = e.currentTarget.dataset.id;
    const url = `/api/v1/creations/${id}/uncollect`
    request(url,'DELETE').then((res) => {
      console.log(res,'-------------res')
      if(res.code === 0) {
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none'
        });
      }
    })
  }

});
