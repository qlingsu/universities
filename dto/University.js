class University {
  constructor() {
    this.id = "";//id
    this.province = "";//省份
    this.city = "";//城市
    this.name = "";//高校名称
    this.level = "";//档次 0--985 1---211 2---普通一本 3---普通二本 4-普通三本 5----专科
    this.url = "";//网站地址
    this.status = "";//0---未投递 1---已投递
    this.createTime = "";//创建时间
    this.remark = "";//备注
  }

}
module.exports = University
