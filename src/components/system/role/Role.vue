<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <!-- 搜索 -->
    <el-row class="search">
      <el-col :span="18">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="names" placeholder="角色名字"></el-input>
        </div>
      </el-col>
      <el-col :span="6" class="search-btn">
        <el-button type="primary" round @click="search">搜索</el-button>
        <el-button type="primary" round @click="clearSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-button
      type="primary"
      round
      v-for="item in $store.state.user.MenuList[this.$route.path].children"
      :key="item.id"
      v-show="item.statusName == '启用'"
      @click="btn(item)"
    >{{item.name}}{{item.statusName}}</el-button>
    <!-- 信息展示 -->
    <div style="padding:20px 0;">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-if="tableData"
        height="400"
        @cell-click="cellClick"
        :highlight-current-row="true"
      >
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="部门" prop="deptName"></el-table-column>
        <el-table-column label="id名称" prop="id"></el-table-column>
      </el-table>
    </div>
    <!-- 功能组件 -->

    <Add :type="btnType.roleAdd" :fun="showBtn"></Add>
    <Edit :type="btnType.roleEdit" :fun="showBtn" :rowData="rowData"></Edit>
    <Delete :type="btnType.roleDelete" :fun="showBtn" :rowData="rowData"></Delete>
    <SetAuthority :type="btnType.roleSetAuthority" :fun="showBtn" :rowData="rowData"></SetAuthority>
  </div>
</template>

<script>
import { http, getRoleList } from "../../../api/api";
// 引入添加用户的组件
import Add from "./Add";
import Edit from "./Edit";
import Delete from "./Delete";
import SetAuthority from "./SetAuthority";
export default {
  components: {
    Add,
    Edit,
    Delete,
    SetAuthority
  },
  data() {
    return {
      tableData: "", // 用户列表信息
      total: "", // 信息总条数
      names: "", // 查询的昵称
      btnType: {}, // 按钮的类型
      rowData: "" // 当前选中的用户
    };
  },
  mounted() {
    // 获取角色列表
    this.getRoleList();
  },
  methods: {
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取角色列表
      this.getRoleList();
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
      if (item.code == "roleAdd") {
        // console.log("弹出对话框");
        this.btnType[item.code] = true;
      } else {
        if (this.rowData != "") {
          // 判断是否选择用户
          if (item.code == "roleEdit") {
            // console.log("修改用户");
            this.btnType[item.code] = true;
          } else if (item.code == "roleDelete") {
            // console.log("删除用户");
            this.btnType[item.code] = true;
          } else if (item.code == "roleSetAuthority") {
            // console.log("分配角色");
            this.btnType[item.code] = true;
          }
        } else {
          this.$message.error("请选择用户信息");
        }
      }
    },
    // 搜索
    search() {
      this.getRoleList();
    },
    // 重置搜索框信息
    clearSearch() {
      // 清空输入框
      this.names = "";
      this.getRoleList();
    },
    // 获取角色列表
    getRoleList() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(http + getRoleList, {
          params: {
            name: this.names
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 获取角色列表
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
            console.log(err);
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
.search {
  margin: 0 0 20px 0;
}
.search-btn {
  padding-left: 10px;
}
</style>