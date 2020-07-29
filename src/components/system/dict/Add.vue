<template>
  <div>
    <el-dialog title="添加字典" :visible.sync="mytype" @close="clearText">
      <el-form ref="form" :model="form" label-width="80px" style="padding:10px 0;">
        <el-form-item label="字典名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <div v-show="status.length">
          <div>字典详情</div>
          <el-row :gutter="20" v-for="(item,index) in status" :key="index">
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="状态码">
                  <el-input v-model="item.status"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="含义">
                  <el-input v-model="item.content"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-button type="danger" @click="status.splice(index,1)">移除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDetail">添加字典详情</el-button>
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, dict } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      formType: {
        name: ""
      },
      form: {
        name: ""
      },
      status: []
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
    // 处理字典详情格式
    codeStatus(data) {
      // 编码
      let str = "";
      for (var i = 0; i < data.length; i++) {
        str += data[i].status + ":" + data[i].content + ";";
      }
      return str;
    },
    // 添加字典详情
    addDetail() {
      this.status.push({ status: "", content: "" });
    },
    // 发送ajax，修改字典
    updataUser() {
      // 判断是否填写完表格
      var type = true;
      // 检查是否填写完所有数据
      for (var i in this.formType) {
        if (this.form[i] == ""||this.status.length==0) {
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
        //  发送ajax
        this.$http
          .post(
            http + dict,
            {
              dictName: this.form.name,
              dictValues: this.codeStatus(this.status)
            },
            { emulateJSON: true }
          )
          .then(
            data => {
              if (data.data.msg == "成功") {
                // 关闭对话框
                this.mytype = false;
                // 清空表单数据
                for (var i in this.form) {
                  this.form[i] = "";
                }
                // 清空字典详细数组
                this.status = [];
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
      this.fun("dictAdd");
    }
  }
};
</script>

<style>
</style>