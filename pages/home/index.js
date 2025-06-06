import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()

Page({
  data: {
    tabValue: 'recommend',
    enable: false,
    swiperList: [],
    cardInfo: [],
    // 发布
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    focusCardInfo:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  // 生命周期
  async onReady() {
    await this.cardInfoOnLoad()
  },
  onLoad(option) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (option.oper) {
      let content = '';
      if (option.oper === 'release') {
        content = '发布成功';
      } else if (option.oper === 'save') {
        content = '保存成功';
      }
      this.showOperMsg(content);
    }
  },
  onRefresh() {
    this.refresh();
  },
  async focusCardInfoOnLoad() {
    const userInfo = wx.getStorageSync('userInfo')  
    if(userInfo.id) {
      const [cardRes] = await Promise.all([
        request(`/api/v1/creations?page=1&pageSize=100&id=${userInfo.id}`).then((res) => res.data),
      ]);
      this.setData({
        enable: false,
        focusCardInfo: cardRes.list,
      });
    }else{
      wx.navigateTo({
        url: '/pages/login/index',
      });
    } 
  },

  async cardInfoOnLoad() {
    const [cardRes] = await Promise.all([
      request('/api/v1/creations/public?page=1&pageSize=100').then((res) => res.data),
    ]);
    console.log(cardRes)
    setTimeout(() => {
      this.setData({
        enable: false,
        cardInfo: cardRes.list,
        swiperList: cardRes.list[0].images,
      });
    }, 1500);

  },
  async onChange(e) {
    if(e.detail.value === 'follow' && this.data.focusCardInfo.length === 0) {
      await this.focusCardInfoOnLoad()
    } else {
      this.setData({
        tabValue: e.detail.value,
      })
    }
    
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    if(this.data.tabValue === 'recommend') {
      await this.cardInfoOnLoad()

    } else {
      await this.focusCardInfoOnLoad()
      
    }
  
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },
  goRelease() {
    wx.navigateTo({
      url: '/pages/release/index',
    });
  },
});
