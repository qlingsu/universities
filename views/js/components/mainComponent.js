var mainComponent = {
    template:
        `<div>
            <el-dialog :visible.sync="dialogVisible" width="300" :title="title">
                <el-form label-position="left" ref="form" :model="form" label-width="100px">
                    <el-form-item label="省份">
                        <el-select v-model="form.province" placeholder="请选择省份">
                            <el-option v-for="item in provinces" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input v-model="form.city"></el-input>
                    </el-form-item>
                    <el-form-item label="高校">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="学校档次">
                        <el-select v-model="form.level" placeholder="请选择学校档次">
                            <el-option v-for="item in levels" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站地址">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item label="是否已投递">
                        <el-switch v-model="form.status"></el-switch>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="是否排除">
                        <el-switch v-model="form.except"></el-switch>
                    </el-form-item>
                </el-form>
                <div style="text-align: center;">
                    <el-button type="primary" @click="handleAdd" v-show="source=='revise'||source=='add'">提交</el-button>
                    <el-button @click="dialogVisible=false">取消</el-button>
                </div>
            </el-dialog>



            <div >
                <div style="margin-top: 20px;margin-left: 10px;">
                    <div style="display:flex;">
                        <el-input v-model="searchText" style="width:260px;" placeholder="请输入高校名称" clearable @keyup.enter.native="searchEvent"></el-input>
                        
                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>省份:</span>
                            <el-select style="margin-left:10px;" v-model="searchProvince" placeholder="请选择省份"  @change="provinceEvent">
                                <el-option label="暂无选择" value=""></el-option>
                                <el-option v-for="item in provinces" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </div>

                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>城市:</span>
                            <el-select style="margin-left:10px;" v-model="searchCity" placeholder="请选择城市"  >
                                <el-option label="暂无选择" value=""></el-option>
                                <el-option v-for="item in cities" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </div>

                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>类型:</span>
                            <el-select style="margin-left:10px;" multiple collapse-tags v-model="searchType" placeholder="请选择类型"  >
                                <el-option v-for="item in types" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div style="display:flex; margin-top: 20px;">
                        <el-radio-group v-model="searchStatus"  @change="radioGroupEvent">
                            <el-radio-button label="">全部</el-radio-button>
                            <el-radio-button label="0">未投递</el-radio-button>
                            <el-radio-button label="1">已投递</el-radio-button>
                        </el-radio-group>

                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>只看本科：</span>
                            <el-switch v-model="searchLevel"></el-switch>
                        </div>

                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>只看有排名：</span>
                            <el-switch v-model="searchRank"></el-switch>
                        </div>

                        <div style="margin-left:20px;display: flex;align-items: center;">
                            <span>显示已排除：</span>
                            <el-switch v-model="searchExcept" ></el-switch>
                        </div>

                        <el-button type="primary" @click="searchEvent" style="margin-left:20px;">搜索</el-button>
                        <el-button type="primary" @click="addEvent" style="margin-left:20px;">新建</el-button>
                    </div>
                </div>

                <el-table :data="dataTable" style="width: 100%" :row-class-name="rowClassName">
                    <el-table-column prop="name" label="高校名称" width="180" :show-overflow-tooltip="showOverflowTooltip"></el-table-column>
                    <el-table-column prop="province" label="省份" width="100" :show-overflow-tooltip="showOverflowTooltip"></el-table-column>
                    <el-table-column prop="city" label="城市" width="80" :show-overflow-tooltip="showOverflowTooltip"></el-table-column>
                    
                    <el-table-column  label="网站地址"  :show-overflow-tooltip="showOverflowTooltip">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
                        </template>
                    </el-table-column>
                    <!--
                    <el-table-column prop="createTime" sortable label="条目创建时间" width="200" :show-overflow-tooltip="showOverflowTooltip"></el-table-column>
                    -->
                    <el-table-column label="状态" width="100" :show-overflow-tooltip="showOverflowTooltip" >
                        <template slot-scope="scope">
                            <div v-show="scope.row.status==true" style="color:green;">已投递</div>
                            <div v-show="scope.row.status!=true" style="color:red;">未投递</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="全国排名" prop="rankInAll" width="80">
                    </el-table-column>
                    <el-table-column label="省内排名" prop="rankInProvince" width="80">
                    </el-table-column>
                    <el-table-column label="类型" prop="type" width="80">
                    </el-table-column>
                    <el-table-column label="类型排名" prop="rankInType" width="80">
                    </el-table-column>
                    
                    <el-table-column label="操作" width="260">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleDetail(scope.row)">查看详情</el-button>
                            <el-button size="mini" @click="handleRevise(scope.row)" type="primary">修改</el-button>
                            <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
                            </template>
                    </el-table-column>
                </el-table>
                    
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div> 
        `,
    data: function () {
        return {
            dataTable: [],

            pageSize: 10,
            pageNum: 1,
            total: 0,

            searchText: "",//搜索内容
            searchProvince: "",
            searchCity: "",
            searchType: [],
            searchStatus: "",
            searchLevel: true,
            searchExcept: true,//true---查看包括已排除 false---查看不包括以排除
            searchRank: false,//true---只看有排名

            loading: false,

            dialogVisible: false,
            title: "",
            provinces: [],//省份//下拉列表选择用
            cities: [],//城市//下拉列表使用
            levels: [],//学校档次
            form: {
                id: "",//id
                province: "",//省份
                city: "",//城市
                name: "",//高校名称
                level: "",//档次 
                url: "",//网站地址
                status: "",//0---未投递 1---已投递
                createTime: "",//创建时间
                remark: "",//备注
                except: ""//是否排除
            },
            source: "",//revise---修改 detail---详情 add---添加
            logoUrl: window.config.logoUrl,

            showOverflowTooltip: true,

            types: [
                { label: "财经", value: "财经" },
                { label: "师范", value: "师范" },
                { label: "理工", value: "理工" },
                { label: "综合", value: "综合" },
                { label: "医药", value: "医药" },
                { label: "农林", value: "农林" },
                { label: "民族", value: "民族" },
                { label: "文法", value: "文法" },
                { label: "艺术", value: "艺术" },
                { label: "体育", value: "体育" },
                { label: "其他", value: "其他" }
            ]

        }
    },
    created: function () {
        var self = this;
        // 添加请求拦截器
        axios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            if (config.method == 'post') {
                if (typeof config.data == "string") {
                    // var extendParams = "mysqlId=" + self.mysqlId + "&tenantId=" + self.tenantId
                    // if (config.data.length == 0) {
                    //     config.data = extendParams;
                    // } else {
                    //     config.data = config.data + "&" + extendParams;
                    // }
                }
            } else if (config.method == 'get') {
                if (!config.params) {
                    // config.params = {};
                    // config.params.mysqlId = self.mysqlId;
                    // config.params.tenantId = self.tenantId;
                } else {
                    // config.params.mysqlId = config.params.mysqlId || self.mysqlId;
                    // config.params.tenantId = config.params.tenantId || self.tenantId;
                }
            }
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });
    },
    mounted: function () {
        var self = this;
        self.getProvinceEnum();
        self.getLevelEnum();
        //请求数据
        self.getList();
    },
    watch: {
        '$route'(to, from) {
            // 对路由变化作出响应...
            // var self = this;
        }
    },
    methods: {
        addEvent: function () {
            var self = this;
            self.dialogVisible = true;
            self.title = "新建";
            self.source = "add";
            self.form = {};
        },
        radioGroupEvent: function () {
            var self = this;
            self.pageNum = 1;
            self.getList();
        },
        provinceEvent: function () {
            let self = this;
            self.cities = [];
            self.searchCity = "";
            self.searchProvince && axios
                .get("/findCityByProvince", {
                    params: {
                        province: self.searchProvince
                    }
                })
                .then(function (data) {
                    var result = data.data;
                    if (result.code == "0") {
                        self.cities = result.result;
                    }
                })
        },
        /**
         *  学校档次枚举
         */
        getLevelEnum() {
            var self = this;
            axios.get("/getLevelEnum", {
                params: {}
            }).then(function (data) {
                var result = data.data;
                if (result.code == "0") {
                    self.levels = result.result;
                }
            })
        },
        /**
         * 省份枚举
         */
        getProvinceEnum() {
            var self = this;
            axios.get("/getProvinceEnum", {
                params: {}
            }).then(function (data) {
                var result = data.data;
                if (result.code == "0") {
                    self.provinces = result.result;
                }
            })
        },
        /**
         * 搜索事件
         */
        searchEvent: function () {
            var self = this;
            self.pageNum = 1;
            self.getList();
        },
        /**
         * 每页显示数目变化 事件
         */
        handleSizeChange: function (pageSize) {
            var self = this;
            self.pageSize = pageSize;
            self.getList();
        },
        /**
         * 提交
         */
        handleAdd: function () {
            var self = this;
            self.showAddBtn = true;
            self.form.status = self.form.status ? "1" : "0";
            self.form.except = self.form.except ? "1" : "0";
            if (self.source == "add") {
                axios.get("/add", {
                    params: self.form
                }).then(function (data) {
                    var result = data.data;
                    self.getList();
                    self.dialogVisible = false;
                    if (result.code == "0") {

                    } else if (result.code == "-1") {
                        self.$message({
                            message: "该条目已经存在,马上定位",
                            type: "warning",
                            showClose: true,
                            duration: 2000
                        })
                        self.searchText = self.form.name;
                        self.getList();
                    }
                })
            } else if (self.source == "revise") {
                axios.get("/update", {
                    params: self.form
                }).then(function (data) {
                    var result = data.data;
                    self.getList();
                    self.dialogVisible = false;
                })
            }
        },
        /**
         * 查看详情
         * @param {*} row 
         */
        handleRevise: function (row) {
            var self = this;
            self.source = "revise";
            axios.get("/detail", {
                params: {
                    id: row.id,
                    pageNum: self.pageNum,
                    pageSize: self.pageSize
                }
            }).then(function (data) {
                var result = data.data;
                self.dialogVisible = true;
                self.title = "修改";
                if (result.code == "0") {
                    self.form = result.result[0];
                    self.form.status = self.form.status == "1" ? true : false;
                    self.form.except = self.form.except == "1" ? true : false;
                } else {
                    self.form = {};
                }
            })
        },
        /**
         * 查看详情
         * @param {*} row 
         */
        handleDetail: function (row) {
            var self = this;
            self.source = "detail";
            axios.get("/detail", {
                params: {
                    id: row.id,
                    pageNum: self.pageNum,
                    pageSize: self.pageSize
                }
            }).then(function (data) {
                var result = data.data;
                self.dialogVisible = true;
                self.title = "查看详情";
                if (result.code == "0") {
                    self.form = result.result[0];
                    self.form.status = self.form.status == "1" ? true : false;
                    self.form.except = self.form.except == "1" ? true : false;
                } else {
                    self.form = {};
                }
            })
        },
        handleDelete: function (row) {
            var self = this;
            self.$confirm("确定删除码？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                axios.get("/delete", {
                    params: {
                        id: row.id,
                    }
                }).then(function (data) {
                    var result = data.data;
                    self.getList();
                    if (result.code == "0") {

                    } else {

                    }
                })
            }).catch(function () {

            })
        },
        /**
         * 当前页码变化 事件
         */
        handleCurrentChange: function (pageNum) {
            var self = this;
            self.getList();
        },

        /**
         * 获取列表
         */
        getList: function () {
            var self = this;

            axios.get("/getList", {
                params: {
                    pageNum: self.pageNum,
                    pageSize: self.pageSize,
                    searchText: self.searchText,
                    searchProvince: self.searchProvince,
                    searchCity: self.searchCity,
                    searchType: self.searchType ? self.searchType : [],
                    searchStatus: self.searchStatus,
                    searchLevel: self.searchLevel ? "1" : "0",//true传1 代表只看本科
                    searchExcept: self.searchExcept ? "1" : "0",//包括已排除---传1 不包括已排除---传0
                    searchRank: self.searchRank ? "1" : "0"
                }
            }).then(function (data) {
                var result = data.data;
                if (result.code == "0") {
                    self.dataTable = result.result.rows;
                    self.total = result.result.total;
                    self.dataTable.forEach((row) => {
                        row.province = self.replaceProvince(row.province);
                    })
                } else {
                    self.dataTable = [];
                }
            })
        },
        replaceProvince(number) {
            let self = this;
            let province = self.provinces.find(function (province) {
                return province.value == number
            })
            return province ? province.label : "";
        },
        /**
         * 重置数据
         */
        resetData: function () {
            var self = this;
            self.dataTable = [];
            self.pageSize = 10;
            self.pageNum = 1;
            self.total = 0;
            self.searchText = "";
        },
        //渲染**的tableheader
        renderHeader(createElement, { column, $index }) {
            let self = this;

            //该列的绑定数据
            console.log(column);
            //列号
            console.log($index);

            return createElement(
                "div",
                {
                    style: "display:flex;align-items: center;"
                },
                [
                    createElement("div", {
                        domProps: {
                            innerHTML: column.label
                        }
                    }),
                    createElement(SelectHeader, {
                        style: "cursor: pointer;display: flex;",
                        // 组件 prop
                        props: {
                            type: "specId",
                            options: self.levels, //下拉框选项
                            defaultValue: "0", //默认值
                            defaultProps: {
                                value: "value",
                                label: "label"
                            }
                        },
                        // 事件监听器在 `on` 属性内，
                        // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
                        // 需要在处理函数中手动检查 keyCode。
                        on: {
                            selectChange: self.selectChange
                            // click: this.clickHandler
                        },
                        // 仅用于组件，用于监听原生事件，而不是组件内部使用
                        // `vm.$emit` 触发的事件。
                        nativeOn: {
                            // click: this.nativeClickHandler
                        }
                    })
                ]
            );
        },
        //选择框回调
        selectChange() {
            var self = this;
            self.getList();

        },
        //给行赋值，排除的行给个颜色
        rowClassName({ row, rowIndex }) {
            // console.log("rowClassName", row);
            if (row.except == "1") {
                return "except-row";
            } else {
                return "";
            }
        }
    }
}