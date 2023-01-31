
//发起ajax请求


// 1、封装功能函数
//   1、功能点明确
//   2、函数内部应该保留固定代码(静态的)
//   3、将动态的数据抽取形参，由使用者根据自身的情况动态的传入实参
//   4、一个良好的功能函数应该设置形参的默认值（ES6形参默认值）
// 2、封装功能组件
//   1、功能点明确
//   2、组件内部保留静态的代码
//   3、将动态的数据抽取props参数,由使用者根据自身的情况以标签属性的形式动态的传入props数据、
//   4、一个良好的组件应该设置组件的必要性及数据类型
//         props:{
//           msg:{
//             requierd:true,
//             default:默认值,
//             type:数据类型
//           }
//         }

import config from '../utils/config'
// 发起数据请求
// data 对象形式
export default (url,data={},method='GET')=>{
  return new Promise((resolve,rejiect)=>{
    // 1、new Promise初始化promise实例的状态为pending
wx.request({
  //http://localhost:3000/banner
  // url: url,属性名与值名相同可以简写
  url: config.host + url,
  data,
  header:{
    cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U') !==-1):'',
    "content-Type":"application/json; charset=utf-8"
  },
  method,
    success:(res)=>{
  console.log('请求成功:',res);
  if(data.isLogin){
    // 将用户的cookie存进至本地
    wx.setStorage({
      key:'cookies', data:res.cookies})
  }
  resolve(res.data)//直接访问到数据data
  // resolve 修改promise的状态为成功状态resolved
  },
  fail:(err)=>{
    console.log('请求失败了',err);
    rejiect(err);
    // reject(err)修改promise的状态为失败状态 rejected
  }
})
})
}
