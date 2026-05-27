import React, { FC, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'
import { Button, Checkbox, Form, Input, Select, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { OptionType, QuestionRadioPropsType } from './interface'

const PropComponent: FC<QuestionRadioPropsType> = (props: QuestionRadioPropsType) => {
  const { title, isVertical, value, options = [], onChange, disabled } = props
  const [form] = Form.useForm()
  const lastPropsRef = useRef('')
  const watchedOptions = Form.useWatch('options', form) || []

  useEffect(() => {
    const propsKey = JSON.stringify({ title, isVertical, value, options })
    if (lastPropsRef.current === propsKey) return
    lastPropsRef.current = propsKey
    form.setFieldsValue({ title, isVertical, value, options })
  }, [form, title, isVertical, value, options])

  function normalizeOptions(rawOptions: OptionType[] = []) {
    return rawOptions
      .filter(Boolean)
      .map(opt => ({
        ...opt,
        text: opt.text || '',
        value: opt.value || nanoid(5),
      }))
  }

  function handleValuesChange() {
    if (onChange == null) return

    const newValues = form.getFieldsValue() as QuestionRadioPropsType
    const normalizedOptions = normalizeOptions(newValues.options)
    const optionValues = normalizedOptions.map(opt => opt.value)
    const nextValue = newValues.value && optionValues.includes(newValues.value) ? newValues.value : ''

    onChange({
      ...newValues,
      options: normalizedOptions,
      value: nextValue,
    })
  }

  function handleAdd() {
    if (onChange == null) return

    const newOption = { text: '', value: nanoid(5) }
    const newValues = form.getFieldsValue() as QuestionRadioPropsType
    const normalizedOptions = normalizeOptions(newValues.options)
    const nextOptions = [...normalizedOptions, newOption]

    form.setFieldsValue({ options: nextOptions })
    lastPropsRef.current = JSON.stringify({
      title: newValues.title,
      isVertical: newValues.isVertical,
      value: newValues.value,
      options: nextOptions,
    })
    onChange({
      ...newValues,
      options: nextOptions,
    })
  }

  function handleRemove(remove: (index: number | number[]) => void, name: number) {
    remove(name)
    setTimeout(handleValuesChange)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, isVertical, value, options }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <Space key={key} align="baseline">
                  <Form.Item name={[name, 'value']} hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={[name, 'text']}
                    rules={[
                      { required: true, message: '请输入选项文字' },
                      {
                        validator: (_, text) => {
                          const { options = [] } = form.getFieldsValue()
                          let count = 0
                          options.forEach((opt: OptionType) => {
                            if (text && opt.text === text) count++
                          })
                          if (!text || count === 1) return Promise.resolve()
                          return Promise.reject(new Error('和其他选项重复了'))
                        },
                      },
                    ]}
                  >
                    <Input placeholder="输入选项文字..." />
                  </Form.Item>

                  {index > 1 && <MinusCircleOutlined onClick={() => handleRemove(remove, name)} />}
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="link"
                  onClick={handleAdd}
                  icon={<PlusOutlined />}
                  block
                >
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="默认选中" name="value">
        <Select
          allowClear
          options={watchedOptions.map(({ text, value }: OptionType) => ({
            value,
            label: text || '未命名选项',
          }))}
        />
      </Form.Item>

      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default PropComponent
