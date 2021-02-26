// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../utils/request'

// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//控制摇杆是否放下
    song: {},//获取歌曲的详细信息
    musicId: '',//音乐ID
    musicLink: '',//音乐链接
    currentTime: '00:00',//当前已播放的时间
    durationTime: '00:00',//总时长
    currentWidth: 0,//实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 用于接收路由跳转的参数
    // option会调用自己内置的转化函数来转化。
    // 路由传参对数据长度有限制
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    //调用方法
    this.getMusicInfo(musicId);
    /**
   * 问题：通过系统来孔子音乐的播放时，由于小程序不知道，造成不同步
   * 解决方法： 添加播放和暂停的监听事件就可以了
   */
    //判断当前音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == musicId) {
      //修改当前页面的播放状态
      this.setData({
        isPlay: true
      })
    }
    //创建音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听页面的播放、暂停和停止
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      //修改全局的音乐状态
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false;
    });
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false;
    });
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('实时的时长', this.backgroundAudioManager.currentTime )
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      // 这是进度条的宽度
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 425;
      this.setData({
        currentTime,
        currentWidth
      })
    });
    this.backgroundAudioManager.onEnded(() => {
      //自动切换下一首个并自动播放
      //发布消息数据库给recommendSong页面
      PubSub.publish('switchType', next);
      // 将进度条长度置为零,音乐时间也置换为00：00
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
      
    });
  },
  //通过ID来获取歌曲的详情信息
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', { ids: musicId})
    // 更改数据
    //songData.songs[0].dt,单位是毫秒
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    //动态更改导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  // 修改播放和暂停时的状态
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  //控制音乐的播放和暂停功能
  async musicControl(isPlay, musicId, musicLink) {
   
    if(isPlay) {//为真怎么样
      if(!musicLink) {
        //请求歌曲播放连接
        let musicLinkData = await request('/song/url', { id: musicId })
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
     
      this.backgroundAudioManager.src = musicLink;
      //一定要设置标题，否则不会播放
      this.backgroundAudioManager.title = this.data.song.name;
    }else {//为假怎么样
      //暂停
      this.backgroundAudioManager.pause();
    }
  },
  // 点击切换歌曲的函数
  handleSwitch(event) {
    //获取点击的类型
    let type = event.currentTarget.id;
    //关闭之前播放的音乐
    this.backgroundAudioManager.stop();
    //订阅来自reocmmendSong的音乐ID,订阅会重复累加
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐的详细信息
      this.getMusicInfo(musicId);
      this.musicControl(true, musicId);
      PubSub.unsubscribe('musicId')
    })
    //发布消息数据库给recommendSong页面
    PubSub.publish('switchType', type);
   
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