// 搜索相关接口
import request from '../request'

//联想搜索结果  /v1_0/suggestion
export const getSuggestions = (q) => {
    return request({
        url: "/v1_0/suggestion",
        method: "GET",
        params: { q }
    })
}

//搜索结果列表  
//page per——page 非必须 给定默认值 1 和 10
export const getSearch = (page = 1, per_page = 10, q) => {
    return request({
        url: "/v1_0/search",
        method: "GET",
        params: {
            page,
            per_page,
            q
        }
    })
}
