var CoreHttp = require('../CoreHttp/CoreHttp.js');


function CoreList() { }


//框架需要接受的外部参数
//1.列表的请求URL
CoreList.url = null
//2.列表请求的参数
CoreList.params = null
//3.列表请求的方式：GET/POST，默认是POST
CoreList.method = "POST"
//4.请传入当前列表页面的指针
CoreList.listVC = null


//框架内部使用的参数
CoreList.CoreListisHeaderRefreshing = false
CoreList.isFooterRefreshing = false
CoreList.FooterStatusNormalText = "继续上拉刷新"
CoreList.FooterStatusRefreshgingText = "正在加载数据..."
CoreList.PageKey = "page"
CoreList.page = 1
CoreList.PageSizeKey = "page_size"
CoreList.page_size = 20
CoreList.dataList = new Array()

//顶部刷新系统自动触发
CoreList.onPullDownRefresh = function () {


  // if (!isHeaderRefreshing){
  //   this.beginHeaderRefresh()
  // }
  // isHeaderRefreshing = true
}

//顶部刷新开始
CoreList.beginHeaderRefresh = function () {

  console.log("beginHeaderRefresh")
  //重置页码
  this.page = 1
  this.request(true)

}

//顶部刷新成功
CoreList.headerRefreshSuccess = function (ms) {
  this.page = 1
  this.dataList = ms
  this.listVC.setData({ dataList: this.dataList })
  this.endHeaderRefresh()
}

//顶部刷新失败
CoreList.headerRefreshError = function (e) {

  this.endHeaderRefresh()
}


//顶部刷新结束
CoreList.endHeaderRefresh = function () {

  console.log("endHeaderRefresh")
  wx.stopPullDownRefresh()
  this.isHeaderRefreshing = false
}

//底部刷新系统自动触发
CoreList.onReachBottom = function () {

  // if (!isFooterRefreshing) {
  //   this.beginFooterRefresh()
  // }

  // isFooterRefreshing = true
}

//底部刷新开始
CoreList.beginFooterRefresh = function () {

  this.setData({ footerStatusText: FooterStatusRefreshgingText })
  console.log("beginFooterRefresh")

}


//底部刷新成功
CoreList.footerRefreshSuccess = function footerRefreshSuccess(ms) {
  //页码递增：如果刷新成功但没有数据则页码回退
  if (ms > 0) {
    var dataList_temp = this.dataList == null ? new Array() : this.dataList
    this.dataList = dataList_temp.concat(res)
    this.listVC.setData({ dataList: this.dataList })
    page++
  }
  this.endFooterRefresh()
}

//底部刷新失败
CoreList.footerRefreshError = function (e) {
  this.endFooterRefresh()
}

//顶部刷新结束
CoreList.endFooterRefresh = function () {
  // this.setData({footerStatusText: FooterStatusNormalText})
  // console.log("endFooterRefresh")
  // isFooterRefreshing = false
}


//请求网络数据
CoreList.request = function (isHeaderRefresh) {

  let weakSelf = this;

  if (this.method == "GET") {

    let sign = this.url.indexOf("?") != -1 ? "&" : "?"
    var url = this.url + sign + this.PageKey + "=" + this.page + "&" + this.PageSizeKey + "=" + this.page_size
    let params = this.params
    console.log(url); console.log(params)
    

    CoreHttp.get(url, params, function (o) {
      console.log("GET请求成功"); console.log(o)

      weakSelf.handleRequestRes(isHeaderRefresh,true,o)

    }, function (e) {

      console.log("GET请求失败"); console.log(e)
      weakSelf.handleRequestRes(isHeaderRefresh, false, e)

    })


  } else {

    var url = this.url
    var params = this.params
    if (params == null) { params = new Object() }
    params[this.PageKey] = this.page
    params[this.PageSizeKey] = this.page_size


    console.log(url); console.log(params)
    
    CoreHttp.post(url, params, function (o) {
      console.log("POST请求成功"); console.log(o)
      weakSelf.handleRequestRes(isHeaderRefresh, true, o)
    }, function (e) {

      console.log("POST请求失败"); console.log(e)
      weakSelf.handleRequestRes(isHeaderRefresh, false, e)
    })

  }


}

CoreList.handleRequestRes = function(isHeaderRefresh, isSuccess, res){

  if (isHeaderRefresh) { //顶部刷新成功
    if (isSuccess) {
      //记录数据
      this.headerRefreshSuccess(res)
    }else {
      this.headerRefreshError(res)
    }
  }else {
    if (isSuccess) {
      //记录数据
      this.footerRefreshSuccess(res)
    } else {
      this.footerRefreshError(res)
    }
  }

}


module.exports = CoreList

