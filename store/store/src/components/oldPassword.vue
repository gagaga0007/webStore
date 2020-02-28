<template>
  <div>
    <van-nav-bar
      title="旧密码"
      left-text="返回"
      left-arrow
      right-text="下一步"
      @click-left="goBackFn"
      @click-right="nextFn()"
    />

    <van-cell-group>
      <van-field
        v-model="password"
        type="password"
        label="旧密码"
        required
        clearable
        placeholder="请输入旧密码"
        :error-message="passwordErr"
      />
    </van-cell-group>
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "oldPassword",
    data() {
      return {
        password: '',
        passwordErr: ''
      }
    },
    methods: {
      goBackFn() {
        this.$router.go(-1);
      },
      //下一步按钮
      nextFn() {
        this.passwordErr = '';
        //如果输入为空
        if (this.password === '') {
          this.passwordErr = '请输入旧密码';
        } else {
          //保存用户名和密码的对象
          var _dataObj = {
            username: localStorage.username,
            password: this.password
          };
          //发送请求，传入这个对象
          axios.post(API_LIST.getOldPassword, _dataObj)
            .then(_d => {
              //旧密码错误的情况
              if (_d.data.reg_code === 14) {
                this.$toast.fail(_d.data.regInfo);
                this.password = '';
                this.passwordErr = '';
              } else if (_d.data.reg_code === 15) {
                //旧密码正确的情况
                this.$router.push('/updatePassword');
              }
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>
