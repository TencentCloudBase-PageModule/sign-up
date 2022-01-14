# 自定义接口说明

该云函数为单页模块的自定义接口示例部署文件。

## 目录说明
```shelll
.
├── README.md
├── api # 存放api实现的文件，文件名对应接口名
│   ├── demo.js # demo示例文件
│   ├── sendmsg.js
│   └── set_remind.js
├── example # 模块给的示例实现，可以接入使用
│   ├── sendmsg.js
│   └── sendmsg.md
├── index.js # 入口文件
└── package.json # 依赖声明
```

## api 自定义接口列表
可在控制台查阅接口文档
1. `send_remind` 订阅消息提醒接口
2. `send_prize` 发奖接口

## example 示例实现

1. 设置订阅消息提醒 [`set_remind`](./example/sendmsg.md) 
## FAQ
### 1. 云函数如何和已有系统打通
云函数内可以通过http接口调用与已有系统打通。