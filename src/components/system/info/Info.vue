<template>
  <div class="info">
    <!-- {{$store.state.user.info.profile}} -->
      <p>账号：{{$store.state.user.info.profile.account}}</p>
      <p>密码：<span @click='type = true' class="change">修改密码</span></p>
      <p>姓名：{{$store.state.user.info.profile.name}}</p>
      <p>生日：{{$store.state.user.info.profile.birthday}}</p>
      <p>性别：{{$store.state.user.info.profile.sex==1?'男':'女'}}</p>
      <p>邮箱：{{$store.state.user.info.profile.email}}</p>
      <p>电话：{{$store.state.user.info.profile.phone}}</p>
      <p>部门：{{$store.state.user.info.profile.dept}}</p>
      <p><el-button type="primary" round @click="logout">退出登录</el-button></p>
      <setPass :type="type" :btn="btn"></setPass>
  </div>
</template>

<script>
import setPass from './setPass'
export default {
  components:{
    setPass
  },
  data(){
    return{
      type:false
    }
  },
  methods:{
    btn(){
      this.type = false;
    },
    logout(){
      // 清空本地存储
      localStorage.clear();
      // 跳转到登录页面
      location.href = './login.html';
    }
  }
}
</script>

<style scoped>
.info p{
  line-height: 40px;
}
.change{
  cursor: pointer;
  color: blue;
}
</style>