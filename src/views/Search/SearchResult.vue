<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 文章列表 -->
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onLoad"> -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="true"
    >
      <div class="articleList">
        <!--
           @click.native=" goArticleDetail(article.art_id)
        直接绑定click是不行的 需要加修饰符
        -->
        <ArticleItem
          v-for="article in articleList"
          :key="article.art_id"
          :article="article"
          :isShow="false"
          @click.native=" goArticleDetail(article.art_id)"
        ></ArticleItem>
      </div>
    </van-list>
    <!-- </van-pull-refresh>  -->
  </div>
</template>

<script>
//引入搜索请求相关接口
import { getSearch } from "@/api/api/search";
//引入组件
import ArticleItem from "@/components/ArticleItem";

export default {
  name: "SearchResult",
  components: {
    ArticleItem,
  },
  data() {
    return {
      page: 1, //显示第一页数据
      pre_page: 10, //每页显示文章书
      articleList: [], //文章列表
      loading: false, //加载状态
      finished: false, //加载全部完成
      isLoading: false, //下拉刷新状态
    };
  },
  created() {
    this.getSearchList(); //发送请求 获取搜索文章列表
  },
  methods: {
    //获取搜索列表
    async getSearchList() {
      // 发送请求
      let res = await getSearch(
        this.page,
        this.pre_page,
        this.$route.params.kw
      );
      // 判断是否有更多数据 没有直接停止
      if (res.data.data.results.length === 0) {
        this.finished = true;
        return;
      }
      // 合并数据
      this.articleList = [...this.articleList, ...res.data.data.results];
      this.loading = false;
    },
    //下拉刷新获取跟多数据
    onLoad() {
      //下拉获取更多数据
      if (this.articleList.length > 0) {
        this.page++;
        this.getSearchList();
      }
    },
    //点击文章 进行路由跳转 并传递点击文章的id
    goArticleDetail(art_id) {
      this.$router.push({
        path: `/articleDetail?id=${art_id}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>