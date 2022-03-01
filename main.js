import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// rem 基准值适配
import 'amfe-flexible/index.min.js'

// 导入Vant组件库，按需再导入Lazyload模块
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

// 导入全局样式控制文件(注意：在vant的样式文件之后做引入)
import '@/assets/css/global.less'

// 对vee-validate校验规则到导入
import '@/utils/validate.js'

// 全部过滤器
import * as filters from '@/utils/filters.js' // global filters

// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 注册，一次性把全部的应用组件都注册好，插件机制
Vue.use(Vant)
Vue.use(Lazyload) // 插件完成注册，注册了一个全局指令 install(Obj){Obj.directive('lazyload',xxx)}

// 创建一个延迟器，
// 给Vue增加继承成员，名称$sleep，也可以自定义为其他
Vue.prototype.$sleep = time => {
  // 返回一个Promise对象，应用端可以设置async/await使得异步变为同步
  // ，同步可以使得后续代码都按照先后顺序执行
  return new Promise((resolve) => {
    // 定时器，规定在多久之后做一点事情，可以设定当前的延迟器等待的时间
    window.setTimeout(() => {
      // 该resolve()没有任何实质数据，应用端也不用接受
      resolve()
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 使得手机的物理返回按键，针对该项目生效，就设置如下代码
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
