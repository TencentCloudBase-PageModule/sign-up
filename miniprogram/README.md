# 签到打卡
## 概述
签到打卡的前端源码组件，支持7天连续签到，连签X天支持抽奖。

## 目录说明

```shell
.
├── README.md #  概述该模块，对外暴露组件简介
├── components
│   ├── __base # 基础组件，外部请勿依赖
│   │   ├── dialog
│   │   ├── halfScreenDialog
│   │   ├── notify
│   │   └── step
│   └── signUp # 对外暴露的组件，请在页面中引用该组件
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       ├── index.wxss
│       └── readme.md # 概述组件 组件属性 使用说明
├── example # 示例页面，简单对组件的引用拼装
└── miniprogram_npm # 组件内置依赖的npm
```

## 组件介绍
1. 签到组件 [SignUp](./components/signUp/README.md)

## 注意事项
1. 需要在详情中本地设置开启将JS编译成ES5。
## 上手介绍
1. 手动签到后，第二天才可以签到，为了方便进行验证。我们在服务端接口中提供了相应接口以供测试
   1. delSignIn 删除签到记录，删除用户指定日期记录
   2. reSignIn 补签，会创建输入日期到当日的前一天的连续签到记录无签到奖励只有记录
2. 在首页位置可放置签到入口，没有签到则红点提示。我们在小程序端提供 getSignStatus 查询当日签到状态接口。
3. [管理端配置说明](https://github.com/TencentCloudBase-PageModule/integral-module/tree/master/docs/admin)
