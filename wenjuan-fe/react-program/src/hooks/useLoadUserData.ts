import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import useGetUserInfo from './useGetUserInfo'
import { getUserInfoService } from '../services/user'
import { loginReducer } from '../store/userReducer'
import { getToken } from '../utils/user.token'

function useLoadUserData() {
  const dispatch = useDispatch()
  const [waitingUserData, setWaitingUserData] = useState(true)

  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result
      dispatch(loginReducer({ username, nickname }))
    },
    onFinally() {
      setWaitingUserData(false)
    },
  })

  const { username } = useGetUserInfo()

  useEffect(() => {
    if (username) {
      setWaitingUserData(false)
      return
    }

    const token = getToken()
    if (!token) {
      setWaitingUserData(false)
      return
    }

    run()
  }, [username])

  return { waitingUserData }
}

export default useLoadUserData
