
/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Space, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
// import type { AnyAction } from '@reduxjs/toolkit'

/////////////////////////////////////////////
// Application's

// import { apiRequest, setParams, setTemp, signIn } from '../data-storage/slice-session'
// import { getLocalDeviceId, getLocalUserToken } from '../commons/users'
// import { createXTSObject } from '../../data-exchange/objects'
// import { generateUUID } from '../../commons/common-use'
// import { connectParams } from '../../commons/connect-params'

/////////////////////////////////////////////
// Object's

// import signInResponse from '../../data-mock/sign-in.json'
// import Password from 'antd/es/input/Password'

import { createXTSObject, getXTSClass, getXTSEnum, getXTSEnumItem, getXTSObjectProperties, readJSON, writeJSON } from '../data-objects/common-use'
import FormItem from 'antd/es/form/FormItem'
import { TextArea } from 'antd-mobile'
// import { postRequest, postRequestWithThunk } from '../data-storage/post-request'

import { actions, apiRequest } from '../data-storage/slice-sales-order'
import { XTSObject, XTSType } from '../data-objects/types-common'
import { useCreatePage, UseCreatePageParams } from '../hooks/usePage'

/////////////////////////////////////////////
// Main component

const ABC: React.FC = () => {

    const [value, setValue] = useState({ text: 'abc' })
    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setValue(Object.assign(value, { text: e.target.value }))
    }

    useEffect(() => {
        form.setFieldsValue({ abc: value })
    }, [value])

    return <>
        <Form form={form}>
            <Form.Item name='abc' initialValue={value.text}>
                <Input onBlur={handleBlur}>
                </Input>
            </Form.Item>
        </Form>
    </>
}

const FormValueChoice: React.FC<any> = (props) => {

    const { itemValue, openChoicePage } = props

    const { itemName } = itemValue
    // const attributeValue = dataObject[itemName]

    // const [value, setValue] = useState(attributeValue)
    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //     dataObject[itemName] = e.target.value
    // }

    useEffect(() => {
        form.setFieldsValue({ [itemName]: itemValue.presentation })
    }, [itemValue])

    return <>
        <Form form={form}>
            <Form.Item name={itemName}>
                <Input />
            </Form.Item>
        </Form>
    </>
}

