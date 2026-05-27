import React, { FC } from 'react'
import { Spin } from 'antd'
import { Outlet } from 'react-router-dom'
import useNavPage from '../hooks/useNavPage'
import useLoadUserData from '../hooks/useLoadUserData'
const QuestionLayout: FC = () => {
  //加载用户信息
  const { waitingUserData } = useLoadUserData()
  //用户没有登录时,跳转到登录页
  useNavPage(waitingUserData)
  return (
    <div style={{ height: '100vh' }}>
      {waitingUserData ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Spin />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
export default QuestionLayout
