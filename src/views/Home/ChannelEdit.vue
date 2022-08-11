<template>
  <div id="channelEdit">
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closeChannelEdit" />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>
          我的频道
          <span class="small-title">{{edit.title}}</span>
        </span>
        <span @click="editStart" v-if="edit.name == '编辑'">{{edit.name}}</span>
        <span @click="editEnd" v-if="edit.name=='完成'">{{edit.name}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="channel in channels"
          :key="channel.id"
          @click="deleteChannel(channel)"
        >
          <div class="channel-item van-hairline--surround">
            {{channel.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-if="edit.state">
              <template #content>
                <!-- 推荐不可以被删除 不需要显示x图标 -->
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                  v-if="channel.name!=='推荐'"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="moreChannel in moreChannels"
          :key="moreChannel.id"
          @click="addChannel(moreChannel)"
        >
          <div class="channel-item van-hairline--surround">{{moreChannel.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
// 引入频道请求相关接口
import { getChannels, reqUserChannels } from "@/api/api/channel";
export default {
  name: "ChannelEdit",
  // 接收父组件传过来的channels 也可以重新发送请求获取数据
  props: ["channels"],
  data() {
    return {
      edit: {
        state: false,
        name: "编辑",
        title: "点击进入频道",
      }, //控制是否编辑 显示关闭徽标
      allChannels: [], //所有频道列表
    };
  },
  methods: {
    editStart() {
      this.edit.state = true;
      this.edit.name = "完成";
      this.edit.title = "点击删除频道";
    },
    editEnd() {
      this.edit.state = false;
      this.edit.name = "编辑";
      this.edit.title = "点击进入频道";
    },
    async getChannel() {
      let res = await getChannels();
      //   console.log(this.channels);
      this.allChannels = res.data.data.channels;
    },
    //添加频道
    async addChannel(channel) {
      if (this.edit.state === true) {
        // 由于channels是父组件传值过来 props接受的
        //虽然 可以直接改变其内的值 但是不推荐 一般还是在父组件中修改
        //此处可以用自定义事件 将addChannel传给父组件 让父组件修改channels
        // this.channels.push(channel);  //这样可以但不推荐
        this.$emit("addChannel", channel);
        // console.log(channel);
        //新增列表
        /*   let res = */
        await reqUserChannels(this.channels);
        // console.log(res);
      }
    },
    // 删除频道
    async deleteChannel(channel) {
      if (this.edit.state === true) {
        // 由于channels是父组件传值过来 props接受的
        //虽然 可以直接改变其内的值 但是不推荐 一般还是在父组件中修改
        //此处可以用自定义事件 将addChannel传给父组件 让父组件修改channels
        // this.channels.push(channel);  //这样可以但不推荐
        //注意 推荐频道 是不可以被删除的 这里需要做一下判断
        if (channel.name == "推荐") return;
        this.$emit("removeChannel", channel);
        // console.log(channel);
        //新增列表
        /*   let res = */
        await reqUserChannels(this.channels);
        // console.log(res);
      } else {
        //未处于编辑状态 点击跳转到相应的频道
        //关闭弹出层
        this.closeChannelEdit();
        //v-model 原理就是input事件和value值 自定义事件把 要跳转的id传给父组件
        console.log(channel.id);
        this.$emit("input", channel.id);
      }
    },
    //关闭频道编辑弹出层
    closeChannelEdit() {
      //给父组件传递关闭弹出层的自定义事件
      this.$emit("closeChannelEdit");
      //关闭弹出层后 编辑状态应该被初始化
      this.editEnd();
    },
  },
  computed: {
    //更多频道列表
    moreChannels() {
      return this.allChannels.filter((obj) => {
        const index = this.channels.findIndex((obj2) => obj2.id === obj.id);
        if (index === -1) return true;
      });
    },
  },
  mounted() {
    this.getChannel(); //发送请求
  },
};
</script>

<style scoped lang="less">
#channelEdit {
  .van-nav-bar {
    background-color: skyblue;
  }
  .van-popup,
  .popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
  }

  .pop-header {
    height: 90px;
    background-color: #007bff;
    color: white;
    text-align: center;
    font-size: 14px;
    position: relative;
    .title {
      width: 100%;
      position: absolute;
      bottom: 15px;
    }
  }

  .pop-body {
    flex: 1;
    overflow: scroll;
    padding: 8px;
    background-color: white;
  }

  .my-channel-box,
  .more-channel-box {
    .channel-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 28px;
      padding: 0 6px;
    }
  }

  .channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 5px;
  }

  /*删除的微标 */
  .cross-badge {
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
  }

  /*提示文字 */
  .small-title {
    font-size: 10px;
    color: gray;
  }
}
</style>
