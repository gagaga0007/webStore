<template>
  <div>
    <van-nav-bar
      :title=msg
      left-text="返回"
      left-arrow
      @click-left="goBackFn"
    />
    <van-field
      v-model="username"
      label="用户名"
      required
      clearable
      placeholder="请输入用户名"
      :error-message="userErr"
    />
    <van-field
      v-model="password"
      type="password"
      label="密码"
      required
      clearable
      placeholder="请输入密码"
      :error-message="passwordErr"
    />

    <div style="margin-top: 30px">
      <van-button plain round type="info" @click="loginResetFn" style="width: 90px; margin-right: 50px">重置</van-button>
      <van-button round type="info" @click="loginFn" style="width: 90px;">登录</van-button>
    </div>

    <div class="toRegister">
      还没有账号？<span href="#" @click="goToRegister">立即注册</span>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "userLogin",
    data() {
      return {
        msg: '登录',

        username: '',
        password: '',
        userErr: '',
        passwordErr: ''
      }
    },
    methods: {
      //返回
      goBackFn() {
        this.$router.push('/userAccount');
      },
      //跳转到注册
      goToRegister() {
        this.$router.push('/register');
      },
      //数据置为空
      setNull() {
        this.username = '';
        this.password = '';
        this.userErr = '';
        this.passwordErr = '';
      },
      //重置
      loginResetFn() {
        this.$dialog.confirm({
          title: '确认重置？'
        }).then(() => {
          this.setNull();
          this.$toast('信息已重置');
        }).catch(() => {
        })
      },
      //登录
      loginFn() {
        //先讲错误信息置为空
        this.userErr = '';
        this.passwordErr = '';

        //用一个对象存储信息
        let _loginObj = {
          username: this.username,
          password: this.password
        };

        //判断输入是否合法
        if (_loginObj.username === '') {
          this.userErr = '用户名不能为空';
          return false;
        }
        if (_loginObj.password === '') {
          this.passwordErr = '密码不能为空';
          return false;
        }

        this.postLoginFn(_loginObj);
      },
      //提交登录
      postLoginFn(_loginObj) {
        axios.post(API_LIST.login_post, _loginObj)
          .then(_d => {
            if (_d.data.reg_code === 3) {
              this.$toast.success('登陆成功!\n欢迎 '+ _d.data.regInfo.username);
              localStorage.username = _d.data.regInfo.username;
              this.$router.push('/');
            } else if (_d.data.reg_code === 4) {
              this.$toast.fail(_d.data.regInfo);
              this.password = '';
            } else if (_d.data.reg_code === 5) {
              this.$toast.fail(_d.data.regInfo);
              this.username = '';
              this.password = ''
            }
          })
      }
    }
  }
</script>

<style scoped>
  .toRegister {
    position: fixed;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }

  .toRegister span {
    color: dodgerblue;
  }
</style>
