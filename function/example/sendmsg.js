
const { cloud } = require('wx-server-sdk');

module.exports = async (params) => {
    const { openId, temId, page } = params;
    
    try {
      const data = {
        thing2: { value: 'HI,同学你今天还没签到哟' },
        thing1: { value: '签到即有奖,连续签到会有额外惊喜' },
        thing3: { value: '签到得奖' },
      };
      console.log('消息发送参数', openId, temId, page, data);
      const reData = await cloud.openapi.subscribeMessage.send({
        touser: openId,
        templateId: temId,
        page,
        data,
      });
      return reData;
    } catch (error) {
      console.log('错误信息返回', {
        code: error.iCode || 10000,
        msg: error.iCode && error.iCode !== 10000 ? error.message : `服务内部错误: ${error.message}`,
        result: {},
      });
    }
};
