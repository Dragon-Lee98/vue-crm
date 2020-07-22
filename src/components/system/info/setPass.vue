<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close="clearText">
        <el-form ref="form" :model="pass" label-width="100px">
            <el-form-item label="旧密码">
                <el-input v-model="pass.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="pass.password"></el-input>
            </el-form-item>
            <el-form-item label="重复新密码">
                <el-input v-model="pass.rePassword"></el-input>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setPass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {http,updatePwd} from '../../../api/api'
export default {
    props:['type','btn'],
    data(){
        return{
            dialogFormVisible:this.type,
            pass:{
                oldPassword:'',
                password:'',
                rePassword:''
            }
        }
    },
    watch:{
        // 监听父组件传过来的type数据变化
        type:function(newType,oldType){
            // 当父级传入的值发生改变，修改对话框的状态
            this.dialogFormVisible = this.type;
        }
    },
    methods:{
        clearText(){
            // 清空密码信息
            for(var i in this.pass){
                this.pass[i] = '';
            }
            // 修改父级组件的对话框状态
            this.btn();
        },
        setPass(){
            // 关闭对话框
            // this.dialogFormVisible = flase;
            // 判断是否为空
            if(this.pass.oldPassword==''){
                this.$message.error('旧密码不能为空');
            }else if(this.pass.password==''){
                this.$message.error('新密码不能为空');
            }else if(this.pass.rePassword!==this.pass.password){
                this.$message.error('新密码重复不一样');
            }else{
                // 发送ajax
                this.$http.post(http+updatePwd,{emulateJSON:true},{
                    oldPassword:this.pass.oldPassword,
                    password:this.pass.password,
                    rePassword:this.pass.rePassword,
                }).then((data)=>{
                    console.log(data)
                },(err)=>{
                    console.log(err)
                })
            }
        }
    }
};
</script>

<style>
</style>