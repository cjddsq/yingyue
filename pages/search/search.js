// pages/search/search.js
import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',//placeholder的默认内容
    hotList: [],//热搜榜数据
    searchContent: '',//搜索框的数据
    searchList: [],//输入内容模糊匹配的效果
    historyList: [],//历史记录的存储数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取初始化数据
    this.getInitData();
    //获取历史记录
    this.getSearchHistory();
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  //获取本地的搜索历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    this.setData({
      historyList
    })
  },
  //监听表单项数据的改变并且发请求实现模糊匹配
  handleInputChange(event) {
    // console.log(event)
    this.setData({
      searchContent: event.detail.value.trim(),
    })
    if (isSend) {
      return;
    }
    isSend = true;
    // 调用接口获得数据
    
    this.getSearchList();
    //进行函数节流
    setTimeout(()=> {
      isSend = false;
    },300)
    
  },
  // 发请求来获得模糊匹配的搜索结果
  async getSearchList() {
 
    if(!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    let {searchContent, historyList} = this.data;
    // 发请求来获得模糊匹配的搜索结果
    let searchListData = await request('/search/', { keywords: this.data.searchContent, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
    })
    //将搜索历史添加到搜索记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
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