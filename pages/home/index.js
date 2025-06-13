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
    columns: [[], []], // 新增两列数据
    // 发布
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    focusCardInfo:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    currentCardIndex: 0, // 记录当前查看的卡片索引
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
  // 处理卡片点击事件
  onCardTap(e) {
    const { index } = e.detail;
    // 更新当前查看的卡片索引
    this.updateCurrentCard(index);
  },
  // 处理分享按钮点击事件
  onShareTap(e) {
    const { index } = e.detail;
    // 更新当前查看的卡片索引
    this.updateCurrentCard(index);
    
    // 调用系统分享API
    this.showShareMenu(index);
  },
  // 显示系统分享菜单
  showShareMenu(index) {
    // 获取当前卡片信息
    let currentCardList = this.data.tabValue === 'recommend' ? this.data.cardInfo : this.data.focusCardInfo;
    let currentCard = currentCardList[index];
    
    if (!currentCard) return;
    
    // 显示自定义分享提示
    this.showOperMsg('分享内容准备完毕，请点击右上角进行分享！');
    
    // 调用微信小程序分享接口
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  // 更新当前查看的卡片索引
  updateCurrentCard(index) {
    this.setData({
      currentCardIndex: index
    });
  },
  // 分享功能
  onShareAppMessage() {
    const defaultTitle = '来看看我发现的好内容';
    const defaultImageUrl = '/static/images/share-default.png';
    
    // 获取当前正在查看的卡片信息
    let currentCardList = this.data.tabValue === 'recommend' ? this.data.cardInfo : this.data.focusCardInfo;
    let currentCard = currentCardList[this.data.currentCardIndex];
    
    // 如果有当前卡片信息，则使用其内容和图片
    if (currentCard) {
      const title = currentCard.content ? 
        (currentCard.content.length > 20 ? currentCard.content.substring(0, 20) + '...' : currentCard.content) : 
        currentCard.prompt ? 
        (currentCard.prompt.length > 20 ? currentCard.prompt.substring(0, 20) + '...' : currentCard.prompt) : 
        defaultTitle;
      
      const imageUrl = currentCard.images && currentCard.images.length > 0 ? 
        currentCard.images[0] : 
        defaultImageUrl;
      
      return {
        title: title,
        path: '/pages/home/index',
        imageUrl: imageUrl,
      };
    }
    
    // 默认分享信息
    return {
      title: defaultTitle,
      path: '/pages/home/index',
      imageUrl: this.data.swiperList && this.data.swiperList.length > 0 ? 
        this.data.swiperList[0] : 
        defaultImageUrl,
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    const defaultTitle = '来看看我发现的好内容';
    const defaultImageUrl = '/static/images/share-default.png';
    
    // 获取当前正在查看的卡片信息
    let currentCardList = this.data.tabValue === 'recommend' ? this.data.cardInfo : this.data.focusCardInfo;
    let currentCard = currentCardList[this.data.currentCardIndex];
    
    // 如果有当前卡片信息，则使用其内容和图片
    if (currentCard) {
      const title = currentCard.content ? 
        (currentCard.content.length > 20 ? currentCard.content.substring(0, 20) + '...' : currentCard.content) : 
        currentCard.prompt ? 
        (currentCard.prompt.length > 20 ? currentCard.prompt.substring(0, 20) + '...' : currentCard.prompt) : 
        defaultTitle;
      
      const imageUrl = currentCard.images && currentCard.images.length > 0 ? 
        currentCard.images[0] : 
        defaultImageUrl;
      
      return {
        title: title,
        imageUrl: imageUrl,
      };
    }
    
    // 默认分享信息
    return {
      title: defaultTitle,
      imageUrl: this.data.swiperList && this.data.swiperList.length > 0 ? 
        this.data.swiperList[0] : 
        defaultImageUrl,
    };
  },
  async focusCardInfoOnLoad() {
    const userInfo = wx.getStorageSync('userInfo')  
    if(userInfo?.id) {
      const [cardRes] = await Promise.all([
        request(`/api/v1/creations?page=1&pageSize=100&id=${userInfo.id}`).then((res) => res.data),
      ]);
      this.setData({
        enable: false,
        focusCardInfo: cardRes.list,
      });
    }else{
      wx.navigateTo({
        url: '/pages/login/login?redirectUrl=' + encodeURIComponent('/pages/home/index'),
      });
    } 
  },

  async cardInfoOnLoad() {
    const [cardRes] = await Promise.all([
      request('/api/v1/creations/public?page=1&pageSize=100').then((res) => res.data),
    ]);
    console.log(cardRes)
    setTimeout(() => {
      // 拆分为两列
      const columns = [[], []];
      cardRes.list.forEach((item, idx) => {
        columns[idx % 2].push(item);
      });
      this.setData({
        enable: false,
        cardInfo: cardRes.list,
        swiperList: cardRes.list[0].images,
        columns,
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
