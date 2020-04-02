var indexComponent = {
  template: `
  <div class="whole-page" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"> 
    <div class="top-title">
      <div style="width: 60px;display: flex;align-items: center;justify-content: center;float: left;">
        <i class="iconfont icon-xueshimao-shi" style="font-size:30px;"></i>
      </div>
      <div style="color:white;font-size:20px;line-height: 40px;margin-left: 20px;float: left;">
        全国高校查询系统 
      </div>
      <div style="line-height: 40px;margin-right:20px;float:right;">
        <span style="font-size:12px;">Copyright © 2020 qlingsu All Rights Reserved.</span>
      </div>
    </div>
    <div class="body-page">
      <div class="left-bar">
        <div v-for="menu in menus" :key="menu.id" :title="menu.title" class="left-bat-menu" @click="menuClickHandle(menu)">
          <i :class="'iconfont icon-'+menu.iconfont" style="font-size:40px;"></i>
        </div>
      </div>

      <div class="right-bar">
        <router-view></router-view>
      </div>

    </div>
  </div>
  `,
  data: function () {
    return {
      loading: false,
      menus: [
        {
          id: "1",
          iconfont: "table",
          title: "列表",
          color: "#FFFF",
          path: "/main"
        },
        {
          id: "2",
          iconfont: "map",
          title: "地图",
          color: "#FFFF",
          path: "/map"
        },{
          id:"3",
          iconfont:"shezhi",
          title: "设置",
          color: "#FFFF",
          path: "/setting"
        }
      ]
    }
  },
  methods: {
    menuClickHandle(menu) {
      let self = this;
      console.log(menu);
      self.$router.push(menu.path)
    }
  }
}