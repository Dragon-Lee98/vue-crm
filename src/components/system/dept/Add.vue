<template>
  <div>
    <el-dialog title="添加部门" :visible.sync="mytype" @close="clearText">
      <div>
        <el-alert v-if="rowData" :title='"当前选择的是 "+rowData.fullname+" 下的部门，如果需要创建公司级别的请取消选择"' type="info" effect="dark"></el-alert>
        <el-alert v-else title="当前选择的是 公司 级别部门，如果需要创建部门级别的请选择创建的父级部门" type="info" effect="dark"></el-alert>
      </div>
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
  },
  methods: {
    // 发送ajax，修改部门
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
        // 设置父级id
        if(this.rowData ==''){
            this.form.pid = 0;
        }else{
          this.form.pid = this.rowData.id;
          // 删除id信息，因为存在id信息就是替换部门 现在只需要添加   
          delete this.form.id;
          //  删除不需要的数据
          delete this.form.children;
          delete this.form.createBy;
          delete this.form.createTime;
          delete this.form.modifyBy;
          delete this.form.modifyTime;
          delete this.form.pids;
          delete this.form.tips;
          delete this.form.version;
        }
        // 设置排序
        this.form.num = 0;
        // 开启动画
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        //  发送ajax
        this.$http.post(http + dept, JSON.stringify(this.form), { emulateJSON: true }).then(
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
      this.fun("deptAdd");
    },
  }
};
</script>

<style>
</style>