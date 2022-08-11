<template>
  <div id="search">
    <!-- 搜索页面头部 -->
    <div class="header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goBack"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        shape="round"
        background="#3c94f2"
        v-inputFocus
        @input="search"
        @search="confirmSearch"
        v-model.trim="keyword"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="suggestionList" v-if="keyword.length">
      <van-cell
        v-for="(suggestion,index) in suggestionList"
        :key="index"
        @click="goSearchResult(suggestion)"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title" v-html="lightHigh(suggestion,keyword)"></span>
        </template>
      </van-cell>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteHistory" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(item,index) in history"
          :key="index"
          @click="goHistoryResult(item)"
        >{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestions } from "@/api/api/search";
export default {
  name: "Search",
  data() {
    return {
      keyword: "", // 搜索关键字
      timer: null, //定时器 防抖
      suggestionList: [], //联想词列表
      history: JSON.parse(localStorage.getItem("history")) || [], // 搜索历史
    };
  },
  methods: {
    //搜索发请求
    search() {
      //添加防抖  开定时器延迟搜索结果
      clearTimeout(this.timer);
      if (this.keyword === "") {
        this.suggestionList = [];
      } else {
        this.timer = setTimeout(async () => {
          //搜索框为空 清空联想列表
          if (this.keyword.length === 0) return;
          //发送请求
          let res = await getSuggestions(this.keyword);
          //   console.log(res.data);
          //获取联想词条列表  由于后台限制 只能联想第一个字或字母
          this.suggestionList = res.data.data.options;
        }, 10);
      }
    },
    //数据高亮 搜素关键词变颜色
    lightHigh(origin, keyword) {
      // 普通方法
      //   return origin.replace(
      //     keyword,
      //     `<span style='color:red'>${keyword}</span>`
      //   );
      //正则表达式
      //不管是普通方法还是正则 都会报null错误 应该是返回的空数组
      //这里进行判断 若是返回为null 不进行替换直接结束函数

      if (!origin) return;
      const reg = new RegExp(keyword, "ig"); //i 忽略大小写 g 全局匹配
      return origin.replace(reg, (keyword) => {
        // keyword是关键字匹配的值(尽量保持原样)
        return `<span style="color: red">${keyword}</span>`;
      });
    },
    //确认搜索 跳转搜索所结果页
    confirmSearch() {
      // 空值不跳转 判断一下
      if (this.keyword.length < 1) return;
      this.history.push(this.keyword);
      // this.$router.push({
      //   path: `/searchResult/${this.keyword}`,
      // });
      this.goSearch(this.keyword);
    },
    goSearch(key) {
      //注意 路由跳转 在watch之前执行 所以加个定时器让他最后执行
      setTimeout(() => {
        this.$router.push({
          path: `/searchResult/${key}`,
        });
      }, 0);
    },
    //点击联想词条跳转搜索页面
    goSearchResult(suggestion) {
      this.history.push(suggestion);
      this.goSearch(suggestion);
    },
    //点击历史记录跳转搜索页面
    goHistoryResult(item) {
      //提取封装
      // this.$router.push({
      //   path: `/searchResult/${item}`,
      // });
      this.goSearch(item);
    },
    //清除历史记录
    deleteHistory() {
      this.history = [];
    },
  },
  watch: {
    history: {
      deep: true,
      immediate: true,
      handler() {
        //历史记录不应该重复 所以需要去重
        //set 去重 ES6方法 ... 扩展运算
        let setItem = new Set(this.history);
        localStorage.setItem("history", JSON.stringify([...setItem]));
      },
    },
  },
};
</script>

<style scoped lang="less">
#search {
  .header {
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #3c94f2;
    overflow: hidden;
    /*后退按钮*/
    .goBack {
      padding-left: 14px;
    }
    /*搜索组件*/
    .van-search {
      flex: 1;
    }
  }
  /**搜索历史 */
  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }

  .history-list {
    padding: 0 10px;
    .history-item {
      display: inline-block;
      font-size: 12px;
      padding: 8px 14px;
      background-color: #efefef;
      margin: 10px 8px 0px 8px;
      border-radius: 10px;
    }
  }
}
</style>