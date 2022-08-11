//用户相关接口函数
import service from "../request";

// console.log(localStorage.getItem(refresh_token));
//登录接口函数
//body 需要携带参数 mobile code
export const reqLogin = ({ mobile, code }) => {
    return service({
        method: "POST",
        url: "/v1_0/authorizations",
        data: {
            mobile, code
        }
    })
}

//刷新登录  刷新登录 有点问题 暂时用退出刷token的方法
// export const reLogin = () => {
//     return service({
//         method: "PUT",
//         url: "/v1_0/authorizations",
//         headers: {
//             Authorization: 'Bearer ' + localStorage.getItem(refresh_token)
//         }
//     })
// }

//关注用户  
export const reqFollowings = (target) => {
    return service({
        method: "POST",
        url: "/v1_0/user/followings",
        data: {
            target
        }
    })
}

//取消关注  
export const reqUnFollowings = (target) => {
    return service({
        method: "DELETE",
        url: `/v1_0/user/followings/${target}`,

    })
}

//对文章点赞  
export const reqLikings = (target) => {
    return service({
        method: "POST",
        url: '/v1_0/article/likings',
        data: {
            target
        }
    })
}

//取消文章点赞
export const reqDisLikings = (target) => {
    return service({
        method: "DELETE",
        url: `/v1_0/article/likings/${target}`,

    })
}

//收藏文章 
export const reqCollections = (id) => {
    return service({
        method: "POST",
        url: '/v1_0/article/collections',
        body: { target: id }
    })
}

//取消收藏文章
export const reqUnCollections = (target) => {
    return service({
        method: "DELETE",
        url: `/v1_0/article/collections/${target}`,
    })
}

//获取用户个人信息 
export const reqUsers = () => {
    return service({
        method: "GET",
        url: '/v1_0/user',
    })
}

//获取用户个人资料  
export const reqUserInfo = () => {
    return service({
        method: "GET",
        url: '/v1_0/user/profile',
    })
}

// 修改个人资料
export const editUsers = ({ name,
    birthday }) => {
    return service({
        method: "PATCH",
        url: '/v1_0/user/profile',
        data: {
            name,
            birthday
        },
    })
}

//发表评论  
export const reqComments = (target,
    content,
    art_id) => {
    return service({
        method: "POST",
        url: '/v1_0/comments',
        data: {
            target,
            content,
            art_id
        },
    })
}

//喜欢评论  
export const reqCommentLikings = (target) => {
    return service({
        method: "POST",
        url: '/v1_0/comment/likings',
        data: {
            target

        },
    })
}
//取消喜欢评论 
export const reqCommentDisLikings = (target) => {
    return service({
        method: "DELETE",
        url: `/v1_0/comment/likings/${target}`
    })
}

//更新头像  
export const reqUserPhoto = (photo) => {
    return service({
        method: "PATCH",
        url: '/v1_0/user/photo',
        data: photo

    })
}

