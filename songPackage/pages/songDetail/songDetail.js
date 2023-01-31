// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from "../../../pages/utils/request";
// 获取全局实例
const appInstance=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      isPlay:false,//音乐是否播放
      song:{},//歌曲详情对象
      musicId:'',//音乐id
      musicLink:'',//音乐的链接
      currentTime:'00.00',//实时时长
      durationTime:'00.00',//总时长
      currentWidth:0,//实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // console.log(options);
        // options:用于接受路由跳转的query参数
        // 原生小程序中路由传参，对参数的长度有限制，如果参数过长会自动截取掉
        let musicId=options.musicId;
        this.setData({
          musicId//拿到的数据更新到data中
        })
        // musicId传进getMusicInFo函数用于查询音乐详情
        this.getMusicInFo(musicId);

         /*
    * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
    * 解决方案：
    *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
    *
    * */
        // 判断当前页面音乐是否在播放
        if(appInstance.globalData.isMusicplay && appInstance.globalData.musicId === musicId){
          // 修改当前页面音乐播放的状态为true 让他们之间状态相同
            this.setData({
              isPlay:true
            })
        }

    // 创建控制音乐播放的实例
       this.backgroundAudioManager=wx.getBackgroundAudioManager();
      //监视音乐播放|暂停 |停止 
       this.backgroundAudioManager.onPlay(()=>{
        this.changePlayState(true);

    // 修改全局音乐播放的状态
        appInstance.globalData.musicId=musicId; 
                  // 修改音乐是否播放的状态
                  // this.setData({
                  //   isPlay:true
                  // })
    });
    this.backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
    // 修改全局音乐播放的状态
      // appInstance.globalData.isMusicplay=false;
              // 修改音乐是否播放的状态
        // this.setData({
        //   isPlay:false
        // })

    });
    // 监听背景音频停止事件
    this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    // 修改全局音乐播放的状态

      // appInstance.globalData.isMusicplay=false;

        // 修改音乐是否播放的状态
        // this.setData({
        //   isPlay:false
        // })

    });
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(()=>{
      // 自动切换至下一首音乐，并且自动播放
      PubSub.publish('switchType','next');
        //将实时进度条、实时时长的长度还原为0
    this.setData({
      currentWidth:0,
      currentTime:'00.00',//实时时长

    })
      // 音乐播放自然结束设置播放状态为false
      this.changePlayState(false)
    // 修改全局音乐播放的状态
      // appInstance.globalData.isMusicplay=false;
        // 修改音乐是否播放的状态
        // this.setData({
        //   isPlay:false
        // })
    });
    // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
    this.backgroundAudioManager.onTimeUpdate(()=>{
// 【 number duration】
// 当前音频的长度（单位：s），只有在有合法 src 时返回。（只读）
// 【number currentTime】
// 当前音频的播放位置（单位：s），只有在有合法 src 时返回。（只读）
    //  格式化实时的播放时间 *1000拿到的是毫秒转秒
    let currentTime=moment(this.backgroundAudioManager.currentTime *1000).format('mm:ss')
        // 实时时间/总时间=实时时间进度条长度/总时时间进度条长度
    let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450;
      // console.log(currentWidth);
      if(this.data.currentTime ==this.data.duration){
        this.handleSwitch()
      }
    this.setData({
        currentTime,
        currentWidth
      })
    })


  },
//  修改音乐播放的功能函数
changePlayState(isPlay){
    // 修改全局音乐播放的状态
  this.setData({
    isPlay:isPlay
  })
  appInstance.globalData.isMusicplay=isPlay;

},

      // 获取音乐详情的功能函数
   async  getMusicInFo(musicId){
          let songData=await request('/song/detail',{ids:musicId})
          // songData.songs[0].dt音乐总时长
          // durationTime格式化后的总时长
         let durationTime=moment(songData.songs[0].dt).format('mm:ss')
          this.setData({
                song:songData.songs[0],
                durationTime
            })
            // 动态修改窗户标题
            wx.setNavigationBarTitle({
              title: this.data.song.name,
            })
        }, 
        handleMusicPlay(){
          let isPlay=!this.data.isPlay;//点击切换播放/暂停
          // this.setData({
          //   isPlay
          // })
          let {musicId,musicLink}=this.data;
          // 把是否播放状态传进musicControl()函数，musicControl再根据播放状态执行相对应操作
          this.musicControl(isPlay,musicId,musicLink);
        }
      ,

      // 控制音乐播放/暂停的功能函数
       async  musicControl(isPlay,musicId,musicLink){
              if(isPlay){//音乐播放
                if(!musicLink){
                // 获取音乐播放链接
            let musicLinkData=await request("/song/url",{id:musicId})
            console.log(musicLinkData);
             musicLink=musicLinkData.data[0].url
            this.setData({
              musicLink
            })
          }
            // // 创建控制音乐播放的实例
          // getBackgroundAudioManager
          // 获取全局唯一的背景音频管理器。 小程序切入后台，如果音频处于播放状态，可以继续播放。
          // 但是后台状态不能通过调用 API 操纵音频的播放状态
          // backgroundAudioManager 放在onload里所以用this
                this.backgroundAudioManager.src= musicLink;
                this.backgroundAudioManager.title=this.data.song.name//手机右边小窗口的标题
                  // string title
// 音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
              }else{
                this.backgroundAudioManager.pause()
              }
            },

// 点击切歌的回调
handleSwitch(event){
        //通过 event.currentTarget.id 获取点击的id判断点击的是上一首还是下一首
        let type=event.currentTarget.id;
        console.log(type);
        // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
        // 发布消息数据给recommendSong页面 触发
        PubSub.subscribe('musicId', (msg, musicId) => {
          // console.log(musicId);
          // console.log(musicId);
          
          // 获取音乐详情信息
          this.getMusicInFo(musicId);
          //切换歌曲 自动播放当前的音乐 true是否播放 musicId音乐id
          this.musicControl(true, musicId);
          // 取消订阅
          PubSub.unsubscribe('musicId');
        })
        PubSub.publish('switchType',type);
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