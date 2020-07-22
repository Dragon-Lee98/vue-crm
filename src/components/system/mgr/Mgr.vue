<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <el-button
      type="primary"
      round
      v-for="item in $store.state.user.MenuList[this.$route.path].children"
      :key="item.id"
      v-show="item.statusName == '启用'"
      @click='btn(item)'
    >{{item.name}}{{item.statusName}}</el-button>
    <!-- 搜索 -->
    <el-row class="search">
      <el-col :span="18"><div class="grid-content bg-purple-dark">
        <el-input v-model="names"></el-input>
        </div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple-dark search-btn">
        <el-button type="primary" round @click='search'>搜索</el-button>
        </div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple-dark reset-btn">
        <el-button type="primary" round @click='clearSearch'>重置</el-button>
        </div></el-col>
    </el-row>
    <MgrAdd :type='btnType.mgrAdd' :fun='showBtn'></MgrAdd>
    <!-- 信息展示 -->
    <div>
      <el-table :data="tableData" style="width: 100%" v-if="tableData" height="300" @cell-click='cellClick'>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.sexName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
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
  </div>
</template>

<script>
import { http, userList } from "../../../api/api";
// 引入添加用户的组件
import MgrAdd from './MgrAdd'
export default {
  components:{
    MgrAdd
  },
  data() {
    return {
      tableData: "", // 用户列表信息
      total: "",// 信息总条数
      names:'',// 查询的昵称
      btnType:{}, // 按钮的类型
      rowData:'', // 被点击那行的数据

    };
  },
  mounted() {
    // 获取用户列表信息，默认第一页
    this.getUserList(1);
  },
  methods: {
    // 修改对话框状态
    showBtn(type){
      this.btnType[type] = false;
    },
    // 点击列表信息的每一行
    cellClick(row){
      this.rowData = row;
    },
    // 设置按钮的类型
    setBtnType(){
      if(this.$store.state.user.MenuList[this.$route.path].children){
        var typeArr = this.$store.state.user.MenuList[this.$route.path].children;
        for(var i=0;i<typeArr.length;i++){
          // 将每个按钮的code设置为false
          this.$set(this.btnType,typeArr[i].code,false)
        }
      }
    },
    // 所有按钮的统一点击事件
    btn(item){
      // 设置按钮的类型
      this.setBtnType();
      if(item.code=='mgrAdd'){
          console.log('弹出对话框')
          this.btnType[item.code] = true;
      }else{
        if(this.rowData!=''){// 判断是否选择用户
          if(item.code=='mgrEdit'){
            console.log('修改用户')
            this.btnType[item.code] = true;
          }else if(item.code=='mgrDelete'){
            console.log('删除用户')
            this.btnType[item.code] = true;
          }else if(item.code=='mgrSetRole'){
            console.log('分配角色')
            this.btnType[item.code] = true;
          }
        }else{
          this.$message.error('请选择用户信息');
        }
      }
    },
    // 搜索
    search(){
      this.getUserList(1);
    },
    // 重置搜索框信息
    clearSearch(){
      // 清空输入框
      this.names = '';
      this.getUserList(1);
    },
    // 获取当前的页码
    pageType(page) {
      this.getUserList(page);
    },
    // 获取用户列表信息
    getUserList(page) {
      this.$http
        .get(http + userList, {
          params: {
            page:page,
            limit: 5,
            name: this.names
          }
        })
        .then(
          data => {
            // 用户列表信息
            this.tableData = data.data.data.records;
            // 用户列表信息总数
            this.total = data.data.data.total;
          },
          err => {
            // 获取数据失败
            // 重新登录
            // location.href = './login.html';
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
.search{
  margin: 20px 0;
}
.search-btn,.reset-btn{
  text-align: center;
}
</style>