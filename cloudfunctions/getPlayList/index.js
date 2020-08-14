// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 链接云数据库
const db = cloud.database()
// 引用request模块进行ajax请求
const rp = require('request-promise')
const URL = 'http://localhost:3000/top/playlist/highquality?before=1503639064232&limit=3'
// 连接playList集合
const playListCollection = db.collection('playList')
const maxLimit = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await playListCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / maxLimit)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playListCollection.skip(i * maxLimit).limit(maxLimit).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.lenght > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  const playList = await rp(URL).then(res => {
    console.log(JSON.parse(res))
    return JSON.parse(res)

  })
  const newData = []
  for (let i = 0; i < playList.length; i++) {
    let flag = true
    for (let j = 0; j < list.data.length; j++) {
      if (playList[i].id == list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playList[i])
    }
  }
  for (let i = 0; i < newData.length; i++) {
    await playListCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log("插入成功")
    }).catch(err => {
      console.log("插入失败")
    })
  }
  return newData.length
}