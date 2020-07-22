import Vue from 'vue'
import Login from './Login.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import resource from 'vue-resource';
Vue.use(resource);
Vue.http.options.emulateJSON = true;  //  全局启用emulateJSON 选项
new Vue({
  el: '#app',
  render: h => h(Login)
})
