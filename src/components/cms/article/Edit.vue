<template>
  <div>
    <el-dialog title="修改文章" width="60%" :visible.sync="mytype" @close="clearText" @open="open">
      <el-row :gutter="20" class="header">
        <el-form ref="form" :model="form" label-width="80px">
          <el-col :span="14">
            <div class="grid-content">
              <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <el-form-item label="类型">
                <el-select v-model="form.idChannel" placeholder="请选择类型" v-if="ArticleList">
                  <el-option v-for="i in ArticleList" :key="i.id" :label="i.name" :value="i.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <div>
        <div ref="editcontent" class="editcontent"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uptext">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http, articlelist, file, article } from "../../../api/api";
import wangeditor from "wangeditor";
export default {
  data() {
    return {
      mytype: this.type, // 模态框状态
      form: {
        title: "",
        idChannel: ""
      },
      ArticleList: ""
    };
  },
  props: ["type", "fun", "rowData"],
  watch: {
    type: function() {
      // 断开单向数据流
      this.mytype = this.type;
    },
    rowData: function() {
      // 浅拷贝变深拷贝
      var json = {};
      for (var i in this.rowData) {
        // 全部转换为字符串
        // this.rowData[i] = this.rowData[i].toString();
        this.$set(json, i, this.rowData[i].toString());
      }
      this.form = json;
    }
  },
  mounted() {
    this.getAriticleList();
  },
  methods: {
    open() {
      // 对话框打开时的回调
      this.$nextTick(() => {
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
                  insert(http + data.data.data.realFileName);
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
        this.editor.txt.html(this.form.content);
      });
    },
    clearText() {
      // 修改父级组件的对话框状态
      this.fun("update");
    },
    // 提交文章
    uptext() {
      let json = {
        author: this.$store.state.user.info.profile.name,
        id: this.form.id,
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
        this.$http
          .post(http + article, JSON.stringify(json), { emulateJSON: true })
          .then(
            data => {
              if (data.data.msg == "成功") {
                this.$message({
                  message: "上传成功",
                  type: "success"
                });
                // 关闭模态框
                this.mytype = false;
              } else {
                this.$message.error(data.data.msg);
              }
            },
            err => {
              this.$message.error(err.data.message);
            }
          );
      } else {
        this.$message.error("请补全信息");
      }
    },
    getAriticleList(name) {
      this.$http.get(http + articlelist).then(
        data => {
          if (data.data.msg == "成功") {
            // 文章列表信息
            this.ArticleList = data.data.data;
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