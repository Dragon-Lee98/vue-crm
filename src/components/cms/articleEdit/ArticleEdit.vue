<template>
  <div>
    <div style="padding:20px;">
      <el-button type="primary">提交</el-button>
    </div>
    <el-row :gutter="20">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="20"><div class="grid-content">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </div></el-col>
        <el-col :span="4"><div class="grid-content">
          <el-form-item label="活动区域">
            <el-select v-model="form.idChannel" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </div></el-col>
      </el-form>
    </el-row>
    <div>
      <div ref="editcontent"></div>
    </div>
  </div>
</template>

<script>
import { http, article } from "../../../api/api";
import wangeditor from 'wangeditor';
export default {
  data() {
    return {
      form:{
        title:"",
        idChannel:""
      }
    };
  },
  mounted() {
    // 获取字典信息
    // this.getDictList();
    var editor = new wangeditor(this.$refs.editcontent);
    editor.create();
  },
  methods: {
    // 获取字典列表信息
    getDictList(name) {
      this.$http
        .post(http + article)
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 字典列表信息
              this.tableData = data.data.data;
              console.log(data)
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