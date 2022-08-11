 <!-- 单片文章组件 -->
<template>
  <div id="articleItem">
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{article.title}}</span>
          <!-- 单图 通过vif判断是否显示 这样是为了合理布局 单张显示在标题右侧-->
          <img class="thumb" :src="article.cover.images[0]" v-if="article.cover.type==1" />
        </div>
        <!-- 多张图片 通过vif判断是否显示 这样是为了合理布局 多张显示在标题下方-->
        <div class="thumb-box" v-if="article.cover.type > 1">
          <img class="thumb" v-for="(img, index) in article.cover.images" :key="index" :src="img" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <!-- 文章名称 -->
            <span>{{article.aut_name}}</span>
            <!-- 文章阅读量 -->
            <span>{{article.comm_count}}</span>
            <!-- 文章发布时间 -->
            <span>{{formatTime(article.pubdate)}}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-show="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      @cancel="cancelBtn"
      @closed="closeBtn"
      :cancel-text="cancel"
      get-container="body"
    />
  </div>
</template>

<script>
// 点击"反馈垃圾内容"数据的切换
// 1. 监听点击事件, 区分用户点击的是哪一个
// 2. 切换actions数组里数据

// 二级反馈数据出现, 取消按钮文字要换成"返回"
// :cancel-text="bottomText" 设置变量, onSelect中, 把变量值换成"返回"

//  点击底部按钮, 要区分判断
// 1. 标签@cancel取消事件和事件方法
// 2. 在里面用bottomText的值, 判断用户点击的是否为"返回"
// 把actions数据源换会成firstActions
// bottomText文字换成"取消"
// 强制让反馈面板show = true留下

//引入 相关组件和接口函数
//时间处理函数
import { timeAgo } from "@/utils/date";
//面板数据方法
import { firstActions, secondActions } from "@/api/api/report";
//相应文章接口请求
import { getDislikes, getReports } from "@/api/api/article";
//vant组件
import { Notify } from "vant";
export default {
  name: "ArticleItem",
  //接收父组件传过来的article数据
  props: {
    article: Object,
    isShow: {
      type: Boolean,
      default: true, //默认显示反馈按钮 传入的值决定它显示与否
    },
  },
  methods: {
    formatTime: timeAgo, //时间处理函数
    async onSelect(item, index) {
      //item 面板对应内容 index 对应内容下表
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      if (item.name == "反馈垃圾内容") {
        //判断 字段 并复制相应数据
        this.actions = secondActions;
        this.cancel = "返回";
        // console.log(item);
      } else if (item.name == "不感兴趣") {
        //不需要res信息 所以无需声明res
        //发送不感兴趣请求
        /*  let res = */ await getDislikes(this.article.art_id);
        // console.log(res);
        Notify({ type: "success", message: "反馈成功" });
        this.show = false;
      } else {
        //不需要res信息 所以无需声明res
        //发送举报请求
        /*  let res = */ await getReports(this.article.art_id, index);
        // console.log(res);
        //改变相应的状态和数据 提示举报成功
        Notify({ type: "success", message: "举报成功" });
        this.show = false;
      }
    },
    cancelBtn() {
      //当面板cancel等于时
      //改变相应的状态和数据
      if (this.cancel == "返回") {
        this.show = true;
        this.actions = firstActions;
        this.cancel = "取消";
      }
    },
    closeBtn() {
      //关闭后 将面板数据还原
      this.actions = firstActions;
      this.cancel = "取消";
    },
  },
  data() {
    return {
      show: false, //反馈面板显示或隐藏
      actions: firstActions, //底部弹起的模态面板数据
      cancel: "取消", //反馈取消文字变量 可切换返回
    };
  },
};
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>