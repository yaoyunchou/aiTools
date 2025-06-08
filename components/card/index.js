Component({
  properties: {
    url: String,
    desc: String,
    tags: Array,
    index: Number,
  },
  data: {},
  methods: {
    onCardTap() {
      this.triggerEvent('cardtap', { index: this.properties.index });
    },
    onShareTap() {
      this.triggerEvent('sharetap', { index: this.properties.index });
    },
  },
});
