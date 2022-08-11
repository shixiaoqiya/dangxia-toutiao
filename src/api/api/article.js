//封装文章相关接口函数
import service from "../request";


//获取文章列表
export const getArticles = ({ channel_id,
    timestamp }) => {
    return service({
        url: "/v1_0/articles",
        method: "GET",

        params: {
            channel_id,
            timestamp
        }
    })
}

//不感兴趣
export const getDislikes = (artId) => {
    return service({
        url: "/v1_0/article/dislikes",
        method: "POST",

        data: {
            target: artId
        }
    })
}
//举报文章 
export const getReports = (artId, index) => {
    return service({
        url: "/v1_0/article/reports",
        method: "POST",

        data: {
            target: artId,
            type: index,

        }
    })
}


//获取文章详细内容 
export const getArticleDetail = (id) => {
    return service({
        url: `/v1_0/articles/${id}`,
        method: "GET",

    })
}

//获取评论  
export const getComments = (id, offset) => {
    return service({
        url: '/v1_0/comments',
        method: "GET",
        params: {
            type: "a",
            source: id,
            offset,
        }
    })
} 