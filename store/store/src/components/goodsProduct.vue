<template>
  <div>
    <!--header-->
    <van-nav-bar
      title="产品详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="goodsImgWrap">
      <img :src="goodsImg" alt="">
    </div>
    <div class="goodsDescribe">
      <h2>{{goodsTitle}}</h2>
      <h3>
        <span>￥{{price}}</span>
        <p>销量：{{saled}}</p>
      </h3>
    </div>
    <div class="goodsDescribe2">
      <p>
        <label>商品概述：</label><br>
        <span>{{describe}}</span>
      </p>
    </div>

    <van-sku
      v-model="showBase"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :hide-stock="sku.hide_stock"
      :quota-used=0
      :reset-stepper-on-hide=false
      :reset-selected-sku-on-hide=false
      :close-on-click-overlay=true
      :disable-stepper-input=false
      :message-config={}
      @sku-selected="switchProductType"
      @add-cart="onAddCartFn"
    >
    </van-sku>

    <!--footer-->
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o" text="购物车" @click="goToCart" :info=cartNum
      />
      <van-goods-action-button type="warning" text="加入购物车" @click="onClickButton"/>
    </van-goods-action>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';
  import footerbar from './footerbar';

  export default {
    name: "goodsProduct",
    data() {
      return {
        goodsTitle: '',
        goodsImg: '',
        describe: '',
        price: '',
        saled: '',
        cartNum: 0,
        collection: '',

        showBase: false,
        goods: {},
        goodsId: '',
        sku: {
          tree: [
            {
              k: '', // skuKeyName：规格类目名称
              v: [
                {
                  id: '001',
                  name: '',
                  imgUrl: ''
                }
              ],
              k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            }
          ],
          // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
          list: [
            {
              id: 2259, // skuId，下单时后端需要
              price: '', // 价格（单位分）
              s1: '001', // 规格类目 k_s 为 s1 的对应规格值 id
              s2: '0', // 规格类目 k_s 为 s2 的对应规格值 id
              s3: '0', // 最多包含3个规格值，为0表示不存在该规格
              stock_num: 999 // 当前 sku 组合对应的库存
            }
          ],
          price: '', // 默认价格（单位元）
          stock_num: 999, // 商品总库存
          hide_stock: true // 是否隐藏剩余库存
        }
      }
    },
    created() {
      let _goodsId = this.$route.query._goodsObjId;
      let _collectionName = this.$route.query._collectionName;

      this.collection = _collectionName;
      //给sku的
      this.goodsId = _goodsId;

      //获取当前商品的信息
      this.getGoodsInfoFn(_goodsId, _collectionName);
      //获取商品总数，小圆点的数字
      this.cartGoodsNum();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      //根据商品id，获取商品信息
      getGoodsInfoFn(_gId, _collectionName) {
        //向服务端传送该商品的id和所属的集合，一是为了安全，二是为了提升查询效率
        axios.get(API_LIST.getGoodsInfo, {
          params: {
            _id: _gId,
            _c: _collectionName
          }
        })
          .then(_d => {
            this.goodsTitle = _d.data.name;
            this.goodsImg = _d.data.img;
            this.describe = _d.data.describe;
            this.price = _d.data.price;
            this.saled = _d.data.saled;
            //sku中goods的信息
            this.goods.title = _d.data.name;
            this.sku.price = _d.data.price;
            this.sku.list[0].price = _d.data.price * 100;
            this.sku.tree[0].v[0].name = _d.data.name;
            this.sku.tree[0].v[0].imgUrl = _d.data.img;
          })
      },

      //切换产品类型vant触发的方法
      switchProductType() {
        this.sku.list[0].price = this.sku.price * 100;
      },

      //sku界面，添加到购物车vant触发的方法
      onAddCartFn(_d) {
        //判断用户是否登录
        if (!localStorage.username) {
          this.$dialog.confirm({
            title: '尚未登录，是否跳转到登录页面？'
          }).then(() => {
            this.$router.push({path: '/login'});
          }).catch(() => {
          })
        } else if (localStorage.username) {
          //判断cartDataInfo中是否有相同的数据
          let _is = false;
          //新增的产品信息
          let _tempObj = {
            _id: _d.goodsId,
            _price: this.price,
            _num: _d.selectedNum,
            _goodsName: this.goodsTitle,
            _img: this.goodsImg,
            _collection: this.collection
          };
          //已经保存在本地存储的数据
          let _cartData = localStorage.cartDataInfo ? JSON.parse(localStorage.cartDataInfo) : [];
          for (let i = 0; i < _cartData.length; i++) {
            //如果有相同的id，即同一商品
            if (_cartData[i]._id === _tempObj._id) {
              _cartData[i]._num += _tempObj._num;
              _is = true;
              //更新小圆点数字
              this.cartGoodsNum();
              break;
            }
          }
          //如果无相同商品
          if (!_is) {
            _cartData.push(_tempObj);
          }
          //这个对象要转换为字符，才能存在本地存储中
          localStorage.cartDataInfo = JSON.stringify(_cartData);

          this.showBase = false;
          this.$toast.success('加车成功');
          //更新小圆点数字
          this.cartGoodsNum();
        }
      },
      //当前购物车中商品总数，给购物车小圆点用的
      cartGoodsNum() {
        let _num = 0;
        // 循环localStorage中的数组，获取商品总数
        let _cart = localStorage.cartDataInfo ? JSON.parse(localStorage.cartDataInfo) : [];
        _cart.map(_d => {
          _num += _d._num;
        });
        // 然后赋值给carNum
        this.cartNum = _num;
      },
      //界面中点击添加到购物车按钮
      onClickButton() {
        this.showBase = true;
      },
      //跳转购物车页面
      goToCart() {
        //判断用户是否登录
        if (!localStorage.username) {
          this.$dialog.confirm({
            title: '尚未登录，是否跳转到登录页面？'
          }).then(() => {
            this.$router.push({path: '/login'});
          }).catch(() => {
          })
        } else if (localStorage.username) {
          this.$router.push({path: '/cart'});
        }
      }
    }
  }
