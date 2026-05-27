import React, { FC, useCallback, memo } from 'react'
import { nanoid } from 'nanoid'
import { Typography } from 'antd'
import { useDispatch } from 'react-redux'
import { componentConfGroup, ComponentConfType } from '../../../components/QuestionComponents'
import { addComponent } from '../../../store/componentsReducer'
import styles from './ComponentLib.module.scss'

const { Title } = Typography

// 单独的组件项，使用 memo 避免不必要的重渲染
const ComponentItem: FC<{ component: ComponentConfType }> = memo(({ component }) => {
  const { title, type, Component, defaultProps } = component
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title,
        type,
        props: defaultProps,
      })
    )
  }, [dispatch, title, type, defaultProps])

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  )
})

const Lib: FC = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => (
        <div key={group.groupId}>
          <Title level={3} className={index === 0 ? styles.firstTitle : styles.title}>
            {group.groupName}
          </Title>
          <div>
            {group.components.map(c => (
              <ComponentItem key={c.type} component={c} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default Lib
