var baiduMapComponent = {
  template: `<div id="container" style="width:100%;height:100%;"></div>`,
  data: function () {
    return {

    }
  },
  mounted() {
    this.$nextTick(function () {
      var _this = this;

      var map = new BMap.Map("container");
      map.enableScrollWheelZoom(true);
      // 创建地图实例 
      var point = new BMap.Point(116.404, 39.915);
      // 创建点坐标 
      map.centerAndZoom(point, 16);
      var name = this.$route.params.name;
      // console.log(name);
      // 创建地址解析器实例
      // var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      // myGeo.getPoint(name, function (point) {
      //   if (point) {
      //     console.log(point);
      //     map.centerAndZoom(point, 16);
      //     map.addOverlay(new BMap.Marker(point));
      //   } else {
      //     alert("您选择地址没有解析到结果!");
      //   }
      // });
      var local = new BMap.LocalSearch(map, {
        onSearchComplete: function (results) {
          // console.log(results)
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            // 判断状态是否正确      
            // console.log("BMAP_STATUS_SUCCESS", local)
            // for (var i = 0; i < results.getCurrentNumPois(); i++) {
            //   console.log(results.getPoi(i))
            //   console.log(results.getPoi(i).title + ", " + results.getPoi(i).address);
            // }
            //获取第一个搜索坐标点
            var point = results.getPoi(0).point;
            map.centerAndZoom(point, 15);
            map.addOverlay(new BMap.Marker(point));
          }
        }
      })
      local.search(name);
    })
  }
}