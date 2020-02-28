<template>
  <div>
    <input type="text" v-model="name"
           class="goodEntry" placeholder="大类名称">

    <van-button plain type="primary" @click="submitBtn">提交商品</van-button>
  </div>
</template>

<script>
  import API_LIST from '../APIList.config';
  import axios from 'axios';

  export default {
    name: "entryCategory",
    data() {
      return {
        msg: '123',
        name: ''
      }
    },
    methods: {
      submitBtn() {
        if (this.name === '') {
          alert('null');
        } else {
          //先获得一共有多少大类
          // axios.get(API_LIST.getGoodsCategoryCount)
          //   .then(_d => {
          //     //然后访问插入大类接口
          //     axios.get(API_LIST.insertCategory, {params: {name: this.name, _count: _d.data.length}})
          //       .then(_d => {
          //         if (_d.data.reg_code === 7) {
          //           this.$notify({type: 'danger', message: _d.data.regInfo})
          //         } else if (_d.data.reg_code === 8) {
          //           this.$notify({type: 'success', message: _d.data.regInfo})
          //         }
          //       })
          // })
        }
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .wrapDiv {
    overflow: hidden;
    border: 1px solid #666;
    background-color: #eee;
    border-radius: 10px;
    margin: 10px auto;
  }

  .leftDiv {
    float: left;
    width: 40%;
    margin: 10px;
    border-radius: 10px;
    height: 30px;
    border: 1px solid #999;
    padding: 10px;
    line-height: 30px;
    text-align: center;
    font-size: 22px;
  }

  .rightDiv {
    float: right;
    width: 40%;
    margin: 10px;
    border-radius: 10px;
    height: 30px;
    border: 1px solid #999;
    padding: 10px;
    background-color: #fff;
    line-height: 30px;
    text-align: center;
    font-size: 22px;
  }

  .goodEntry {
    margin: 10px;
    border-radius: 10px;
    border: 1px solid #999;
    text-align: center;
    font-size: 16px;
  }
</style>
