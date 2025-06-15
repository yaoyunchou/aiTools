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
        name: '我的收藏',
        icon: 'search',
        type: 'progress',
        url: '',
      },
      // {
      //   name: '已发布',
      //   icon: 'upload',
      //   type: 'published',
      //   url: '',
      // },
      {
        name: '草稿箱',
        icon: 'file-copy',
        type: 'draft',
        url: '',
      },
    ],

    settingList: [
      { name: '联系客服', icon: 'service', type: 'service' },
      { name: '设置', icon: 'setting', type: 'setting', url: '/pages/setting/index' },
    ],
    showAvatarActionSheet: false,
    avatarActions: [
      { name: '获取系统头像', value: 'system' },
      { name: '上传图片', value: 'upload' }
    ],
    showCropper: false,
    cropperRatio: 1,
  },

  onLoad() {
    // this.getServiceList();
    this.setData({
        personalInfo:  wx.getStorageSync('userInfo')
    })
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

  onEleClick(e) {
    const { name, url } = e.currentTarget.dataset.data;
    if (url) return;
    this.onShowToast('#t-toast', name);
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
  }
});
