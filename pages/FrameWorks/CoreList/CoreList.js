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

  let isArr = Array.isArray(ms)
  if (!isArr) {
    this.hasMoreData = false
    this.page = 1

  } else {

    this.hasMoreData = true
    this.page = 1
    this.dataList = ms

    if (ms.length == this.page_size) { //第一页满页
      this.listVC.setData({ dataList: this.dataList, footerStatusText: this.FooterStatusNormalText })
      this.hasMoreData = true
    } else {//第一页都没有满页
      this.listVC.setData({ dataList: this.dataList, footerStatusText: this.FooterStatusRefreshNomoreDataText })
      this.hasMoreData = false
    }
  }

  this.endHeaderRefresh()
  console.log("endFooterRefresh")

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

  if (!this.hasMoreData) { return }

  //先page自增，但在几种特殊情况下页码需要回退
  this.page++
  this.listVC.setData({ footerStatusText: this.FooterStatusRefreshgingText })
  this.request(false)

}


//底部刷新成功
CoreList.footerRefreshSuccess = function footerRefreshSuccess(ms) {
  let isArr = Array.isArray(ms)
  let length = isArr ? ms.length : 0
  //页码递增：如果刷新成功但没有数据则页码回退
  if (length > 0) {
    var dataList_temp = this.dataList == null ? new Array() : this.dataList
    this.dataList = dataList_temp.concat(ms)
    this.listVC.setData({ dataList: this.dataList })
  }
  //this.page-- //页码回退

  console.log("footerRefreshSuccess=====================")
  console.log(ms)
  console.log(length)



  var str = ""
  if (length == this.page_size) {
    str = this.FooterStatusNormalText
  } else if (length < this.page_size && length > 0) {
    str = this.FooterStatusRefreshNomoreDataText
    this.hasMoreData = false
  } else if (length == 0) {
    str = this.FooterStatusRefreshNomoreDataText
    this.hasMoreData = false
  }

  this.endFooterRefresh(str)

}

//底部刷新失败
CoreList.footerRefreshError = function (e) {
  //此处可能有两种错误，一是网络加载失败，另外一种是服务器抛出错误
  this.endFooterRefresh(this.FooterStatusRefreshErrorText)
  this.hasMoreData = true
  this.page-- //页码回退
}

//顶部刷新结束
CoreList.endFooterRefresh = function (str) {
  this.listVC.setData({ footerStatusText: str })
  console.log("endFooterRefresh")
  this.isFooterRefreshing = false
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

      weakSelf.handleRequestRes(isHeaderRefresh, true, o)

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

CoreList.handleRequestRes = function (isHeaderRefresh, isSuccess, res) {

  var ms_temp_whenSuccess = null

  if (isSuccess) {

    ms_temp_whenSuccess = (typeof this.listVC.corelist_findUsefullData_ReturnObj == "function") ? this.listVC.corelist_findUsefullData_ReturnObj(res) : res
  }

  if (isHeaderRefresh) { //顶部刷新成功
    if (isSuccess) {
      //记录数据
      this.headerRefreshSuccess(ms_temp_whenSuccess)
    } else {
      this.headerRefreshError(res)
    }
  } else {
    if (isSuccess) {
      //记录数据
      this.footerRefreshSuccess(ms_temp_whenSuccess)
    } else {
      this.footerRefreshError(res)
    }
  }

}

CoreList.prepare = function () {

  this.listVC.setData({ footerStatusText: this.FooterStatusFirstText })
  this.beginFooterRefresh()
}


module.exports = CoreList

