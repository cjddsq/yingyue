import request from '../../utils/request.js'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    recommendList:[],//推荐歌单数据
    topList:[], //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', {type: 2});
    this.setData({
      bannerList: bannerListData.banners
    });
    //获取推荐歌单的数据
    let recommendListData = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListData.result
    });
    // 获取排行榜数据
    /*
    *需求分析
    *1.需要根据idx的值获取对应的数据
    *2.idx的取值分为是0-20，但是我们需要的是0-4
    *3需要发送五次请求
    *4
    */
    let index=0;
    let resultArr=[];
    while(index<5){
      let topListdata = await request(`/top/list`, { idx: index++ });
      // splice(会对原数组进行修改，可以进行增删改查)，slice不会对原数组做出改变（0，3）包含开始的位置，不包含结束的位置
      let topListItem = { name: topListdata.playlist.name, tracks: topListdata.playlist.tracks.slice(0,3)};
      resultArr.push(topListItem);
      // 不需要等到五次体验好
      this.setData({
        topList: resultArr
      })
    }
    // console.log(resultArr)
    // 更新topList的值，放在这里setdata的用户体验差
  
  },
  //跳转到推荐页面
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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