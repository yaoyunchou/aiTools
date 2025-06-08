import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

Page({
  data: {
    text: '',
    characters: [
      '蜡笔小新', '孙悟空', '皮卡丘', '哆啦A梦', '柴犬', '魔童哪吒', '路飞'
    ],
    selectedCharacter: '蜡笔小新',
    customCharacter: '',
    loading: false,
    images: []
  },
  onTextInput(e) {
    this.setData({ text: e.detail.value });
  },
  onCustomCharacterInput(e) {
    this.setData({ 
      customCharacter: e.detail.value,
      // 当用户输入自定义角色时，清除选中状态
      selectedCharacter: ''
    });
  },
  onCharacterSelect(e) {
    this.setData({ 
      selectedCharacter: e.currentTarget.dataset.character,
      // 当用户选择推荐角色时，清除自定义输入
      customCharacter: ''
    });
  },

  async onGenerate() {
  
    try {
      const character = this.data.customCharacter || this.data.selectedCharacter;
      
      if (!character) {
        Message.error('请选择或输入卡通形象');
        return;
      }
      this.setData({
        loading: true
      })
      // 调用工作流的接口
      const runWork = await request('/api/v1/creations/coze/run-workflow', "POST", {
        "workflowId": "7509756170825351202",
        "parameters": {
          "num": 3,
          "role": character,
          "talk": this.data.text
        },
        "isAsync": true
      })
      console.log('------------', runWork)
      if (runWork.code == 0) {
        // 循环接口找图片的返回
        let isRunning = true
        while (isRunning) {
          const res = await request(`/api/v1/creations/coze/workflow-status/${runWork.data.execute_id}?workflow_id=7509756170825351202`)
          if(res.data.execute_status === "Success"){
            isRunning = false
         
            console.log(res.data.images )
            // 调用接口创建作品
            const images = res.data.images.filter(item => item)
          
            this.setData({
              loading: false,
              images: [...images,...this.data.images]
            });
            // 创建图片
            await request(`/api/v1/creations`,"POST",{
              "title": `表情包/${character}/3/${this.data.text}`,
              "prompt": this.data.text,
              "type":"emoji",
              "images":images, 
              "status": 1
             })
          } else if(res.data.execute_status === "Running"){
            await new Promise(resolve => setTimeout(resolve, 1000));
          }else{
            isRunning = false
            // 出错了
            Message.error(res.data.msg)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}); 