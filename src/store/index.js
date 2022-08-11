import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo'))
  },
  getters: {
  },
  mutations: {
    getUserInfo(state, val) {
      state.userInfo = val
      localStorage.setItem('userInfo', JSON.stringify(val))
    }
  },
  actions: {
  },

})
