import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Index from '../components/Index'
import Info from '../components/system/info/Info'
import Mgr from '../components/system/mgr/Mgr'
import Role from '../components/system/role/Role'
import Dept from '../components/system/dept/Dept'
import Menu from '../components/system/menu/Menu'
import Dict from '../components/system/dict/Dict'

import Channel from '../components/cms/channel/Channel'
import ArticleEdit from '../components/cms/articleEdit/ArticleEdit'
import Article from '../components/cms/article/Article'
import FileMgr from '../components/cms/fileMgr/FileMgr'
const routes = [
    {
        path:'/',
        name:'index',
        component:Index
    },
    {
        path:'/info',
        name:'info',
        component:Info
    },
    {
        path:'/mgr',
        name:'mgr',
        component:Mgr
    },
    {
        path:'/role',
        name:'role',
        component:Role
    },
    {
        path:'/dept',
        name:'dept',
        component:Dept
    },
    {
        path:'/menu',
        name:'menu',
        component:Menu
    },
    {
        path:'/dict',
        name:'dict',
        component:Dict
    },
    {
        path:'/channel',
        name:'channel',
        component:Channel
    },
    {
        path:'/cms/articleEdit',
        name:'articleEdit',
        component:ArticleEdit
    },
    {
        path:'/article',
        name:'article',
        component:Article
    },
    {
        path:'/fileMgr',
        name:'fileMgr',
        component:FileMgr
    },


]

export default new Router({
    routes
})