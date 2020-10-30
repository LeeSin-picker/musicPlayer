// components/musicList/musicList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicList: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectMusicId: -1
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log()
      this.setData({
        selectMusicId: parseInt(app.getPlayMusicId())
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      console.log(event.currentTarget.dataset)
      const ds = event.currentTarget.dataset
      const index = ds.index
      this.setData({
        selectMusicId: ds.musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?selectMusicId=${ds.musicid}&index=${index}`,
      })
    }
  }
})