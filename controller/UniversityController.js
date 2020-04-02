import DaoService from "../service/DaoService";
import IdUtil from "../util/IdUtil";
import Result from "../dto/Result";
import University from "../dto/University";
import Page from "../dto/Page";
import LevelEnum from "../enum/LevelEnum";
import StatusEnum from "../enum/StatusEnum";
import ProvinceEnum from "../enum/ProvinceEnum";
import CityEnum from "../enum/CityEnum";
class UniversityController {
  constructor(app) {
    this.app = app;

    app.all("/getList", function (req, res) {

      var pageSize = req.query.pageSize || req.body.pageSize;
      var pageNum = req.query.pageNum || req.body.pageNum;
      var searchText = req.query.searchText || req.body.searchText;
      var searchProvince = req.query.searchProvince || req.body.searchProvince;
      var searchCity = req.query.searchCity || req.body.searchCity;
      var searchType = req.query.searchType || req.body.searchType;
      var searchStatus = req.query.searchStatus || req.body.searchStatus;
      var searchLevel = req.query.searchLevel || req.body.searchLevel;
      var searchExcept = req.query.searchExcept || req.body.searchExcept;
      var searchRank = req.query.searchRank || req.body.searchRank;
      var tableName = req.query.tableName || req.body.tableName || "universities";

      var result = new Result();

      var list = DaoService.list(tableName);
      if (searchText) {
        list = list.filter((item) => {
          return item.name.includes(searchText);
        })
      }
      //省份
      if (searchProvince) {
        list = list.filter((item) => {
          return item.province == searchProvince;
        })
      }
      //城市
      if (searchCity) {
        list = list.filter((item) => {
          return item.city == searchCity;
        })
      }
      //投递状态
      if (searchStatus) {
        list = list.filter((item) => {
          return item.status == searchStatus;
        })
      }
      //只看本科
      if (searchLevel == 1) {
        list = list.filter((item) => {
          return item.level != 5;
        })
      }
      //是否显示已排除
      if (searchExcept == 0) {
        list = list.filter((item) => {
          return item.except != 1;
        })
      }
      //只看排名
      if (searchRank == 1) {
        list = list.filter((item) => {
          return item.rankInAll;
        })
      }
      //类型筛选
      if (searchType && searchType.length > 0) {
        let templist1 = [];
        let templist2 = [];
        if (searchType.includes("其他")) {//如果有其他，则返回没有类型的
          templist1 = list.filter((item) => {
            return !item.type;
          })
        }
        //按照类型筛选
        templist2 = list.filter((item) => {
          return searchType.includes(item.type);
        })

        list = templist1.concat(templist2);
      }

      result.setResult(new Page(pageSize, pageNum, list));
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/add", function (req, res) {
      var id = IdUtil.createId();
      var province = req.query.province || req.body.province;
      var city = req.query.city || req.body.city;
      var name = req.query.name || req.body.name;
      var level = req.query.level || req.body.level;
      var url = req.query.url || req.body.url;
      var status = req.query.status || req.body.status;
      var remark = req.query.remark || req.body.remark;

      var result = new Result();

      var university = new University();
      university.id = id;
      university.province = province;
      university.city = city;
      university.name = name;
      university.level = level;
      university.url = url;
      university.status = status;
      university.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      university.remark = remark;
      var item = DaoService.findOne("universities", { name: university.name });
      if (item.length > 0) {
        result.setResult("");
        result.setMsg("failed");
        result.setCode("-1");
      } else {
        DaoService.insert("universities", university);

        result.setResult("");
        result.setMsg("success");
        result.setCode("0");
      }


      res.status(200).send(result);
    })
    //根据省找城市
    app.all("/findCityByProvince", function (req, res) {
      var province = req.query.province || req.body.province;
      let proviceData = ProvinceEnum.find(function (item) {

        return item.value == province || item.label.includes(province);
      })

      var result = new Result();

      if (!proviceData) {
        result.setResult("");
        result.setMsg("error,wrong province");
        result.setCode(0);

        res.status(200).send(result);
      }

      let resultArr = [];
      for (let city in CityEnum) {

        let cityData = CityEnum[city];
        if (cityData.province.includes(proviceData.label) || proviceData.label.includes(cityData.province)) {
          resultArr.push({
            label: city,
            value: city
          })
        }
      }

      result.setResult(resultArr);
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/update", function (req, res) {
      var id = req.query.id || req.body.id;
      var province = req.query.province || req.body.province;
      var city = req.query.city || req.body.city;
      var name = req.query.name || req.body.name;
      var level = req.query.level || req.body.level;
      var url = req.query.url || req.body.url;
      var status = req.query.status || req.body.status;
      var remark = req.query.remark || req.body.remark;
      var except = req.query.except || req.body.except;



      var university = new University();
      university.id = id;
      university.province = province;
      university.city = city;
      university.name = name;
      university.level = level;
      university.url = url;
      university.status = status;
      university.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      university.remark = remark;
      university.except = except;

      DaoService.update("universities", university);

      var result = new Result();
      result.setResult("");
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/detail", function (req, res) {
      var id = req.query.id || req.body.id;

      var one = DaoService.findOne("universities", { id: id });

      var result = new Result();
      result.setResult(one);
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/delete", function (req, res) {
      var id = req.query.id || req.body.id;

      DaoService.deleteOne("universities", { id: id });

      var result = new Result();
      result.setResult("");
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/getStatusEnum", function (req, res) {

      var result = new Result();
      result.setResult(StatusEnum);
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/getLevelEnum", function (req, res) {

      var result = new Result();
      result.setResult(LevelEnum);
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })

    app.all("/getProvinceEnum", function (req, res) {

      var result = new Result();
      result.setResult(ProvinceEnum);
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })
    app.all("/syncData", function (req, res) {
      DaoService.syncData();
      var result = new Result();
      result.setResult("");
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })
    /**
     * 同步排名
     */
    app.all("/syncRank", function (req, res) {
      DaoService.syncRank();
      var result = new Result();
      result.setResult("");
      result.setMsg("success");
      result.setCode(0);

      res.status(200).send(result);
    })
  }
}
module.exports = UniversityController