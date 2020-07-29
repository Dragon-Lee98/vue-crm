<template>
  <div>
    <el-dialog title="添加菜单" :visible.sync="mytype" @close="clearText">
      <div>
        <el-alert v-if="rowData" title="当前选中的是子级菜单" type="info" effect="dark"></el-alert>
        <el-alert v-else title="当前选中的是一级菜单" type="info" effect="dark"></el-alert>
      </div>
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
    }
  },
  methods: {
    // 发送ajax，修改菜单
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
        // 设置父级id
        if (this.rowData == "") {
          this.form.pcode = 0;
        } else {
          this.form.pcode = this.rowData.code;
          // 删除id信息，因为存在id信息就是替换menu 现在只需要添加
          delete this.form.id;
          //  删除不需要的数据
          delete this.form.children;
          delete this.form.hidden;
          delete this.form.icon;
          delete this.form.isMenuName;
          delete this.form.levels;
          delete this.form.parentId;
          delete this.form.path;
          delete this.form.statusName;
        }
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
                this.form = {
                  name: "",
                  code: "",
                  component: "",
                  url: "",
                  ismenu: "1",
                  status: "1"
                };
              } else {
                this.$message.error(data.data.msg);
              }
              delete this.form.pid;
              delete this.form.num;
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
      this.fun("menuAdd");
    }
  }
};
</script>

<style>
</style>