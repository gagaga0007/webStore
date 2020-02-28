<template>
  <div class="main">

    <div class="main-t">
      <van-sticky>
        <div class="goBack" @click="goBack">
          <span><van-icon name="arrow-left"/></span>
        </div>
        <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="searchGoods"/>
      </van-sticky>
    </div>

    <div class="main-b">
      <div class="item" v-for="item in resultArr" @click="goodsProductFn(item)">
        <label><img :src=item.img></label>
        <span>{{item.name}}</span>
        <b>销量：{{item.saled}}</b>
        <i>￥{{item.price}}</i>
      </div>
      <div class="txt">没有更多商品啦</div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "search",
    data() {
      return {
        msg: '',
        searchValue: '',
        resultArr: []
      }
    },
    created() {
      //先给搜索字符串赋值
      this.searchValue = this.$route.query.searchData;
      //然后调用搜索函数
      this.searchGoods();
    },
    methods: {
      //返回
      goBack() {
        this.$router.push('/');
      },
      //点击商品，跳转商品详情页
      goodsProductFn(_self) {
        this.$router.push({
          name: 'goodsProduct',
          query: {
            _goodsObjId: _self._id,
            _collectionName: _self.category
          }
        })
      },
      //搜索
      searchGoods() {
        axios.get(API_LIST.search, {params: {data: this.searchValue}})
          .then(_d => {
            this.resultArr = _d.data;
          })
      }
    }
  }
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
  }

  .goBack {
    text-align: left;
    font-size: 18px;
    color: #1989fa;
    float: left;
    height: 54px;
    width: 20px;
    background-color: #fff;
    position: relative;
  }

  .goBack span {
    display: block;
    position: absolute;
    top: 17px;
    left: 8px;
  }

  .main-t {
    height: 54px;
  }

  .main-b {
    min-height: calc(100vh - 59px);
    flex: 1;
    height: 100%;
    background-color: #eee;
    padding-top: 5px;
  }

  .item {
    width: 95%;
    background-color: #fff;
    margin: 0 auto 5px;
    border-radius: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    position: relative;
  }

  .item label {
    display: inline-block;
    width: 90px;
    height: 90px;
    overflow: hidden;
    position: relative;
    border-radius: 15px;
  }

  .item img {
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .item span {
    position: absolute;
    left: 100px;
    font-size: 18px;
    font-weight: 500;
  }

  .item i {
    text-align: right;
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-style: normal;
    color: #ff3300;
  }

  .item b {
    font-weight: normal;
    display: block;
    position: absolute;
    bottom: 35px;
    right: 10px;
    font-size: 14px;
  }

  .txt {
    font-size: 12px;
    color: #999999;
    margin: 10px auto;
  }
</style>
