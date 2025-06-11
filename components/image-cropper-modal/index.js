Component({
  properties: {
    visible: { type: Boolean, value: false },
    src: { type: String, value: '' },
    disable_ratio:{type: Boolean, value: false},
    aspectRatio: { type: Number, value: 1 } // 默认1:1
  },
  data: {
    cutWidth: 300,
    cutHeight: 300,
    disable_ratio:false
  },
  observers: {
    aspectRatio(val) {
      let base = 300;
      this.setData({
        cutWidth: base,
        cutHeight: base / val
      });
    }
  },
  methods: {
    onCropperLoad() {
      this.cropper = this.selectComponent('#cropper');
    },
    onCrop() {
      this.cropper.getImg((imgPath) => {
          console.log('---image--' , imgPath)
        this.triggerEvent('crop', { ...imgPath });
      });
    },
    onCancel() {
      this.triggerEvent('cancel');
    }
  }
}); 