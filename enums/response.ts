export enum ResponseCode {
  OK = 0,
  InternalError = 50, // 内部发生错误
  ValidationFailed = 51, // 数据验证失败
  DBOperationError = 52, // 数据库操作错误
  InvalidParameters = 53, // 当前操作给定的参数无效
  MissingParameter = 54, // 当前操作的参数缺失
  InvalidOperation = 55, // 函数不能这样使用
  InvalidConfiguration = 56, // 当前操作的配置无效
  MissingConfiguration = 57, // 当前操作缺少配置
  NotImplemented = 58, // 操作尚未执行
  NotSupported = 59, // 操作不支持
  OperationFailed = 60, // 我试过了，但是我不能给你想要的
  NotAuthorized = 61, // 未授权
  SecurityReason = 62, // 由于安全原因，操作被拒绝
  ServerBusy = 63, // 服务器繁忙
  UnknownError = 64, // 未知错误
  NotFound = 65, // 资源不存在
  InvalidRequest = 66, // 无效的请求
  NecessaryPackageNotImported = 67, // 缺少必要的包
  BusinessValidationFailed = 300 // 业务验证失败
}
