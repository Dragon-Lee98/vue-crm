<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <el-button
      type="primary"
      round
      v-for="item in $store.state.user.MenuList[this.$route.path].children"
      :key="item.id"
      v-show="item.statusName == '启用'"
      @click="btn(item)"
    >{{item.name}}{{item.statusName}}</el-button>
    <!-- 信息展示 -->
    <div class="data-form" v-if="tableData">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        :tree-props="{children: 'children'}"
        @cell-click="cellClick"
        :highlight-current-row="true"
        height="400"
      >
        <el-table-column prop="name" label="菜单名称" sortable width="180"></el-table-column>
        <el-table-column prop="component" label="链接标识" sortable width="180"></el-table-column>
        <el-table-column prop="isMenuName" label="是否是菜单"></el-table-column>
        <el-table-column :formatter="cellname" prop="status" label="状态"></el-table-column>
        <el-table-column prop="id" label="菜单id"></el-table-column>
      </el-table>
    </div>
    <!-- 功能组件 -->

    <Add :type="btnType.menuAdd" :fun="showBtn" :rowData="rowData"></Add>

    <Edit :type="btnType.menuEdit" :fun="showBtn" :rowData="rowData"></Edit>

    <Delete :type="btnType.menuDelete" :fun="showBtn" :rowData="rowData"></Delete>
  </div>
</template>

<script>
import { http, menulist } from "../../../api/api";
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
      tableData: "", // 菜单列表信息
      btnType: {}, // 按钮的类型
      rowData: "" // 当前选中的用户
    };
  },
  mounted() {
    // 获取菜单信息
    this.getMenuList();
  },
  methods: {
    // 状态码=》状态
    cellname(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "弃用";
      } else if (cellValue == 1) {
        return "启用";
      } else if (cellValue == 2) {
        return "删除";
      }
    },
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取菜单信息
      this.getMenuList();
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
      if (item.code == "menuAdd") {
        // console.log("弹出对话框");
        this.btnType[item.code] = true;
      } else {
        if (this.rowData != "") {
          // 判断是否选择用户
          if (item.code == "menuEdit") {
            // console.log("修改用户");
            this.btnType[item.code] = true;
          } else if (item.code == "menuDelete") {
            // console.log("删除用户");
            this.btnType[item.code] = true;
          }
        } else {
          this.$message.error("请选择用户信息");
        }
      }
    },
    // 获取菜单列表信息
    getMenuList() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.get(http + menulist).then(
        data => {
          if (data.data.msg == "成功") {
            // 菜单列表信息
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
</style>