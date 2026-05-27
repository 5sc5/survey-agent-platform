import { Tabs } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import React, { FC } from 'react'
import ComponentLib from './ComponentLib'
import Layers from './Layers'
const LeftPanel: FC = () => {
  const tabsItems = [
    {
      key: 'componentLib',
      label: (
        <span>
          <AppstoreOutlined />
          组件库
        </span>
      ),
      children: <ComponentLib />,
    },
    {
      key: 'layers',
      label: (
        <span>
          <BarsOutlined />
          图层
        </span>
      ),
      children: (
        <div>
          <Layers />
        </div>
      ),
    },
  ]
  return <Tabs defaultActiveKey="componentLib" items={tabsItems} />
}
export default LeftPanel
