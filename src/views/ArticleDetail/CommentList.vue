<template>
  <div>
    <!-- 评论列表 -->
    <div
      id="comment"
      class="cmt-list"
      :class="{'art-cmt-container-1':isShow,'art-cmt-container-2':!isShow}"
    >
      <!-- 评论的 Item 项 -->
      <!-- list 包裹的是评论列表 而不是外部div -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="cmt-item" v-for="result in results" :key="result.cim_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="result.aut_photo" class="avatar" />

              <span class="uname">{{result.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="result.is_liking"
                @click="reqCommentDisLiking(result)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="reqCommentLiking(result)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{result.content}}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(result.pubdate)}}</div>
        </div>
      </van-list>
    </div>
    <!-- 写评论 -->
    <div class="comment">
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggle">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount?totalCount:''" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="goComment" />
          </van-badge>
          <van-icon
            name="star"
            color="red"
            size="0.53333334rem"
            @click="reqUnCollection"
            v-if="collect"
          />
          <van-icon name="star-o" size="0.53333334rem" @click="reqCollection" v-else />

          <van-icon name="share-o" size="0.53333334rem" @click="isShowShare" />
          <van-share-sheet
            v-model="showShare"
            :options="options"
            title="立即分享给好友"
            description="描述信息"
            get-container="body"
            @select="select"
          />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-inputFocus v-model="content" @blur="blur"></textarea>
        <van-button type="default" @click="reqComment" :disabled="!content">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
//引入文章相关接口
import { getComments } from "@/api/api/article";
//引入用户相关接口
import {
  reqComments,
  reqCommentLikings,
  reqCommentDisLikings,
  reqCollections,
  reqUnCollections,
} from "@/api/api/user";
//引入处理时间函数
import { timeAgo } from "@/utils/date";
import { Toast } from "vant";
export default {
  name: "CommentList",
  data() {
    return {
      results: [], //评论列表
      isShow: true, //底部显示短/高的评论容器
      totalCount: 0, //评论总数量
      id: this.$route.query.id, //文章id
      content: "", //评论内容
      offset: "", //评论偏移量
      last_id: "", //最后一个评论的id
      loading: false, //加载状态
      finished: false, //完成获取最后评论
      collect: true, //收藏
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
    };
  },
  created() {
    this.getComment(); //获取评论
  },
  methods: {
    isShowShare() {
      this.showShare = true;
    },
    select(option) {
      Toast(`成功复制${option.name}链接`);
      this.showShare = false;
    },
    //下拉评论刷持续获取评论
    async onLoad() {
      if (this.results.length > 0) {
        //发送请求 这里可以封装 后期有时间在弄
        let res = await getComments(this.id, this.offset);
        //合并两个数组
        this.results = [...this.results, ...res.data.data.results];
        //设置评论开始的位置
        this.offset = res.data.data.end_id;
        //获取到下一组评论后 关闭加载状态
        this.loading = false;
        //当评论为最后一个时 显示完成获取所有评论
        if (this.last_id === res.data.data.last_id) {
          this.finished = true;
        }
      } else {
        //数组为零 但是会一直加载 需要关闭加载状态
        this.loading = false;
      }
    },
    //获取评论
    async getComment() {
      let res = await getComments(this.id);
      // 将评论结果 赋值给result保存
      this.results = res.data.data.results;
      this.offset = res.data.data.end_id;
      this.last_id = res.data.data.last_id;
      this.totalCount = res.data.data.total_count;
      // console.log(this.results);
    },

    //处理时间函数 key val 一致 省略val
    timeAgo,
    //切换评论框
    toggle() {
      this.isShow = false;
    },

    //失去焦点
    blur() {
      //由于失去焦点后不能 点击发布评论 加定时器解决
      setTimeout(() => {
        this.isShow = true;
      }, 0);
    },
    //发表对文章的评论
    async reqComment() {
      let res = await reqComments(this.id, this.content);
      // console.log(res);
      //这里也可以重新发送获取评论请求
      this.results.unshift(res.data.data.new_obj);
      // console.log(this.results);
      //将评论数加一
      this.totalCount++;
      //清空输入框内容
      this.content = "";
    },
    //对评论进行点赞
    async reqCommentLiking(result) {
      /*  let res = */ await reqCommentLikings(result.com_id);
      // console.log(res);
      result.is_liking = true;
    },
    //对评论取消点赞
    async reqCommentDisLiking(result) {
      /* let res =  */ await reqCommentDisLikings(result.com_id);
      // console.log(res);
      result.is_liking = false;
    },
    //跳转 评论
    goComment() {
      //跳转 到下方评论区  ！！！！
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      document.querySelector(".like-box").scrollIntoView({
        behavior: "smooth",
      });
    },
    //收藏文章
    //这里参数错误 原因没找到
    async reqCollection() {
      // console.log(this.id);
      // let res = await reqCollections(this.id);
      // console.log(res);
      this.collect = true;
    },
    //取消收藏文章
    async reqUnCollection() {
      /* let res = */ await reqUnCollections(this.id);
      // console.log(res);
      this.collect = false;
    },
  },
};
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
