<template>
  <div class="main">

    <div style="flex: 1;">


      <!--<div v-if="isGoodsEntry" class="goodEntry">商品录入框-->
      <!--&lt;!&ndash;批量添加商品组件&ndash;&gt;-->
      <!--<div v-for="item in emptyGoodsDom">-->
      <!--<entryGoods-->
      <!--@pushGoodsInfo="pushGoodsInfoFn"-->
      <!--@isVoidFalse="isVoidFalseFn"-->
      <!--/>-->
      <!--<entryNewGood/>-->
      <!--</div>-->
      <!--<van-button plain type="primary" @click="addGoodsInputBtn">+</van-button>-->
      <!--<van-button plain type="primary" @click="submitBtn">提交商品</van-button>-->
      <!--</div>-->

      <!--<van-button v-if="isLogin" plain type="primary" @click="entryGoods">录入商品(临时放这里)</van-button>-->
      <!--<div v-if="isGoodsEntry" class="goodEntry">商品录入框-->
      <!--<entryNewGood/>-->
      <!--</div>-->

      <!--<van-button v-if="isLogin" plain type="primary" @click="entryCategory">录入大类(临时放这里)</van-button>-->
      <!--<div v-if="isCategoryEntry" class="goodEntry">大类录入框-->
      <!--<entryCategory/>-->
      <!--</div>-->


      <div class="bottom">

        <div class="categoryList">
          <van-sidebar v-model="activeKey" @change="sidebarChange">
            <div class="categoryItem" v-for="item in getGoodsCategoryData">
              <van-sidebar-item
                :title=item.n
              />
            </div>
          </van-sidebar>
        </div>

        <div class="goodsList">
          <div class="goodsItem" v-for="item in getGoodsItem" @click="goodsProductFn(item)">
            <label>
              <!--图片懒加载-->
              <lazy-component>
                <img :src="item.img"/>
              </lazy-component>
            </label>
            <span>{{item.name}}</span>
            <div>
              <b>销量：{{item.saled}}</b>
              <i>￥{{item.price}}</i>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div style="height: 50px;">
      <footerbar/>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import footerbar from './footerbar';
  import entryNewGood from './entryNewGood';
  // import entryGoods from './entryGoods';
  import entryCategory from './entryCategory';
  import API_LIST from '../APIList.config';

  export default {
    name: "goodsType",
    data() {
      return {
        //大类数组
        getGoodsCategoryData: '',
        //商品数组
        getGoodsItem: '',
        //当前被点击的大类
        thisCategory: '',

        isLogin: false,
        isGoodsEntry: false,
        isCategoryEntry: false,

        //侧边栏激活项，默认为第一个
        activeKey: 0

        //四个输入框是否填完
        // isGoodsInfo: false,

        //空的录入框
        // emptyGoodsDom: [{}],

        //保存批量添加商品的数组，里面是每一新增商品的对象
        // entryGoodsObj: []
      }
    },
    created() {
      //录入框是否显示
      if (localStorage.username) {
        this.isLogin = true;
      }

      localStorage.setItem('inxState', 1);

      //获取商品大类
      this.getGoodsCategoryFn();
      //刚打开时，商品为第一个列表的
      this.goodsList1();
    },

    components: {
      footerbar,
      // entryGoods,
      entryNewGood,
      entryCategory
    },

    methods: {
      //EntryGoods 显示或隐藏
      entryGoods() {
        this.isGoodsEntry = !this.isGoodsEntry;
      },

      //添加大类
      entryCategory() {
        this.isCategoryEntry = !this.isCategoryEntry;
      },

      //添加到录入商品的对象，参数为子组件传进来的新添商品的对象
      // pushGoodsInfoFn(_goodsObj) {
      //   //判断商品名称是否和大数组里的商品重复
      //   let _is = true;
      //   for (let i = 0; i < this.entryGoodsObj.length; i++) {
      //     if (this.entryGoodsObj[i].n === _goodsObj.n) {
      //       _is = false;
      //       break;
      //     }
      //   }
      //   if (_is) {
      //     //如果新增商品合法，添加到大数组里，并将判断是否填完的变量设为true
      //     this.entryGoodsObj.push(_goodsObj);
      //     this.isGoodsInfo = true;
      //   } else {
      //     this.$dialog.alert({
      //       message: '商品名称重复'
      //     })
      //   }
      // },
      // //如果录入商品中有框没填完，将判断是否填完的变量设为false
      // isVoidFalseFn() {
      //   this.isGoodsInfo = false;
      // },
      // //四个输入框全部填完，新增一个添加商品的输入框，再将判断是否填完的变量重置为false
      // addGoodsInputBtn() {
      //   if (this.isGoodsInfo) {
      //     this.emptyGoodsDom.push({});
      //     this.isGoodsInfo = false;
      //   } else {
      //     this.$dialog.alert({
      //       message: '商品信息未填写完毕'
      //     })
      //   }
      // },

      // //提交新增的商品们
      // submitBtn() {
      //   //判断是否未填写商品
      //   if (this.entryGoodsObj.length <= 0) {
      //     this.$dialog.alert({
      //       message: '未填写商品'
      //     });
      //   } else {
      //     // 如果填写合法，再提交
      //     axios.post(API_LIST.insert_goods, this.entryGoodsObj)
      //       .then(_d => {
      //         this.$dialog.alert({
      //           message: _d.data.regInfo
      //         }).then(() => {
      //           // 录入窗口关掉
      //           this.isGoodsEntry = false;
      //           // 商品输入框重置
      //           this.emptyGoodsDom = [{}];
      //           // 保存商品的大对象重置
      //           this.entryGoodsObj = [];
      //           // 判断商品输入框是否填完的变量重置
      //           this.isGoodsInfo = false;
      //           //获得商品列表-大类
      //           this.getGoodsCategoryFn();
      //         })
      //       })
      //   }
      // },

      //获得商品列表-大类
      getGoodsCategoryFn() {
        axios.get(API_LIST.getAllCategoryName)
          .then(_d => {
            this.getGoodsCategoryData = _d.data;
          })
      },
      //刚打开页面，显示第一个大类的商品
      goodsList1() {
        axios.get(API_LIST.getGoodsItems, {params: {d: 'goodsList_1'}})
          .then(_d => {
            this.getGoodsItem = _d.data;
          })
      },
      //slideBar切换时请求该大类所对应的商品
      sidebarChange() {
        this.thisCategory = this.getGoodsCategoryData[this.activeKey];
        axios.get(API_LIST.getGoodsItems, {params: this.thisCategory})
          .then(_d => {
            this.getGoodsItem = _d.data;
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
      }
    }

  }
</script>

<style scoped>
  .main {
    background-color: #fafafa;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .bottom {
    display: flex;
    flex-direction: row;
  }

  .categoryList {
    width: 85px;
    display: flex;
    flex-direction: column;
    color: #999;
    height: calc(100vh - 50px);
    overflow: auto;
    box-sizing: border-box;
  }

  .goodsList {
    box-sizing: border-box;
    background-color: #fafafa;
    flex: 1;
    flex-direction: column;
    height: calc(100vh - 50px);
    overflow: auto;
  }

  .goodsItem {
    width: 95%;
    box-sizing: border-box;
    height: 100px;
    background-color: #fff;
    margin: 5px auto 0 auto;
    border-radius: 10px;
    padding: 5px 10px;
    text-align: left;
    display: flex;
    position: relative;
  }

  .goodsItem label {
    display: block;
    width: 80px;
    height: 100%;
    overflow: hidden;
    position: relative;
    border-radius: 10px;
    margin-right: 16px;
  }

  .goodsItem label img {
    height: 100%;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .goodsItem span {
    display: block;
    margin-top: 6px;
    font-weight: 500;
    font-size: 18px;
  }

  .goodsItem div {
    display: flex;
    flex: 1;
    width: 45%;
  }

  .goodsItem div b {
    position: absolute;
    right: 10px;
    bottom: 35px;
    font-weight: normal;
    display: block;
    font-size: 12px;
  }

  .goodsItem div i {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-style: normal;
    font-size: 14px;
    display: block;
    color: #ff3300;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  .goodEntry {
    width: 80%;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 112;
    padding: 10px;
    background: #ddd;
    border-radius: 10px;
    border: 1px solid #999;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
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

  .entryGoodsDivBg {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
    z-index: 111;
    position: absolute;
    top: 0;
    left: 0;
  }

  .imgSize {
    width: 100%;
    height: 100%;
  }
</style>
