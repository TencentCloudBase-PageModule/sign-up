const objCloud = require('wx-server-sdk');
module.exports = async function setRemind(params, context){
  const { openId = '', temId = '', page = '', type = 'setRemind' } = params;
  const { ENV } = objCloud.getWXContext();
  try {
    if (type === 'setRemind') {
      // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/cloudbase/cloudbase.addDelayedFunctionTask.html
      const reData = await objCloud.openapi.cloudbase.addDelayedFunctionTask({
        env: ENV,
        functionName: 'page-module-sign-up',
        data: JSON.stringify({
          methodName: 'set_remind',
          params: {
            temId,
            page,
            openId,
            type: 'sendMsg'
          }
        }),
        delayTime: 86400,
      });
      console.log('消息发送结果:',reData);
      return {
        code: 0,
        msg: 'success',
        result: reData,
      };
    } else {
      // 与模板详情中对应
      const data = {
        thing2: { value: 'HI,同学你今天还没签到哟' },
        thing1: { value: '签到即有奖,连续签到会有额外惊喜' },
        thing3: { value: '签到得奖' },
      };
      console.log('消息发送参数', openId, temId, page, data);
      const reData = await objCloud.openapi.subscribeMessage.send({
        touser: openId,
        templateId: temId,
        page,
        data: JSON.stringify(data),
      });
      console.log('消息发送结果:',reData);
      return reData;
    }

  } catch (error) {
    console.log('错误信息返回', {
      code: error.iCode || 10000,
      msg: error.iCode && error.iCode !== 10000 ? error.message : `服务内部错误: ${error.message}`,
      result: {},
    });
  }
};
