// pages/search/search.js
import request from "../utils/request";
let isSend = false; // 函数节流使用

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//placeholder的内容
    hotList:[],//热搜榜数据
    searchContent:'',//用户输入的表单项数据
    searchList:[],//关键词模糊匹配的数据     
    historyList:[]//搜索历史记录       

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    this.getInitData();
      // 获取本地历史记录
     this.getSearchHistroy();
  },
    async getInitData(){
      let placeholderData=await request('/search/default');
      let hotListData=await request('/search/hot/detail');
      this.setData({
        placeholderContent:placeholderData.data.showKeyword,//默认搜索关键词
        hotList:hotListData.data
      })
      
    },
// 获取本地历史记录的功能函数
getSearchHistroy(){
  let historyList=wx.getStorageSync('searchHistory');
  console.log(historyList);
  if(historyList){
    this.setData({
      historyList
    })
  }
  },
    // 表单项内容发生改变的回调
     handleInputChange(event){
           console.log(event.detail.value);
          //  更新searchContent的状态数据
          this.setData({
            searchContent:event.detail.value.trim()
          })
          if(isSend){
            return
          }
          isSend=true;
          this.getSearchList();
          // 函数节流
          setTimeout(()=>{
            isSend=false;
          },500)
          
    },
    // 获取搜索数据的功能函数
  async getSearchList(){
      // 往回删掉搜索关键词的时候是个空串也会发起请求，所以下面进行取反停止请求
      if(!this.data.searchContent){

        this.setData({
          // 此时更新searchList为空
          searchList:[],
        })
        console.log(this.data.searchList.length);
        return;

      }
        let {searchContent,historyList}=this.data;

    // 发起请求获取关键字模糊匹配数据       
    let searchListData = await request('/search', {keywords: searchContent, limit: 10});
          this.setData({
            searchList:searchListData.result.songs
          })
  //将搜索的关键字添加到搜索历史记录中
  if(historyList.indexOf(searchContent) !== -1){
    historyList.splice(historyList.indexOf(searchContent), 1)
  }
  historyList.unshift(searchContent);
        //  更新 historyList
              this.setData({
                  historyList
              })
              wx.setStorageSync('searchHistory', historyList)
      },
      // 清空搜索内容
      clearSearchContent(){
        console.log('clear');
        
          this.setData({
            searchContent:'',
            searchList:[]
          })
      },
      // 删除历史记录
      deleteSearchHistroy(){
        // 显示模态对话框
            wx.showModal({
              content: '确认清空搜索记录',
              success:(res)=>{
                console.log(res);
                if(res.confirm){
              //1、 清空data中histroyList
              this.setData({
                historyList:[]
              })
              //2、 清空本地搜索历史记录
                wx.removeStorageSync('searchHistory')
                }
              }
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