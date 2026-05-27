/**
 * @description 问卷checkbox
 * @author 吴英杰
 */
import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionCheckboxDefaultProps } from './interface'
export * from './interface'
export default {
  title: '多选',
  type: 'questionCheckbox',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionCheckboxDefaultProps,
}
