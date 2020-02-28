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
    <van-field
      v-model="password2"
      type="password"
      label="重复密码"
      required
      clearable
      placeholder="请重复输入密码"
      :error-message="passwordErr2"
    />
    <van-field
      v-model="describe"
      label="个人签名"
      rows="2"
      autosize
      clearable
      type="textarea"
      maxlength="30"
      placeholder="请输入个性签名"
      show-word-limit
    />

    <div style="margin-top: 30px">
      <van-button plain round type="info" @click="registerResetFn" style="width: 90px; margin-right: 50px">重置
      </van-button>
      <van-button round type="info" @click="registerFn" style="width: 90px;">注册</van-button>
    </div>

    <div class="toRegister">
      已有账号？<span href="#" @click="goToLogin">立即登录</span>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "register",
    data() {
      return {
        msg: '注册页面',

        username: '',
        password: '',
        password2: '',
        describe: '',

        userErr: '',
        passwordErr: '',
        passwordErr2: ''
      }
    },
    methods: {
      //返回
      goBackFn() {
        this.$router.push('/userAccount');
      },
      goToLogin() {
        this.$router.push('/login');
      },
      //数据置为空
      setNull() {
        this.username = '';
        this.password = '';
        this.password2 = '';
        this.userErr = '';
        this.passwordErr = '';
        this.passwordErr2 = '';
        this.describe = '';
      },
      //注册
      registerFn() {
        //先讲错误信息置为空
        this.userErr = '';
        this.passwordErr = '';
        this.passwordErr2 = '';

        //用一个对象存储输入的信息
        let _registerObj = {
          username: this.username,
          password: this.password,
          password2: this.password2,
          describe: this.describe
        };

        //判断输入是否合法
        if (_registerObj.username === '') {
          this.userErr = '用户名不能为空';
          return false;
        }
        if (_registerObj.password === '') {
          this.passwordErr = '密码不能为空';
          return false;
        }
        if (_registerObj.password2 === '') {
          this.passwordErr2 = '重复密码不能为空';
          return false;
        }
        if (_registerObj.password !== _registerObj.password2) {
          this.passwordErr2 = '两次密码输入不一致';
          return false;
        }

        this.postRegisterObj(_registerObj);
      },
      //提交注册
      postRegisterObj(_registerObj1) {
        let _registerObj = {
          username: _registerObj1.username,
          password: _registerObj1.password,
          describe: _registerObj1.describe,
          realname: '',
          phone: '',
          address: ''
        };

        axios.post(API_LIST.register_post, _registerObj)
          .then(_d => {
            if (_d.data.reg_code === 1) {
              this.$toast.success(_d.data.regInfo);
              this.$router.go(-1);
            } else if (_d.data.reg_code === 2) {
              this.$toast.fail(_d.data.regInfo);
              this.setNull();
            }

          })
      },
      //重置
      registerResetFn() {
        this.$dialog.confirm({
          title: '确认重置？'
        }).then(() => {
          this.setNull();
          this.$toast('信息已重置');
        }).catch(() => {
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
