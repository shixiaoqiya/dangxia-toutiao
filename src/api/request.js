//封装axios请求
import axios from 'axios'
// 引入路由
// import router from '@/router'
import { reLogin } from "@/api/api/user";
// 引入vant组件
// import { Notify } from 'vant';
//引入getToken方法
import { getToken, setToken } from "@/utils/token";
const service = axios.create({
    baseURL: "http://geek.itheima.net",
    timeout: 3000, //3秒后视为请求超时
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 统一携带token 先判断是否有token
    if (getToken() && config.headers.Authorization == undefined) {
        config.headers.Authorization = `Bearer ${getToken()}`

    }
    // console.log(config);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, /* async */ function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.dir(error)
    // 若err status == 401 表明身份过期 需要重新登陆
    if (error.response.status == 401) {
        // this.$router 无法使用 因为此处不是vue实例 this指向未定义
        //所以引用router 直接使用router 进行路由跳转
        // 方法一 强制跳转登录 刷新token
        Notify({ type: "warning", message: "您的身份已过期，请重新登录" })
        router.replace('/login')
        // 方法二 刷新token 续签token 有点问题 暂时用方法一
        // let res = await reLogin()
        // // 更新token在本地储存
        // setToken(res.data.data.token)
        // //更新token到请求头
        // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
        // // console.log(res);
        // //未完成的请求 再一次发起
        // return axios(error.config)

    }
    return Promise.reject(error);
});

//对外暴露request
export default service