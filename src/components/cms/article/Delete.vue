<template>
  <div>
    <el-dialog title="删除文章" :visible.sync="mytype" @close="clearText">
      <div>
        你确定要删除文章
        <span style="color:blue;">{{rowData.title}}</span>
        吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, article } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type // 模态框状态
    };
  },
  props: ["type", "fun", "rowData"],
  watch: {
    type: function() {
      // 断开单向数据流
      this.mytype = this.type;
    }
  },
  methods: {
    clearText() {
      this.fun("deleteArticle");
    },
    deleteUser() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .delete(http + article, {
          params: {
            id: this.rowData.id
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              this.mytype = false;
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
</style>