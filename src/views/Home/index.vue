<template>
  <div id="home">
    <!-- 头部导航 -->
    <div class="nav">
      <!--   fixed 可以让头部div带固定定位样式
            (原理: 给组件内props传入true/false)
      (影响到组件内的动态样式:class)-->
      <van-nav-bar fixed>
        <!-- 插槽 左侧logo -->
        <template #left>
          <img src="@/assets/toutiao_logo.png" alt />
        </template>
        <!-- 插槽 右侧搜索图标 -->
        <template #right>
          <!-- 注意：postcss只能翻译style里的css样式代码，标签内行内样式它无法转换px到rem，需要自己手动计算 -->
          <van-icon name="search" size="0.48rem" @click="$router.push('/search')" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab栏导航 -->
    <div class="tab">
      <!-- 1. tab栏导航
      van-tabs 一行容器
      van-tab 每个tab栏
      v-model关联的激活项的下标(双向绑定)
      tab栏+内容
      2. 坑: sticky参照"父级div标签"进行粘性布局, 如果body/html设置高度, 父级div一起走了, 所以内部sticky也上去的
      3. (重要)每个van-tab代表一个标签导航, 中间夹着内容, 对应的下属列表内容
      4. (重要)每个van-tab都对应"独立的自己"的ArticleList(多次)
      5. 细节
      van-tab循环了很多标签导航, 与之一一对应的内容列表不是上来都创建的, 默认创建当前激活导航对应列表组件
      第一次切换到对应频道时, 才会创建下属的ArticleList组件->created方法
      第二次切换就是显示/隐藏切换
      -->
      <!-- swipeable 开启手势滑动 -->
      <van-tabs
        v-model="channel_id"
        sticky
        animated
        offset-top="1.226667rem"
        line-height="1px"
        color="skyblue"
        title-active-color="skyblue"
        swipeable
      >
        <!--// 问题: 每次切换tab拿到的数据都是新的
            // 即使你用keep-alive也没用(防止组件被销毁, 而你的组件没有销毁, 是在点击切换数据)
            // 解决: 外面现在用的是同一个数组切换数据(多个ArticleList用的是同一个数组, 换会影响别人)
            // 文章列表数据, 请求, 数组, 分别放入到ArticleList内部(自己请求自己的数据)
        // 外面只负责传入当前激活的频道ID-->
        <!-- van-tab name属性一定要写 不然编辑跳转会对不上！！！！ -->
        <van-tab
          :title="channel.name"
          v-for="channel in channels"
          :key="channel.id"
          :name="channel.id"
        >
          <!-- 将 channel_id传给子组件 -->
          <ArticleList :channel_id="channel_id"></ArticleList>
        </van-tab>
      </van-tabs>

      <!-- 右侧加号图标 -->
      <van-icon name="plus" @click="showPopup" size="0.37333334rem" class="moreChannels" />
    </div>
    <!-- 频道管理弹出层 -->
    <!-- 将控制弹出层变量传给子组件 让子组件可以关闭弹出层 -->
    <van-popup
      v-model="show"
      :style="{height:'100vh',width:'100vw'}"
      position="top"
      get-container="body"
    >
      <!-- v-model 与tabs 共享channel_id 实现跳转功能 -->
      <ChannelEdit
        :channels="channels"
        @addChannel="addChannel"
        @removeChannel="removeChannel"
        @closeChannelEdit="closePopup"
        v-model="channel_id"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
//引入相关频道接口函数
import { getUserChannels } from "@/api/api/channel.js";
//引入组件
import ArticleList from "@/views/Home/components/ArticleList.vue";
import ChannelEdit from "./ChannelEdit";
export default {
  name: "Home",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      channel_id: 0, //当前那个频道id  默认id为0
      channels: [], //存储频道列表
      show: false, //控制频道管理弹出层
    };
  },
  // watch: {
  //   channel_id(a, b) {
  //     console.log(a, b);
  //   },
  // },
  created() {
    this.getUserChannel(); //发送获取频道请求
  },
  methods: {
    async getUserChannel() {
      //调用获取全部频道接口
      let res = await getUserChannels();
      // console.log(res.data);
      //将频道数据赋值给channels存储
      this.channels = res.data.data.channels;
      // console.log(this.channels);
    },
    //开启频道管理弹出层
    showPopup() {
      this.show = true;
    },
    //关闭频道管理弹出层
    closePopup() {
      this.show = false;
    },
    //自定义事件 接收子组件传过来的channel 并修改channels
    //添加频道
    addChannel(channel) {
      this.channels.push(channel);
    },
    //删除频道
    removeChannel(channel) {
      this.channels.splice(this.channels.indexOf(channel), 1);
    },
  },
};
</script>

<style lang="less" scoped>
#home {
  .nav {
    .van-nav-bar {
      background-color: skyblue;
      img {
        width: 100px;
        height: 30px;
      }
    }
  }
  .tab {
    // 给padding-top防止上滑时 头部被遮挡
    padding-top: 46px;
  }
  // 设置 tabs 容器的样式
  :deep .van-tabs__wrap {
    padding-right: 30px;
    background-color: #fff;
  }

  // 设置小图标的样式
  .moreChannels {
    position: fixed;
    top: 62px;
    right: 8px;
    z-index: 999;
  }
}
</style>