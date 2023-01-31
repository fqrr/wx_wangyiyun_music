// const request = require("request");

// pages/personal/personal.js
// 获取移动坐标
let startY =0;//手指起始的坐标
let moveY=0;//手指移动的左边
let moveDistance=0;//手指移动的距离


import request from '../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:''//过渡
    ,userInfo:{},//用户信息
    recentPlayList:[] //用户播放记录

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户的基本信息
      // 读的属性跟存储的属性要一致
      let userInfo =wx.getStorageSync('userInfo');
      // 要判断userInfo的状态是否是已登录
      if(userInfo){
        //  存进去的是JSON 取出来用的时候要进行解析
       this.setData({
         userInfo:JSON.parse(userInfo) 
       }) 
      //  用户登录后才能获取用户播放记录
      // 获取到的userId传给getUerRenctPlayList()函数
        this.getUerRenctPlayList(this.data.userInfo.userId)
      }
      
  },
// 获取用户播放记录的功能函数
 async getUerRenctPlayList(userId){
    // id:'2075939212'
    let recentPlayListData=await request('/user/record',{uid:userId,type:0})
    let index=0;
   let recentPlayList=recentPlayListData.allData.splice(0,15).map(item=>{
     item.id=index++;
     return item;
   })
    // 把获取的记录存放于 recentPlayList[] 用于渲染页面
    this.setData({
        recentPlayList
      })
  },
    // 
    // let loginData=await request('/login/cellphone',{phone:15113507023,password:'Aa20030613'});
    // console.log(loginData);
  handleTouchStart(event){
    // 让下拉不用过渡
    this.setData({
      coverTransition:''
    })
    // 获取手指起始坐标
    startY=event.touches[0].clientY;
    // event.touches是数组形式
      // console.log(startY);
      
  },
  handleTouchMove(event){
    // 获取手指移动坐标
    moveY=event.touches[0].clientY
    moveDistance=moveY-startY;
    // moveDistance=移动的坐标-起始坐标
    // console.log(moveDistance);
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })

  },
  handleTouchEnd(){
    // console.log('handleTouchEnd');
    // 动态更新coverTransform的值
    this.setData({
      coverTransform:`translateY(0rpx)`,
      // 手指松开实现过渡
      coverTransition:'transform 1s linear'
    })

  },

  // 跳转至登录页login的回调
  toLogin(){
    console.log('gg');
    
      // 跳转至登录页
      // navigateTo不能回退到tabbar页面
          wx.navigateTo({
            url:'/pages/login/login'
          })
  },
  userInfo(){
    wx.navigateTo({
      url:'/pages/userPage/userPage'
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