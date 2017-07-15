# wx.CoreList
此框架是Charlin出品的大型iOS框架CoreList的小程序版本。

一.框架截图
==========
<br/>
![image](https://github.com/ShiDianSoftware/Resource/blob/master/CoreList/a.gif)
<br/>
![image](https://github.com/ShiDianSoftware/Resource/blob/master/CoreList/b.gif)


二.快速集成
==========
1. 框架依赖CoreHttp (https://github.com/ShiDianSoftware/wx.CoreHttp )，请先导入这个框架。
2. 将CoreList放入您的FrameWorks目录。
3. 建议初始化页面的时侯，一次性先copy以下代码到您的控制器js


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

          //初始化
          onLoad: function(o){

            CoreList.url = "http://39.108.3.179/tp5test/index"
            CoreList.params = { "uid": "1" }
            CoreList.method = "POST"
            CoreList.listVC = this
            CoreList.prepare()
          },

          //自定义框架数据
          corelist_findUsefullData_ReturnObj: function (obj){

            return obj.list
          },

          //触发顶部刷新
          onPullDownRefresh: function(){

            CoreList.beginHeaderRefresh()
          },

          //触发底部刷新
          onReachBottom: function(){

            CoreList.beginFooterRefresh()
          }

        })
