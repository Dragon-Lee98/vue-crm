<template>
  <div>
    <el-dialog title="添加部门" :visible.sync="mytype" @close="clearText">
      <el-form ref="form" :model="form" label-width="80px" style="padding:10px 0;">
        <el-form-item label="部门全称">
          <el-input v-model="form.fullname"></el-input>
        </el-form-item>
        <el-form-item label="部门简称">
          <el-input v-model="form.simplename"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, dept } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      formType: {
        fullname: "", //部门全称
        simplename: "", //部门简称
      },
      form: {
        fullname: "", //部门全称
        simplename: "", //部门简称
      }
    };
  },
  props: ["type", "fun", "rowData"],
  watch: {
    type: function() {
      // 断开单向数据流
      this.mytype = this.type;
    },
    rowData: function() {
      // 浅拷贝变深拷贝
      var json = {};
      for (var i in this.rowData) {
        // 全部转换为字符串
        // this.rowData[i] = this.rowData[i].toString();
        this.$set(json, i, this.rowData[i].toString());
      }
      this.form = json;
    }
  },
  methods: {
    // 发送ajax，修改用户
    updataUser() {
      // 判断是否填写完表格
      var type = true;
      // 检查是否填写完所有数据
      for (var i in this.formType) {
        if (this.form[i] == "") {
          type = false;
        }
      }
      if (type) {
        // 设置排序
        this.form.num = 0;
        //  发送ajax
        this.$http.post(http + dept, JSON.stringify({
            simplename:this.form.simplename,
            num:this.rowData.num,
            fullname:this.form.fullname,
            pid:this.rowData.pid,
            id:this.rowData.id,
        }), { emulateJSON: true }).then(
          data => {
            if (data.data.msg == "成功") {
              // 关闭对话框
              this.mytype = false;
              // 清空表单数据
              for (var i in this.form) {
                this.form[i] = "";
              }
            } else {
              this.$message.error(data.data.msg);
            }
            delete this.form.pid;
            delete this.form.num;
          },
          err => {
            this.$message.error(err.data.message);
          }
        );
      } else {
        this.$message.error("请填写完表格");
      }
    },
    clearText() {
      // 修改父级组件的对话框状态
      this.fun("deptEdit");
    },
  }
};
</script>

<style>
</style>