<template>
  <div class="main">
    <div style="height: 46px;">
      <van-nav-bar title="我的订单"
                   left-text="返回"
                   left-arrow
                   @click-left="goBack"
      />
    </div>

    <div style="flex: 1;">
      <van-tabs v-model="active">

        <van-tab title="全部">
          <div v-for="order in allOrders">
            <van-panel :title=order.date :status=order.status>
              <div class="item" v-for="(item,inx) in order.names">
                <label><img :src=order.imgs[inx]></label>
                <span>{{order.names[inx]}}</span>
                <i>×{{order.nums[inx]}}</i>
              </div>
              <div slot="footer" class="foot">
                <b>总价： ￥{{order.price}}</b>
                <!--根据订单的不同状态，通过v-if显示不同的按钮-->
                <van-button size="small" @click="deleteOrder(order.date)"
                            v-if="order.status!=='退货中'&&order.status!=='进行中'&&order.status!=='未发货'"
                >
                  删除
                </van-button>
                <van-button size="small" @click="setOrder(order.date, '已取消')"
                            v-if="order.status === '未发货'"
                >
                  取消
                </van-button>
                <van-button size="small" @click="setOrder(order.date, '退货中')"
                            v-if="order.status==='进行中'"
                >
                  退货
                </van-button>
                <van-button size="small" type="danger" @click="setOrder(order.date, '已完成')"
                            v-if="order.status==='进行中'"
                >
                  确认收货
                </van-button>
                <van-button size="small" @click="setOrder(order.date, '进行中')"
                            v-if="order.status==='退货中'"
                >
                  取消退货
                </van-button>
              </div>
            </van-panel>
          </div>
          <div class="txt" v-if="!allShow">没有更多订单啦</div>
          <div class="txtBox" v-if="allShow">无 商 品</div>
        </van-tab>

        <van-tab title="未发货">
          <div v-for="order in noOrders">
            <van-panel :title=order.date :status=order.status>
              <div class="item" v-for="(item,inx) in order.names">
                <label><img :src=order.imgs[inx]></label>
                <span>{{order.names[inx]}}</span>
                <i>×{{order.nums[inx]}}</i>
              </div>
              <div slot="footer" class="foot">
                <b>总价： ￥{{order.price}}</b>
                <van-button size="small" @click="setOrder(order.date, '已取消')">取消</van-button>
              </div>
            </van-panel>
          </div>
          <div class="txt" v-if="!noShow">没有更多订单啦</div>
          <div class="txtBox" v-if="noShow">无 商 品</div>
        </van-tab>

        <van-tab title="进行中">
          <div v-for="order in onOrders">
            <van-panel :title=order.date :status=order.status>
              <div class="item" v-for="(item,inx) in order.names">
                <label><img :src=order.imgs[inx]></label>
                <span>{{order.names[inx]}}</span>
                <i>×{{order.nums[inx]}}</i>
              </div>
              <div slot="footer" class="foot">
                <b>总价： ￥{{order.price}}</b>
                <van-button size="small" @click="setOrder(order.date, '退货中')">退货</van-button>
                <van-button size="small" type="danger" @click="setOrder(order.date, '已完成')">确认收货</van-button>
              </div>
            </van-panel>
          </div>
          <div class="txt" v-if="!onShow">没有更多订单啦</div>
          <div class="txtBox" v-if="onShow">无 商 品</div>
        </van-tab>

        <van-tab title="退货中">
          <div v-for="order in tuiOrders">
            <van-panel :title=order.date :status=order.status>
              <div class="item" v-for="(item,inx) in order.names">
                <label><img :src=order.imgs[inx]></label>
                <span>{{order.names[inx]}}</span>
                <i>×{{order.nums[inx]}}</i>
              </div>
              <div slot="footer" class="foot">
                <b>总价： ￥{{order.price}}</b>
                <van-button size="small" @click="setOrder(order.date, '进行中')">取消退货</van-button>
              </div>
            </van-panel>
          </div>
          <div class="txt" v-if="!tuiShow">没有更多订单啦</div>
          <div class="txtBox" v-if="tuiShow">无 商 品</div>
        </van-tab>

      </van-tabs>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "userOrders",
    data() {
      return {
        active: 0,
        userName: '',

        //各类型的订单数组
        allOrders: '',
        noOrders: [],
        onOrders: [],
        tuiOrders: [],

        //各类型订单的无商品框框是否显示
        allShow: true,
        noShow: true,
        onShow: true,
        tuiShow: true
      }
    },
    created() {
      this.userName = localStorage.username;

      //获得全部订单，无商品框框是否显示，各类型的按钮显示情况
      this.getOrders();
      this.txtFn();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      //无商品是否显示的box
      txtFn() {
        this.allShow = this.allOrders.length > 0 ? false : true;
        this.noShow = this.noOrders.length > 0 ? false : true;
        this.onShow = this.onOrders.length > 0 ? false : true;
        this.tuiShow = this.tuiOrders.length > 0 ? false : true;
      },

      //获取订单
      getOrders() {
        axios.post(API_LIST.getOrders, this.userName)
          .then(_d => {
            //根据返回的对象的时间排序，赋值给allOrders总数组
            if (_d.data.length > 0) {
              this.allOrders = _d.data.sort((a, b) => {
                let _var1 = a.date;
                let _var2 = b.date;
                //上网找的方法
                return _var1 > _var2 ? -1 : _var1 < _var2 ? 1 : 0;
              });

              //把结果加入对应的数组中
              this.allOrders.map(_d => {
                if (_d.status === '未发货') {
                  this.noOrders.push(_d);
                } else if (_d.status === '进行中') {
                  this.onOrders.push(_d);
                } else if (_d.status === '退货中') {
                  this.tuiOrders.push(_d);
                }
              });
            }
            this.txtFn();
          })
      },

      //删除订单
      deleteOrder(_date) {
        this.$dialog.confirm({
          title: '确认删除？'
        }).then(() => {
          let _delObj = {
            username: localStorage.username,
            date: _date
          };
          axios.post(API_LIST.delOrder, _delObj)
            .then(_d => {
              if (_d.data.reg_code === 18) {
                this.$toast.success(_d.data.regInfo);
                //重新获取订单，并设置无商品框框是否显示
                this.noOrders = [];
                this.onOrders = [];
                this.tuiOrders = [];
                this.getOrders();
                this.txtFn();
              } else {
                this.$toast.fail('删除失败');
              }
            })
        }).catch(() => {
        })
      },

      //对订单的各种操作
      setOrder(_date, _txt) {
        this.$dialog.confirm({
          title: '确认操作？'
        }).then(() => {

          let _obj = {
            username: localStorage.username,
            date: _date,
            txt: _txt
          };
          axios.post(API_LIST.setOrder, _obj)
            .then(_d => {

              if (_d.data.reg_code === 19) {
                this.$toast.success(_d.data.regInfo);
                //将所有数组重置，并重新调用获取商品的函数以及无商品框框是否显示的函数
                this.noOrders = [];
                this.onOrders = [];
                this.tuiOrders = [];
                this.getOrders();
                this.txtFn();
              } else {
                this.$toast.fail('操作失败');
              }
            })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped>
  .main {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .txtBox {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translate(-50%);
    color: #ccc;
    font-size: 30px;
  }

  .item {
    text-align: left;
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    width: 100%;
    position: relative;
  }

  .item label {
    display: inline-block;
    width: 70px;
    height: 70px;
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
    left: 90px;
    font-size: 18px;
    font-weight: 500;
  }

  .item i {
    text-align: right;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  b {
    flex: 1;
    text-align: left;
    padding-bottom: 5px;
  }

  .foot {
    width: 100%;
    text-align: right;
    display: flex;
  }

  .txt {
    font-size: 12px;
    color: #999999;
    margin: 10px auto;
  }

  .van-cell__title {
    text-align: left;
  }

  .van-cell {
    padding: 5px 10px;
  }

  .van-panel {
    margin: 15px 0;
  }

  .van-panel__content {
    padding: 5px 5px 0;
    clear: both;
  }

  .van-button--small {
    margin: 0 5px;
  }

  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .van-tab__pane {
    background-color: #eee;
    padding-bottom: 10px;
    min-height: calc(100vh - 105px);
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
</style>