function TestPage(props: any) {

    const dispatch = useDispatch()

    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    const onChange = (value: string, form: any) => {

        let newObject = createXTSObject(value)
        // console.log('newObject', newObject)

        if (!newObject) {
            newObject = getXTSEnum(value)
        }
        const newObjectJSON = writeJSON(newObject)
        // const newObjectJSON = newObject.writeJSON()
        form.setFieldValue("textArea", newObjectJSON)

        // console.log('newObject', newObject)
        if (newObject instanceof XTSType) {
            newObject.clearEmptyRef()
        }
        // console.log('newObject.clearEmptyRef', newObject)

        // console.log('getXTSClass.' + value, getXTSClass(value))
        // console.log('getXTSEnum.' + value, getXTSEnum('XTSGender'))
        // console.log('getXTSEnumItem.' + value, getXTSEnumItem('XTSGender', 'Male'))

        // console.log('typeof register', typeof newObject.register)

        // const ABC = getXTSClass('XTSOrder')

        // type PropertiesWithType<T> = { [K in keyof T]: T[K]; }

        // type ABCProperties = PropertiesWithType<ABC>

        // type ABCProperties = keyof ABC
        // type ABCProperties = Omit<ABC, never>
        // console.log('ABCProperties', ABCProperties)

    }

    const handleReadJSON = () => {

        // const abc = createXTSObject('XTSCreateObjectsRequest')
        // console.log(abc)

        // const XTSClass = getXTSClass('XTSCreateObjectsRequest')
        // console.log(XTSClass)

        // console.log('getPrototypeOf', Object.getPrototypeOf(abc))
        // console.log('className', getClassName(abc))
        // console.log('getXTSObjectProperties', getXTSObjectProperties(getClassName(abc)))

        const textArea = form.getFieldValue('textArea')

        if (textArea.length > 0) {

            const newXTSObject = readJSON(textArea)
            console.log('newXTSObject', newXTSObject)

            // const XTSClass = getXTSClass(newXTSObject._type)
            // console.log(' newXTSObject instanceof ', newXTSObject instanceof XTSClass)
        }

    }

    const handleDoRequest = () => {

        const dataType = form.getFieldValue('xtsType')
        const textArea = form.getFieldValue('textArea')

        // console.log('dataType', dataType)

        const objectJSON = JSON.parse(textArea)
        // console.log('objectJSON', objectJSON)

        const headers = {}
        const body = createXTSObject(dataType, objectJSON)
        // console.log('body', body)

        const requestData = { headers, body }

        console.log('requestData', requestData)

        const ABC = getXTSClass('XTSOrder') as any

        type PropertyDescriptions<T> = { [K in keyof T]: string }

        // const getPropertyDescriptions = <T>(obj: T): PropertyDescriptions<T> => { 
        //     const descriptions: Partial<PropertyDescriptions<T>> = {}

        //     for (const key in obj) {
        //          if (obj.hasOwnProperty(key)) { 
        //             descriptions[key] = `This is a ${typeof obj[key]} property`; 
        //         } 
        //     } 
        //     return descriptions as PropertyDescriptions<T>;
        // }



        try {
            dispatch<any>(apiRequest(requestData))

        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <p>Test page </p>

            < Form
                form={form}
            >
                <Space>

                    <Form.Item label='Select type' name='xtsType' style={{ width: '300px' }
                    }>
                        <Select placeholder='Select XTS-type' options={Options} onChange={
                            (value) => { onChange(value, form) }
                        }
                        />
                    </Form.Item>

                    {/* <FormItem>
                        <Button
                            onClick={clickButton}
                        >
                            Create XTSObject
                        </Button>
                    </FormItem> */}

                    <FormItem>
                        <Button
                            onClick={handleDoRequest}
                        >
                            Do request
                        </Button>
                    </FormItem>

                    < FormItem >
                        <Button
                            onClick={handleReadJSON}
                        >
                            Read stringJSON
                        </Button>
                    </FormItem>
                </Space>

                < FormItem name='textArea' >

                    <Input.TextArea
                        // autoSize={true}
                        style={{ height: '500px', resize: 'none' }}
                    >
                    </Input.TextArea>

                </FormItem>
            </Form>

        </div>
    )
}

const Options = [
    {
        value: "XTSSessionState",
        label: "XTSSessionState"
    },
    {
        value: "XTSObjectId",
        label: "XTSObjectId"
    },
    {
        value: "XTSObject",
        label: "XTSObject"
    },
    {
        value: "XTSRecordKey",
        label: "XTSRecordKey"
    },
    {
        value: "XTSProduct",
        label: "XTSProduct"
    },
    {
        value: "XTSOrder",
        label: "XTSOrder"
    },
    {
        value: "XTSCounterparty",
        label: "XTSCounterparty"
    },
    {
        value: "XTSCart",
        label: "XTSCart"
    },
    {
        value: "XTSGender",
        label: "XTSGender"
    },
    {
        value: "XTSGetObjectListRequest",
        label: "XTSGetObjectListRequest"
    },
    {
        value: "XTSGetObjectsRequest",
        label: "XTSGetObjectsRequest"
    },
    {
        value: "XTSCreateObjectsRequest",
        label: "XTSCreateObjectsRequest"
    },
    {
        value: "XTSUpdateObjectsRequest",
        label: "XTSUpdateObjectsRequest"
    },
    {
        value: "XTSDeleteObjectsRequest",
        label: "XTSDeleteObjectsRequest"
    },
    {
        value: "XTSDownloadObjectListRequest",
        label: "XTSDownloadObjectListRequest"
    },
    {
        value: "XTSGetRecordSetRequest",
        label: "XTSGetRecordSetRequest"
    },
    {
        value: "XTSUpdateRecordSetRequest",
        label: "XTSUpdateRecordSetRequest"
    },
    {
        value: "XTSUpdateRecordsRequest",
        label: "XTSUpdateRecordsRequest"
    }
]


// export enum PAGE_ACTIONS {
//     SAVE = 'SAVE',
//     BACK = 'BACK',
//     RELOAD = 'RELOAD',
// }

// var B = PAGE_ACTIONS.BACK

// if (B === 'BACK') {
//     console.log('This is BACK')
// } else (
//     console.log('This is not BACK')
// )

/////////////////////////////////////////////
// Export's

export default TestPage