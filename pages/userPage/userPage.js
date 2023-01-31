Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    Sex:'',
    phone:'',
    email:'',
    Birthday:'',
    imgSrc:'../../static/images/personal/missing-face.png',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getLocation()
  },
  getLocation(){
    wx.getLocation({
      success: (res)=> {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          complete: (res) => {
            console.log(res);
              this.setData({
                address:res.name
              })
          },
        })
      }
    })
  },
  account(e){
      this.setData({
        account:e.detail.value
      })
      
  },
  accountSex(e){
      this.setData({
        Sex:e.detail.value
      })
  },
  userPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  userEmail(e){
    this.setData({
      email:e.detail.value
    })
  },
  userBirthday(e){
    this.setData({
      Birthday:e.detail.value
    })
  }
  ,
  login(){
    if(this.data.account ===''|| this.data.pwd
     === '' || this.data.phone === '' || this.data.userName === '')
     return
    
    wx.request({
      url: 'https://www.edugzsw.com/xcx323/index.php/Home/Getda/test',
      data:{
        name:this.data.account,
        Sex:this.data.Sex,
        phoneNumber:this.data.phone,
        email:this.data.userName,
        Birthday:this.data.Birthday

      },
      success:(res)=>{
        console.log(res);
        this.setData({
          account:'',
          Sex:'',
          phone:'',
          email:'',
          Birthday:''
        })
      }
    })
  },
  chooseImg(){
         wx.chooseMedia({
                  count: 1,               //最多可以选择的图片张数，默认为9
                 mediaType: ['image','video'],       //original为原图，compressed为压缩图。默认二者都有
                  sourceType: ['album', 'camera'],        //album为从相册选图，camera为使用相机。默认二者都有
                  success: (res)=>{
                  // console.log(res);
                    var tempFilePaths = res.tempFiles[0].tempFilePath;
                  //  console.log(tempFilePaths);
                    this.setData({
                      imgSrc:tempFilePaths
                    })
                    //创建uploadTask对象
                    const uploadTask = wx.uploadFile({
                      url: 'https://api.mofun365.com:8888/api/banner/wxUploadFile',
                      filePath: tempFilePaths,
                      name: 'file',
                     // header: { 'content-type': 'Application/json' },
                      formData: {
                        imgName: '头像',
                        imgSize: '122kB',
                        position: 'wx'            //自定义文件存放的文件夹
                      },
           success: function (res) { 
                            console.log(res);
                            uploadTask.abort(); //中断请求任务
                         }
                      });
                //监听 HTTP Response Header事件
                uploadTask.onHeadersReceived(function (res) {
                    console.log("-----------监听 HTTP Response Header事件-------------");
                    console.log(res);
                  });
                  //取消监听 HTTP Response Header事件
                  uploadTask.offHeadersReceived(function () {
                    console.log("-----------取消监听 HTTP Response Header事件--------------");
                  });
                  //监听上传进度变化事件
                  uploadTask.onProgressUpdate(function (res) {
                    console.log("-----------监听上传进度变化事件-------------");
                    console.log(res);
                  });
                  //取消监听上传进度变化事件
                  uploadTask.offProgressUpdate(function () {
                    console.log("-----------取消监听上传进度变化事件--------------");
                  });
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