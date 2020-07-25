<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <!-- 搜索 -->
    <el-row class="search">
      <el-col :span="18">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="names"></el-input>
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
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-if="tableData"
        height="300"
        @cell-click="cellClick"
        :highlight-current-row="true"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.sexName }}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span>{{ props.row.birthday }}</span>
              </el-form-item>
              <el-form-item label="部门">
                <span>{{ props.row.deptName }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱号">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.statusName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="状态" prop="statusName"></el-table-column>
      </el-table>
    </div>
    <div v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="5"
        :total="total"
        @current-change="pageType"
      ></el-pagination>
    </div>
    <!-- 功能组件 -->
    <!-- 添加用户 -->
    <MgrAdd :type="btnType.mgrAdd" :fun="showBtn"></MgrAdd>
    <!-- 修改用户信息 -->
    <MgrEdit :type="btnType.mgrEdit" :fun="showBtn" :rowData="rowData"></MgrEdit>
    <!-- 删除用户信息 -->
    <MgrDelete :type="btnType.mgrDelete" :fun="showBtn" :rowData="rowData"></MgrDelete>
    <!-- 分配角色 -->
    <MgrSetRole :type="btnType.mgrSetRole" :fun="showBtn" :rowData="rowData"></MgrSetRole>
  </div>
</template>

<script>
import { http, userList } from "../../../api/api";
// 引入添加用户的组件
import MgrAdd from "./MgrAdd";
import MgrEdit from "./MgrEdit";
import MgrDelete from "./MgrDelete";
import MgrSetRole from "./MgrSetRole";
export default {
  components: {
    MgrAdd,
    MgrEdit,
    MgrDelete,
    MgrSetRole
  },
  data() {
    return {
      tableData: "", // 用户列表信息
      total: "", // 信息总条数
      names: "", // 查询的昵称
      btnType: {}, // 按钮的类型
      rowData: "", // 当前选中的用户
      page: 1 //当前页码
    };
  },
  mounted() {
    // 获取用户列表信息，默认第一页
    this.getUserList(1);
  },
  methods: {
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取用户信息列表
      this.getUserList(this.page);
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
      if (item.code == "mgrAdd") {
        // console.log("弹出对话框");
        this.btnType[item.code] = true;
      } else {
        if (this.rowData != "") {
          // 判断是否选择用户
          if (item.code == "mgrEdit") {
            // console.log("修改用户");
            this.btnType[item.code] = true;
          } else if (item.code == "mgrDelete") {
            // console.log("删除用户");
            this.btnType[item.code] = true;
          } else if (item.code == "mgrSetRole") {
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
      this.getUserList(1);
    },
    // 重置搜索框信息
    clearSearch() {
      // 清空输入框
      this.names = "";
      this.getUserList(1);
    },
    // 获取当前的页码
    pageType(page) {
      this.page = page; // 记录当前页码
      this.getUserList(page);
    },
    // 获取用户列表信息
    getUserList(page) {
      this.$http
        .get(http + userList, {
          params: {
            page: page,
            limit: 5,
            name: this.names
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 用户列表信息
              this.tableData = data.data.data.records;
              // 用户列表信息总数
              this.total = data.data.data.total;
            } else {
              this.$message.error(data.data.msg);
            }
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
.search {
  margin: 20px 0;
}
.search-btn{
  padding-left: 10px;
}
</style>