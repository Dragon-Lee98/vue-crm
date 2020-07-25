<template>
  <div>
    <el-dialog title="修改用户" :visible.sync="mytype" @close="clearText">
      <el-form ref="form" :model="form" label-width="80px" v-if="deptListArr&&form">
        <!-- 账户 -->
        <el-form-item label="账户">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 生日 -->
        <el-form-item label="活动时间">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
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
        <!-- 状态 -->
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
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
import { http, deptList, user } from "../../../api/api";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      formType: {
        account: "", //账号
        name: "", //姓名
        birthday: "", //生日
        sex: "1", //性别
        email: "", //邮箱
        phone: "", //电话
        deptid: "", //部门id
        status: "1" //状态
      },
      form: "",
      deptListArr: [], // 部门信息
      props: {
        value: "id",
        label: "fullname",
        children: "children"
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
      var json = {}
      for (var i in this.rowData) {
        // 全部转换为字符串
        // this.rowData[i] = this.rowData[i].toString();
        this.$set(json,i,this.rowData[i].toString());
      }
      this.form = json;
    }
  },
  mounted() {
    this.getdeptList();
  },
  methods: {
    //  处理时间格式
    setTime(time){
      var time = new Date(time);
      return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
    },
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
        //  处理部门信息（只要最后一个id）
        if(Array.isArray(this.form.deptid)){// 是数组才需要取最后一个数值
          this.form.deptid = this.form.deptid[this.form.deptid.length-1];
        }
        //  处理生日时间格式
        this.form.birthday = this.setTime(this.form.birthday);
        //  发送ajax
        this.$http.post(http+user,this.form,{emulateJSON:true}).then((data)=>{
            if(data.data.msg=='成功'){
                // 关闭对话框
                this.mytype = false;
                // 清空表单数据
                for(var i in this.form){
                    this.form[i] = '';
                }
            } else {
              this.$message.error(data.data.msg);
            }
        },(err)=>{
          this.$message.error(err.data.message);
        })
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
      // 清空密码信息
      // for(var i in this.pass){
      //     this.pass[i] = '';
      // }
      // 修改父级组件的对话框状态
      this.fun("mgrEdit");
    },
    // 获取部门信息
    getdeptList() {
      this.$http.get(http + deptList).then(
        data => {
          if(data.data.msg=='成功'){
            // 赋值为处理过的部门信息数据
            this.deptListArr = this.setChildrenNull(data.data.data);
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