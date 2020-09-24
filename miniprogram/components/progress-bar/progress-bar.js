// components/progress-bar/progress-bar.js
let backgroundAudio = wx.getBackgroundAudioManager()
let duration=0
let moveAreaWidth=0
let moveViewWidth=0
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
    }
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
    initBackgroundAudio() {
      backgroundAudio.onPlay(() => {
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
        console.log('onTimeUpdate')
      })
      backgroundAudio.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudio.onEnded(() => {
        console.log('onEnded')
      })
      backgroundAudio.onError(() => {
        console.log('onErrot')
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
        moveAreaWidth=res[0].width
        moveViewWidth=res[1].width
        console.log(moveAreaWidth,moveViewWidth)
      })
    }
  }
})