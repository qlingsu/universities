const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

const adapter = new FileSync('database/db.json'); // 申明一个适配器
const db = low(adapter);

const schoolAdapter = new FileSync('database/school.json'); // 申明一个适配器
const schoolDb = low(schoolAdapter);//学校数据库--较全

const rankAdapter = new FileSync('database/rank2019.json'); // 申明一个适配器
const rankDb = low(rankAdapter);//学校排名数据库--2019某排名前800所

const ProvinceEnum = require("../enum/ProvinceEnum");
const LevelEnum = require("../enum/LevelEnum");

const appConfig = require("../config/config");
/**
 * 同步数据
 */
function syncData() {
  let schoolData = schoolDb.get("data").value();

  console.log("syncData start");
  let tableName = appConfig.mainTableName;
  for (let school of schoolData) {
    let university = this.findOne(tableName, { name: school.schoolName });
    let provinceData = ProvinceEnum.find(function (item) {
      return item.label.includes(school.province);
    })
    if (!provinceData) {
      console.log(school);
    }

    if (university.length > 0) {//如果库里有，只更新
      let level = "";
      //判断是专科的方法，有专科两个字或有职业两个字
      if (school.schoolName.includes("专科") || school.schoolName.includes("职业")) {
        level = 5;
      }

      db.get(tableName).find({ name: school.schoolName }).assign({
        except: 0,//是否排除
        id: school.schoolId,
        city: school.city.replace("市", ""),
        province: provinceData.value,
        level: level
      }).write();
    } else {//库里没有，则插入

      db.get(tableName).push({
        except: 0,//是否排除
        id: school.schoolId,
        province: provinceData.value,
        city: school.city,
        name: school.schoolName,
        level: "",
        url: "",
        status: "0",
        createTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        remark: ""
      }).write();
    }

  }
  console.log("syncData end");
}
/**
 * 同步排名数据
 */
function syncRank() {
  console.log("syncRank start");
  let rankData = rankDb.get("data").value();//排名数据---2019排名
  let tableName = appConfig.mainTableName;
  for(let rank of rankData){
    let university = this.findOne(tableName, { name: rank.name });
    if (university.length > 0) {//如果库里有，只更新
      db.get(tableName).find({ name: rank.name }).assign({
        ...rank
      }).write();
    }
  }
  console.log("syncRank end");
}

function createTable(tableName) {
  if (db.has(tableName).value()) {

  } else {
    let newTable = {};
    newTable[tableName] = [];
    db.defaults(newTable).write();
  }
}

//插入
function insert(tableName, data) {
  db.get(tableName).push(data).write();
}

//更新
function update(tableName, data) {
  db.get(tableName).find({ id: data.id }).assign(data).write();
}

//删除
function deleteOne(tableName, data) {
  try {
    db.get(tableName).remove(data).write();
  } catch (e) {

  }
}
//查询列表
function list(tableName, sort) {
  //desc "降序" asc "升序"
  if (sort == "desc" || !sort) {
    return db.get(tableName).sortBy("createTime").value().reverse();
  } else if (sort == "asc") {
    return db.get(tableName).sortBy("createTime").value();
  }
}
//查找
function findOne(tableName, data) {
  return db.get(tableName).filter(data).take(1).value();
}

module.exports = {
  syncData: syncData,
  syncRank: syncRank,
  createTable: createTable,
  insert: insert,
  update: update,
  deleteOne: deleteOne,
  findOne: findOne,
  list: list
}


