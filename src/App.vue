<template>
  <div id="app">
    <el-container>
      <el-aside style="width:auto;">
        <!-- 导航 -->
        <el-menu 
        :default-active="$route.path" 
        class="el-menu-vertical-demo" 
        :collapse="isCollapse" 
        v-if="$store.state.menu.menu && $store.state.user.info.permissions"
        router
        text-color="#fff">
          <el-menu-item index="/">
            <i class="el-icon-house"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="i in $store.state.menu.menu" :key="i.id" :index="i.path">
            <template slot="title">
              <i :class="iconsList[i.id]"></i>
              <span slot="title">{{i.name}}</span>
            </template>
            <el-menu-item 
            v-for="a in i.children" 
            :key="a.id" :index="a.path" 
            :disabled="$store.state.user.info.permissions.indexOf(a.path) == -1">
              <i :class="iconsList[a.id]"></i>
              <span slot="title">{{a.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main v-if="$store.state.user.info.profile">
        <div class="main-header">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="12"><div class="grid-content bg-purple">
              <div class="header-btn">
                <el-radio-group v-model="isCollapse">
                  <el-radio-button :label="false">展开</el-radio-button>
                  <el-radio-button :label="true">收起</el-radio-button>
                </el-radio-group>
              </div>
              </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
              <div class="userInfo">
                当前用户：
                <router-link to="/info" tag="span">
                  {{$store.state.user.info.profile.name}}
                </router-link>
              </div>
            </div></el-col>
          </el-row>
        </div>
        <div class="main">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import './assets/css/common.css'
import {http,listForRouter,info,menulist} from './api/api'
export default {
  data(){
    return{
      isCollapse:false,
      iconsList:{
        1:'el-icon-setting',
        2:'el-icon-s-order',
        4:'el-icon-user',
        12:'el-icon-s-custom',
        21:'el-icon-date',
        17:'el-icon-menu',
        22:'el-icon-reading',
        41:'el-icon-notebook-2',
        46:'el-icon-edit',
        42:'el-icon-document',
        45:'el-icon-folder'
      }
    }
  },
  mounted(){
    this.getMenu();
    this.getInfo();
    this.getMenuList();
  },
  methods:{
    // 获取导航信息
    getMenu(){
      this.$http.get(http+listForRouter).then((data)=>{
        if(data.data.msg=='成功'){
          this.$store.commit('setMenu',data);
        }else{
          this.$message.error(data.data.message);
        }
      },(err)=>{
        this.$message.error(err.data.message);
      })
    },
    // 获取用户信息
    getInfo(){
      this.$http.get(http+info).then((data)=>{
        if(data.data.msg=='成功'){
          this.$store.commit('setInfo',data);
        }else{
          this.$message.error(data.data.message);
        }
      },(err)=>{
        this.$message.error(err.data.message);
      })
    },
    // 获取菜单功能列表
    getMenuList(){
      this.$http.get(http+menulist).then((data)=>{
        if(data.data.msg=='成功'){
          var data = data.data.data;
          // 存放菜单功能信息
          var json = {};
          // 循环父级
          for(var i=0;i<data.length;i++){
            var child = data[i].children;
            // 循环子集
            for(var j=0;j<child.length;j++){
              this.$set(json,child[j].url,child[j]);
            }
          }
          // 存储到vuex中
          this.$store.commit('setMenuList',json);
        }else{
          this.$message.error(data.data.message);
        }
      },(err)=>{
        this.$message.error(err.data.message);
      })
    }
  }
}
</script>

<style scoped>
.el-aside >>> .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-aside >>> .el-menu-vertical-demo{
  min-height: 500px;
}
.el-main{
  padding: 0px;
  background: rgba(0, 0, 0, .3);
  min-height: 100vh;
}
.el-main >>> .main{
  padding: 20px;
}
.userInfo{
  line-height: 40px;
  text-align: right;
}
.userInfo span{
  color: blue;
  cursor: pointer;
}
.el-aside{
  background: rgba(0, 0, 0, .5);
}
.el-aside >>> .el-menu{
  background: none;
  border:none;
}
.el-menu-item:hover,.el-submenu >>> .el-submenu__title:hover{
  background: rgba(0, 0, 0, .2);
}
.is-active{
  background: none;
}
.main-header{
  padding: 10px;
  background: #ccc;
}


</style>