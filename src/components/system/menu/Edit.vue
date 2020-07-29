<template>
  <div>
    <el-dialog title="修改菜单" :visible.sync="mytype" @close="clearText">
      <el-form ref="form" :model="form" label-width="100px" style="padding:10px 0;">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="是否是菜单">
          <el-radio-group v-model="form.ismenu">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">弃用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, menu } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      formType: {
        name: "",
        code: "",
        component: "",
        url: "",
        ismenu: "1",
        status: "1"
      },
      form: {
        name: "",
        code: "",
        component: "",
        url: "",
        ismenu: "1",
        status: "1"
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
        // 开启动画
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 设置排序
        this.form.num = 0;
        //  发送ajax
        this.$http
          .post(http + menu, JSON.stringify(this.form), { emulateJSON: true })
          .then(
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
              // 结束动画
              setTimeout(() => {
                loading.close();
              }, 0);
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
      this.fun("menuEdit");
    }
  }
};
</script>

<style>
</style>