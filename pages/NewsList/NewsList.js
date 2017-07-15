// NewsList.js
var CoreList = require('../FrameWorks/CoreList/CoreList.js');

Page({

  data: {

      //CoreList框架变量
      //1.动态变量:无需配置，请保留，框架会自动调用
      dataList: null,
      footerStatusText: null,

      //2.静态变量：请填写配置(为了更灵活，请带上单位)
      insetsTop: "100px",
      insetsBottom: "50px"
      
  },

  onLoad: function(o){

    CoreList.url = "http://39.108.3.179/tp5test/index"
    CoreList.params = { "uid": "1" }
    CoreList.method = "POST"
    CoreList.listVC = this
    CoreList.prepare()
  },

  corelist_findUsefullData_ReturnObj: function (obj){

    return obj.list
  },

  onPullDownRefresh: function(){
    
    CoreList.beginHeaderRefresh()
  },

  onReachBottom: function(){

    CoreList.beginFooterRefresh()
  }

})