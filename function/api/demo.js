/**
 * 具体的业务函数，在这里实现你发奖，发积分的逻辑
 * @param { object } params - 业务入参
 * @param { string } params.openId - 当前访问者的微信openId
 * @param  context - 云函数的调用信息和运行状态
 * @returns { object } - 返回参数
 * @returns { number } code 返回的状态标记，成功返回0， 非0代表错误
 * @returns { string } msg 如果成功，则可以不返回，如果失败把相应的错误原因中文描述放在这里
 * @returns {Object} result 出参必须遵循接口定义
 */

const {
    cloudbase
} = require('@cloudbase/page-module')

module.exports = async function doSomething(params, context) {
    console.log(params, context, 'doSomething')

    //   调用当前环境的云函数
    //   const result = await cloudbase.callFunction({
    //     name: 'doSomething',
    //   })

    // 出参需要遵守自定接口规范
    return {
        code: 0,
        msg: 'success',
        result: {
            sendResult: true
        }
    };
}