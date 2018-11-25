'use strict'
let Router = require('koa-router')
let bodyParser = require('koa-bodyparser')
let postReq = require('./test_post')
module.exports = function(){
    let router = new Router({
        prefix:'/api'
    })

    // 抓取网易漫画接口
    router.post('/test', bodyParser(), postReq.testPost)


    return router
}