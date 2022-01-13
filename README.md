```shell
.
├── README.md #  概述该模块，对外暴露组件简介
├── components
│   ├── __base__ # 基础ui组件，外部请勿依赖
│   │   ├── dialog
│   │   ├── halfScreenDialog
│   │   ├── notify
│   │   └── step
│   └── sign-up # 对外暴露的组件
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       ├── index.wxss
│       └── readme.md # 概述组件 组件属性 使用说明
├── example # 示例页面，简单对组件的引用拼装
└── miniprogram_npm # 组件内置依赖的npm
```