</script>

<style scoped>
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

  h2 {
    margin: 0 0 10px 0;
  }

  h3 {
    margin: 0 0 10px 0;
  }

  .goodsList li {
    float: left;
    width: 49%;
    overflow: hidden;
    margin: 0 0 10px 0;
  }

  .goodsList li label {
    width: 100px;
    height: 115px;
    display: block;
    overflow: hidden;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    position: relative;
    border: 1px solid #666;
  }

  .goodsList li img {
    height: 100%;
    position: absolute;
    top: -5px;
    left: 0;
    clear: both;
    display: block;
    margin: 5px auto;
    padding: 0;
    max-height: 100%;
  }

  .goodsList h1.goodsTitle {
    clear: both;
    margin: 5px auto;
    font-size: 22px;
    border-radius: 5px;
    background: #5d5d5d;
    width: 50%;
    color: #fff;
    padding: 3px 0;
  }

  .goodsImgWrap {
    width: 100%;
    height: 300px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
  }

  .goodsImgWrap img {
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .goodsDescribe {
    text-align: left;
    padding: 10px;
    background-color: #f0f0f0;
  }

  .goodsDescribe h3 {
    position: relative;
  }

  .goodsDescribe h3 span {
    color: mediumvioletred;
  }

  .goodsDescribe h3 p {
    font-weight: normal;
    font-size: 14px;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .goodsDescribe2 {
    text-align: left;
    padding: 10px;
  }

  .goodsDescribe2 p {
    margin: 0;
  }

  .goodsDescribe2 p label {
    font-weight: 700;
  }

  .goodsDescribe2 p span {
    display: block;
    margin: 10px 0 0 10px;
  }
</style>
