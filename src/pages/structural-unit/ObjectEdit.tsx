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
import { BottomBar } from '../../components/ContextMenu'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { createXTSMediaItem, createXTSObject } from '../../data-objects/common-use'
import { XTSMediaItem, XTSObjectEditProps } from '../../data-objects/types-components'
import { actions as sessionActions } from '../../data-storage/slice-session'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'

/////////////////////////////////////////////
// Object's

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
    // const dataType = 'XTSStructuralUnit'

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

    const pageName = dataType
    const pageTitle = (!dataObject?.objectId.id) && 'Đơn vị mới' || dataObject?.description + ' (soạn)'
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
        // renderKey: 0,
    }
    const { setPageInfo } = useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page

    const afterSave = (tempData: any) => {

        if (props.afterSave) {
            // const objectId = tempData?.objects[0]?.objectId
            // if (objectId) {
            //     props.afterSave(objectId)
            // }
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
    // props

    const commonItemProps = { form, dataObject, setPageInfo }

    /////////////////////////////////////////////
    //

    return (
        <div className='structural-unit-edit' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                form={form}
            >
                <Card style={{ margin: 5 }}>

                    <FormInput
                        itemName='objectId'
                        dataType='XTSStructuralUnit'
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
                    <FormSelect
                        itemName='structuralUnitType'
                        dataType='XTSStructuralUnitType'
                        itemProps={{
                            label: 'Dạng đơn vị',
                            required: false,
                            labelCol: { span: 4 },
                            style: { width: '200px' }
                        }}
                        selectProps={{
                            required: false
                        }}
                        {...commonItemProps}
                    />
                    <Space>
                        <FormInput
                            itemName='orderWarehouse'
                            dataType='Boolean'
                            itemProps={{
                                label: 'Kho 2 pha',
                                // className: 'hidden',
                            }}
                            checkerProps={{
                                required: false
                            }}
                            {...commonItemProps}
                        />

                    </Space>

                    {/* <FormInput
                        itemName='employeeResponsible'
                        dataType='XTSEmployee'
                        itemProps={{
                            label: 'Chăm sóc',
                            // className: 'hidden',
                            required: false,
                            labelCol: { span: 4 },
                        }}
                        inputProps={{
                            placeholder: '',
                            allowClear: true,
                            required: false
                        }}
                        {...commonItemProps}
                    /> */}

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