<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <!-- 搜索 -->
    <div>
      <el-button type="primary" round @click="search">搜索</el-button>
      <el-button type="primary" round @click="clearSearch">重置</el-button>
    </div>
    <el-row class="search">
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="title" placeholder="标题"></el-input>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="author" placeholder="作者"></el-input>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="grid-content bg-purple-dark">
          <el-date-picker
            v-model="dates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMddHHmmss"
          ></el-date-picker>
        </div>
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
        style="width: 100%;"
        v-if="tableData"
        height="300"
        @cell-click="cellClick"
        :highlight-current-row="true"
      >
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
    </div>
    <div v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="total"
        @current-change="pageType"
      ></el-pagination>
    </div>
    <!-- 功能组件 -->
    <Edit :type="btnType.update" :fun="showBtn" :rowData="rowData"></Edit>
    <Delete :type="btnType.deleteArticle" :fun="showBtn" :rowData="rowData"></Delete>
  </div>
</template>

<script>
import { http, articleList } from "../../../api/api";

import Edit from "./Edit";
import Delete from "./Delete";
export default {
  components: {
    Edit,
    Delete
  },
  data() {
    return {
      tableData: "", // 文章列表信息
      total: "", // 信息总条数
      names: "", // 查询的昵称
      btnType: {}, // 按钮的类型
      rowData: "", // 当前选中的用户
      page: 1, // 当前页码
      dates: [], // 开始结束时间
      title: "", // 标题
      author: "" // 作者
    };
  },
  mounted() {
    // 获取文章列表信息，默认第一页
    this.getAriticleList(1);
  },
  methods: {
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取文章信息列表
      this.getAriticleList(this.page);
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
      if (this.rowData != "") {
        // 判断是否选择用户
        if (item.code == "update") {
          this.btnType[item.code] = true;
        } else if (item.code == "deleteArticle") {
          this.btnType[item.code] = true;
        }
      } else {
        this.$message.error("请选择文章信息");
      }
    },
    // 搜索
    search() {
      this.getAriticleList(1);
    },
    // 重置搜索框信息
    clearSearch() {
      // 清空输入框
      this.title = "";
      this.author = "";
      this.dates = [];
      this.getAriticleList(1);
    },
    // 获取当前的页码
    pageType(page) {
      this.page = page; // 记录当前页码
      this.getAriticleList(page);
    },
    // 获取文章列表信息
    getAriticleList(page) {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(http + articleList, {
          params: {
            page: page,
            limit: 10,
            title: this.title,
            author: this.author,
            startDate: this.dates[0],
            endDate: this.dates[1]
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 文章列表信息
              this.tableData = data.data.data.records;
              // 文章列表信息总数
              this.total = data.data.data.total;
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
.search {
  margin: 20px 0;
}
</style>