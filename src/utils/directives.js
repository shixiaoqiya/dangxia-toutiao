import Vue from 'vue'
// 插件对象(必须有install方法, 才可以注入到Vue.use中)
export default {
    install() {
        Vue.directive('inputFocus', {
            inserted(el) {
                // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
                if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {

                    el.focus()
                } else {
                    const input = el.querySelector('input')
                    const textarea = el.querySelector('textarea')
                    if (input) input.focus
                    if (textarea) textarea.focus
                }
            }
        })
    }
}