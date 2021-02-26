// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//视频导航栏的标签数据
    navId: '',//选中的ID
    videoList: [],//视屏列表
    videoId: '',//视屏ID
    videoUpdateTime: [],//视频的播放进度数组
    isTriggered: false,//是否刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航栏的标签数据
    this.getVideoGroupList();
   
  },
  
  // 获取导航栏的标签数据
  async getVideoGroupList() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id,
    })
    //获取视频列表数据
    this.getVideoList(this.data.navId);
  },

  //获取视频列表数据
  async getVideoList(navId) {
    
    let videoListData = await request('/video/group', {id: navId})
    //关闭正在加载的图标
    wx.hideLoading();
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    //更改数据
    this.setData({
      videoList,
      isTriggered: false,//关闭下拉刷新
    })
  },
  //点击切换标签的回调
  chanNav(event) {
    let navId = event.currentTarget.id;//当传进的参数是一个数字类型时，他会自动帮我们转换为字符创
    this.setData({
      navId: navId*1,
      videoList: []
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    //动态获取当前标签页的视频数据
    this.getVideoList(this.data.navId);
  },
  //点击关闭和播放的回调
  handlePlay(event) {
    /**
   * 需求
   * 1）在点击新的视频前要找到前一个视频
   * 2）在播放新的视频前要关闭前一个视频
   * 关键：
   * 1）如何找到上一个视频的实例对象
   * 2）如何确定新的视频和上一个视频不是同一个视频
   */
    let vid = event.currentTarget.id;
    // 关闭上一个视频
    this.vid !== vid && this.videoContent && this.videoContent.stop();
    this.vid=vid;
   
    //更新data中的NavId
    this.setData({
      videoId: vid
    })
    // 创建控制video对象的实例
     this.videoContent = wx.createVideoContext(vid)
     //在播放之前要判断一下是否播放过，有无播放记录
     let {videoUpdateTime} = this.data;
     let videoItem = videoUpdateTime.find(item => item.vid === vid);
     if(videoItem) {
       this.videoContent.seek(videoItem.currentTime);
     }

     this.videoContent.play();
  },
  //监听视频播放的时间
  handleTimeUpdate(event) { 
    let videoTimeObject = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    //从this.data中拿到一个名为videoUpdateTime的数组
    let { videoUpdateTime} = this.data;
    /**
   * 思路：
   * 1.如果数组里面有当前的ID，只需要修改播放时间就好了
   * 2.如果数组里面没有当前的ID，那就要把这个ID的对象推进数组里面
   */
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObject.vid)
    if(videoItem) {//之前有
      videoItem.currentTime = event.detail.currentTime;

    }else {//之前没有
      videoUpdateTime.push(videoTimeObject);
    }
    
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束的回调
  handleEnded(event) {
    //移除当前播放对象在数组中的项
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdateTime
    })

  },
  //下拉刷新菜单
  handleRdfresh() {
    //再次发请求，获取最新的视频数据
    this.getVideoList(this.data.navId)
  },
  //底部加载是
  handleToLower() {
    // console.log("dibujiazai")
    //数据分页，1，后端分页 2.前端分页
    
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