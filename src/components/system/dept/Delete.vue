<template>
  <div>
    <el-dialog title="删除部门" :visible.sync="mytype" @close="clearText">
      <div>
        你确定要删除角色
        <span style="color:blue;">{{rowData.fullname}}</span>
        吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, dept } from "../../../api/api";
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
      this.fun("deptDelete");
    },
    deleteUser() {
      this.$http
        .delete(http + dept, {
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