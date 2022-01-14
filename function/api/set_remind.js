const { LcapContainer } = require('@cloudbase/lcap-business-sdk');
const lodash = require('lodash');
/**
 * 设置明天提醒
 */
async function main(params, cloud, context) {
  const { services } = new LcapContainer({ lcDatasourceCtx: context });
  const {  tcbService: { envId }, configService, utilService, loggerService, errService } = services;
  const wxOpenId = configService.wxOpenId || 'defaultOpenId';

  /**
   * 计算明天上午的时间，通知再提醒
   * 最终是明天的这个时间提醒，这里返回距离当前时间的单位秒数
   * @returns {number} 距离当前的用户离明天这个时候的秒数
   */
  const countTime = () => {
    const nowTime = utilService.getLocalDayjs().valueOf();
    const tomorrowTime9 = utilService.getLocalDayjs().add(1, 'day')
      .valueOf();

    const num = (tomorrowTime9 - nowTime) / 1000;
    return Math.round(num);
  };
  /**
   * 主体逻辑
   */
  const run = async () => {
    try {
      // 打印上下文
      loggerService.info({
        logType: 'setRemindEnv',
        content: utilService.inspectLimit(lodash.get(context, 'env')),
      });

      // 检查入参，并拿到转换后的参数
      const { temId, page, openId } = params;
      const result = {};
      const delayTime = countTime();
      loggerService.info({ content: '设置提醒入参', openId: wxOpenId, temId, delayTime,context });
      // 该云调用接口依赖于在config.json配置中,配置 API 的权限
      // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/cloudbase/cloudbase.addDelayedFunctionTask.html
      const reData =  await cloud.openapi.cloudbase.addDelayedFunctionTask({
        env: cloud.DYNAMIC_CURRENT_ENV,
        functionName: 'page_module_tcb_sign_up',
        data: JSON.stringify({
          methodName: 'sendmsg',
          params: {
            temId,
            page,
            openId,
          } }),
        delayTime: countTime(),
      });
      loggerService.info({ content: '设置提醒调用结果', reData });
      return {
        code: 0,
        msg: 'success',
        result,
      };
    } catch (error) {
      loggerService.error({
        logType: 'setRemindError',
        errCode: error.iCode || 10000,
        errMsg: error.message,
        errStack: error,
      });
      return {
        code: error.iCode || 10000,
        msg: error.iCode && error.iCode !== 10000 ? error.message : `服务内部错误: ${error.message}`,
        result: {},
      };
    }
  };

  return await run();
}

/**
 * 用于本地环境测试
 */
if ((new LcapContainer()).services.configService.isLocalDev()) {
  main({ temId: 'eJ8NG1u50h13GiwfDpLtWBt42XekeY19yzmn5hPFr9o', page: 'pages/index/index' }) // 根据需要，填写前端的入参
    .then(res => console.log('>>> res is', res));
}
module.exports = main;
