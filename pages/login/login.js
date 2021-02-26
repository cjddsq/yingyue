
  /**
   * 登录流程
   * 1.手机表单信息
   * 2.前端验证
   * 1）验证用户信息是否合法
   * 2）验证不通过，不要发请求
   * 3）验证通过了，发送携带用户信息的请求
   * 3.后端验证
   * 1)验证用户的账号是否存在
   * 2）如果不存在，告诉前端用户账号错误
   * 3)如果存在，则验证密码是否正确
   * 4）如果不正确返回错误信息，如果正确，正返回携带用户信息的数据
   */
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //定义表单项的回调函数
  handleInput(event) {
    let type=event.currentTarget.id;//取值有两种phone or password
    // console.log(type,event.detail.value)
    // 更改数据
    this.setData({
      [type]: event.detail.value
    })
  },
  //定义登录的回调函数
  async login() {
    let {phone, password} = this.data;
    /**
   * 手机号验证
   * 1）手机号不能为空
   * 2）手机号的格式要对
   * 3）手机号正确,验证通过
   */
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    //通过正则表达式来验证手机号
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    //简单验证一下密码不为空就可以了
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
   //后端验证
    let result = await request('/login/cellphone', {phone, password,isLogin: true});
    if(result.code == 200) {
      wx.showToast({
        title: '登录成功',
      })
      //将登陆信息存储至本地存储中
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      //登录成功后跳转至个人中心界面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code == 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if(result.code == 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '登陆失败，请重新登陆',
        icon: 'none'
      })
    }

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