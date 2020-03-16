var settingComponent = {
  template: `
  <div> 
    <div style="margin-top:20px;">
      <el-button type="primary" @click="syncData" :loading="loading">初始化数据</el-button>
    </div>
  </div>
  `,
  data: function () {
    return {
      loading: false
    }
  },
  methods: {
    syncData() {
      let self = this;
      if (self.loading) {
        return;
      }
      self.loading = true;
      axios
        .get("/syncData")
        .then(function (data) {
          var result = data.data;
          self.loading = false;
          if (result.code == "0") {
            self.cities = result.result;
          }
        }).catch(function () {
          self.loading = false;
        })
    }
  }
}