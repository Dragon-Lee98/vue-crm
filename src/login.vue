<template>
  <div id="login">
    <div class="login">
      <div class="wrapper">
        <div class="input-data">
          <input type="text" required v-model="login.user"/>
          <label>UserName</label>
          <div class="underline"></div>
        </div>
      </div>
      <div class="wrapper">
        <div class="input-data">
          <input type="password" required v-model="login.pass"/>
          <label>PassWord</label>
          <div class="underline"></div>
        </div>
      </div>
      <button class="login-btn" id="loginBtn" @click='onSubmit'>登录</button>
    </div>
  </div>
</template>

<script>
import "./assets/css/common.css";
import { http, login } from "./api/api";
export default {
  data() {
    return {
      login: {
        user: "",
        pass: ""
      }
    };
  },
  mounted() {
    document.documentElement.onkeyup = e => {
      // 输入回车登录
      if (e.keyCode == 13) {
        this.onSubmit();
      }
    };
  },
  methods: {
    // 登录操作
    onSubmit() {
      // 这是一个小小的验证
      if (this.login.user == "") {
        this.$message.error("请输入账号");
      } else if (this.login.pass == "") {
        this.$message.error("请输入密码");
      } else {
        // 发送ajax
        this.$http
          .post(http + login, {
            username: this.login.user,
            password: this.login.pass
          })
          .then(
            data => {
              if (data.data.msg == "成功") {
                // 本地存储token
                localStorage.token = data.data.data.token;
                // 跳转到主页
                location.href = "/";
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
  }
};
</script>

<style scoped>
.login {
  width: 500px;
  margin: 0 auto;
  padding-top: 200px;
}
.wrapper {
  width: 450px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.wrapper .input-data {
  position: relative;
  width: 100%;
  height: 40px;
}

.wrapper .input-data input {
  width: 100%;
  height: 100%;
  background: none;
  color: #fff;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  outline: none;
  font-size: 17px;
  box-sizing: border-box;
}

.wrapper .input-data label {
  position: absolute;
  bottom: 10px;
  left: 0;
  color: rgb(247, 241, 241);
  pointer-events: none;
  transition: all 0.3s ease;
}

.input-data input:focus ~ label,
.input-data input:valid ~ label {
  transform: translateY(-25px);
  font-size: 15px;
  color: #409eff;
}

.wrapper .input-data .underline {
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: #409eff;
  transform: scale(0);
  transition: all 0.3s ease;
}

.input-data input:focus ~ .underline,
.input-data input:valid ~ .underline {
  transform: scale(1);
}

.login-btn {
  font-size: 17px;
  color: #fff;
  background: #409eff;
  border: 0;
  outline: 0;
  font-weight: 500;
  padding: 12px 228px;
  cursor: pointer;
}
</style>