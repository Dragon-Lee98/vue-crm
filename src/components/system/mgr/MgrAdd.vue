<template>
  <div>
      <el-dialog title="添加用户" :visible.sync="mytype" @close='clearText'>
        <el-form ref="form" :model="form" label-width="80px" v-if="deptListArr">
            {{form}}
            <!-- 账户 -->
            <el-form-item label="账户">
                <el-input v-model="form.account"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <!-- 姓名 -->
            <el-form-item label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 生日 -->
            <el-form-item label="活动时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
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
                <el-cascader v-model="form.deptid" :options="deptListArr" :show-all-levels="false" :props="props"></el-cascader>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {http,deptList} from '../../../api/api'
export default {
    data(){
        return{
            mytype:this.type, // 模态框状态
            form:{
                account:'', //账号
                password:'', //密码
                name:'', //姓名
                birthday:'', //生日
                sex:'1', //性别
                email:'', //邮箱
                phone:'', //电话
                deptid:'', //部门id
                status:'1', //状态
            },
            deptListArr:[], // 部门信息
            props:{
                value:'id',
                label:'fullname',
                children:'children'
            }
        }
    },
    props:['type','fun'],
    watch:{
        type:function(){ // 断开单向数据流
            this.mytype = this.type;
        }
    },
    mounted(){
        this.getdeptList();
    },
    methods:{
        // 递归函数，处理部门信息中children为空
        setChildrenNull(data){
            for(var i=0;i<data.length;i++){
                if(data[i].children.length==0){
                    data[i].children=null;
                }else{
                    this.setChildrenNull(data[i].children);
                }
            }
            return data;
        },
        clearText(){
            // 清空密码信息
            // for(var i in this.pass){
            //     this.pass[i] = '';
            // }
            // 修改父级组件的对话框状态
            this.fun('mgrAdd');
        },
        // 获取部门信息
        getdeptList(){
            this.$http.get(http+deptList).then((data)=>{
                // 赋值为处理过的部门信息数据
                this.deptListArr = this.setChildrenNull(data.data.data);
                console.log(this.deptListArr)
            },(err)=>{
                // 获取数据失败
                // 重新登录
                location.href = './login.html';
            })
        }
    }
}
</script>

<style>

</style>