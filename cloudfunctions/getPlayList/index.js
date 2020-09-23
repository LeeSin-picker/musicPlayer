// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 链接云数据库
const db = cloud.database()
// 引用request模块进行ajax请求
const rp = require('request-promise')
const URL = 'https://www.fastmock.site/mock/147eba3750466cc63754f618c4ad38d2/api/top/playlist/highquality'

// 连接playList集合
const playListCollection = db.collection('playList')
const maxLimit = 3
// 云函数入口函数
exports.main = async (event, context) => {
let playList=await rp(URL).then(res=>{
  return JSON.parse(res).playlists
})
const Max=100
// let dbPlayList = await playListCollection.get()
let countDb = await playListCollection.count()
let total = countDb.total
let timeOfGet = Math.ceil(total / Max)
let task=[]
let list={data:[]}
for(let i=0;i<timeOfGet;i++){
  let dataList=playListCollection.skip(i*Max).limit(Max).get()
  task.push(dataList)
}
if(task.length>0){
  list = (await Promise.all(task)).reduce((acc,cur)=>{
    return acc.data.concat(cur.data)
  })
}

let newData=[]
for(let i=0,len1=playList.length;i<len1;i++){
  let flag=true
  for(let j=0,len2=list.data.length;j<len2;j++){
    if(playList[i].id==list.data[j].id){
      flag=false;
      break;
    }
  }
  if(flag){
    newData.push(playList[i])
  }
}
for(let i=0;i<newData.length;i++){
  await playListCollection.add({
    data:{
      ...newData[i],
      createdTime:db.serverDate()
    }
  }).then(res=>{
    console.log("添加成功")
  }).catch(err=>{
    console.log("添加失败")
  })
}
return newData.length
}