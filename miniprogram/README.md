# 签到打卡
## 概述
签到打卡的前端源码组件，支持7天连续签到，连签X天支持抽奖。

## 目录说明

```shell
.
├── README.md #  概述该模块，对外暴露组件简介
├── components
│   ├── __base__ # 基础组件，外部请勿依赖
│   │   ├── dialog
│   │   ├── halfScreenDialog
│   │   ├── notify
│   │   └── step
│   └── sign-up # 对外暴露的组件，请在页面中引用该组件
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       ├── index.wxss
│       └── readme.md # 概述组件 组件属性 使用说明
├── pages # 示例页面，简单对组件的引用拼装
└── miniprogram_npm # 组件内置依赖的npm
```

## 组件介绍
1. 签到组件 [sign-up](./components/sign-up/README.md)