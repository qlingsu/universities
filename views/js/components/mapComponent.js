var mapComponent = {
  template: `
    <!-- 图表容器 DOM -->
    <div id="container" style="width:100%;height:100%;"></div>
    `,
  data: function () {
    return {
      universities: []
    }
  },
  mounted: function () {
    var self = this;
    self.getList().then(() => {
      self.drawMap();
    })
  },
  methods: {
    /**
     * 获取列表
     */
    getList: function () {
      var self = this;
      return new Promise((resolve, reject) => {
        axios.get("/getList", {
          params: {
            pageNum: 1,
            pageSize: 3000,
          }
        }).then(function (data) {
          var result = data.data;
          if (result.code == "0") {
            self.universities = result.result.rows;
          } else {
            self.universities = [];
          }
          resolve();
        }).catch(() => {
          reject();
        })
      })

    },
    drawMap() {
      var self = this;
      var series = [{
        // 地图数据列
        type: 'map',
        mapData: Highcharts.maps["cn/china"],
        joinBy: 'hc-key',
        name: '随机数据',
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        showInLegend: false
      }]
      var lastLevel = null;

      var cityLevel = 6;//几线城市
      // 中国城市分布数据
      for (var name in cities) {
        var city = cities[name];
        if (city.level.level !== lastLevel) {
          series.push({
            name: city.level.name,
            visible: series.length <= cityLevel,
            data: []
          });
          lastLevel = city.level.level;
        }
        //根据城市找单位
        var us = getUniversity(name);
        var selectOption = "allCollege";
        if (selectOption == "university") {//只看大学
          var temp = [];
          for (var i in us) {
            if (isUniversity(us[i])) {
              temp.push(us[i]);
            }
          }
          us = temp;
        } else if (selectOption == "allCollege") {//所有高校}
          var temp = [];

          for (var i in us) {
            if (isUniversity(us[i]) || isCollege(us[i])) {
              temp.push(us[i]);
            }
          }
          us = temp;
        }
        if (us.length > 0) {
          series[series.length - 1].data.push({
            name: name,
            properties: city,
            x: city.x,
            y: -city.y,
            univeristies: us
          });
        }
      }

      for (var i = 1; i < series.length; i++) {
        series[i].name += '（' + series[i].data.length + ' 个）';
      }
      console.log(series);

      //是学院
      function isCollege(univeristy) {
        return univeristy.name && univeristy.name.indexOf("学院") >= 0 && univeristy.name.indexOf("大学") < 0;
      }
      //是大学
      function isUniversity(univeristy) {
        return univeristy.name && univeristy.name.indexOf("大学") >= 0;
      }
      //根据城市找大学
      function getUniversity(city) {
        var result = [];
        for (var i in self.universities) {
          if (self.universities[i].city == city) {
            result.push(self.universities[i])
          }
        }
        return result;
      }

      var map = new Highcharts.Map('container', {
        chart: {
          type: 'mappoint'
        },
        title: {
          text: '中国城市和高校分布(部分)'
        },
        mapNavigation: {
          enabled: true,// 开启地图导航器，默认是 false
          buttonOptions: { // 缩放按钮相关样式
            verticalAlign: 'bottom'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          floating: true,
          x: 30
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<small>{point.key}</small><table>',
          formatter: function () {
            let s = '';
            s = '<div style="width:100px;"></div>';
            this.point.univeristies.forEach(function (us, index) {
              s += '<div >单位:' + us.name + '</div> ';
            })
            return s;
          },
          useHTML: true,
          footerFormat: '</table>',
        },
        series: series
      });
    }

  }
}