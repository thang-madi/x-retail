/////////////////////////////////////////////
// Standard's

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Modal, Flex, Switch, DatePicker, Select, FormInstance } from 'antd'
import { PicCenterOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import debounce from 'lodash.debounce'

/////////////////////////////////////////////
// Application's

import { createXTSObject, getXTSEnum } from '../../data-objects/common-use'
import { XTSItemValue } from '../../data-objects/types-form'
import { ITEM_VALUE_ACTIONS } from '../../data-objects/types-components'
import ChoicePage from '../../hocs/ChoicePage'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'

/////////////////////////////////////////////
// Main's

// Interface
export interface XTSFormInputProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    multiline?: boolean,
    password?: string,
    itemProps?: any,
    inputProps?: any,
    inputNumberProps?: any,
    datePickerProps?: any,
    checkerProps?: any,
    form?: FormInstance,
    renderKey?: number,
    setPageInfo?: () => void,
}

export interface XTSFormSelectProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    options?: any[]
    itemProps?: any,
    selectProps?: any,
    form?: FormInstance,
    // renderKey?: number,
}

//
export interface XTSSelectProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    options?: any[]
    itemProps?: any,
    selectProps?: any,
    form?: FormInstance,
}

//
export interface XTSTextInputProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    itemProps?: any,
    inputProps?: any,
    inputNumberProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSNumberInputProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    itemProps?: any,
    inputNumberProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSTextAreaProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    multiline?: boolean,
    itemProps?: any,
    inputProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSPasswordInputProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    password?: string,
    itemProps?: any,
    inputProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSCheckerProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    itemProps?: any,
    checkerProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSDatePickerProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    multiline?: boolean,
    password?: string,
    itemProps?: any,
    datePickerProps?: any,
    form?: FormInstance,
    // setPageInfo?: () => void,
}

export interface XTSValueChoiceProps {
    itemName: string,
    prefix?: string,
    dataType: string,
    dataObject: any,
    itemProps?: any,
    inputProps?: any,
    form?: FormInstance,
    setPageInfo?: () => void,
}

/////////////////////////////////////////////
// Form items

// OK
const FormInput: React.FC<XTSFormInputProps> = (props) => {

    const {
        itemName,
        prefix,
        dataType,
        dataObject,
        multiline,
        password,
        // pageId,
        itemProps = {},
        inputProps = {},
        inputNumberProps = {},
        datePickerProps = {},
        checkerProps = {},
        form,
        setPageInfo,
    } = props

    const commonProps = {
        itemName,
        prefix,
        dataType,
        dataObject,
        itemProps,
        form,
        // pageId,
    }

    // console.log('FormInput.props', props)

    /////////////////////////////////////////////
    // 

    switch (dataType) {
        case 'String':
            if (password) {
                return <FormPasswordInput {...commonProps} inputProps={inputProps} />
            } else if (multiline === true) {
                return <FormTextArea {...commonProps} inputProps={inputProps} />
            } else {
                return <FormTextInput {...commonProps} inputProps={inputProps} />
            }
        case 'Number':
            return <FormNumberInput {...commonProps} inputNumberProps={inputNumberProps} />
        case 'Date':
            return <FormDatePicker {...commonProps} datePickerProps={datePickerProps} />
        case 'DateTime':
            return <FormDatePicker {...commonProps} datePickerProps={datePickerProps} />
        case 'Time':
            return <FormDatePicker {...commonProps} datePickerProps={datePickerProps} />
        case 'Boolean':
            return <FormChecker {...commonProps} checkerProps={checkerProps} />

        case '':
        case undefined:
        case null:
            return <></>

        default:
            // console.log('default.itemValue', itemValue)
            // console.log('default.dataObject', dataObject)
            return <FormValueChoice {...commonProps} setPageInfo={setPageInfo} inputProps={inputProps} />
    }
}

// OK
const FormSelect: React.FC<XTSFormSelectProps> = (props) => {

    const {
        itemName,
        prefix,
        dataType = '',
        dataObject,
        options = [],
        itemProps = {},
        selectProps = {},
        form,
    } = props

    const xtsEnum = getXTSEnum(dataType)
    let selectOptions = []
    if (options.length > 0) {
        if (typeof options[0] === 'string') {
            for (let text of options) {
                selectOptions.push({ label: text, value: text })
            }
        } else if (options[0].dataType?.startsWith('XTS')) {
            for (let item of options) {
                selectOptions.push({ label: item.presentation, value: item })
            }
        } else {
            selectOptions = [...options]
        }
        // } else if (objectsEnums[dataType]) {
    } else if (xtsEnum) {
        for (let key in xtsEnum) {
            const item = xtsEnum[key]
            selectOptions.push({ label: item.presentation, value: item })
        }
    }

    // console.log('selectOptions', selectOptions)
    const commonProps = {
        itemName,
        prefix,
        dataObject,
        itemProps,
        selectProps,
        form,
    }

    /////////////////////////////////////////////
    // 

    if (dataType.startsWith('XTS')) {
        return <FormObjectSelect {...commonProps} options={selectOptions} />
    } else {
        return <FormTextSelect {...commonProps} options={selectOptions} />
    }
}

