/**
 * 具体的业务函数，在这里实现你发奖，发积分的逻辑，data 入参是固定的，出参必须遵循规范
 * @param { object } data - 业务入参
 * @param { string } data.openId - 当前访问者的微信openId
 * @param { object } data.prize - 中奖的对象
 * @param { string } data.prize.name - 正常奖品记录对象奖品名
 * * @param  cloud - 当前环境的云开发实例
 * @returns { object } - 返回参数
 * @returns { number } code 返回的状态标记，成功返回0， 非0代表错误
 * @returns { string } [msg]  如果成功，则可以不返回，如果失败把相应的错误原因中文描述放在这里
 * 
 */
module.exports = async (data, cloud) => {
    console.log("参数：", data);
    // 这里实现你具体的业务逻辑，比如发积分，发奖
    return {code:0, msg:'suc'};
};
