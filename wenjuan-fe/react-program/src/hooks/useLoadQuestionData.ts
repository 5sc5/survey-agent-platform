import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import { getQuestionServise } from '../services/question'
import { resetComponents } from '../store/componentsReducer'
import { resetPageInfo } from '../store/pageInfoReducer'
function useLoadQuestionData() {
  const { id = '' } = useParams()
  const dispatch = useDispatch()
  // ajax加载
  const { data, loading, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error('没有问卷 id')
      const data = await getQuestionServise(id)
      return data
    },
    {
      manual: true,
    }
  )
  //根据获取的data设置redux store
  useEffect(() => {
    if (!data) return
    const {
      title = '',
      desc = '',
      js = '',
      css = '',
      isPublished = false,
      componentList = [],
    } = data
    //获取默认的selected
    let selectedId = ''
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id //默认选中第一个组件
    }
    //把componentList存储到Redux store中
    dispatch(resetComponents({ componentList, selectedId, copiedComponent: null }))
    //把pageInfo存储到Redux store中
    dispatch(resetPageInfo({ title, desc, js, css, isPublished }))
  }, [data])
  // 判断id变化，执行ajax加载问卷数据
  useEffect(() => {
    run(id)
  }, [id])
  return { loading, error }
}
export default useLoadQuestionData
