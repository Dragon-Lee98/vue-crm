<template>
  <div>
    <el-dialog
      title="配置角色权限"
      :visible.sync="mytype"
      @close="clearText"
      @open="getRoleList"
      v-if="RoleListArr&&checkedIds"
    >
      <el-tree
        :data="RoleListArr"
        show-checkbox
        node-key="id"
        :default-expanded-keys="checkedIds"
        :default-checked-keys="checkedIds"
        :props="defaultProps"
        ref="roleSetAuthority"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, roleSetAuthority, roleSavePermission } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      RoleListArr: [], // 权限信息
      checkedIds: [], // 选择用户当前已有的权限
      defaultProps: {
        children: "children",
        label: "name"
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
    // 发送ajax，角色分配
    updataUser() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // 获取权限状态id数组
      var arr = [
        ...this.$refs.roleSetAuthority.getCheckedKeys(),
        ...this.$refs.roleSetAuthority.getHalfCheckedKeys()
      ];
      //  发送ajax
      this.$http
        .post(
          http + roleSavePermission,
          {
            roleId: this.rowData.id,
            permissions: arr.toString()
          },
          { emulateJSON: true }
        )
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 关闭对话框
              this.mytype = false;
            } else {
              this.$message.error(data.data.msg);
            }
            // 结束动画
            setTimeout(() => {
              loading.close();
            }, 0);
          },
          err => {}
        );
    },
    clearText() {
      // 修改父级组件的对话框状态
      this.fun("roleSetAuthority");
    },
    // 获取角色状态树信息
    getRoleList() {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get(http + roleSetAuthority, {
          params: {
            roleId: this.rowData.id
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              this.RoleListArr = data.data.data.treeData;
              this.checkedIds = data.data.data.checkedIds;
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