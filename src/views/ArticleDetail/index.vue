<template>
  <div id="articleDetail">
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{article.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="article.aut_name" :label="article.pubdate">
        <template #icon>
          <img :src="article.aut_photo" alt="图片出小差了" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="article.is_followed"
              @click="reqUnFollowing"
            >已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="reqFollowing">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞-->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          @click="reqDisLiking"
          v-if="article.attitude"
        >已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" @click="reqLiking" v-else>点赞</van-button>
      </div>
    </div>

    <!-- 评论区 -->
    <CommentList></CommentList>
  </div>
</template>

<script>
import { getArticleDetail } from "@/api/api/article";
import {
  reqFollowings,
  reqUnFollowings,
  reqDisLikings,
  reqLikings,
} from "@/api/api/user";
import CommentList from "./CommentList";
export default {
  name: "ArticleDetail",
  components: {
    CommentList,
  },
  data() {
    return {
      id: this.$route.query.id, //携带的路由参数
      article: [], //文章内容
    };
  },
  created() {
    this.getArticle(); //获取文章请求
  },
  methods: {
    //获取文章请求
    async getArticle() {
      let res = await getArticleDetail(this.id);
      // console.log(res);
      this.article = res.data.data;
    },
    //关注用户
    async reqFollowing() {
      this.article.is_followed = true;
      /*     let res =  */ await reqFollowings(this.article.aut_id);
      // console.log(res);
    },
    //取消关注
    async reqUnFollowing() {
      this.article.is_followed = false;
      /* let res = */ await reqUnFollowings(this.article.aut_id);
      // console.log(res);
    },
    //点赞
    async reqLiking() {
      let res = await reqLikings(this.article.art_id);
      console.log(res);
      this.article.attitude = 1;
    },
    // 取消点赞
    async reqDisLiking() {
      let res = await reqDisLikings(this.article.art_id);
      console.log(res);
      this.article.attitude = 0;
    },
  },
};
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>