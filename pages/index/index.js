// index.js
// 导入请求模块
import request from '../utils/request';

// 获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    recommendList:[],//推荐歌单内容区数据
    topList:[],//排行榜数据
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 发起数据请求
    wx.request({
      //http://localhost:3000/banner
      url: 'http://localhost:3000/banner',
      data:{type:2},
      success:(res)=>{
      console.log('请求成功:',res);
      },
      fail:(err)=>{
        console.log('请求失败了',err);
      }
    })
// 获取banner数据
// let loginData=await request('/login/cellphone',{phone:15113507023,password:'Aa20030613'});
// console.log(loginData);
   let bannerListData=await request('/banner',{type:2});
        this.setData({
          bannerList:bannerListData.banners
          // 请求到的数据存储到data中
        })

        // 推荐歌单内容区数据
        // 用await  才能接受到数据
        let recommendListData= await request('/personalized',{limit:10});
         this.setData({
          //  请求的推荐歌单内容区数据 存放到recommendList中
          recommendList:recommendListData.result
         })   
       
         //获取排行榜数据
        /*
         需求分析：
         1.需要根据idx的值获取对应的数据
         2、idx的取值范围是0-20，我们需要0-4
         3、需要发送5次请求
         前++ 和后++的区别
         1、先看到是运算符还是值
         2、如果先看到的是运算就先运算再赋值
         3、如果先看到的是值那么就是先赋值再运算
        */
      //  let index=0;
      //  let resultArr=[]
      //  while(index <5){
      //   let topListData= await request('/playlist/track/all',{id:24381616,limit:10,offset:1})
      // //   // 相当于data
      //   //splice(会修改原数组，可以对指定的数组进行增删改)  slice(不会改变原数组)
      //   let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      //   topListData.playlist.name = data.playlist.name
      //   // slice(0,3)包括下标0
      //   resultArr.push(topListItem);
      //   // 得到的数据存放到数组中
      //   this.setData({
      //     topList:resultArr
      //   })
      //  }
      // 获取排行榜数据
    let index = 0;
    let topListIp = []
    let resultArr = [];
    let topListAll = await request('/toplist')

    for(let i=0;i<5;i++){
      topListIp.push(topListAll.list[i].id)
    }
    console.log(topListIp)
    while(index < 5){
      let topListData = await request('/playlist/detail', {id:topListIp[index++]})
      let topListItem = {name: topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
      resultArr.push(topListItem);
// 不需要等待五次请求全部结束才更新，用户体验好
      this.setData({
        topList:resultArr
      })
    }
      // 更新topList的状态值，放在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
      //  this.setData({
      //    topList:resultArr
      //  })
  },
  // 跳转至推荐歌曲页面
  turn(){
    wx.navigateTo({
      url:'/songPackage/pages/recommendSong/recommendSong',
    })
  },
  toOther(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
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