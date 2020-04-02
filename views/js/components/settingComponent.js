var settingComponent = {
  template: `
  <div> 
    <div style="margin-top:20px;">
      <el-button type="primary" @click="syncData" :loading="loading">初始化数据</el-button>
      <el-button type="primary" @click="syncRank" :loading="rankLoading">初始化2019排名数据</el-button>
    </div>
  </div>
  `,
  data: function () {
    return {
      loading: false,
      rankLoading: false
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
    },
    syncRank() {
      let self = this;
      if (self.rankLoading) {
        return;
      }
      self.rankLoading = true;
      axios
        .get("/syncRank")
        .then(function (data) {
          var result = data.data;
          self.rankLoading = false;
          if (result.code == "0") {
            self.cities = result.result;
          }
        }).catch(function () {
          self.rankLoading = false;
        })
    }
  }
}