<template>
  <div style="display: flex; flex-direction: column; background-color: #f5f5f5; padding: 0 1% 0 1%" class="main">

    <div style="flex: 1;">

      <van-sticky>
        <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="searchGoods"/>
      </van-sticky>

      <van-swipe class="slider" :autoplay="3000" indicator-color="white">
        <div v-for="category in goodsObj" class="sliderItem" @click="sliderClick(category)">
          <van-swipe-item>
            <img :src="category.i"/>
            <span>{{category.n}}分区</span>
          </van-swipe-item>
        </div>
      </van-swipe>

      <div>
        <van-sticky :offset-top="53">
          <div class="allGoods">
            <span>分区销量TOP3</span>
            <!--<div class="clickShowAll" @click="showAllFn">点击展开/收起</div>-->
          </div>
        </van-sticky>


        <!--此处为获取商品大类以及大类下的商品-->
        <!--商品大类的v-for循环-->
        <div v-for="itemObj in goodsObj" class="wrapDiv cls goodsList">
          <!--商品大类的名称-->
          <h1 class="goodsTitle">{{itemObj.n}}分区</h1>
          <div :class="{'setheight1': showAll}" style="transition: all 0.3s;">
            <!--连表查询返回的结果的v-for循环（goodsList_100、goodsList_200……）-->
            <div v-for="arr in goodsArr">
              <!--对商品的循环，将商品放入对应的大类-->
              <li v-for="(goods,inx) in itemObj[arr]" @click="goodsProductFn(goods)" v-if="inx<3">
                <!--右上角的1、2、3-->
                <b v-if="inx===0">1</b>
                <em v-if="inx===1">2</em>
                <em v-if="inx===2">3</em>
                <label>
                  <!--图片懒加载-->
                  <lazy-component>
                    <img :src="goods.img"/>
                  </lazy-component>
                </label>
                <i>{{goods.name}}</i>
                <span>￥{{goods.price}}</span>
              </li>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!--footer-->
    <div style="height: 50px;">
      <footerbar/>
    </div>
    <!--<div class="wrapDiv">-->
    <!--<input type="text" class="leftDiv" placeholder="Please Input..." ref="inputRef">-->
    <!--<div class="rightDiv">{{text}}</div>-->
    <!--</div>-->
    <!--<van-button plain type="primary" @click="sendBtn">Send</van-button>-->
    <!--<van-button plain type="primary" @click="getBtn">Receive</van-button>-->
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';
  import entryGoods from './entryGoods';
  import footerbar from './footerbar';

  export default {
    name: "shopCart",
    data() {
      return {
        text: '',

        //展开/折叠
        showAll: false,

        //所有商品的总的数据，包括所有大类和所有商品
        goodsObj: '',

        //保存连表查询后结果的集合，即goodsList_100、goodsList_200等
        goodsArr: [],

        //搜索
        searchValue: ''
      }
    },

    created() {
      localStorage.setItem('inxState', 0);

      //获得商品的函数
      this.getGoodsCategoryFn();
    },

    components: {entryGoods, footerbar},


    methods: {
      // //展开/收起所有商品
      // showAllFn() {
      //   this.showAll = !this.showAll;
      // },
      //查询所有大类以及所属商品
      getGoodsCategoryFn() {
        axios.get(API_LIST.getGoodsCategoryCount)
          .then(_d => {
            //返回的商品的总的数据，就是所有大类以及所有商品
            this.goodsObj = _d.data;
            // console.log(this.goodsObj);

            // 返回的连表查询的结果的前半部分
            let _str = 'goodsList_';
            // 连表查询结果名称的后半部分是数字，所以通过for循环实现
            for (let i = 0; i < this.goodsObj.length; i++) {
              // 将连表查询的结果存到data里的goodsArr数组中
              this.goodsArr.push(_str + (i + 1) * 100);
              //每个大类对应的商品数组，重新赋值为按销量排序之后的数组
              this.goodsObj[i][_str + (i + 1) * 100] = this.goodsObj[i][_str + (i + 1) * 100].sort((a, b) => {
                return b.saled - a.saled;
              });
            }
          })
      },

      //商品详情页
      goodsProductFn(_self) {
        this.$router.push({
          name: 'goodsProduct',
          query: {
            _goodsObjId: _self._id,
            _collectionName: _self.category
          }
        })
      },

      //轮播图点击事件，搜索
      sliderClick(item) {
        this.searchValue = item.n;
        this.$router.push({
          name: 'search',
          query: {
            searchData: this.searchValue
          }
        });
      },

      //搜索商品
      searchGoods() {
        this.$router.push({
          name: 'search',
          query: {
            searchData: this.searchValue
          }
        });
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

  .main {
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    padding: 0 1% 0 1%;
    min-height: 100vh;
  }

  .slider {
    width: 100%;
    height: 150px;
    margin: 10px auto 20px auto;
    border-radius: 10px;
    box-shadow: 0 0 7px #999;
  }

  .slider img {
    display: block;
    float: left;
    max-width: 100%;
    position: relative;
    top: -25px;
  }

  .sliderItem span {
    position: absolute;
    display: block;
    left: 50%;
    top: 58px;
    transform: translateX(-50%);
    color: #eeeeee;
    text-shadow: 0px 0px 5px #000;
    font-weight: 500;
    font-size: 30px;
  }

  .wrapDiv {
    /*width: 85%;*/
    overflow: hidden;
    /*border: 1px solid #666;*/
    /*background-color: #eee;*/
    /*border-radius: 10px;*/
    margin: 10px auto;
  }

  .cls:before, .cls:after {
    content: '';
    display: table;
  }

  .cls:after {
    clear: both;
  }

  .cls {
    *zoom: 1
  }

  .goodsCategory {
    clear: both;
    margin: 10px 0;
  }

  .goodsCategory li {
    float: left;
  }

  .goodsCategory li img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #666;
  }

  .allGoods {
    width: 97%;
    text-align: left;
    font-weight: 900;
    font-size: 22px;
    border-bottom: 2px solid #ccc;
    margin-left: 5px;
    color: #555;
    position: relative;
    background-color: #f5f5f5;
  }

  .goodsList {
    background-color: #f5f5f5;
  }

  .goodsList li {
    float: left;
    width: 31%;
    margin: 0 1% 5px 1%;
    background-color: #fff;
    border-radius: 5px;
    font-family: sans-serif;
    position: relative;
  }

  .goodsList li label {
    width: 100px;
    height: 115px;
    display: block;
    overflow: hidden;
    margin: 5px auto;
    padding: 0;
    text-align: center;
    position: relative;
    border: 1px solid #eee;
    border-radius: 5px;
  }

  .goodsList li b {
    display: block;
    position: absolute;
    background-color: #FF7256;
    z-index: 1;
    right: -5px;
    top: -2px;
    font-size: 14px;
    color: #eee;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    line-height: 25px;
    box-shadow: 1px 1px 3px #ccc;
  }

  .goodsList li em {
    display: block;
    position: absolute;
    background-color: #FF7F00;
    z-index: 1;
    right: 0;
    top: 0;
    font-size: 12px;
    color: azure;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 1px 1px 3px #ccc;
    line-height: 20px;
    font-style: normal;
  }

  .goodsList li img {
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    padding: 0;
  }

  .goodsList h1.goodsTitle {
    clear: both;
    margin: 5px auto;
    font-size: 18px;
    text-align: left;
    border-radius: 5px;
    background: #999;
    width: 94%;
    color: #fff;
    padding: 3px 10px;
    position: relative;
  }

  .goodsList li i {
    font-style: normal;
    font-weight: 700;
    display: block;
    font-size: 16px;
  }

  .goodsList li span {
    display: block;
    font-size: 14px;
    color: #ff3300;
    font-weight: 700;
  }

  .setheight1 {
    height: 0px;
    transition: height 0.5s;
    overflow: hidden;
  }
</style>
