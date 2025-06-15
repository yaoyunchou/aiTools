Component({
  properties: {
    url: String,
    desc: String,
    tags: Array,
    index: Number,
    type: String,
    id: String,
  },
  data: {},
  methods: {
    onCardTap() {
      this.triggerEvent('cardtap', { index: this.properties.index });
    },
    onShareTap() {
      this.triggerEvent('sharetap', { index: this.properties.index });
    },
    onLikeTap() {
      console.log('onLikeTap', this.properties.index);
      this.triggerEvent('likeTap', { ...this.properties });
    },
    onFavTap() {
      console.log('onFavTap', this.properties.index);
      this.triggerEvent('favTap', { ... this.propertieS });
    },
  },
});
