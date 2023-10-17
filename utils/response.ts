import { ResponseCode } from '@/enums/response'
import { NextResponse } from 'next/server'

type ResponseInit = Exclude<Parameters<typeof NextResponse.json>[1], undefined>

export type Page<T> = {
  collection: T[]
  total: number
  page: number
  page_size: number
}

export type R<T> = {
  code: ResponseCode
  message: string
  data: T
  ts: number
}

const responseCodeMessages: Map<ResponseCode, string> = new Map([
  [ResponseCode.OK, 'OK'],
  [ResponseCode.InternalError, '内部发生错误'],
  [ResponseCode.ValidationFailed, '数据验证失败'],
  [ResponseCode.DBOperationError, '数据库操作错误'],
  [ResponseCode.InvalidParameters, '当前操作给定的参数无效'],
  [ResponseCode.MissingParameter, '当前操作的参数缺失'],
  [ResponseCode.InvalidOperation, '函数不能这样使用'],
  [ResponseCode.InvalidConfiguration, '当前操作的配置无效'],
  [ResponseCode.MissingConfiguration, '当前操作缺少配置'],
  [ResponseCode.NotImplemented, '操作尚未执行'],
  [ResponseCode.NotSupported, '操作不支持'],
  [ResponseCode.OperationFailed, '我试过了，但是我不能给你想要的'],
  [ResponseCode.NotAuthorized, '未授权'],
  [ResponseCode.SecurityReason, '由于安全原因，操作被拒绝'],
  [ResponseCode.ServerBusy, '服务器繁忙'],
  [ResponseCode.UnknownError, '未知错误'],
  [ResponseCode.NotFound, '资源不存在'],
  [ResponseCode.InvalidRequest, '无效的请求'],
  [ResponseCode.NecessaryPackageNotImported, '缺少必要的包'],
  [ResponseCode.BusinessValidationFailed, '业务验证失败']
])

export function getResponseCodeMessage(code: ResponseCode): string {
  return responseCodeMessages.get(code) || '未知错误'
}

export function success<T>(data: T, init?: ResponseInit): NextResponse<R<T>> {
  return NextResponse.json(
    {
      code: ResponseCode.OK,
      message: 'OK',
      data,
      ts: Date.now()
    },
    init
  )
}

interface FailParams<T> extends ResponseInit {
  message?: string
  data?: T
}

export function fail<T>(
  code: ResponseCode,
  { message, data = {} as T, ...init }: FailParams<T>
): NextResponse<R<T>> {
  return NextResponse.json(
    {
      code,
      message: message || getResponseCodeMessage(code),
      data,
      ts: Date.now()
    },
    init
  )
}
