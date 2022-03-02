const { callSelfDefinedMethod } = require('@cloudbase/page-module')

exports.main = async function (event, context) {
  return callSelfDefinedMethod(event, context)
}