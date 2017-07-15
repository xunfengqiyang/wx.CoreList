// NewsList.js
var CoreList = require('../FrameWorks/CoreList/CoreList.js');

Page({

  data: {
    footerStatusText: CoreList.FooterStatusNormalText,
    dataList: null
  },

  onLoad: function(o){

    CoreList.url = "http://www.a.com/list"
    CoreList.params = null
    

  },

  onPullDownRefresh: function(){
    
    CoreList.beginHeaderRefresh()

    setTimeout(function(){

      CoreList.headerRefreshSuccess()
      
    },3000)
  }

})