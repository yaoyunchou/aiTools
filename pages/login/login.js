import request from '~/api/request';

Page({
  data: {
    phoneNumber: '',
    isPhoneNumber: false,
    isCheck: false,
    isSubmit: false,
    isPasswordLogin: false,
    passwordInfo: {
      account: '',
      password: '',
    },
    radioValue: '',
  },

  /* 自定义功能函数 */
  changeSubmit() {
    if (this.data.isPasswordLogin) {
      if (this.data.passwordInfo.account !== '' && this.data.passwordInfo.password !== '' && this.data.isCheck) {
        this.setData({ isSubmit: true });
      } else {
        this.setData({ isSubmit: false });
      }
    } else if (this.data.isPhoneNumber && this.data.isCheck) {
      this.setData({ isSubmit: true });
    } else {
      this.setData({ isSubmit: false });
    }
  },

  // 手机号变更
  onPhoneInput(e) {
    const isPhoneNumber = /^[1][3,4,5,7,8,9][0-9]{9}$/.test(e.detail.value);
    this.setData({
      isPhoneNumber,
      phoneNumber: e.detail.value,
    });
    this.changeSubmit();
  },

  // 用户协议选择变更
  onCheckChange(e) {
    const { value } = e.detail;
    this.setData({
      radioValue: value,
      isCheck: value === 'agree',
    });
    this.changeSubmit();
  },

  onAccountChange(e) {
    this.setData({ passwordInfo: { ...this.data.passwordInfo, account: e.detail.value } });
    this.changeSubmit();
  },

  onPasswordChange(e) {
    this.setData({ passwordInfo: { ...this.data.passwordInfo, password: e.detail.value } });
    this.changeSubmit();
  },

  // 切换登录方式
  changeLogin() {
    this.setData({ isPasswordLogin: !this.data.isPasswordLogin, isSubmit: false });
  },

  async login() {
    if (this.data.isPasswordLogin) {
      const res = await request('/login/postPasswordLogin', 'post', { data: this.data.passwordInfo });
      if (res.success) {
        await wx.setStorageSync('access_token', res.data.token);
        wx.switchTab({
          url: `/pages/my/index`,
        });
      }
    } else {
      const res = await request('/login/getSendMessage', 'get');
      if (res.success) {
        wx.navigateTo({
          url: `/pages/loginCode/loginCode?phoneNumber=${this.data.phoneNumber}`,
        });
      }
    }
  },

  async handleAuth() {

    try {
      wx.showLoading({ title: '授权中' });
      const { code } = await wx.login();
      console.log('---code', code)
      const result = await request('/api/v1/auth/wechat/login',"POST",{
        code,
        phone: this.data.phoneNumber
      })


      console.log('result===============', result);
      if(result.code ===0) {
        wx.setStorageSync('access_token', result.data.token);
        wx.setStorageSync('userInfo', result.data.user);
        wx.showToast({
            title: '授权成功',
            icon: 'success'
          });
      
     
  
      
        // 返回原页面
        if (this.data.redirectUrl) {
          const barUrlList = ['/pages/home/index', '/pages/my/index', '/pages/create/index'];
          const redirectUrl = unescape(this.data.redirectUrl);
          if(barUrlList.includes(redirectUrl)) {
            wx.switchTab({
              url: redirectUrl
            });
            
          } else {
            wx.navigateTo({
              url: redirectUrl
            });
          }
          
        } else {
          wx.navigateBack();
        }
      }
   
    } catch (error) {
      console.error('授权失败:', error);
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  }
});
