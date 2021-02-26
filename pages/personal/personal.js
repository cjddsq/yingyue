// pages/personal/personal.js
let startY=0;//手指的起始位置
let moveY=0;//手指离开屏幕的位置
let movedistance=0;//手指移动的距离
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //移动的距离
    coverTransform: "translateY(0)",
    coveTransition: '',
    userInfo: {},//用户信息
    recentPlayList: [],//用户的播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户的基本信息
    let userInfo = wx.getStorageSync("userInfo");
    //判断一下userifno是否为空在对数据进行修改
    if(userInfo) {
      //更改数据
      this.setData({
        userInfo: JSON.parse(userInfo),
      })
      //用户的播放记录
      this.getUserRencentPlayList(this.data.userInfo.userId)
    }
  },
  //获取用户播放记录的函数
  async getUserRencentPlayList(userId){
    let userRencentPlayData = await request('/user/record', {uid: userId, type: 0})
    //给数据手动添加一个id
    let index =0;
    let recentPlayList = userRencentPlayData.allData.splice(0, 10).map(item=> {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    })
  },
  handleTouchStart(event) {
    //消除开始时的过渡效果
    //动态更新translateY的距离
    this.setData({
      coveTransition: ''
    })
    //获取手指的起始位置
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    //获取手指的离开屏幕的位置
    moveY = event.touches[0].clientY
    //移动的距离
    movedistance = moveY - startY;
    
    if(movedistance<0) {
      return;
    }
    if(movedistance>80) {
      movedistance = 80;
    }
    //动态更新translateY的距离
    this.setData ({
      coverTransform: `translateY(${movedistance}rpx)`
      
    })
  },
  handleTouchEnd() {
    //动态更新translateY的距离
    this.setData({
      coverTransform: `translateY(0)`,
      coveTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
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