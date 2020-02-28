import axios from 'axios';
import API_LIST from '../../APIList.config';

//保存的数据
const state = {
  //全部订单
  allOrders: '',
  //待发货订单
  shippedOrders: [],
  //待退货订单
  returnedOrders: [],
  //待发货订单数量
  shippedNum: 0,
  //待退货订单数量
  returnedNum: 0
};

//映射到页面的数据
const getters = {
  //全部订单
  allOrders: state => state.allOrders,
  //待发货订单
  shippedOrders: state => state.shippedOrders,
  //待退货订单
  returnedOrders: state => state.returnedOrders,
  //待发货订单数量
  shippedNum: state => state.shippedNum,
  //待退货订单数量
  returnedNum: state => state.returnedNum
};

//映射的事件
const actions = {
  //获取订单
  getOrders({commit}) {
    commit('getOrders');
  }
};

//逻辑操作
const mutations = {
  //获取订单
  getOrders(state) {
    //首先先把各个变量先重置一遍
    state.shippedOrders = [];
    state.returnedOrders = [];
    state.shippedNum = 0;
    state.returnedNum = 0;
    //再进行请求
    axios.get(API_LIST.adminGetOrders)
      .then(_d => {
        //全部订单数组
        state.allOrders = _d.data.sort((a, b) => {
          let _var1 = a.date;
          let _var2 = b.date;
          //上网找的方法,按时间排序
          return _var1 > _var2 ? -1 : _var1 < _var2 ? 1 : 0;
        });

        //待发货订单数组
        state.allOrders.map(_d => {
          if (_d.status === '未发货') {
            state.shippedOrders.push(_d);
            state.shippedNum++;
          }
        });

        //待退货订单数组
        state.allOrders.map(_d => {
          if (_d.status === '退货中') {
            state.returnedOrders.push(_d);
            state.returnedNum++;
          }
        })
      })
  }
};


export default {
  state,
  getters,
  actions,
  mutations
}
