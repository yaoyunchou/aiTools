import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

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
    const {id} = wx.getStorageSync("userInfo")
    const info = await request(`/api/v1/user/${id}`)
    if(info.code === 0) {
      wx.setStorageSync('userInfo',  info.data);
      return info.data;

    }
  },

  onLogin(e) {
    wx.navigateTo({
      url: '/pages/login/login',
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
});
