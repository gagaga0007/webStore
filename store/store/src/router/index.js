import Vue from 'vue'
import Router from 'vue-router'
import shopCart from '../components/shopCart';
import register from '../components/register';
import login from '../components/userLogin';
import goodsType from '../components/goodsType';
import goodsProduct from '../components/goodsProduct';
import cart from '../components/cart';
import userAccount from '../components/userAccount';
import updateDescribe from '../components/updateDescribe';
import updatePassword from '../components/updatePassword';
import userInfo from '../components/userInfo';
import userOrders from '../components/userOrders';
import oldPassword from '../components/oldPassword';
import search from '../components/search';

import adminIndex from '../components/admin/index';
import categorySetting from '../components/admin/categorySetting';
import addGoods from '../components/admin/addGoods';
import updateGoods from '../components/admin/updateGoods';
import delGoods from '../components/admin/delGoods';
import allOrders from '../components/admin/allOrders';
import returnedOrders from '../components/admin/returnedOrders';
import shippedOrders from '../components/admin/shippedOrders';
import indexShow from '../components/admin/indexShow';
import updateCategory from '../components/admin/updateCategory';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'shopCart',
      component: shopCart
    }, {
      path: '/register',
      name: 'register',
      component: register
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/goodsType',
      name: 'goodsType',
      component: goodsType
    }, {
      path: '/goodsProduct',
      name: 'goodsProduct',
      component: goodsProduct
    }, {
      path: "/cart",
      name: "cart",
      component: cart
    }, {
      path: '/userAccount',
      name: 'userAccount',
      component: userAccount
    }, {
      path: '/updateDescribe',
      name: 'updateDescribe',
      component: updateDescribe
    }, {
      path: '/updatePassword',
      name: 'updatePassword',
      component: updatePassword
    }, {
      path: '/userInfo',
      name: 'userInfo',
      component: userInfo
    }, {
      path: '/userOrders',
      name: 'userOrders',
      component: userOrders
    }, {
      path: '/oldPassword',
      name: 'oldPassword',
      component: oldPassword
    }, {
      path: '/search',
      name: 'search',
      component: search
    }, {
      path: '/adminIndex',
      name: 'adminIndex',
      component: adminIndex,
      redirect: '/indexShow',//默认右侧打开的组件
      children: [
        {
          path: '/categorySetting',
          name: 'categorySetting',
          component: categorySetting
        }, {
          path: '/addGoods',
          name: 'addGoods',
          component: addGoods
        }, {
          path: '/updateGoods',
          name: 'updateGoods',
          component: updateGoods
        }, {
          path: '/delGoods',
          name: 'delGoods',
          component: delGoods
        }, {
          path: '/allOrders',
          name: 'allOrders',
          component: allOrders
        }, {
          path: '/returnedOrders',
          name: 'returnedOrders',
          component: returnedOrders
        }, {
          path: '/shippedOrders',
          name: 'shippedOrders',
          component: shippedOrders
        }, {
          path: '/indexShow',
          name: 'indexShow',
          component: indexShow
        }, {
          path: '/updateCategory',
          name: 'updateCategory',
          component: updateCategory
        }
      ]
    }

  ]
})