/////////////////////////////////////////////
// Internal's

// OK
const FormObjectSelect: React.FC<any> = (props) => {

    const {
        itemName,
        prefix = '',
        dataObject,
        options,
        itemProps = {},
        selectProps = {},
        form,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const [selectOptions, setSelectOptions] = useState<any[]>([])
    // useEffect(() => {
    //     const _selectOptions: any[] = []
    //     for (let option of options) {
    //         // const { label, value } = option
    //         _selectOptions.push({ label: option.label, value: option.value?.id })
    //     }
    //     setSelectOptions(_selectOptions)
    // }, [options])
    // console.log('props', props)


    const selectItemValue = (value: any) => {

        const option = options.find((item: any) => item.value?.id === value)
        if (option) {
            // dataObject[itemName] = createXTSObject('XTSObjectId', option.value)
            Object.assign(dataObject[itemName], option.value)
            // console.log(itemName, createXTSObject('XTSObjectId', option.value), dataObject, option.value)
            if (selectProps.onChange) {
                selectProps.onChange(option.value)
            }
        }
    }

    const attributeValue = dataObject[itemName]
    useEffect(() => {
        // console.log('attributeValue', attributeValue)
        const _selectOptions: any[] = []
        for (let option of options) {
            _selectOptions.push({ label: option.label, value: option.value?.id })
        }
        setSelectOptions(_selectOptions)

        let option = _selectOptions.find((item: any) => item.value === attributeValue.id)
        if (!option) {
            option = _selectOptions.find((item: any) => item.label === attributeValue.presentation)
        }
        // if (option) {
        //     form.setFieldValue(_itemName, option.value)
        // }
    }, [attributeValue.id, options])

    /////////////////////////////////////////////
    // 

    return (
        <Form.Item name={_itemName} {...itemProps}  >
            <Select
                {...selectProps}
                options={selectOptions}
                onChange={selectItemValue}
                value={attributeValue.id}
                defaultValue={attributeValue.id}
            />
        </Form.Item>
    )
}

// OK
const FormTextSelect: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        options,
        itemProps = {},
        selectProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const selectOptions = []
    if (options.length > 0) {
        if ((typeof options[0] === 'string')) {
            for (let text of options) {
                selectOptions.push({ label: text, value: text })
            }
        }
    }

    const selectItemValue = (value: any) => {

        const option = options.find((item: any) => item.value === value)
        if (option) {
            form.setFieldValue(itemName, option.value)
            dataObject[itemName] = option.value
            if (selectProps.onChange) {
                selectProps.onChange(option.value)
            }
        }
    }

    const attributeValue = dataObject[itemName]
    // useEffect(() => {
    //     form.setFieldValue(_itemName, attributeValue)
    // }, [attributeValue])

    /////////////////////////////////////////////
    // 

    return (
        <Form.Item name={_itemName} {...itemProps} >
            <Select
                {...selectProps}
                value={attributeValue}
                options={selectOptions}
                onChange={selectItemValue}
            />
        </Form.Item>
    )
}

// OK
const FormValueChoice: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        dataType,
        itemProps = {},
        inputProps = {},
        form,
        dataObject,
        // pageId,
    } = props

    // console.log('FormValueChoice.props', props)

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    // choiceOpen
    // State dùng để mở và đóng Modal ChoicePage
    const [choiceOpen, setChoiceOpen] = useState(false)

    // openChoicePage - mở Modal
    const openChoicePage = () => {
        setChoiceOpen(true)
    }

    // Chọn giá trị và đóng cửa sổ Modal ChoicePage
    const choiceItemValue = (itemValue: XTSItemValue): void => {
        props.setPageInfo()
        setChoiceOpen(false)
        // console.log('choiceItemValue.props', props)
        // const { itemName } = itemValue
        if (itemValue.action === ITEM_VALUE_ACTIONS.CHOICE) {
            // setChosenItemValues({ ...chosenItemValues, [itemName]: itemValue })
            // console.log('dataObject', dataObject)
            dataObject[itemName].id = itemValue.id
            dataObject[itemName].dataType = itemValue.dataType
            dataObject[itemName].presentation = itemValue.presentation
            form.setFieldValue(_itemName, itemValue.presentation)
            if (inputProps.onChange) {
                inputProps.onChange(itemValue)
            }
        }
    }

    const addonAfter = <>
        <PicCenterOutlined onClick={() => {
            openChoicePage()
        }} />
    </>

    const clearValue = () => {
        dataObject[itemName].id = ''
        dataObject[itemName].presentation = ''
        if (inputProps.onChange) {
            inputProps.onChange(dataObject[itemName])
        }
    }

    const attributeValue = dataObject[itemName]
    useEffect(() => {
        form.setFieldValue(_itemName, attributeValue?.presentation)
    }, [attributeValue?.id])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName} {...itemProps}>
                <Input
                    className='form-item-value-choice'
                    {...inputProps}
                    addonAfter={(!inputProps.readOnly) && addonAfter}
                    onClear={clearValue}
                    autoComplete='off'
                    readOnly={true}
                />
            </Form.Item>

            <ChoicePage
                modalProps={{
                    centered: true,
                    title: 'Chọn phần tử',
                    open: choiceOpen,
                    header: [],
                    footer: [],
                }}
                itemName={_itemName}
                dataType={dataType}
                form={form}             // Xem xét lại, có thể bỏ đi
                choiceItemValue={choiceItemValue}
            // pageOwnerId={pageId}
            />
        </div >
    )
}

