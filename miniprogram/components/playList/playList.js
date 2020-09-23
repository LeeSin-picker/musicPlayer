// components/playList/playList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playList: {
      type: Object
    }
  },
  observers: {
    ['playList.playCount'](val) {
      this.setData({
        _count: this.handleCount(val, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusicList(){
      wx.navigateTo({
        url: `../../pages/musicList/musicList?playListId=${this.properties.playList.id}`,
      })
    },
    handleCount(count, point) {
      let newStr = count.toString().split('.')[0]
      if (newStr.length < 6) {
        return newStr
      } else if (newStr.length >= 6 && newStr.length <= 8) {
        let decimal = newStr.slice(newStr.length - 4, newStr.length - 4 + point)
        return parseInt(newStr / 10000) + '.' + decimal + '万'
      } else if (newStr.length > 8) {
        let decimal = newStr.slice(newStr.length - 8, newStr.length - 8 + point)
        return parseInt(newStr / 100000000) + '.' + decimal + '亿'
      }
    }
  }
})