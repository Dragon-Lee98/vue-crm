<template>
  <div>
    <div style="padding:20px 0;">
      <el-button type="primary" @click="uptext">提交</el-button>
    </div>
    <el-row :gutter="20" class="header">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="19">
          <div class="grid-content">
            <el-input v-model="form.title" placeholder="标题"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
            <el-select v-model="form.idChannel" placeholder="请选择类型" v-if="ChannelList">
              <el-option v-for="i in ChannelList" :key="i.id" :label="i.name" :value="i.id"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <div style="background:#fff;">
      <div ref="editcontent" class="editcontent"></div>
    </div>
  </div>
</template>

<script>
import { http, articlelist, file, article } from "../../../api/api";
import wangeditor from "wangeditor";
export default {
  data() {
    return {
      form: {
        title: "",
        idChannel: ""
      },
      ChannelList: "",
      editor: ""
    };
  },
  mounted() {
    // 获取栏目列表
    this.getAriticleList();
    // 文本框配置
    this.editor = new wangeditor(this.$refs.editcontent);
    // 限制上传图片数量
    this.editor.customConfig.uploadImgMaxLength = 1;
    this.editor.customConfig.showLinkImg = false;
    this.editor.customConfig.uploadImgServer = "/upload";
    this.editor.customConfig.customUploadImg = (files, insert) => {
      // files 是 input 中选中的文件列表
      let f = files[0];
      let d = new FormData();
      d.append("file", f);
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .post(http + file, d, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.token
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              // 上传代码返回结果之后，将图片插入到编辑器中
              insert(
                "http://39.101.217.150:8086/static" +
                  data.data.data.realFileName
              );
            } else {
              this.$message.error(data.data.msg);
            }
            // 结束动画
            setTimeout(() => {
              loading.close();
            }, 0);
          },
          err => {
            this.$message.error(err.data.message);
          }
        );
    };
    this.editor.create();
  },
  methods: {
    // 提交文章
    uptext() {
      let json = {
        author: this.$store.state.user.info.profile.name,
        content: this.editor.txt.html().replace(/\%/g, "%25"),
        idChannel: this.form.idChannel,
        title: this.form.title
      };
      let type = true;
      for (var i in json) {
        if (json[i] == "") {
          type = false;
        }
      }
      if (type) {
        // 开启动画
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post(http + article, JSON.stringify(json), { emulateJSON: true })
          .then(
            data => {
              if (data.data.msg == "成功") {
                this.$message({
                  message: "上传成功",
                  type: "success"
                });
              } else {
                this.$message.error(data.data.msg);
              }
              // 结束动画
              setTimeout(() => {
                loading.close();
              }, 0);
            },
            err => {
              this.$message.error(err.data.message);
            }
          );
      } else {
        this.$message.error("请补全信息");
      }
    },
    // 获取文章列表
    getAriticleList(name) {
      // 开启动画
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.get(http + articlelist).then(
        data => {
          if (data.data.msg == "成功") {
            // 文章列表信息
            this.ChannelList = data.data.data;
          } else {
            this.$message.error(data.data.msg);
          }
          // 结束动画
          setTimeout(() => {
            loading.close();
          }, 0);
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
.header {
  position: relative;
  z-index: 2;
  padding: 0 0 20px 0;
}
.editcontent {
  position: relative;
  z-index: 1;
}
</style>