//封装频道相关接口函数
import service from "../request";



// 获取所有频道 
//注意 没有参数 箭头函数这里省略了{}和return
export const getChannels = () => service({
    url: "/v1_0/channels",
    method: "GET",

})

//获取用户列表 
export const getUserChannels = () => service({
    url: "/v1_0/user/channels",
    method: "GET",

})

//获取用户已选
export const reqUserChannels = (channels) => service({
    url: "/v1_0/user/channels",
    method: "PUT",
    data: { channels }
})