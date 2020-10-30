// pages/player/player.js
let nowPlayingIndex = 0
let musicList = []
// 获取全局唯一的背景音频管理器
const bgMusic = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: "",
    music: {},
    isPlaying: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index
    musicList = wx.getStorageSync('musicList')
    this.loadingMusic(options.selectMusicId)
    console.log(musicList)
  },
  loadingMusic(musicId) {
    console.log(musicId)
    wx.setNavigationBarTitle({
      title: musicList[nowPlayingIndex].name,
    })
    this.setData({
      picUrl: musicList[nowPlayingIndex].al.picUrl,
      isPlaying: false
    })
    app.setPlayMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'music'
      }
    }).then((res) => {
      this.setData({
        music: res.result.data
      })
      console.log(res.result.data)
      bgMusic.src = this.data.music.url
      bgMusic.title = musicList[nowPlayingIndex].name
      bgMusic.coverImgUrl = musicList[nowPlayingIndex].al.picUrl
      bgMusic.singer = musicList[nowPlayingIndex].ar[0].name
      bgMusic.epname = musicList[nowPlayingIndex].al.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  preMusic() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musicList.length - 1
    }
    console.log(musicList[nowPlayingIndex].id)
    this.loadingMusic(musicList[nowPlayingIndex].id)
  },
  nextMusic() {
    nowPlayingIndex++
    if (nowPlayingIndex == musicList.length) {
      nowPlayingIndex = 0
    }
    this.loadingMusic(musicList[nowPlayingIndex].id)
  },
  togglePlaying() {
    if (this.data.isPlaying) {
      bgMusic.pause()
    } else {
      bgMusic.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})