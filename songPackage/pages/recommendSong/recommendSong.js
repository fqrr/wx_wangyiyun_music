// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from "../../../pages/utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      day:'',//日
      month:'',//月
      recommendList:[],//推荐列表数据
      index:0,//点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo=wx.getStorageSync('userInfo');
    // console.log(userInfo);
    
    // userInfo 为空证明还未登录
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 未登录 跳转至登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
        // 更新日期(实时)的状态数据
        this.setData({
          day:new Date().getDate(),
          // getMonth从0开始取，所以要加1才是正确时间
          month:new Date().getMonth()+1
        })
        // 获取每日推荐的数据
        this.getRecommendList();

        // 订阅来自songDetail页面发布的消息 接收
        PubSub.subscribe('switchType',(msg,type)=>{
          
          let {recommendList,index}=this.data
          if(type === 'pre'){//上一首
            // 当在第一首时 点击上一首让index=最后一首的index
            (index ===0) && (index=recommendList.length);
            index -=1;
          }else{//下一首
            //recommendList.length -1 因为length会计算0下标 当在最后一首时 点击上一首让index=第一首的index -1是因为下面会加一
            (index ===recommendList.length -1) && (index=-1);
                index +=1;
          }
          // 更新下标
      this.setData({
        index
      })
          let musicId =recommendList[index].id;
          PubSub.publish('musicId', musicId)
          // 将musicId回传给songDetail页面
          // console.log(msg,type);
          
        })

  },
        // 获取每日推荐的数据
     async  getRecommendList(){
          let recommendListData=await request("/recommend/songs");
          console.log(recommendListData);
          this.setData({
            recommendList:recommendListData.data.dailySongs
          })
        },
// 跳转至songDetail页面
        toSongDetail(event){
              let {song,index} =event.currentTarget.dataset;
              // 更新点击音乐的下标
              this.setData({
                index
              })
              console.log(song);
              console.log(index);
              
          // 路由跳转传参:query参数
            wx.navigateTo({
              // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
              // url: '/pages/songDetail/songDetail?song='+JSON.stringify(song)
              url: '/songPackage/pages/songDetail/songDetail?musicId='+song.id
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