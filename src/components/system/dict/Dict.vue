<template>
  <div>
    <el-row class="search">
      <el-col :span="18">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="names" placeholder="字典名字"></el-input>
        </div>
      </el-col>
      <el-col :span="6" class="search-btn">
        <el-button type="primary" round @click="search">搜索</el-button>
        <el-button type="primary" round @click="clearSearch">重置</el-button>
      </el-col>
    </el-row>
    <div v-if="$store.state.user.MenuList[this.$route.path]" class="btn">
      <el-button
        type="primary"
        round
        v-for="item in $store.state.user.MenuList[this.$route.path].children"
        :key="item.id"
        v-show="item.statusName == '启用'"
        @click="btn(item)"
      >{{item.name}}{{item.statusName}}</el-button>
    </div>
    <!-- 信息展示 -->
    <div class="data-form">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-if="tableData"
        row-key="id"
        border
        :tree-props="{children: 'children'}"
        @cell-click="cellClick"
        :highlight-current-row="true"
        max-height="300"
      >
        <el-table-column prop="name" label="字典名称"></el-table-column>
        <el-table-column prop="detail" label="备注详情"></el-table-column>
        <el-table-column prop="id" label="字典id"></el-table-column>
      </el-table>
    </div>
    <!-- 功能组件 -->
    <Add :type="btnType.dictAdd" :fun="showBtn" :rowData="rowData"></Add>
    <Edit :type="btnType.dictEdit" :fun="showBtn" :rowData="rowData"></Edit>
    <Delete :type="btnType.dictDelete" :fun="showBtn" :rowData="rowData"></Delete>
  </div>
</template>

<script>
import { http, dictList } from "../../../api/api";
// 引入添加用户的组件
import Add from "./Add";
import Edit from "./Edit";
import Delete from "./Delete";
export default {
  components: {
    Add,
    Edit,
    Delete
  },
  data() {
    return {
      names: "", // 搜索的名称
      tableData: "", // 字典列表信息
      btnType: {}, // 按钮的类型
      rowData: "" // 当前选中的字典
    };
  },
  mounted() {
    // 获取字典信息
    this.getDictList();
  },
  methods: {
    // 搜索
    search() {
      this.getDictList(this.names);
      // 清空搜索栏
      this.name = "";
    },
    clearSearch() {
      // 清空搜索栏
      this.name = "";
      this.getDictList(this.names);
    },
    // 重置
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取部门信息
      this.getDictList();
      // 清空数据
      this.rowData = "";
    },
    // 点击列表信息的每一行
    cellClick(row) {
      this.rowData = row;
    },
    // 设置按钮的类型
    setBtnType() {
      if (this.$store.state.user.MenuList[this.$route.path].children) {
        var typeArr = this.$store.state.user.MenuList[this.$route.path]
          .children;
        for (var i = 0; i < typeArr.length; i++) {
          // 将每个按钮的code设置为false
          this.$set(this.btnType, typeArr[i].code, false);
        }
      }
    },
    // 所有按钮的统一点击事件
    btn(item) {
      // 设置按钮的类型
      this.setBtnType();
      if (item.code == "dictAdd") {
        this.btnType[item.code] = true;
      } else {
        if (this.rowData != "") {
          // 判断是否选择字典
          if (item.code == "dictEdit") {
            this.btnType[item.code] = true;
          } else if (item.code == "dictDelete") {
            this.btnType[item.code] = true;
          }
        } else {
          this.$message.error("请选择字典信息");
        }
      }
    },
    // 获取字典列表信息
    getDictList(name) {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(http + dictList, {
          params: {
            name
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 字典列表信息
              this.tableData = data.data.data;
            } else {
              this.$message.error(data.data.msg);
            }
            // 结束动画
            setTimeout(() => {
              loading.close();
            }, 0);
          },
          err => {
            this.$message.error(err.data.message);
          }
        );
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.data-form {
  margin-top: 10px;
}
.search {
  margin: 20px 0;
}
.search-btn {
  padding-left: 10px;
}
</style>