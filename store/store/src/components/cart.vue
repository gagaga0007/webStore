<template>
  <div style="display: flex;flex-direction: column;">

    <div style="height: 46px;">
      <!--header-->
      <van-nav-bar
        title="购物车"
        left-text="返回"
        right-text="清空购物车"
        left-arrow
        @click-left="goBack"
        @click-right="cartEmpty"
      />
    </div>

    <div style="flex: 1;">

      <!--显示无商品的文字盒子-->
      <div class="innerTxt" v-if="txtBoxShow">无 商 品</div>

      <!--goods-->
      <van-checkbox-group v-model="goodsResult" @change="countGoodsPrice" ref="checkboxGroup">
        <div class="goodsDiv" v-for="item in cartArr">
          <van-checkbox :name="item" :label-disabled="true" style="width: 100%;height: 100%;">
            <!--点击图片，跳转到指定商品页-->
            <label @click="goodsProductFn(item)"><img :src=item._img></label>
            <h4>{{item._goodsName}}</h4>
            <span class="goodsSpan">单价：{{item._price}}
            <i>
              <!--async-change必须为true，否则计算点击之前的值-->
              <!--步进器绑定的是该商品的数量，即_num-->
              <van-stepper
                v-model="item['_num']"
                disabled-input
                :async-change=true
                @plus="addBtnFn"
                @minus="minBtnFn"
                button-size="20px"
                style="display: inline"
              />
            </i>
            <div class="delBtn">
              <van-button icon="delete" type="danger" size="mini" @click="delGoods(item)">删除</van-button>
          </div>
          </span>


          </van-checkbox>
        </div>
      </van-checkbox-group>

    </div>

    <div style="height: 100px;">
      <!--submit-->
      <!--它的price单位是分，所以下方计算时候要*100-->
      <van-submit-bar
        :price="allGoodsPrice"
        :button-text="submitTxt"
        @submit="onSubmit"
      >
        <van-button type="default" @click="checkAll">全选</van-button>
      </van-submit-bar>

      <footerbar/>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';
  import footerbar from './footerbar';

  export default {
    name: "cart",
    data() {
      return {
        txtBoxShow: false,
        //提交时确认地址的
        realname: '',
        phone: '',
        address: '',

        //从localStorage里读取已经选取了的商品的数组
        cartArr: '',
        //所选择的商品的总价
        allGoodsPrice: 0,
        allGoodsNum: 0,
        //复选框绑定的数组，传进来的是选择的商品的对象，保存的是已经选择的商品
        goodsResult: [],
        //提交按钮的文本的默认值
        submitTxt: '未选择商品'
      }
    },

    created() {
      //先设置当前footbar的inxState
      localStorage.setItem('inxState', 2);

      //判断用户是否登录
      if (!localStorage.username) {
        this.$dialog.confirm({
          title: '尚未登录，是否跳转到登录页面？'
        }).then(() => {
          this.$router.push({path: '/login'});
        }).catch(() => {
          this.$router.go(-1);
        })

      } else if (localStorage.username) {
        //再获取localStorage中保存的已经选择的商品的数组，存在cartArr中
        this.cartArr = localStorage.cartDataInfo ? JSON.parse(localStorage.cartDataInfo) : [];
        //调用判断"无商品"的函数
        this.innerTxtFn();
        //获取用户的收货信息
        this.getUserInfo();
      }
    },

    components: {footerbar},

    methods: {
      //返回
      goBack() {
        this.$router.go(-1);
      },
      // 无商品时，显示"无商品"文字的盒子
      innerTxtFn() {
        this.txtBoxShow = (this.cartArr.length <= 0) ? true : false;
      },
      //确认用户地址的函数
      getUserInfo() {
        axios.post(API_LIST.getUserInfo, localStorage.username)
          .then(_d => {
            // 把收货信息保存在data中
            this.realname = _d.data.realName;
            this.phone = _d.data.phone;
            this.address = _d.data.address;
          })
      },
      //清空购物车
      cartEmpty() {
        if (this.cartArr.length > 0) {
          this.$dialog.confirm({
            title: '清空购物车？'
          }).then(() => {
            localStorage.removeItem('cartDataInfo');
            this.cartArr = '';
            this.goodsResult = [];
            this.allGoodsNum = 0;
            this.allGoodsPrice = 0;
            this.submitTxt = '未添加商品';
            this.innerTxtFn();
            this.$toast.success('购物车已清除');
          }).catch(() => {
          })
        } else {
          this.$toast.fail('无商品');
        }


      },
      //删除购物车的某一项的按钮
      delGoods(_item) {
        //删除某一项，删除carArr中的元素
        this.cartArr.map((_goods) => {
          //如果当前循环的元素和传进来的元素名称相同）
          if (_goods._id === _item._id) {
            //获取当前元素的下标
            let _inx = this.cartArr.indexOf(_goods);
            // 删除cartArr数组中的这个元素
            this.cartArr.splice(_inx, 1);
            // 同时也删除localStorage保存的这个数组的这个元素，cartArr和这个数组一样
            var _localArr = JSON.parse(localStorage.cartDataInfo);
            _localArr.splice(_inx, 1);
            //修改为JSON格式再保存到localStorage
            localStorage.cartDataInfo = _localArr.length > 0 ? JSON.stringify(_localArr) : [];

            //调用无商品文字显示与否的函数以及计算总数总价的函数
            this.innerTxtFn();
            this.countGoodsPrice();
          }
        });
        //如果是复选框选择了的情况，也要删除复选框数组goodsResult的元素
        this.goodsResult.map(_goods => {
          if (_goods._goodsName === _item._goodsName) {
            let _inx = this.goodsResult.indexOf(_goods);
            this.goodsResult.splice(_inx, 1);
          }
        });
      },

      //步进器添加数量
      addBtnFn() {
        this.countGoodsPrice();
      },
      //步进器减少数量
      minBtnFn() {
        this.countGoodsPrice();
      },

      //复选框组发生变化（即点击复选框）或者步进器发生变化时，计算总价以及商品总数
      countGoodsPrice() {
        //先重置为0
        this.allGoodsPrice = 0;
        this.allGoodsNum = 0;
        // 然后遍历goodsResult数组，计算总价以及商品总数，并修改提交按钮的文本
        this.goodsResult.map((_goods) => {
          this.allGoodsPrice += (_goods._price * _goods._num) * 100;
          this.allGoodsNum += _goods._num;
          this.submitTxt = '去结账(' + this.allGoodsNum + ')';
        });
        // 如果没选择商品，即goodsResult数组长度为0时，修改提交按钮的文本为默认
        if (this.goodsResult.length <= 0) {
          this.submitTxt = '未选择商品';
        }
      },

      // 下方全选按钮
      checkAll() {
        // 如果已经全选，即goodsResult数组长度和localStorage中保存的数组长度相等
        if (this.goodsResult.length === this.cartArr.length) {
          // 把复选框所有都取消全选
          this.$refs.checkboxGroup.toggleAll(false);
        } else {
          // 未全选，则将复选框所有都全选
          this.$refs.checkboxGroup.toggleAll(true);
        }
      },

      //点击某一商品的图片，跳转到指定商品页面
      goodsProductFn(_self) {
        this.$router.push({
          name: 'goodsProduct',
          query: {
            _goodsObjId: _self._id,
            _collectionName: _self._collection
          }
        })
      },

      //提交订单
      onSubmit() {
        //未选择商品时候
        if (this.goodsResult.length <= 0) {
          this.$toast.fail('未选择商品');
        } else if (this.realname === '' || this.phone === '' || this.address === '') {
          //没有收货信息的时候
          this.$dialog.alert({
            message: '您尚未填写收货信息！请到个人中心中填写收货信息。'
          });
        } else {
          //一切ok，提交，先提示收货信息
          this.$dialog.confirm({
            title: '确认地址',
            message: '姓名：' + this.realname + '\n' + '电话：' + this.phone + '\n'
              + '地址：' + this.address + '\n商品总数：' + this.allGoodsNum + '\n商品总价：' + Number(this.allGoodsPrice) / 100
          }).then(() => {
            //确认提交
            //初始化订单对象各个属性
            var _date = new Date().toLocaleString('chinese', {hour12: false});  //当前的时间
            var _names = [];  //用数组保存订单每个商品的商品名
            var _nums = [];   //用数组保存订单每个商品的数量
            var _imgs = [];   //用数组保存订单每个商品的图片
            var _collections = [];  //用数组保存订单每个商品所属的数据库表(增添销量用)
            var _ids = [];  //用数组保存订单每个商品的id
            //把购物车里选择的每一个商品的属性存在数组中
            for (let i = 0; i < this.goodsResult.length; i++) {
              _names.push(this.goodsResult[i]._goodsName);
              _nums.push(this.goodsResult[i]._num);
              _imgs.push(this.goodsResult[i]._img);
              _collections.push(this.goodsResult[i]._collection);
              _ids.push(this.goodsResult[i]._id);
            }
            //订单对象：用户名；时间、姓名数组、数量数组、图片数组、所属大类数组
            var _dataObj = {
              userName: localStorage.username,
              _orderObj: {
                date: _date,
                names: _names,
                nums: _nums,
                imgs: _imgs,
                collections: _collections,
                _ids: _ids,
                price: Number(this.allGoodsPrice) / 100,
                userInfo: {
                  realname: this.realname,
                  phone: this.phone,
                  address: this.address
                }
              }
            };

            //发送post请求
            axios.post(API_LIST.submitCart, _dataObj)
              .then(_d => {
                if (_d.data.reg_code === 11) {  //返回的信息，如果成功
                  //新设置一个数组，保存localStorage中的cartDataInfo，之后更新localStorage的cartDataInfo用的
                  let _arr = JSON.parse(localStorage.cartDataInfo);
                  //订单提交后，会删除支付的商品，即goodsList数组里的元素，把_arr中与其相同的商品删除
                  for (let i = 0; i < _arr.length; i++) {
                    for (let j = 0; j < this.goodsResult.length; j++) {
                      if (_arr[i]._id === this.goodsResult[j]._id) {
                        _arr.splice(i, 1);
                        //转换为JSON格式，存入localStorage
                        localStorage.cartDataInfo = JSON.stringify(_arr);
                      }
                    }
                    //无商品框框显示与否的函数
                    this.innerTxtFn();
                  }
                  //cartArr中也删除被支付的商品，会重新渲染购物车页面
                  for (let i = 0; i < this.cartArr.length; i++) {
                    for (let j = 0; j < this.goodsResult.length; j++) {
                      if (this.cartArr[i]._id === this.goodsResult[j]._id) {
                        this.cartArr.splice(i, 1);
                      }
                    }
                    //无商品框框显示与否的函数
                    this.innerTxtFn();
                  }

                  //因为每次提交之后都要重新再选择要提交的商品，所以将总价和总数和提交订单的文字重置
                  this.allGoodsPrice = 0;
                  this.allGoodsNum = 0;
                  this.submitTxt = '未选择商品';
                  //也要重置保存选择的商品的数组
                  this.goodsResult = [];

                  //提示信息
                  this.$toast.success(_d.data.regInfo);
                }
              })
          }).catch(() => {
          })
        }
      }
    }
  }
</script>

<style scoped>
  h4 {
    margin: 0 0 10px 0;
    text-align: left;
  }

  .goodsDiv .goodsSpan {
    display: block;
    font-size: 14px;
    text-align: left;
  }

  .delBtn {
    position: absolute;
    right: 0;
    bottom: 10px;
    text-align: center;
  }

  .goodsDiv i {
    float: right;
  }

  .cle:after {
    content: '.';
    overflow: hidden;
    visibility: hidden;
    height: 0;
    display: block;
    clear: both;
  }

  .goodsDiv {
    width: 95%;
    height: 102px;
    margin: 15px auto;
    clear: both;
    position: relative;
  }

  .goodsDiv label {
    float: left;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-right: 20px;
  }

  .goodsDiv label img {
    width: 100%;
    height: 100%;
  }

  .goodsDiv h2 {
    font-size: 22px;
  }

  .innerTxt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: #ccc;
  }

  .van-submit-bar {
    bottom: 50px;
  }

  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

</style>
