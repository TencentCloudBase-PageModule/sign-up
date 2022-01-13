const { PageModule } = require('@cloudbase/page-module');
const pageModule = new PageModule('tcb:sign_up');
const requestApi = async (methodName, params = {}) => {
  const objInfo = await pageModule.callMethod(methodName, params);
  const { result: { code, data } } = objInfo;
  if (code !== 0) {
    wx.showToast({
      title: '云函数调用出错',
    });
  }
  return data;
};
Component({
  properties: {
    temId: {
      type: String,
      value: '',
    },
    page: {
      type: String,
      value: 'pages/index/index',
    },
    autoSign: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogInfo: '', // 弹层标记
    dialogStatus: false, // 普通中奖弹层
    signInTimes: [], // 签到完整天数
    heartenMsg: '', // 鼓励提示
    heartenInfo: {
      day: '',
      name: '',
      type: '',
    }, // 鼓励原子信息
    winPrizeDialog: false, // 抽奖弹层
    flag: false, // 立即抽奖 点击控制
    num: 0, // 当前选中哪个奖品样式
    wonCon: '', // 获奖的内容提示
    extraPrizeId: '', // 额外奖品记录id
    halfDialog: false, // 控制弹窗
    isSign: false, // 今日是否签到
    signInStart: true,
    btnTitle: '明天提醒', // 奖品弹窗按钮显示文字
    clockNum: 0, // 连续签到天数
    isAutoSign: true, // 是否开启自动签到
    doSignType: '', // 判断是否存在未填写地址实物奖励 - 奖品类型
    doSignPath: '', // 判断是否存在未填写地址实物奖励 - 奖品图片
    doSignName: '', // 判断是否存在未填写地址实物奖励 - 奖品名称
    doSignTip: false, // 判断是否存在未填写地址实物奖励 - 打开弹框
    path: '', // 奖品图片地址
    type: 'integral', // 奖品类型
    prizeRule: '' // 签到规则
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 关闭弹窗 */
    closesignInDialog() {
      if (!this.data.flag) {
        this.setData({
          dialogStatus: false,
          winPrizeDialog: false,
        });
        // 如果存在未填写实物奖励 弹出提醒用户填写
        if (this.data.doSignType === 'goods' && !this.data.doSignTip) {
          this.setData({
            dialogStatus: true,
            type: this.data.doSignType,
            btnTitle: '填写邮寄地址',
            dialogInfo: 'activated-star',
            desc: this.data.doSignName,
            heartenMsg: this.data.heartenMsg,
            path: this.data.doSignPath,
            isSign: true,
            doSignTip: true,
          });
        }
      }
    },
    /** 响应抽奖点击动作 */
    async startPrize() {
      if (!this.data.flag) {
        this.setData({
          flag: true,

        });
        const objPrize = await this.getDoPrize();
        if (Object.values(objPrize).length > 0) {
          await this.PrizeAnimation(objPrize);
        }
      }
    },
    /**
     * 点击签到
     */
    async tapDoSign() {
      Promise.all([await this.doSignIn(true), await this.getSignInList()], await this.getRemindMsg());
    },
    /**
     * 抽奖的动画效果, 真实中奖是由后台传递给小程序端的
     * 小程序端的只是一个动画效果
     * @param { object } objPirze - 中奖的奖品
     **/
    async PrizeAnimation(objPirze) {
      // 取20到35的整数值
      const initial = Math.floor(Math.random() * (35 - 20) + 20);
      // 去除选中样式
      const that = this;
      let x = 0;
      // position用于定位每一个抽奖格;
      const position = [0, 1, 2, 4, 5, 8, 7, 6, 3];
      const currentNum = initial % 9;
      for (let i = 0; i < initial; i++) {
        // eslint-disable-next-line no-loop-func
        setTimeout(() => {
          const item = x % 9;
          that.setData({
            num: position[item],
          });
          x = x + 1;
          if (x === initial) { // 到结尾了，设置中奖的奖品,中奖的是第几个
            that.setData({
              num: that.countPrizeGoods(objPirze),
            });
            setTimeout(() => {
              // 弹出中奖提醒
              const wonCon = objPirze.name ? `抽中${objPirze.name}${objPirze.desc ? `(${objPirze.desc})` : ''}` : '没有中奖，继续加油哟';
              that.setData({
                flag: false,
                winPrizeDialog: true,
                dialogStatus: false,
                notice: objPirze.type === 'prizeChance' ? '谢谢参与' : '中奖啦',
                type: objPirze.type,
                path: objPirze.path,
                wonCon,
                btnTitle: objPirze.type === 'goods' ? '填写邮寄地址' : '明天提醒'
              });
            }, 10);
          }
        }, i * 150);
      }
    },

    /**
     * 计算中了第几个奖品
     * @param { object } objPirze - 中奖的奖品
     * @returns { number } 返回第几个奖品中奖，0代表第1个
     **/
    async countPrizeGoods(objPirze) {
      return objPirze.index;
    },

    /** 
     * 获取完整的签到周期
     * @param { Number } isRe - 是否返回数据
     * @returns { Object } signInTimes - 当日签到奖励信息
     * @returns { Number } clockNum - 连续签到时间
     **/
    async getSignInList(isRe = 0) {
      const {
        code,
        msg,
        result,
      } = await requestApi('getSignInList');
      if (code !== 0) {
        throw msg;
      }
      // 签到进度显示抽奖名称样式调整值
      const leftRpx = {
        '3': 9,
        '4': -3,
        '5': -15,
        '6': -28,
        '7': -40
      }
      const firstLeft = {
        '3': 35,
        '4': 28,
        '5': 20,
        '6': 12,
        '7': 3
      }
      const arrSignInTimes = [];
      let clockNum = 0;
      let extraDesc = '';
      let descLeft = 0;
      result.forEach((objSignInList) => {
        let status = objSignInList.isSignIn === 1 ? 'activated-star' : 'inactivated-star';
        let iconType = 'star';
        if (objSignInList.extraPrize.length > 0) {
          for (const key of objSignInList.extraPrize) {
            if (key.type !== 'noPrize') {
              extraDesc = `抽${key.name}`;
              break;
            }
            extraDesc = `谢谢参与`;
          }
          iconType = 'gift';
          status = objSignInList.isSignIn === 1 ? 'activated-gift' : 'inactivated-gift';
          descLeft = objSignInList.day === 1 ? extraDesc.length < 8 ? `${firstLeft[String(extraDesc.length)]}%` : '-1%' : `${leftRpx[String(extraDesc.length)]}%` || '-48%';
        }
        if (objSignInList.isSignIn === 1) {
          clockNum = clockNum + 1;
        }
        arrSignInTimes.push({
          id: objSignInList.day,
          days: `${objSignInList.day}天`,
          iconType,
          extraDesc,
          status,
          descLeft,
        });

      });
      if (isRe) {
        return {
          signInTimes: arrSignInTimes,
          clockNum,
        };
      }
      this.setData({
        signInTimes: arrSignInTimes,
        clockNum,
      });
    },

    /** 
     * @param {boolean} signStatus - 是否是主动点击签到，默认为false
     * 执行签到 
     * */
    async doSignIn(signStatus) {
      const {
        code,
        msg,
        result,
      } = await requestApi('doSignIn', {
        autoSign: signStatus || this.properties.autoSign
      });
      try {
        if (code !== 0) {
          if (code === 5001) {
            this.setData({
              isSign: true
            })
            wx.showToast({
              title: msg,
            });
          } else {
            wx.showToast({
              title: '今日已签到',
            });
          }
        } else {
          if (!this.properties.autoSign && result.status === 2) {
            return this.setData({
              isSign: result.isValid,
            })
          }
          if (result.type === 'noPrize' && result.extraType === 'noPrize') {
            return true;
          }
          // 弹出签到提醒框, 分额外奖励与积分奖励
          if (result.extraType === 'prizeChance' && result.extraPrize.length > 0) { // 有额外奖励
            if (result.type === 'goods') { // 当日奖励为实物时提醒填写收货地址
              this.setData({
                doSignType: result.type,
                doSignPath: result.prize.path,
                doSignName: result.prize.name,
              })
            }
            const prizeData = [];
            result.extraPrize.forEach((objextraPrize, index) => {
              let newIndex = index;
              if (index === 4) {
                newIndex = newIndex + 1;
                prizeData.push({ // 插入抽奖按钮
                  id: 'prize',
                  index,
                  text: '立即抽奖',
                });
              } else if (index > 4) {
                newIndex = newIndex + 1;
              }
              prizeData.push({ // 抽奖转盘数据设置
                index: newIndex,
                id: objextraPrize.type === 'integral' ? objextraPrize.faceValue : objextraPrize._id,
                text: objextraPrize.name,
                isIntegral: objextraPrize.type,
                path: objextraPrize.path,
                desc: objextraPrize.desc
              });
            });
            this.setData({ // 有抽奖机会
              dialogStatus: true,
              dialogInfo: 'activated-gift',
              desc: result.type === 'integral' ? result.prize.desc : result.prize.name,
              prizeData,
              heartenMsg: this.data.heartenMsg,
              extraPrizeId: result.extraPrizeId,
              isSign: true,
              path: result.prize.path || '',
              type: result.type
            });
          } else {
            if (result.type === 'goods') { // 奖励为实物
              return this.setData({
                dialogStatus: true,
                type: result.type,
                btnTitle: '填写邮寄地址',
                dialogInfo: 'activated-star',
                desc: result.prize.name,
                heartenMsg: this.data.heartenMsg,
                path: result.prize.path,
                isSign: true,
              });
            }
            this.setData({ // 奖励为积分
              dialogStatus: true,
              dialogInfo: 'activated-star',
              desc: result.prize.desc,
              heartenMsg: this.data.heartenMsg,
              isSign: true,
              type: result.type
            });
          }
        }
      } catch (error) {

      }
    },

    /** 
     * 获取鼓励提示信息 
     * @returns { String } objRemindMsg - 鼓励提示信息 
     **/
    async getRemindMsg() {
      const objRemindMsg = await requestApi('getRemindMsg');
      this.data.heartenMsg = (objRemindMsg.result && objRemindMsg.result.heartenMsg) ? objRemindMsg.result.heartenMsg : '';
      this.data.heartenInfo = objRemindMsg.result;
      return [objRemindMsg];
    },

    /** 
     * 获取他人获奖消息
     * @returns {Array<string>} objOtherMsg - 其他人获奖消息
     **/
    async getOtherMsg() {
      const objOtherMsg = await requestApi('getOtherMsg');
      return objOtherMsg;
    },

    /** 抽奖，后台返回中奖的奖品 */
    async getDoPrize() {
      const {
        code,
        msg,
        result,
      } = await requestApi('doPrize', {
        id: this.data.extraPrizeId,
      });
      if (code !== 0) {
        const wonCon = msg;
        this.setData({
          flag: false,
          winPrizeDialog: true,
          dialogStatus: false,
          wonCon,
          notice: '没抽中',
        });
        return false;
      }
      return result;
    },

    /** 设置明天提醒 */
    async setRemind() {
      const objOtherMsg = await requestApi('setRemind', {
        temId: this.properties.temId,
        page: this.properties.page,
      });
      return objOtherMsg;
    },
    /** 设置收货地址 */
    async setAddress(addressInfo) {
      const objOtherMsg = await requestApi('setAddress', {
        ...addressInfo
      });
      return objOtherMsg;
    },
    /** 订阅明天提醒 */
    subscription(type) {
      const that = this;
      if (type.detail === 'goods') {
        wx.chooseAddress({
          success(res) {

          },
          complete(end) {
            if (end.errMsg === 'chooseAddress:ok') {
              let addressInfo = end;
              delete addressInfo.errMsg
              that.closesignInDialog();
              that.setAddress(addressInfo);
              wx.showToast({
                title: '今天已签到',
              });
            }
          },
          fail(err) {
            wx.showToast({
              title: `填写邮寄地址失败`,
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else {
        that.closesignInDialog();
        wx.requestSubscribeMessage({
          tmplIds: [this.properties.temId],
          success(res) {
            if (res[this.properties.temId] === 'accept') {
              that.setRemind();
            }

          },
          fail(err) {
            wx.showToast({
              title: `订阅失败\r\n请检查模板id`,
              icon: 'none',
              duration: 2000
            })
          },
        });
      }

    },
    async getSignRule() {
      const { result, code } = await requestApi('getSignInRule');
      this.setData({
        prizeRule: result.rule
      });
    },
    /** 获取签到说明规则 */
    async getSignInRule() {
      this.setData({
        halfDialog: true,
      });
    },
    doCloseHalfDialog() {
      this.setData({
        halfDialog: false,
      });
    },
  },

  lifetimes: {
    async attached() {
      try {
        this.setData({
          isAutoSign: this.properties.autoSign
        })
        // 签到后获取信息
        Promise.all([await this.doSignIn(), await this.getSignInList()]);
        const remindRes = await this.getOtherMsg();
        await this.getSignRule()
        const sucMsg = remindRes.result.length > 0 ? remindRes.result : ['os*****连续签到2天获得100积分'];
        const p3 = new Promise((resolve) => {
          const msg = this.getRemindMsg();
          resolve(msg);
        });
        Promise.all([p3]).then((res) => {
          const heartenInfo = res[0][0].result;
          this.setData({
            sucMsg,
            heartenInfo,
            ref: !this.data.ref
          });
        })
          .catch((e) => {
            throw e;
          });
      } catch (e) {
        console.error('出错误了', e);
      }
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

});
