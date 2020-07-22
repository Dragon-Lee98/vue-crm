import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 引入resource
import resource from 'vue-resource';
Vue.use(resource);
// 引入router
import router from './router/router';
// 引入echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// 判断有无登录
if(localStorage.token){
  // 登录成功
  // 设置token请求头
  Vue.http.headers.common['Authorization'] = localStorage.token;
}else{
  // 登陆失败
  location.href = './login.html';
}

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
