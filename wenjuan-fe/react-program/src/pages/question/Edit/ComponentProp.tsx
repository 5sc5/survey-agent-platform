import React, { FC } from 'react'
import { useDispatch, UseDispatch } from 'react-redux'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import { ComponentPropsType, getComponentConfByType } from '../../../components/QuestionComponents'
import { changeComponentProps } from '../../../store/componentsReducer'
const NoProp: FC = () => {
  return <div style={{ textAlign: 'center' }}>未选中组件</div>
}
const ComponentProp: FC = () => {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()
  if (selectedComponent == null) return <NoProp />
  const { type, props, isLocked } = selectedComponent
  const componentConf = getComponentConfByType(type)
  if (componentConf == null) return <NoProp />
  function changeProps(newProps: ComponentPropsType) {
    if (selectedComponent == null) return
    const { fe_id } = selectedComponent
    dispatch(changeComponentProps({ fe_id, newProps }))
  }
  const { PropComponent } = componentConf
  return <PropComponent {...props} onChange={changeProps} disabled={isLocked} />
}
export default ComponentProp
