import React, { FC } from 'react'
import { Space, Typography } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import useGetUserInfo from '../hooks/useGetUserInfo'
import styles from './Logo.module.scss'
import { HOME_PATHNAME, MANAGE_INDEX_PATHNAME } from '../router/index'
const { Title } = Typography
const Logo: FC = () => {
  const { username } = useGetUserInfo()
  const pathname = username ? MANAGE_INDEX_PATHNAME : HOME_PATHNAME

  return (
    <div className={styles.container}>
      <Link to={pathname}>
        <Space>
          <Title>
            <FormOutlined />
          </Title>
          <Title>小慕问卷</Title>
        </Space>
      </Link>
    </div>
  )
}
export default Logo
