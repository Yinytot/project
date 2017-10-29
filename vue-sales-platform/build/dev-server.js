require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

//jsonServer的配置(提供虚拟的后台数据的jsonServer)
// const jsonServer = require('json-server')
// const apiServer = jsonServer.create()
// const apiRouter = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

// apiServer.use(middlewares)
// apiServer.use('/api',apiRouter)
// apiServer.listen(port + 1, () => {
//   console.log('JSON Server is running')
// })
//jsonServer的配置

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

//用Node和Express提供虚拟的后台数据
//epress是在Node基础上搭建的web框架，可以方便配置路由，定义中间件，错误处理，渲染模版等。
var apiServer = express() //获得express定义的apiServer,apiServer对象此时代表整个web应用
var bodyParser = require('body-parser') //加载body-parser
// 给app配置bodyParser中间件
// 通过如下配置在路由中处理request时，可以直接获得post请求的body部分
apiServer.use(bodyParser.urlencoded({ extended: true }))
apiServer.use(bodyParser.json()) 
var apiRouter = express.Router() //获得express的router对象
var fs = require('fs')
apiRouter.route('/:apiName') //根api目录下接口对应的是不同的json数据，apiName来设置
.all(function (req, res) {  //.all请求，无论是get/post/put/delete都执行后面的回调
  fs.readFile('./db.json', 'utf8', function (err, data) { //通过node的fs去读db.json文件，编码是utf8
    if (err) throw err
    var data = JSON.parse(data) //使用JSON.parse方法把文件中data里面的数据强行转换成js的对象
    if (data[req.params.apiName]) {  //有了data对象之后，通过req.params取得当前访问url的端口名
      res.json(data[req.params.apiName]) //当前端口名存在的话，我们将data以json的形式返回到接口中
    }
    else {
      res.send('no such api name')
    }
  })
})
//注册路由
apiServer.use('/api', apiRouter); //所有的路由会加上"/api"前缀
apiServer.listen(port + 1, function (err) { //监听port+1这个端口
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + (port + 1) + '\n')
})
//用Node和Express提供虚拟的后台数据

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
