## 业务系统联动打通

业务系统与模块间进行联调

1. 方式1：业务侧主动调用模块的 [服务端接口](./api.md#服务端接口)
2. 方式2：模块内的自定义接口打到业务模块，例如，积分中心兑换奖品真实的奖品发放会调用业务侧的接口

### 1.`timedTask` 定时任务(每日00:00统计当日邀请数据)

```js
// 在自身业务代码中引入pageModuleSDK方法 设置每晚定时触发
const  { PageModule } = require('@cloudbase/page-module');
const pageModule = new PageModule('integral-module');
module.exports = async function demo(params, context) {
    await  pageModule.callMethod('timedTask')
}
```

### 2. 自定义任务 `setInviteStatus` 设置用户任务状态

```js
// 在自身业务代码中引入pageModuleSDK方法 设置每晚定时触发
const  { PageModule } = require('@cloudbase/page-module');
const pageModule = new PageModule('integral-module');
module.exports = async function demo(params, context) {
    await  pageModule.callMethod('setInviteStatus'{
        openId: params.openId,
        status: 3, // todo 补充枚举值 
        failureReason: '非新用户'
    })
}
```
### 3. 自定义接口
#### 3.1 `send_prize` 发奖接口

兑换虚拟类型的礼物时，兑换接口内会调用`send_prize`接口，该接口可连接到云开发的云函数，业务在云函数内实现发奖逻辑。

### 3.2 `send_faceValue` 发积分接口

兑换积分类型的礼物时，兑换接口内会调用`send_prize`接口，该接口可连接到云开发的云函数，业务在云函数内实现发奖逻辑。

### 3.3 业务方检查用户是否被邀请
模块将首先判断用户是否已在邀请有礼模块内被邀请，如果未被邀请，则会再去调用业务方接口让业务方来判断该用户是否可被邀请。
如果该用户为黑产或者已经注册的用户，业务方可直接返回不可被邀请。