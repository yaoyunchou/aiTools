import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

Page({
  data: {
    text: '',
    characters: [
      '蜡笔小新', '孙悟空', '喜羊羊', '皮卡丘', '哆啦A梦', '柴犬', '魔童哪吒', '路飞'
    ],
    selectedCharacter: '蜡笔小新',
    images: []
  },
  onTextInput(e) {
    this.setData({ text: e.detail.value });
  },
  onCharacterSelect(e) {
    this.setData({ selectedCharacter: e.currentTarget.dataset.character });
  },
  onGenerate() {
    // 调用工作流的接口
    const runWork = request('/api/v1/creations/coze/run-workflow', "POST", {
      "workflowId": "7509756170825351202",
      "parameters": {
        "num": 3,
        "role": this.selectedCharacter,
        "talk":this.text
      },
      "isAsync": true
    })
    console.log('------------', runWork)
    // 这里只做占位，实际接入AI后替换为真实图片


    const { text, selectedCharacter, images } = this.data;
    const newImg = `https://dummyimage.com/200x200/eee/333&text=${encodeURIComponent(selectedCharacter)}`;
    this.setData({
      images: [newImg, ...images]
    });
  }
}); 