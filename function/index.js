const cloud = require('wx-server-sdk');
const fs = require('fs');
/** 
 * 解析出参数
 * @param { object } event - 入参对象
 * @param { string } event.methodName - 具体的接口名，对应于api目录下的文件名，例如，打卡签到模块的自定义接口methodName的枚举值为：sendIntegral、sendPrize
 * @param { object } event.data - 自定义接口的入参
 * @param { object } context - 请求的上下文对象
 * @returns { object } - 返回指定出参对象，必须按下面出参返回
 * @returns { number } code 返回的状态标记，成功返回0， 非0代表错误
 * @returns { string } [msg]  如果成功，则可以不返回，如果失败把相应的错误原因中文描述放在这里
 */
exports.main = async (event, context) => {
    const c1 = new cloud.Cloud({
        resourceEnv: cloud.DYNAMIC_CURRENT_ENV,
    })

    // 等待初始化完成
    await c1.init()

    const {
        SOURCE
    } = c1.getWXContext();
    const {
        methodName,
        params
    } = event;

    // 自定义接口配置时第二步检测接口海鲜时，来源时为 undefined
    const fromConsoleInvoke = SOURCE === undefined

    // 只允许来自云函数/延迟任务的调用，例如以下来源 https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/utils/Cloud.getWXContext.html#%E8%BF%94%E5%9B%9E%E5%80%BC
    // wx_client,scf    wx_client,scf,scf   wx_delaytask
    const hasAuthToInvoke = (SOURCE && SOURCE.endsWith(',scf')) || SOURCE == 'wx_delaytask' || fromConsoleInvoke;

    console.log(`调用来源：${SOURCE}，调用方法为${methodName}，入参为${JSON.stringify(params)}`)

    if (!hasAuthToInvoke) {
        return {
            code: -3,
            msg: `${SOURCE}来源无权限调用`
        };
    }


    // 根据自定义接口名，自动路由到 api 目录下的文件实现
    const methodApiFile = `./api/${methodName}.js`
    if (!fs.existsSync(methodApiFile)) {
        return {
            code: -1,
            msg: `自定义接口未实现，请按规范在${methodApiFile}文件中编写代码实现接口`
        };
    }

    const objMethodName = require(methodApiFile);
    try {
        return await objMethodName(params, c1, context);
    } catch (err) {
        console.error(err);
        return {
            code: -2,
            msg: `接口实现异常：${err.message}`
        };
    }
};