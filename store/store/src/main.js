import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {
  Button,
  NavBar,
  Field,
  Notify,
  Dialog,
  Tab,
  Tabs,
  Tabbar,
  TabbarItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  Popup,
  Picker,
  Stepper,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Toast,
  Icon,
  Cell,
  CellGroup,
  ActionSheet,
  AddressList,
  AddressEdit,
  Area,
  Panel,
  Sticky,
  Sidebar,
  SidebarItem,
  Lazyload,
  Swipe,
  SwipeItem,
  Search
} from 'vant';

Vue.use(Button).use(NavBar).use(Field).use(Notify)
  .use(Dialog).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem)
  .use(GoodsAction).use(GoodsActionButton).use(GoodsActionIcon)
  .use(Sku).use(Popup).use(Picker).use(Stepper).use(Icon)
  .use(Checkbox).use(CheckboxGroup).use(SubmitBar).use(Toast)
  .use(Cell).use(CellGroup).use(ActionSheet).use(AddressList)
  .use(AddressEdit).use(Area).use(Panel).use(Sticky)
  .use(Sidebar).use(SidebarItem).use(Lazyload, {lazyComponent: true})
  .use(Swipe).use(SwipeItem).use(Search);

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
