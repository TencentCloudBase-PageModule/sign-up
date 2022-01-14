# sign-up 签到组件

## 代码演示

```js
<sign-up temId="eJ8NG1u50h13GiwfDpLtWBt42XekeY19yzmn5hPFr9o" page="pages/index/index" autoSign="true"></sign-up>
```

## 组件属性

| 属性     | 说明                       | 类型    | 默认值            |
| -------- | -------------------------- | ------- | ----------------- |
| autoSign | 是否开启自动签到           | Boolean | true              |
| temId    | 消息模板ID                 | String  | -                 |
| page     | 订阅消息跳转小程序页面地址 | String  | pages/index/index |


## 注意事项
### 订阅消息模板设置

1. 进入[微信公众平台](https://mp.weixin.qq.com/) 后在菜单中进入 订阅消息>公共模板库>一次性订阅 
2. 输入关键词`签到提醒`进行搜索，找到符合自己小程序服务类目的模板（可在 设置>基本设置>服务类目 中查看）
![搜索](https://qcloudimg.tencent-cloud.cn/raw/eefc58f8c8e865ded2bfeb62fce3becb.png)
3. 点击选用，勾选关键词，确认添加模板。(每个模板显示的不同，推荐模板:服务类目生活服务 > 百货/超市/便利店的签到提醒模板)
4. 在“我的模板”中点击模板详情，查看详细内容，确定 thing 序号
![模板详情](https://qcloudimg.tencent-cloud.cn/raw/94efdede217c338c7d856e80e85c6e0b.png)
5. 前往 自定义接口创建的云函数中 page_module_tcb_sign_up/api/sendmsg 文件中按照自己申请的模板详情填写提醒

## FAQ
### 1. 找不到合适的订阅消息模板
每个小程序只能看到配置的小程序类目下的订阅消息模板，因此你需要选择你类目下合适的模板。字段需要自己进行匹配。