var SelectHeader = {
    template:
        `<el-popover placement="bottom" width="180" trigger="click">
            <el-select
            v-model="value"
            placeholder="请选择"
            clearable
            @change="changeHandler"
            >
            <el-option
                v-for="item in options"
                :key="item[defaultProps.value]"
                :label="item[defaultProps.label]"
                :value="item[defaultProps.value]"
            ></el-option>
            </el-select>
            <div slot="reference">
            <i class="el-icon-arrow-down"></i>
            </div>
        </el-popover>`,

    data: function () {
        return {
            value: ""
        };
    },
    props: {
        type: {
            type: String,
            default: ""
        },
        defaultValue: {
            type: String,
            default: ""
        },
        options: {
            type: Array,
            default: function () {
                return [];
            }
        },
        defaultProps: {
            type: Object,
            default: function () {
                return {
                    label: "label",
                    value: "value"
                };
            }
        }
    },
    watch: {
        defaultValue(newVal, oldVal) {
            let self = this;
            self.value = newVal;
        }
    },
    methods: {
        changeHandler() {
            let self = this;
            self.$emit("selectChange", { type: self.type, value: self.value });
        }
    }
}
