<template>
  <div id="articleList">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 无限往下滑 触底更新数据  -->
      <van-list
        v-model="loading"
        :offset="50"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 这里使用index 是由于使用id 会导致key重复报错  -->
        <ArticleItem
          v-for="(article,index) in articleList"
          :key="index"
          :article="article"
          @click.native=" goArticleDetail(article.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
//引入相关组件或接口函数
//组件
import ArticleItem from "@/components/ArticleItem.vue";
//有关文章接口函数
import { getArticles } from "@/api/api/article.js";
export default {
  name: "ArticleList",
  //接收父组件传过来的值
  props: ["channel_id"],
  components: {
    ArticleItem,
  },
  data() {
    return {
      articleList: [], //储存文章列表
      loading: false, //加载状态
      finished: false, //加载完成触底
      timestamp: new Date().getTime(), //用于分页
      isLoading: false, //下拉刷新
    };
  },
  created() {
    this.getArticle(); //发送获取文章请求
  },
  methods: {
    async getArticle() {
      //调用获取文章列表接口
      //当id 变化会重新请求数据
      let res = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp,
      });
      //将文章列表数据赋值给articleList储存
      this.articleList = res.data.data.results;
      // console.log(res);
      // pre_timestamp
      // 下一段开头的那篇文章时间戳
      // 第一次 系统时间(timestamp) ->   后台 返回0-9条数据 ->携带第10条pre_timestamp值返回
      // 第二次 (timestamp)-上一次pre_timestamp (代表告诉后, 从指定的时间戳再往后找10个) 10-19条, 20条pre_timestamp返回
      this.timestamp = res.data.data.pre_timestamp;
    },
    //触底更新
    async onLoad() {
      //调用获取文章列表接口
      //当id 变化会重新请求数据
      let res = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp,
      });

      //将文章列表数据赋值给articleList储存
      this.articleList = [...this.articleList, ...res.data.data.results];
      this.timestamp = res.data.data.pre_timestamp;
      this.loading = false; //如果不关闭 则一直加载中 下次触底会再次触发onLoad
      //当数据没有时 停止刷新
      if (res.data.data.pre_timestamp == null) {
        this.finished = true;
      }
    },
    //下拉刷新
    onRefresh() {
      // 加定时器是感觉刷新太快了 可以不加
      setTimeout(() => {
        //清空原有数组
        this.articleList = [];
        //重新获取时间戳
        this.timestamp = new Date().getTime();
        //关闭加载状态
        this.isLoading = false;
        //重新发送请求
        this.getArticle();
      }, 500);
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

<style>
</style>