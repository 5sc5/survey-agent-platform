/**
 * @description 问卷 输入框
 * @author 吴英杰
 */
import Component from './Component'
import PropComponent from './PropComponent'
import { QuestionTextareaDefaultProps } from './interface'
export * from './interface'
// Textarea组件配置
export default {
  title: '多行输入',
  type: 'questionTextarea', //要和后端统一好
  Component, //画布显示组件
  PropComponent, //修改属性
  defaultProps: QuestionTextareaDefaultProps,
}
