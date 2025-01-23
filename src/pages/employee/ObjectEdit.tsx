/////////////////////////////////////////////
// Standard's

import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Space, FloatButton, Modal, Avatar, Upload, Card } from 'antd'
import { CameraOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams } from '../../hooks/usePage'
import { requestData_ByDataItem, requestData_SaveObject } from '../../data-objects/request-data'
import { FormInput, FormSelect } from '../../components/FormItems'
import { AppAvatar } from '../../components/Avatar'
import { BottomBar, } from '../../components/ContextMenu'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { createXTSMediaItem, createXTSObject } from '../../data-objects/common-use'
import { XTSMediaItem, XTSObjectEditProps } from '../../data-objects/types-components'
import { actions as sessionActions } from '../../data-storage/slice-session'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'

/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../../data-storage/slice-customers'        // customers

import { dataType } from './'
import './index.css'

/////////////////////////////////////////////
// Main component

// OK                                             
const ObjectEditPage: React.FC<XTSObjectEditProps> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn
    const navigate = useNavigate()
    const dispatch = useDispatch()

    /////////////////////////////////////////////
    // Giải cấu trúc props
    const { itemValue, pageId, itemName = '' } = props

    // Biến dùng để quản lý Form
    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    const object_id = itemValue?.id
    // const dataType = 'XTSCounterparty'

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: true,
    }
    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    // console.log('useGetDataObject.dataObject', dataObject)

    const pageName = dataType
    const pos = dataObject?.objectId.presentation.indexOf('ngày')
    const pageTitle = (!dataObject?.objectId.id) && 'Khách hàng mới' || dataObject?.description + ' (soạn)'
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
        // renderKey: 0,
    }
    const { setPageInfo } = useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Làm việc với ChoicePage

    // // Hàm sự kiện khi bấm nút OK trên biểu mẫu Modal ChoicePage
    // const handleOk = (value: any) => {
    //     // console.log('value', value)
    //     closeChoicePage()
    // }

    // // Hàm sự kiện khi bấm nút Cancel trên biểu mẫu Modal ChoicePage
    // const handleCancel = () => {
    //     closeChoicePage()
    // }


    // const { choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     chosenItemValues,
    //     setChosenItemValues,            // Không dùng, mà chỉ dùng tại choice-page
    //     initialItemValue,               // Được gán giá trị bằng setInitialItemValue khi gọi openChoicePage, vẫn cần
    //     setInitialItemValue,            // Không dùng, chỉ dùng trong openChoicePage
    // } = useChoicePage({ pageOwnerId: props.pageId })
    // const { choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     chosenItemValues,
    //     // setChosenItemValues,            // Không dùng, mà chỉ dùng tại choice-page
    //     choiceItemValue,
    //     initialItemValue,               // Được gán giá trị bằng setInitialItemValue khi gọi openChoicePage, vẫn cần
    //     // setInitialItemValue,            // Không dùng, chỉ dùng trong openChoicePage
    // } = useChoicePage()

    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page

    const externalAccount = useSelector((state: any) => state.session.externalAccount)
    const afterSave = (tempData: any) => {
        // const requestData = createRequestDataToSaveFormValues(values, 'XTSCounterparty', defaultValues)
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        // dispatch(actions.setTemp(null))
        // dispatch(apiRequest([requestData]))
        // console.log('customer-edit.afterSave', newAvatar)

        const { apiRequest, actions } = getXTSSlice(dataType)

        const fileOwner = tempData.objects[0].objectId

        console.log('tempData', tempData)
        console.log('fileOwner', fileOwner)

        // Gắn với userProfile
        if (props.additionals?.isUserProfile && externalAccount) {
            // console.log('isUserProfile.externalAccount', externalAccount)

            const customer = fileOwner
            const object = {
                _type: 'XTSCounterparty',
                objectId: externalAccount,
                customer
            }
            const requestData = requestData_ByDataItem('XTSUpdateObjectsRequest', { objects: [object] })
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            // dispatch(actions.setTemp(null))

            dispatch(apiRequest(requestData))
            dispatch(sessionActions.setParams({ userProfile: customer }))
        }

        // Gửi request để xóa bỏ file cũ:
        if (!newAvatar?.imageSrc && currentAvatar.id) {
            const fileIds = []
            const objectId = createXTSObject('XTSObjectId')
            Object.assign(objectId, currentAvatar)
            // objectId.id = currentAvatar.id
            // objectId.dataType = currentAvatar.dataType
            fileIds.push(objectId)

            // console.log('fileIds', fileIds)

            const requestData = requestData_ByDataItem('XTSDeleteFilesRequest', { fileIds },)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            // dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        }

        // Tạo các file mới
        if (newAvatar.imageSrc) {
            let pos = newAvatar.imageSrc.indexOf(';base64,')
            if (pos > 0) {
                let base64Prefix = newAvatar.imageSrc.substring(0, pos)
                let extension = base64Prefix.slice(String('data:image/').length)
                let file = createXTSObject('XTSFile', { _type: 'XTSCounterpartyAttachedFile' })
                file.fileOwner = fileOwner
                file.extension = extension
                file.startsWith = 'customer'
                let binaryData = newAvatar.imageSrc.slice(pos + String(';base64,').length)
                let attributeName = 'picture'
                let dataItem = {
                    copyToS3Storage: true,
                    binaryData,
                    file,
                    attributeName,      // Điền giá trị file vào thuộc tính attributeName là 'picture'
                }
                // console.log('fileOwner 2', fileOwner)
                // console.log('file', file)

                const requestData = requestData_ByDataItem('XTSUploadFileRequest', dataItem)
                console.log('requestData', requestData)
                // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
                dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
                // dispatch(actions.setTemp(null))
                dispatch(actions.setUploadFilesCountDown({ uploadFilesCountDown: 1 }))
                dispatch(apiRequest(requestData))
            }
        }

        if (props.afterSave) {
            const objectId = tempData?.objects[0]?.objectId
            if (objectId) {
                props.afterSave(objectId)
            }
        }
    }

    // Khi ghi lại dữ liệu xong trên Server thì thay đổi trạng thái status và tempData của state.orders
    // Hàm này gọi useEffect để thực hiện thay đổi trên Page.
    const saveFormDataParams: UseSaveFormDataParams = {
        dataType,
        itemName,
        choiceItemValue: props.choiceItemValue,
        afterSave,
    }
    useSaveFormData(saveFormDataParams)

    // finish
    // Hàm sự kiện khi bấm nút Hoàn thành (Ghi lại) trên Form
    const defaultValues = useSelector((state: any) => state.session.defaultValues)

    const finish = ((values: { [key: string]: any }) => {

        const requestData = requestData_SaveObject(dataObject)

        const { apiRequest, actions } = getXTSSlice(dataType)

        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    })

    // finishFailed
    // Hàm sự kiện khi bấm nút Cancel trên Form
    // Quay lại trang trước, hoặc chuyển sang trang View
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    /////////////////////////////////////////
    // Blocker

    // // Biến lưu dấu hiệu về việc cấm quay lại trang trước khi bấm nút Back trên Browser
    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         !choiceOpen && currentLocation.pathname !== nextLocation.pathname
    // );

    // console.log("formDataToItemValue(formData, 'objectId', 'XTSCounterparty')")
    // console.log(formDataToItemValue(formData, 'objectId', 'XTSCounterparty'))

    /////////////////////////////////////////////
    // Avatar

    const dataType_AttachedFile = 'XTSCounterpartyAttachedFile'
    const [currentAvatar, setCurrentAvatar] = useState<XTSMediaItem>(createXTSMediaItem(undefined))
    const [newAvatar, setNewAvatar] = useState<XTSMediaItem>(createXTSMediaItem(undefined))
    const avatarProps = { dataType: dataType_AttachedFile, currentAvatar, newAvatar, setNewAvatar }

    useEffect(() => {
        // console.log('dataObject', dataObject)
        if (dataObject?.picture) {
            setCurrentAvatar(dataObject.picture)
            // console.log('setCurrentAvatar.dataObject', dataObject)

        }
    }, [dataObject])

    /////////////////////////////////////////////
    // props

    const commonItemProps = { form, dataObject, setPageInfo }

    /////////////////////////////////////////////
    //

    return (
        <div className='employee-edit' >

            <AppAvatar
                {...avatarProps}
            />

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                form={form}
            >
                <Card style={{ margin: 5 }}>

                    <FormInput
                        itemName='objectId'
                        dataType='XTSCounterparty'
                        itemProps={{
                            className: 'hidden',
                            label: 'ObjectId',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: '',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <FormInput
                        itemName='description'
                        dataType='String'
                        itemProps={{
                            label: 'Tên gọi',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập tên gọi',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <FormInput
                        itemName='descriptionFull'
                        dataType='String'
                        itemProps={{
                            label: 'Tên gọi đầy đủ',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập tên gọi đầy đủ',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />

                    {/* <Space direction='vertical'> */}
                    <FormSelect
                        itemName='gender'
                        dataType='XTSGender'
                        itemProps={{
                            label: 'Giới tính',
                            required: false,
                            labelCol: { span: 4 },
                        }}
                        selectProps={{
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <FormSelect
                        itemName='counterpartyKind'
                        dataType='XTSCounterpartyKind'
                        itemProps={{
                            label: 'Dạng đối tác',
                            className: 'hidden',
                            required: false,
                            labelCol: { span: 4 },
                        }}
                        selectProps={{
                            required: false
                        }}
                        {...commonItemProps}
                    />

                    <FormInput
                        itemName='dateOfBirth'
                        dataType='Date'
                        itemProps={{
                            label: 'Ngày sinh',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập số điện thoại',
                            allowClear: true,
                            required: false,
                            labelCol: { span: 4 },
                        }}
                        {...commonItemProps}
                    />
                    {/* </Space> */}
                    <FormInput
                        itemName='phone'
                        dataType='String'
                        itemProps={{
                            label: 'Phone',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập số điện thoại',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <FormInput
                        itemName='email'
                        dataType='String'
                        itemProps={{
                            label: 'E-mail',
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập E-mail',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <FormInput
                        itemName='comment'
                        dataType='String'
                        multiline={true}
                        itemProps={{
                            label: 'Mô tả chi tiết',
                        }}
                        inputProps={{
                            placeholder: 'Nhập mô tả chi tiết',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    />

                    <Space>
                        <FormInput
                            itemName='customer'
                            dataType='Boolean'
                            itemProps={{
                                label: 'Customer',
                                // className: 'hidden',
                            }}
                            checkerProps={{
                                required: false
                            }}
                            {...commonItemProps}
                        />

                        <FormInput
                            itemName='vendor'
                            dataType='Boolean'
                            itemProps={{
                                label: 'Vendor',
                                // className: 'hidden',
                            }}
                            inputProps={{
                                placeholder: 'Nhập số điện thoại',
                                required: false
                            }}
                            {...commonItemProps}
                        />
                        <FormInput
                            itemName='otherRelations'
                            dataType='Boolean'
                            itemProps={{
                                label: 'Other relations',
                                // className: 'hidden',
                            }}
                            inputProps={{
                                placeholder: 'Nhập số điện thoại',
                                required: false
                            }}
                            {...commonItemProps}
                        />
                    </Space>
                </Card>

            </Form>

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshObject, }}
                saveItem={{ onClick: () => { form.submit() } }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectEditPage