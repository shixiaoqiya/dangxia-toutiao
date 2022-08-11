<template>
  <div id="login">
    <!-- 登陆页面导航栏-->
    <van-nav-bar title="黑马头条-登录" />
    <!-- 登陆表单 -->
    <van-form @submit="onSubmit">
      <!-- rules 验证规则 pattern 手机号正则验证 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        required
        placeholder="请输入11位手机号"
        :rules="[{ required: true, message: '请填写正确的手机号',pattern:/^[1][3,4,5,7,8][0-9]{9}$/
 }]"
      />
      <!-- 输入密码框 -->
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        required
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写正确密码' }]"
      />
      <!-- 登录按钮 -->
      <div style="margin: 16px;">
        <van-button
          round
          block
          native-type="submit"
          :disabled="isLoading"
          :loading="isLoading"
          type="info"
          loading-text="正在登陆..."
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
//引入登录请求接口函数
import { reqLogin } from "@/api/api/user.js";
//时间处理函数
import { setToken } from "@/utils/token.js";
//vant组件
import { Notify } from "vant";
export default {
  name: "Login",
  data() {
    return {
      user: {
        mobile: "13888888888", //手机号
        code: "246810", //验证码(密码-必须是246810 后台写死的 无论手机号码是什么)
      },
      isLoading: false, //登陆状态
    };
  },
  methods: {
    //提交表单至后台
    async onSubmit() {
      //登陆状态 以及点击后禁用按钮
      this.isLoading = true;
      //点击提交信息到后台
      try {
        let res = await reqLogin(this.user);
        console.log(res);
        // 登录成功通知
        Notify({ type: "success", message: "登陆成功" });
        //存储用户token
        setToken(res.data.data.token);
        localStorage.setItem("refresh_token", res.data.data.refresh_token);
        //跳转到home页面  注意：一定要最后执行跳转
        this.$router.replace("/layout/home");
      } catch (err) {
        //抛出错误进入这里  登录错误通知
        Notify({ type: "danger", message: "账号或密码错误" });
        console.log(err);
      }
      //网络请求完成后 取消禁用按钮 和加载显示
      this.isLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
#login {
  .van-nav-bar {
    background: #007bff;
    /* /deep/ 就是把data-v-hash值选择器写到类名的前面 */
    :deep .van-nav-bar__title {
      color: white;
    }
  }
}
</style>