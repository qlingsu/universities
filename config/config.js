(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.appConfig = factory());
}(this, function () {
  var appConfig = {
    mainTableName: "universities"
  }
  return appConfig;
}))