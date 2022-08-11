<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <!-- 上传头像 -->

      <van-cell title="头像" is-link center>
        <template #default>
          <!-- <van-uploader :after-read="afterRead"> -->
          <van-image round class="avatar" :src="user.photo" @click="$refs.iptFile.click()" />
          <!-- file 选择框 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
          <!-- </van-uploader> -->
        </template>
      </van-cell>

      <van-cell title="名称" :value="user.name" is-link @click="show =true" />
      <van-cell title="生日" :value="user.birthday" is-link @click="isShowBirth = true"></van-cell>
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button @confirm="editName()">
      <label>昵称：</label>
      <input type="text" v-model="user.name" v-inputFocus />
    </van-dialog>

    <!-- 修改时间 -->
    <van-popup v-model="isShowBirth" position="bottom" style="height: 50%" round>
      <!-- 日期选择控件 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        :show-toolbar="true"
        @cancel="isShowBirth = false"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import moment from "moment";
import { editUsers, reqUserPhoto, reqUserInfo } from "@/api/api/user";
export default {
  name: "UserEditor",
  data() {
    return {
      user: "", //储存用户信息
      show: false, //修改姓名弹窗
      name: "", //修改的姓名
      isShowBirth: false, // 显示时间选择器
      minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date(), // 最大的可选日期
      currentDate: new Date(), // 当前日期
    };
  },
  created() {
    this.reqUser();
  },
  methods: {
    //修改 用户信息
    async reqUser() {
      let res = await reqUserInfo();
      this.user = res.data.data;
      // console.log(this.user);
    },
    //上传头像
    // async afterRead(photo) {
    //   // 此时可以自行将文件上传至服务器
    //   console.log(photo);
    //   let res = await reqUserPhoto(photo);
    //   console.log(res);
    // },
    // 文件选择方法
    // 文件选择方法
    async onFileChange(e) {
      //   console.log(ev.target.files[0])
      if (e.target.files.length === 0) return; // 防止用户未选择图片
      const photo = new FormData();
      photo.append("photo", e.target.files[0]); // photo在表单里参数名携带
      const res = await reqUserPhoto(photo);
      console.log(res);
      this.user.photo = res.data.data.photo; // 更新最新头像
    },
    //修改昵称
    async editName() {
      this.name = this.user.name;
      /* let res =  */ await editUsers({ name: this.name });
      // console.log(res);
    },
    // 弹出时间选择框
    showBirthFn() {
      this.isShowBirth = true;
      this.currentDate = new Date(this.user.birthday); // 设置data组件默认显示时间
    },
    // 时间选择
    async confirmFn() {
      // console.log(this.currentDate instanceof Date)
      // this.currentDate里值是日期对象
      // 但是后台要"年-月-日"格式字符串参数值

      console.log(this.currentDate);
      const dateStr = moment(this.currentDate).format("YYYY-MM-DD");
      let res = await editUsers({ birthday: dateStr });
      console.log(res);
      // 前端页面同步
      this.user.birthday = dateStr;
      // 时间选择器关闭
      this.isShowBirth = false;
    },
  },
};
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
  ::v-deep .van-dialog__content {
    text-align: center;
    input {
      padding-left: 10px;
      outline: none;
      border: none;
      height: 50px;
    }
  }
}
</style>