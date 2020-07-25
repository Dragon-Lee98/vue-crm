<template>
  <div>
    <el-dialog title="角色分配" :visible.sync="mytype" @close="clearText">
      选择角色：
      <el-select v-model="form.roleid" placeholder="请选择">
        <el-option v-for="item in RoleListArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, roleTreeList, setRole } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      form: {
        roleid: ""
      },
      RoleListArr: [] // 角色信息
    };
  },
  props: ["type", "fun", "rowData"],
  watch: {
    type: function() {
      // 断开单向数据流
      this.mytype = this.type;
    },
    rowData: function() {
      this.form.roleid = this.rowData.roleid;
    }
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 发送ajax，角色分配
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
        //  发送ajax
        this.$http
          .get(http + setRole, {
            params: {
              userId: this.rowData.id,
              roleIds: this.form.roleid
            }
          })
          .then(
            data => {
              if (data.data.msg == "成功") {
                // 关闭对话框
                this.mytype = false;
              } else {
                this.$message.error(data.data.msg);
              }
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
      this.fun("mgrSetRole");
    },
    // 获取角色信息
    getRoleList() {
      this.$http
        .get(http + roleTreeList, {
          params:{
            idUser:this.$store.state.user.info.profile.id
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              this.RoleListArr = data.data.data.treeData;
            } else {
              this.$message.error(data.data.msg);
            }
          },
          err => {
            this.$message.error(err.data.message);
            console.log(err)
          }
        );
    }
  }
};
</script>

<style>
</style>