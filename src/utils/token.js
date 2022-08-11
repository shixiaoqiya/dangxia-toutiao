// 此文件 封装三个方法 用于操作token
//封装目的 使代码分层  结构清晰 方便管理修改
const key = 'dangxia-toutiao'

//设置
export const setToken = (token) =>
    localStorage.setItem(key, token)


//获取
export const getToken = () =>
    localStorage.getItem(key)

//删除
export const removeToken = () =>
    localStorage.removeItem(key)
