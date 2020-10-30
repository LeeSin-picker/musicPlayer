// components/progress-bar/progress-bar.js
let backgroundAudio = wx.getBackgroundAudioManager()
let duration = 0
let moveAreaWidth = 0
let moveViewWidth = 0
let currentSec = -1
let moving = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    movableDis: 0,
    progress: 0
  },
  lifetimes: {
    ready() {
      this.getMoveDis()
      this.initBackgroundAudio()

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      if (event.detail.source == "touch") {
        this.data.progress = event.detail.x * 100 / (moveAreaWidth - moveViewWidth)
        this.data.movableDis = event.detail.x
        moving = true
        console.log(moving)
      }
    },
    onTouchEnd() {
      console.log(duration)
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: this.timeFormat(this.data.progress * backgroundAudio.duration / 100).min + ":" + this.timeFormat(this.data.progress * backgroundAudio.duration / 100).sec
      })
      backgroundAudio.seek(this.data.progress * duration / 100)
      moving = false
    },
    initBackgroundAudio() {
      backgroundAudio.onPlay(() => {
        moving = false
        console.log('onPlay')
      })
      backgroundAudio.onPause(() => {
        console.log('onPause')
      })
      backgroundAudio.onCanplay(() => {
        console.log('onCanPlay')
        this.getTotalTime()
      })
      backgroundAudio.onTimeUpdate(() => {
        if (!moving) {
          let duration = backgroundAudio.duration
          let currentTime = backgroundAudio.currentTime
          if (currentSec != Math.floor(currentTime)) {
            console.log(123)
            this.setData({
              movableDis: (moveAreaWidth - moveViewWidth) * currentTime / duration,
              progress: currentTime * 100 / duration,
              ['showTime.currentTime']: this.timeFormat(currentTime).min + ":" + this.timeFormat(currentTime).sec
            })
            currentSec = Math.floor(currentTime)
          }
        }

      })
      backgroundAudio.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudio.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent("musicEnd")
      })
      backgroundAudio.onError((error) => {
        console.log(error)
      })
    },
    getTotalTime() {

      if (typeof backgroundAudio.duration != 'undefined') {
        duration = backgroundAudio.duration
        let timeTotal = this.timeFormat(duration)
        this.setData({
          ['showTime.totalTime']: `${timeTotal.min}:${timeTotal.sec}`
        })
      } else {
        setTimeout(() => {
          duration = backgroundAudio.duration
          let timeTotal = this.timeFormat(duration)
          this.setData({
            ['showTime.totalTime']: `${timeTotal.min}:${timeTotal.sec}`
          })
        }, 1000)
      }
    },
    timeFormat(second) {
      return {
        min: this.format(Math.floor(second / 60)),
        sec: this.format(Math.floor(second % 60))
      }
    },
    format(param) {
      return param < 10 ? "0" + param : param
    },
    getMoveDis() {
      let query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((res) => {
        moveAreaWidth = res[0].width
        moveViewWidth = res[1].width
        console.log(moveAreaWidth, moveViewWidth)
      })
    }
  }
})