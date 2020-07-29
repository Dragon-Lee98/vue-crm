<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="mytype" @close="clearText">
      <el-form ref="form" :model="form" label-width="80px" v-if="deptListArr">
        <!-- 角色名称 -->
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 角色编码 -->
        <el-form-item label="角色编码">
          <el-input v-model="form.tips"></el-input>
        </el-form-item>
        <!-- 部门 -->
        <el-form-item label="部门">
          <el-cascader
            v-model="form.deptid"
            :options="deptListArr"
            :show-all-levels="false"
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, deptList, role } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      form: {
        name: "", //角色名称
        tips: "", //角色编码
        deptid: "" //部门id
      },
      deptListArr: [], // 部门信息
      props: {
        value: "id",
        label: "fullname",
        children: "children"
      }
    };
  },
  props: ["type", "fun"],
  watch: {
    type: function() {
      // 断开单向数据流
      this.mytype = this.type;
    }
  },
  mounted() {
    this.getdeptList();
  },
  methods: {
    // 发送ajax，添加用户
    updataUser() {
      // 判断是否填写完表格
      var type = true;
      // 检查是否填写完所有数据
      for (var i in this.form) {
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
        // 父级id
        this.form.pid = this.$store.state.user.info.profile.roleid;
        // num排序
        this.form.num = 1;
        //  处理部门信息（只要最后一个id）
        this.form.deptid = this.form.deptid[this.form.deptid.length - 1];
        //  发送ajax
        this.$http
          .post(http + role, JSON.stringify(this.form), { emulateJSON: true })
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
    // 递归函数，处理部门信息中children为空
    setChildrenNull(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.setChildrenNull(data[i].children);
        }
      }
      return data;
    },
    clearText() {
      // 修改父级组件的对话框状态
      this.fun("roleAdd");
    },
    // 获取部门信息
    getdeptList() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.get(http + deptList).then(
        data => {
          if (data.data.msg == "成功") {
            // 赋值为处理过的部门信息数据
            this.deptListArr = this.setChildrenNull(data.data.data);
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