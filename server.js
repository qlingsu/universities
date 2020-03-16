var express = require('express');
var bodyParser = require('body-parser');
var http_port = 8082;

var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json ：接受 json 或者可以转换为json的数据格式
app.use(bodyParser.json({ type: 'application/*+json' }));

//跨域
var allowCrossDomain = require("./config/crossdomain.config");
// app.use(allowCrossDomain);

app.use('/node_modules', express.static('./node_modules'));
app.use('/views', express.static('./views'));


var ViewController = require("./controller/ViewController");

var UniversityController = require("./controller/UniversityController");


var DateUtil = require("./util/DateUtil");

var DaoService = require("./service/DaoService");
var appConfig  = require("./config/config");
DaoService.createTable(appConfig.mainTableName);//创建数据库表

const opn = require('opn');

//初始化服务器
var initHttpServer = () => {
  new ViewController(app, __dirname + "/views/html");

  new UniversityController(app);

  app.listen(http_port,"0.0.0.0" ,() => console.log('Listening http on port: ' + "http://localhost:" + http_port));
  opn("http://localhost:" + http_port + "/index", {app: 'chrome'});
  //这里如果是windows，就是运行框中的命令，如果是linux就是终端中的命令，例如 360浏览器是360se6
}

initHttpServer();