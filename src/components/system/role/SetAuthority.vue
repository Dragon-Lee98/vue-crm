<template>
  <div>
    <el-dialog title="配置权限" :visible.sync="mytype" @close="clearText" @open="getRoleList" v-if="RoleListArr&&checkedIds">
        <el-tree
        :data="RoleListArr"
        show-checkbox
        node-key="id"
        :default-expanded-keys="checkedIds"
        :default-checked-keys="checkedIds"
        :props="defaultProps"
        ref="roleSetAuthority">
        </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, roleSetAuthority, setRole } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      form: {
        roleid: ""
      },
      RoleListArr: [], // 权限信息
      checkedIds:[], // 选择用户当前已有的权限
      defaultProps: {
            children: 'children',
            label: 'name'
        },
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
  methods: {
    // 发送ajax，角色分配
    updataUser() {
        // 获取权限状态id数组
        // this.$refs.roleSetAuthority
        console.log("updataUser -> this.$refs.roleSetAuthority", this.$refs.roleSetAuthority.getCheckedNodes(false,true))
        // //  发送ajax
        // this.$http
        //   .get(http + setRole, {
        //     params: {
        //       userId: this.rowData.id,
        //       roleIds: this.form.roleid
        //     }
        //   })
        //   .then(
        //     data => {
        //       if (data.data.msg == "成功") {
        //         // 关闭对话框
        //         this.mytype = false;
        //       } else {
        //         this.$message.error(data.data.msg);
        //       }
        //     },
        //     err => {
        //       this.$message.error(err.data.message);
        //     }
        //   );

    },
    clearText() {
      // 修改父级组件的对话框状态
      this.fun("roleSetAuthority");
    },
    // 获取角色状态树信息
    getRoleList() {
      this.$http
        .get(http + roleSetAuthority, {
          params:{
            roleId:this.rowData.id
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
                console.log(data)
              this.RoleListArr = data.data.data.treeData;
              this.checkedIds = data.data.data.checkedIds;
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