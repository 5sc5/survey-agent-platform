import React, { FC, useEffect, useState, useRef } from 'react'
// import { useSearchParams } from 'react-router-dom'
import { Typography, Spin, Divider, Empty } from 'antd'
import { useTitle, useDebounceFn, useRequest } from 'ahooks'
import { useSearchParams } from 'react-router-dom'
import { getQuestionListServise } from '../../services/question'
import QuestionCard from '../../components/QuestionCard'
import ListSearch from '../../components/ListSearch'
import styles from './common.module.scss'
import userEvent from '@testing-library/user-event'
import { LIST_PAGE_SIZE, LIST_SEARCH_PARAM_KEY } from '../../constant'
const { Title } = Typography
const List: FC = () => {
  useTitle('小慕问卷-我的问卷')
  const [started, setStarted] = useState(false) //标记已经开始加载（防抖，有延迟时间）
  const [page, setPage] = useState(1) //List内部的数据，不在url参数中体现
  const [list, setList] = useState([]) //全部的列表数据，上划加载更多，累计
  const [total, setTotal] = useState(0)
  const haveMoreData = total > list.length
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || ''
  // keyword变化时重置信息
  useEffect(() => {
    setStarted(false)
    setPage(1)
    setList([])
    setTotal(0)
  }, [keyword])
  // 真正加载
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListServise({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword,
      })
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], total = 0 } = result
        setList(list.concat(l)) //累计
        setTotal(total)
        setPage(page + 1)
      },
    }
  )
  // 尝试去触发加载-防抖
  const containerRef = useRef<HTMLDivElement>(null)
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const elem = containerRef.current
      if (elem == null) return
      const domRect = elem.getBoundingClientRect()
      if (domRect == null) return
      const { bottom } = domRect
      if (bottom <= document.body.clientHeight) {
        load() //真正加载数据
        setStarted(true)
      }
    },
    {
      wait: 1000,
    }
  )
  //当页面加载，或者url参数（keyword）变化时，触发加载
  useEffect(() => {
    tryLoadMore()
  }, [searchParams])
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener('scroll', tryLoadMore)
    }
    return () => {
      window.removeEventListener('scroll', tryLoadMore) //解绑时间，重要!!!
    }
  }, [searchParams, haveMoreData])
  // LoadMore Elem
  const LoadMoreContentElem = () => {
    if (!started || loading) return <Spin />
    if (total === 0) return <Empty description="暂无数据" />
    if (!haveMoreData) return <span>没有更多了...</span>
    return <span>开始加载下一页</span>
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {/* {问卷列表} */}
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q
            return <QuestionCard key={_id} {...q} />
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{LoadMoreContentElem()}</div>
      </div>
    </>
  )
}
export default List
