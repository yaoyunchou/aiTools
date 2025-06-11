import dayjs from 'dayjs'
import request from '~/api/request';

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
        id: 'checkIn',
        title: `打卡`,
        icon: 'time',
        desc: `在时间范围内的第一次点击为打卡开始时间`,
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

  async onLoad() {
    // 页面加载时的逻辑， 处理好的打开初始化
    const time = dayjs()
    let title = '没到打卡时间哟'
    let type = 'morning'
    console.log('---time', time)
    // 如果是早上4点到12点之间， 则显示早起打开
    if(time.hour() >= 4 && time.hour() < 12) {
      title = '早起打卡4:00~12:00'
    }else if(time.hour() >= 19 && time.hour() < 24) {
      title = '晚间打卡19:00~24:00'
      type = 'evening'
    }
   
    this.setData({
      createList: this.data.createList.map(item => {
        if(item.id === 'checkIn') {
          item.title = title
        }
        return item
      })
    })
  
    
   
  },

  async handleItemClick(e) {
    const { path, id, title, type } = e.currentTarget.dataset;
    if(id === 'checkIn' && title === '没到打卡时间哟') {
      wx.showToast({
        title: title,
        icon: 'none'
      })
      return
    }else if(id === 'checkIn'){
       // 通过接口获取打卡时间
      const result = await request('/api/v1/user-action/check-in', 'POST', {
        type,
        checkInTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
      if(result.code ===0) {
        const { checkInTime, continuousCheckInCount } = result.data
        const time = dayjs(checkInTime).format('HH:mm:ss')
        // 修改createList的第二个元素的title
        wx.navigateTo({
          url: path + `?time=${time}&continuousCheckInCount=${continuousCheckInCount}`
        });
        return
      }
    }else{
      wx.navigateTo({
        url: path
      });
    }
  }
}); 