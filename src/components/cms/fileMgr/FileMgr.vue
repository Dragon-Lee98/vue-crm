<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
    <div style="text-align:center;">
      <el-upload
        class="upload-demo"
        drag
        :action="upfileurl"
        :headers="headers"
        :on-success="success"
        :on-error="error"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <!-- 搜索 -->
    <el-row class="search">
      <el-col :span="18">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="originalFileName" placeholder="文件名字"></el-input>
        </div>
      </el-col>
      <el-col :span="6" class="search-btn">
        <el-button type="primary" round @click="search">搜索</el-button>
        <el-button type="primary" round @click="clearSearch">重置</el-button>
      </el-col>
    </el-row>
    <!-- 信息展示 -->
    <div style="padding-bottom:10px;">
      <el-table :data="tableData" style="width: 100%" v-if="tableData" height="300">
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="文件预览">
          <template slot-scope="scope">
            <img :src="publicImg+scope.row.realFileName" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import {
  http,
  fileMgrList,
  fileDownload,
  publicImg,
  file
} from "../../../api/api";

export default {
  data() {
    return {
      tableData: "", // 文件列表信息
      total: "", // 信息总条数
      originalFileName: "", // 图片名称
      page: 1, //当前页码
      publicImg, //图片静态地址
      upfileurl: http + file, //文件上传的路径
      headers: {
        // 请求头设置
        "content-type": "multipart/form-data",
        Authorization: localStorage.token
      }
    };
  },
  mounted() {
    // 获取文件列表信息，默认第一页
    this.getFilesList(1);
  },
  methods: {
    // 图片上传成功的回调
    success(response) {
      console.log(response);
      // if (data.msg == "成功") {
      //     console.log(data);
      //     // 获取文件列表信息
      //     this.getFilesList(1);
      //   } else {
      //     this.$message.error(data.msg);
      //   }
    },
    // 图片上传失败的回调
    error(err) {
      // this.$message.error(err.message);
    },
    // 下载图片
    download(row) {
      location.href =
        http +
        fileDownload +
        "?idFile=" +
        row.id +
        "&fileName=" +
        row.originalFileName;
    },
    // 对话框关闭的回调函数，修改对话框状态
    showBtn(type) {
      this.btnType[type] = false;
      // 重新获取文件列表
      this.getFilesList(this.page);
      // 清空数据
      this.rowData = "";
    },
    // 搜索
    search() {
      this.getFilesList(1);
    },
    // 重置搜索框信息
    clearSearch() {
      // 清空输入框
      this.originalFileName = "";
      this.getFilesList(1);
    },
    // 获取当前的页码
    pageType(page) {
      this.page = page; // 记录当前页码
      this.getFilesList(page);
    },
    // 获取文件列表信息
    getFilesList(page) {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(http + fileMgrList, {
          params: {
            page: page,
            limit: 10,
            originalFileName: this.originalFileName
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 文件列表信息
              this.tableData = data.data.data.records;
              // 文件列表信息总数
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

<style scoped>
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
  margin: 5px 0;
}
.search-btn {
  padding-left: 10px;
}
</style>