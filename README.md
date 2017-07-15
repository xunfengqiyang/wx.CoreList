# wx.CoreList
此框架是Charlin出品的大型iOS框架CoreList的小程序版本。

一.框架截图
==========


![image](https://github.com/ShiDianSoftware/Resource/blob/master/CoreList/a.gif)


![image](https://github.com/ShiDianSoftware/Resource/blob/master/CoreList/b.gif)


二.快速集成
==========
1. 框架依赖CoreHttp (https://github.com/ShiDianSoftware/wx.CoreHttp )，请先导入这个框架。
2. 将CoreList放入您的FrameWorks目录。
3. 请设置项目配置不校验请求域名，设置app.json的window的"backgroundTextStyle":"dark"，列表控制器js的json文件设置"enablePullDownRefresh": true
4. 建议初始化页面的时侯，一次性先copy以下代码到您的控制器js


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


三.框架解释
==========
<br/>
1.请问这个框架怎么没有加载HUD？<br/>
答：我认为列表不需要HUD，HUD在列表非常难看。顶部刷新以及底部刷新控件完全足以实现加载进度提示。<br/>
<br/>
2.insetsTop和insetsBottom是做什么的？<br/>
答：
（1）这个有两个作用，首选在ios的UITableview（UIScrollView）本身就有这两个概念，这两个主要是实现各种blur以及半透明穿透效果。<br/>

（2）作为通用列表，您的列表不可能是点满整个屏幕的，顶部或者底部总会有点什么，这个是为了这种情况而设计的。请注意您的布局，列表总是占满整个页面的布局。
<br/>
<br/>
3. corelist_findUsefullData_ReturnObj这个方法是做什么的？<br/>
答：这个方法您可以实现也可以不实现，这个是不强制的，框架内部也做了判断。服务器返回的列表一般是data下面的数组。例如：data: [listObjs]<br/>
有时侯服务器返回的却是一些更复杂的信息，比如例如：data: [count: 99, list: [listObjs]]<br/>
这个方法是为了让你手动剥离出来列表数组，至于为什么这个方法不写死在框架内部，因为有的列表结构又不是这么复杂，这个完全是一种定制行为。<br/>

4.我可以自定义一些数据吗？<br/>
答：可以的，请查看:


                //框架需要接受的外部参数
                //1.列表的请求URL
                CoreList.url = null
                //2.列表请求的参数
                CoreList.params = null
                //3.列表请求的方式：GET/POST，默认是POST
                CoreList.method = "POST"
                //4.请传入当前列表页面的指针
                CoreList.listVC = null
                //5.请传入insetsTop值以及insetsBottom值
                CoreList.insetsTop = 0
                CoreList.insetsBottom = 0


                //框架内部使用的参数
                CoreList.CoreListisHeaderRefreshing = false
                CoreList.isFooterRefreshing = false
                CoreList.FooterStatusFirstText = "正在读取数据..."
                CoreList.FooterStatusNormalText = "继续上拉刷新"
                CoreList.FooterStatusRefreshgingText = "正在读取数据..."
                CoreList.FooterStatusRefreshNomoreDataText = "没有更多数据啦"
                CoreList.FooterStatusRefreshErrorText = "网络错误，请稍后再试吧~"
                CoreList.PageKey = "page"
                CoreList.PageSizeKey = "page_size"
                CoreList.page = 0
                CoreList.page_size = 20
                CoreList.dataList = new Array()
                CoreList.hasMoreData = true


<br/>
####  作者Charlin Feng
##### Hi，我是Charlin Feng，来自成都，目前就职于成都时点软件开发有限公司。我是一名做了3年前后端开发LAMP的，然后从12年开始又做了5年iOS开发的工程师，

##### 这是我的Github： https://github.com/CharlinFeng 目录开源了100多个iOS框架（少量Android框架），在国内有上千名iOS框架使用者。


##### 目前从iOS的角度，国内Object-C开发者排行第11位（https://githuber.cn/search?language=Objective-C ）

##### Swift开发目前综合排名第19位（https://githuber.cn/search?language=Swift ）


##### 现在我对小程序比较感兴趣，我的开发理念是封装，高度的封装，疯狂的封装。

##### 希望我能在在小程序这个领域封装出更多好用的框架。这些框架都带有浓郁的iOS代码风格。

##### 基本为什么要这个封装，因为对应一个小程序框架在iOS里面就有一个我写过的非常成熟的框架，只是代码换了一下，思路还是一致的。

##### 这是我的第一个小程序的框架，下面第二个就复杂一点了，封装了通用列表（含有数据解析，上拉下拉，分页，错误处理，页面insets效果等等，请期待）。
   
   
