import { message } from 'antd'
import { getToken } from '../utils/user.token'
import axios from 'axios'
const instance = axios.create({
  timeout: 10 * 1000,
})
//request 拦截：每次请求都带上token
instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  error => Promise.reject(error)
)
// response 拦截：统一处理error和msg
instance.interceptors.response.use(res => {
  const resData = (res.data || {}) as ResType
  const { errno, data, msg } = resData
  if (errno !== 0) {
    // 错误处理
    if (msg) {
      message.error(msg)
    }
    throw new Error(msg)
  }
  return data as any
})
export default instance
export type ResType = {
  errno: number
  data?: ResDataType
  msg?: string
}
export type ResDataType = {
  [key: string]: any
}
