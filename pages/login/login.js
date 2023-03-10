// pages/login/login.js
import request from '../utils/request';
/*
说明: 登录流程
1. 收集表单项数据
2. 前端验证
  1) 验证用户信息(账号，密码)是否合法
  2) 前端验证不通过就提示用户，不需要发请求给后端
  3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
3. 后端验证
  1) 验证用户是否存在
  2) 用户不存在直接返回，告诉前端用户不存在
  3) 用户存在需要验证密码是否正确
  4) 密码不正确返回给前端提示密码不正确
  5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phone:'',//手机号
      password:''//用户密码
      ,userInfo:{}//用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(wx.getStorageSync('userInfo')){
        wx.showModal({
          title:'登录成功，现在在去首页',
          content:'现在去首页'
        })
      }else{
        wx.showModal({
          title:'登录失败，请重新输入',
          content:''
        })
      }
      
  },
  // 获取表单值
  handleInput(event){
    console.log(event);
    // 传唯一标识的时候用id 传多个参数的时候用 data-key=value
   let type= event.currentTarget.id //id传值 取值： phone || password
  //  data-属性名  对应的取值event.cuurrentTarget.dataset.type
    console.log(type,event.detail.value);
    this.setData({
      [type]:event.detail.value
      // 根据type的类型给phone 和 password赋值
    })
  },

// 给登录绑定点击事件
async login(){
  // ________________________________________
    //1、[   收集表单数据    ]
    let {phone,password} =this.data;
    // 2、前端验证
    /*手机号验证
    1、内容为空
    2、手机号码格式不正确
    3、手机号格式正确，验证通过
    */
   if(!phone){
    wx.showToast({
      title: '手机号码不能为空',
      icon:"none"
    })
    return;//不执行下面的代码
   }
  //  定义正则表达式
  let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
  if(!phoneReg.test(phone)){
    wx.showToast({
      title: '手机号格式不正确',
      icon:"none"
    })
    return;
  }
  if(!password){
    wx.showToast({
      title: '密码不能为空',
      icon:"none"
    })
    return;//不执行下面的代码
  }
      // 后端验证
      let result =await request('/login/cellphone',{phone,password,isLogin:true})
      // let result =await request('/login/cellphone',{phone,password})
      // phone password 是直接获取表单输入的数据
          console.log(result.code);
          if(result.code ===200){
              // 弹窗
              wx.showToast({
                title: '登录成功',
              })
              // 将用户的信息存储至本地
              // 在h5存储的是JSON格式
              // wx.setStorageSync('key', data)
              wx.setStorageSync('userInfo',JSON.stringify(result.profile))
              // 15711140593&password=123456yzy

              // 跳转至个人中心personal页面
              wx.reLaunch({
                url: '/pages/personal/personal',
              })
          }else if(result.code ===400){
            wx.showToast({
              title: '手机号码错误',
              icon:"none"
            })
          }else if(result.code ===502){
            wx.showToast({
              title: '手机号码错误',
              icon:"none"
            })
          }else{
            wx.showToast({
              title: '登录失败，请重新登录',
              icon:"none"
            })
          }
          
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