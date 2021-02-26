// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js';
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    day: '',//天
    month: '',//月
    recommendList: [],//歌曲的数据
    index: '',//音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: ()=> {
          // 跳转到登录界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 更新日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    // 获取相应的音乐数据
    this.getrecommendList();
    //订阅来自songdetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      if(type === 'pre') {
        //当音乐是第一首时，自动等于最后一首
        (index === 0 ) && (index = recommendList.length)
        index -=1;
      }else {
        (index = recommendList.length - 1) && (index = -1)
        index +=1;
      }
      // 更新下标
      this.setData({
        index
      })
      // 订阅方变为发布方,将music回传给songDetail页面
      let musicId = recommendList[index].id;
      PubSub.publish('musicId', musicId)
    })
    
  },
  // 获取音乐数据的函数
  async getrecommendList() {
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
  // 跳转到歌曲详情界面
  toSongDetail(event) {
    //不能直接传song这个参数，会因长度过长而被截取掉
    let {song, index} = event.currentTarget.dataset;
    // console.log('diyici',index)
    // console.log(index)
    // 赋值给index
    this.setData({
      index
    })
    // console.log(song)
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
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