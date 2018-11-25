'use strict'
// 测试post请求
exports.testPost = (async (ctx, next) => {
    //请求的参数
    const body = ctx.request.body
    for (let key in body) {
        console.log("body 参数 key is: ", key, " , value is: ", body[key])
    }

    ctx.body = {
        success: true,
        msg: '测试成功'
    }


})