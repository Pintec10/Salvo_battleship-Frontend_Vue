import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GameView from '../views/game_view.vue'
import Leaderboard from '../views/leaderboard.vue'
import Login from '../views/login.vue'
import GameList from '../views/game_list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/game_view/:gpId',
    name: 'game_view',
    component: GameView,
    props: true
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/game_list',
    name: 'game_list',
    component: GameList
  }
]

const router = new VueRouter({
  routes
})

export default router
