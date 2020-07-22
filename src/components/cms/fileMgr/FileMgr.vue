<template>
  <div v-if="$store.state.user.MenuList[this.$route.path]">
      文件管理
      <el-button 
      type="primary" 
      round 
      v-for="item in $store.state.user.MenuList[this.$route.path].children"
      :key="item.id"
      v-show="item.statusName == '启用'"
      >{{item.name}}{{item.statusName}}</el-button>
      {{$store.state.user.MenuList[this.$route.path].children}}
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>