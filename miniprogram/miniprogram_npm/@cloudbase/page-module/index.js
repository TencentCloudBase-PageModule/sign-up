module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1640575353035, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.pageModule = exports.PageModule = void 0;
const saasmodule_1 = require("./saasmodule");
var saasmodule_2 = require("./saasmodule");
Object.defineProperty(exports, "PageModule", { enumerable: true, get: function () { return saasmodule_2.PageModule; } });
exports.pageModule = new saasmodule_1.PageModule();
/**
 * 初始化全局的单例 PageModule
 * @param moduleName - 模块名称
 * @param options    - 模块参数
 * @returns
 */
function init(moduleName, options = {}) {
    return exports.pageModule.init(moduleName, options);
}
exports.init = init;

}, function(modId) {var map = {"./saasmodule":1640575353036}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1640575353036, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.PageModule = void 0;
const cloudbase_1 = require("./cloudbase");
class PageModule {
    constructor(moduleName, options) {
        this.inited = false;
        if (moduleName) {
            this.init(moduleName, options);
        }
    }
    init(moduleName, options = {}) {
        if (this.inited) {
            throw new Error('[ERROR]PageModule has already been inited, do not repeat initialization.');
        }
        this.env = `$:${moduleName}`;
        this.initCloudbaseInstance(this.env, options.cloudbaseInstanceInitOptions);
        this.inited = true;
        return this;
    }
    callMethod(methodName, data, options = {}) {
        this.checkInited();
        return this.cloudbaseInstance.callFunction({
            name: methodName,
            data: {
                ...options,
                envType: options.envType || 'prod',
                // 数据源参数放到 params 中
                params: data,
            },
        });
    }
    uploadFile(options) {
    }
    deleteFile(options) {
    }
    downloadFile(options) {
    }
    getTempFileURL(options) {
    }
    initCloudbaseInstance(env, options = {}) {
        this.cloudbaseInstance = (0, cloudbase_1.initCloudbaseInstance)(env, options);
    }
    checkInited() {
        if (!this.inited) {
            throw new Error('[ERROR]PageModule is not inited, please call `init()` method first.');
        }
    }
}
exports.PageModule = PageModule;

}, function(modId) { var map = {"./cloudbase":1640575353037}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1640575353037, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.initCloudbaseInstance = exports.initCloudbaseInstanceForWxClient = exports.initCloudbaseInstanceForNodejs = void 0;
const utils_1 = require("./utils");
const kBaseSdk = 'wx-server-sdk';
const kRuntimeEnv = (0, utils_1.identifyRuntimeEnv)();
/* eslint-disable max-len */
function initCloudbaseInstanceForNodejs(env, options = {}) {
    try {
        /* eslint-disable @typescript-eslint/no-require-imports */
        const cloud = require(kBaseSdk);
        const cloudInstance = cloud.createNewInstance({
            ...options,
            env,
        });
        return cloudInstance;
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            /* eslint-disable max-len */
            throw new Error(`[ERROR][${kBaseSdk}] is required for Node.js environment, please install '${kBaseSdk}' first.`);
        }
        else {
            throw e;
        }
    }
}
exports.initCloudbaseInstanceForNodejs = initCloudbaseInstanceForNodejs;
function initCloudbaseInstanceForWxClient(env, options = {}) {
    // 微信小程序环境
    const cloudInstance = new wx.cloud.Cloud({
        resourceEnv: env,
    });
    cloudInstance.init(options);
    return cloudInstance;
}
exports.initCloudbaseInstanceForWxClient = initCloudbaseInstanceForWxClient;
function initCloudbaseInstance(env, options = {}) {
    if (kRuntimeEnv === utils_1.RuntimeEnv.NODEJS) {
        return initCloudbaseInstanceForNodejs(env, options);
    }
    if (kRuntimeEnv === utils_1.RuntimeEnv.WX_CLIENT) {
        return initCloudbaseInstanceForWxClient(env, options);
    }
    /* eslint-disable max-len */
    throw new Error('[ERROR] Unknown runtime environment, please use in Node.js or WX_CLIENT environment');
}
exports.initCloudbaseInstance = initCloudbaseInstance;

}, function(modId) { var map = {"./utils":1640575353038}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1640575353038, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyRuntimeEnv = exports.RuntimeEnv = exports.isNodeEnv = exports.isSupportCloudbase = exports.isInWxEnv = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
function isInWxEnv() {
    // window && window.__wxjs_environment
    return !!__wxConfig;
}
exports.isInWxEnv = isInWxEnv;
/* eslint-enable @typescript-eslint/naming-convention */
function isSupportCloudbase() {
    return !!wx.cloud;
}
exports.isSupportCloudbase = isSupportCloudbase;
function isNodeEnv() {
    var _a, _b;
    return ((_b = (_a = global === null || global === void 0 ? void 0 : global.process) === null || _a === void 0 ? void 0 : _a.release) === null || _b === void 0 ? void 0 : _b.name) === 'node';
}
exports.isNodeEnv = isNodeEnv;
var RuntimeEnv;
(function (RuntimeEnv) {
    RuntimeEnv["NODEJS"] = "nodejs";
    RuntimeEnv["WX_CLIENT"] = "WX_CLIENT";
    RuntimeEnv["UNKNOWN"] = "unknown";
})(RuntimeEnv = exports.RuntimeEnv || (exports.RuntimeEnv = {}));
function identifyRuntimeEnv() {
    // 注意检查顺序：先检查是否在 Node.js 环境，再检查是否在小程序环境
    if (isNodeEnv()) {
        return RuntimeEnv.NODEJS;
    }
    if (isInWxEnv() && isSupportCloudbase()) {
        return RuntimeEnv.WX_CLIENT;
    }
    return RuntimeEnv.UNKNOWN;
}
exports.identifyRuntimeEnv = identifyRuntimeEnv;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1640575353035);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map