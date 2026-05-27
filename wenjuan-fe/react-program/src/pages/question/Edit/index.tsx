import React, { FC } from 'react'
// import { useParams } from 'react-router-dom'
import { useTitle } from 'ahooks'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import { changeSelectedId } from '../../../store/componentsReducer'
import EditCanvas from './EditCanvas'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import EditHeader from './EditHeader'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
const Edit: FC = () => {
  const { loading } = useLoadQuestionData()
  const dispatch = useDispatch()
  function clearSelectedId() {
    dispatch(changeSelectedId(''))
  }
  //修改标题
  const { title } = useGetPageInfo()
  useTitle(`问卷编辑-${title}`)
  return (
    <div className={styles.container}>
      <EditHeader />
      <div className={styles['content-wrapper']}>
        <div className={styles.content}>
          <div className={styles.left}>
            <LeftPanel />
          </div>
          <div className={styles.main} onClick={clearSelectedId}>
            <div className={styles['canvas-wrapper']}>
              <EditCanvas loading={loading} />
            </div>
          </div>
          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Edit
