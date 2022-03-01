<template>
  <div class='container'>
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 瀑布流加载 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
              @load="onLoad">
      <van-cell
        v-for="item in searchList"
        :key="item.art_id.toString()"
        :title="item.title"
        />
    </van-list>
  </div>
</template>

<script>
import { apiSearchList } from '@/api/search.js'
export default {
  name: 'search-result',
  data () {
    return {
      // 瀑布相关
      list: [],
      loading: false,
      finished: false,

      page: 1, // 页码
      per_page: 10, // 每页条数
      searchList: [] // 检索到的文章列表
    }
  },
  computed: {
    q: function () {
      // q是路由参数名称
      return this.$route.params.q
    }
  },
  // created () {
  //   this.getSearchList()
  // },
  methods: {
    // 瀑布加载--同时对文章做检索获取
    async onLoad () {
      await this.$sleep(1000) // 暂停1s，不要太着急加载

      // 根据关键字、分页条件 获得文章数据
      const result = await apiSearchList({
        q: this.q,
        page: this.page,
        per_page: this.per_page
      })
      // 加载状态结束
      this.loading = false

      if (!result.results.length) {
        // 数据全部加载完成
        this.finished = true // 瀑布停止了
        return false
      }
      // 追加数据
      this.searchList.push(...result.results)
      // 页码累加
      this.page++
    }
    // // 文章列表检索
    // async getSearchList () {
    //   const result = await apiSearchList({ q: this.q })
    //   // console.log(result)
    //   // data接收
    //   this.searchList = result.results
    // }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
