// 导入axios模块
import request from '@/utils/request.js'

// 频道各种api创建

// 导入vuex模块，以便知道当前用户是否登录系统 store.state.user.token
import store from '@/store'

// 本地持久化存储频道设置的key(游客 和 登录用户 分别设置)
// 定义localStorage的key的名称
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key

/**
 * 删除频道
 * @param {被删除频道的id} id
 */
export function apiChannelDel (id) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key

    // 频道不能通过localStorage直接对"某个项目"做删除，必须取出来操作
    // 操作完毕再把数据更新给localStorage
    const localChannels = localStorage.getItem(key) // 获取缓存

    // 缓存有数据
    let channels = JSON.parse(localChannels)
    // 通过id，把被删除的频道中全部的数据里边排除出去
    channels = channels.filter(item => item.id !== id)

    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    resolve() // 成功执行
  })
}

// 添加频道
export function apiChannelAdd (channel) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key

    const localChannels = localStorage.getItem(key) // 获取缓存
    // 频道不会为空，最少会保留“推荐”频道项目

    // 缓存有数据
    const channels = JSON.parse(localChannels) // 频道 字符串 变为 对象
    // localStorage内部存储的频道数据样子
    // [{id:xx,name:xx},{id:xx,name:xx}……]
    channels.push(channel) // 添加{id:xx,name:xx}

    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    // 成功执行，没有任何返回信息(添加操作代码、系统没有问题，业务上不会出错)
    // 成功率100%
    resolve()
  })
}

// 首先获得本地缓存localStorage频道
// 有-->直接使用
// 没有-->走axios获取-->存储给localStorage(供下次使用)
// 同时要考虑用户是否有登录系统
// 登录 和 未登录 用户分别独立存储自己的频道数据、
/**
 * 获取用户频道列表数据
 * 已登录、未登录 都可以获取
 */
// 获得用户频道数据
export function apiChannelList () {
  // 通过Promise封装，通过resolve返回输出具体信息，await修饰就接收到了
  // 因为所有api接口的返回结果都是Promise对象，这样做兼容性更好，应用层代码就不用改了
  return new Promise(async (resolve) => {
    // 判断用户是否登录，并执行不同的key(localStorage)
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL

    // 获取本地频道数据
    const localChannels = localStorage.getItem(key)

    // localStorage内部存储的频道数据样子
    // [{id:xx,name:xx},{id:xx,name:xx}……]

    if (localChannels) {
      // 输出频道数据给外部
      resolve({ channels: JSON.parse(localChannels) })
    } else {
      // 频道没有被缓存
      const result = await request({
        url: '/app/v1_0/user/channels',
        method: 'get'
      })
      // 本地存储频道数据
      localStorage.setItem(key, JSON.stringify(result.channels))
      // 输出频道数据给外部
      resolve(result)
    }
  })
}

/**
 * 获取用户频道列表数据
 * 已登录、未登录 都可以获取
 */
// export function apiChannelList () {
//   return request({
//     url: '/app/v1_0/user/channels',
//     method: 'get'
//   })
// }

/**
 * 获取所有频道数据
 */
export function apiChannelAll () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
