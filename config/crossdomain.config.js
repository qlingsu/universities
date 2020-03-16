
/**
 * 跨域设置
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var crossdomain = function(req, res, next) {
    
  res.header('Access-Control-Allow-Origin', 'http://localhost:9091');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.header('Access-Control-Allow-Credentials','true');
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("X-Powered-By",' 3.2.1')

  if(req.method=="OPTIONS") {
      res.send(200);/*让options请求快速返回*/}
  else  {
      next();
    }
};
module.exports = crossdomain