// OK
const FormTextInput: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        inputProps = {},
        form,
        dataObject,
    } = props

    // console.log('FormTextInput.props', props)

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (e: any) => {
        const value = e.target.value || ''
        // form.setFieldValue(itemName, value)
        dataObject[itemName] = value
        if (inputProps.onChange) {
            inputProps.onChange(value)
        }
    }

    const presentation = dataObject[itemName]

    useEffect(() => {
        if (typeof presentation === 'string') {
            form.setFieldValue(_itemName, presentation)
        }
    }, [presentation])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName} {...itemProps}>
                <Input
                    {...inputProps}
                    autoComplete='off'
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}

// OK
const FormTextArea: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        inputProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (e: any) => {
        const value = e.target.value || ''
        // form.setFieldValue(itemName, value)
        dataObject[itemName] = value
        if (inputProps.onChange) {
            inputProps.onChange(value)
        }
    }

    const presentation = dataObject[itemName]

    useEffect(() => {
        if (typeof presentation === 'string') {
            form.setFieldValue(_itemName, presentation)
        }
    }, [presentation])

    return (
        <div>
            <Form.Item name={_itemName}  {...itemProps} >
                <Input.TextArea
                    {...inputProps}
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}

// OK
const FormPasswordInput: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        inputProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (e: any) => {
        const value = e.target.value || ''
        // form.setFieldValue(itemName, value)
        dataObject[itemName] = value
        if (inputProps.onChange) {
            inputProps.onChange(value)
        }
    }

    const presentation = dataObject[itemName]
    useEffect(() => {
        if (typeof presentation === 'string') {
            form.setFieldValue(_itemName, presentation)
        }
    }, [presentation])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName}  {...itemProps} >
                <Input.Password
                    {...inputProps}
                    autoComplete='off'
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}

// OK
const FormNumberInput: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        inputNumberProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (value: number) => {
        // const value = e.target.value || 0
        // form.setFieldValue(itemName, value)
        dataObject[itemName] = value
        if (inputNumberProps.onChange) {
            inputNumberProps.onChange(value)
        }
    }

    const presentation = dataObject[itemName]
    useEffect(() => {
        if (typeof presentation === 'number') {
            form.setFieldValue(_itemName, presentation)
        }
    }, [presentation])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName} {...itemProps} >
                <InputNumber
                    {...inputNumberProps}
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}

// OK
const FormChecker: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        checkerProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (value: boolean) => {

        // console.log('itemName', itemName)
        // console.log('dataObject', dataObject)

        dataObject[itemName] = value
        if (checkerProps.onChange) {
            checkerProps.onChange(value)
        }
    }

    const presentation = dataObject[itemName]
    useEffect(() => {
        if (typeof presentation === 'boolean') {
            form.setFieldValue(_itemName, presentation)
        }
    }, [presentation])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName}  {...itemProps} >
                <Switch
                    {...checkerProps}
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}

// OK
const FormDatePicker: React.FC<any> = (props) => {

    const {
        itemName,
        prefix,
        itemProps = {},
        datePickerProps = {},
        form,
        dataObject,
    } = props

    const _itemName = (prefix) && '_' + prefix + '_' + itemName || itemName

    const onChange = (value: Dayjs) => {
        // const value = e.target.value
        console.log('value', value)
        // form.setFieldValue(itemName, value)
        if (value) {
            dataObject[itemName] = value.format('YYYY-MM-DDTHH:mm:ss')
        } else {
            dataObject[itemName] = '0001-01-01T00:00:00'
        }

        console.log('dataObject[itemName]', dataObject[itemName])

        if (datePickerProps.onChange) {
            datePickerProps.onChange(value)
        }
    }

    // const { format = 'DD-MM-YYYY' } = datePickerProps

    const presentation = dataObject[itemName]
    useEffect(() => {
        if (typeof presentation === 'string') {
            let format = 'YYYY-MM-DD'
            if (presentation.length > 10) {
                format = 'YYYY-MM-DDTHH:mm:ss'
            }
            form.setFieldValue(_itemName, dayjs(presentation, format))
        }
    }, [presentation])

    /////////////////////////////////////////////
    // 

    return (
        <div>
            <Form.Item name={_itemName}  {...itemProps} >
                <DatePicker
                    {...datePickerProps}
                    format='DD-MM-YYYY'
                    onChange={onChange}
                />
            </Form.Item>
        </div >
    )
}


/////////////////////////////////////////////
// Export's

export { FormInput, FormSelect }
