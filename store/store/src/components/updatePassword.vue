<template>
  <div>
    <van-nav-bar
      title="新密码"
      left-text="返回"
      left-arrow
      right-text="完成"
      @click-left="goBackFn"
      @click-right="submitFn()"
    />

    <van-cell-group>

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
    </van-cell-group>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "updatePassword",
    data() {
      return {
        password: '',
        password2: '',
        passwordErr: '',
        passwordErr2: ''
      }
    },
    methods: {
      goBackFn() {
        this.$router.go(-1);
      },
      submitFn() {
        this.passwordErr = '';
        this.passwordErr2 = '';
        let _is = true;
        //判断输入是否合法
        if (this.password === '') {
          this.passwordErr = '密码不能为空';
          _is = false;
        }
        if (this.password2 === '') {
          this.passwordErr2 = '重复密码不能为空';
          _is = false;
        }
        if (this.password !== this.password2) {
          this.passwordErr2 = '两次密码输入不一致';
          _is = false;
        }
        //合法时，提交
        if (_is) {
          let _dataObj = {
            username: localStorage.username,
            password: this.password
          };
          axios.post(API_LIST.setNewPassword, _dataObj)
            .then(_d => {
              if (_d.data.reg_code === 16) {
                this.$toast.success(_d.data.regInfo);
                this.$router.push('/userAccount');
              } else {
                this.$toast.fail('更新失败');
              }
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>
