<template>
  <div id="login">
    <div class="login">
      <el-form ref="form" :model="login" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="login.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="login.pass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {http,login} from './api/api'
export default {
  data(){
    return{
      login:{
        user:'',
        pass:''
      }
    }
  },
  methods:{
    // 登录操作
    onSubmit(){
      // 这是一个小小的验证
      if(this.login.user==''){
        this.$message.error('请输入账号');
      }else if(this.login.pass==''){
        this.$message.error('请输入密码');
      }else{
        // 发送ajax
        this.$http.post(http+login,{
          username:this.login.user,
          password:this.login.pass
        }).then((data)=>{
          if(data.data.msg=='成功'){
            // 本地存储token
            localStorage.token = data.data.data.token;
            // 跳转到主页
            location.href = '/';
          }else if(data.data.msg=='用户名或密码错误'){
            this.$message.error('用户名或密码错误');
          }
        },(err)=>{
          // 登录失败
          this.$message.error('登录失败');
        })
      }
    }
  }
};
</script>

<style scoped>
.login{
  width: 500px;
  margin: 150px auto;
}
</style>