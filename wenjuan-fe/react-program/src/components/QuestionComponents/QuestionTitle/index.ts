/**
 * @description 问卷 输入框
 * @author 吴英杰
 */
import Component from './Component'
import { QuestionTitleDefaultProps } from './interface'
import PropComponent from './PropComponent'
export * from './interface'
// Title组件配置
export default {
  title: '标题',
  type: 'questionTitle', //要和后端统一好
  Component, //画布显示的组件
  PropComponent, //修改属性
  defaultProps: QuestionTitleDefaultProps,
}
