// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter=require('tcb-router')
const rp = require('request-promise');
const BASE_URL="https://www.fastmock.site/mock/147eba3750466cc63754f618c4ad38d2/api"
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
const app=new TcbRouter({event})
app.router('playList',async (ctx,next)=>{
  ctx.body=await cloud.database().collection('playList')
    .skip(event.start)
    .limit(event.Max)
    .orderBy('createdTime','desc')
    .get()
    .then(res=>{
      return res
    })
})
app.router('musicList',async (ctx,next)=>{
  ctx.body=await rp(BASE_URL+'/playlist/detail?id='+parseInt(event.playListId))
  .then(res=>{
    return JSON.parse(res)
  })
})
app.router('music',async (ctx,next)=>{
  ctx.body=await rp(BASE_URL+'/song/url?id='+parseInt(event.musicId))
  .then(res=>{
    return JSON.parse(res)
  })
})
  return app.serve()
}