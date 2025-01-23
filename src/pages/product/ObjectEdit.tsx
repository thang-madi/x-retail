/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Modal, List, Space, FloatButton, Upload, Avatar, Card } from 'antd'
import { CameraOutlined, CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, DeleteOutlined, InsertRowBelowOutlined, PaperClipOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
// import Pictures from '../../components/Pictures'
import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams } from '../../hooks/usePage'
import { FormInput } from '../../components/FormItems'
import { BottomBar } from '../../components/ContextMenu'
import { XTSMediaItem, XTSObjectEditProps } from '../../data-objects/types-components'
import { requestData_ByDataItem, requestData_SaveObject } from '../../data-objects/request-data'
import { XTSObjectId } from '../../data-objects/types-common'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { createXTSObject } from '../../data-objects/common-use'
import { Pictures } from '../../components/Pictures'
import { Loader } from '../../components/Loader'
import { REQUEST_STATUSES } from '../../commons/enums'

/////////////////////////////////////////////
// Object's

import { ProductUOMCard, ProductUOMRowEditPage } from './ProductUomRow'
import { XTSFileRow } from '../../data-objects/types-application'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

// 
const ObjectEditPage: React.FC<XTSObjectEditProps> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn
    // const navigate = useNavigate()
    const dispatch = useDispatch()

    /////////////////////////////////////////////
    // Giải cấu trúc props    
    const { itemValue, pageId, itemName } = props

    // Biến dùng để quản lý Form
    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    const object_id = itemValue?.id
    // const dataType = 'XTSProduct'
    // const tabNames = ['uoms', '_pictures']

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: false,
    }

    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    console.log('ProductEdit.dataObject', dataObject)
    // console.log('ProductEdit.formData', formData)

    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: dataType,
        pageTitle: (!dataObject?.objectId.id) && 'Mặt hàng mới' || dataObject?.description + ' (soạn)',
        // renderKey: 0,
    }
    const { setPageInfo } = useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Làm việc với ChoicePage   

    // // Hàm sự kiện khi bấm nút OK trên biểu mẫu Modal ChoicePage
    // const handleOk = (value) => {
    //     closeChoicePage();
    // }

    // // Hàm sự kiện khi bấm nút Cancel trên biểu mẫu Modal ChoicePage
    // const handleCancel = () => {
    //     closeChoicePage();
    // }

    // const { choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     chosenItemValues,
    //     setChosenItemValues,            // Không dùng, mà chỉ dùng tại choice-page
    //     initialItemValue,               // Được gán giá trị bằng setInitialItemValue khi gọi openChoicePage, vẫn cần
    //     setInitialItemValue,            // Không dùng, chỉ dùng trong openChoicePage
    // } = useChoicePage({ pageOwnerId: props.pageId })


    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page   

    const afterSave = (tempData: any) => {
        // console.log('product-edit.afterSave')
        // console.log('tempData', tempData)

        const { apiRequest, actions } = getXTSSlice(dataType)

        const fileOwner = tempData.objects[0].objectId

        // Gửi request để xóa bỏ các files: 
        if (deletedPictures.length > 0) {
            const fileIds = []
            for (let deletedPicture of deletedPictures) {
                const objectId = createXTSObject('XTSObjectId')
                objectId.id = deletedPicture.id
                objectId.dataType = deletedPicture.dataType
                fileIds.push(objectId)
            }

            // console.log('fileIds', fileIds)

            const requestData = requestData_ByDataItem('XTSDeleteFilesRequest', { fileIds })
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            // dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        }

        // Gửi request để upload các file mới
        if (newPictures.length > 0) {
            // console.log('newPictures', newPictures)
            for (let newPicture of newPictures) {
                let pos = newPicture.imageSrc.indexOf(';base64,')
                if (pos > 0) {
                    let base64Prefix = newPicture.imageSrc.substring(0, pos)
                    let extension = base64Prefix.slice(String('data:image/').length)
                    let file = createXTSObject('XTSFile', { _type: 'XTSProductAttachedFile' })
                    file.fileOwner = fileOwner
                    file.extension = extension
                    file.startsWith = 'product'
                    let binaryData = newPicture.imageSrc.slice(pos + String(';base64,').length)
                    let attributeName = 'picture'
                    let dataItem = {
                        copyToS3Storage: true,
                        binaryData,
                        file,
                        attributeName,          // Điền giá trị file vào thuộc tính attributeName là 'picture'
                    }
                    const requestData = requestData_ByDataItem('XTSUploadFileRequest', dataItem)
                    // console.log('requestData', requestData)
                    // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
                    dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
                    // dispatch(actions.setTemp(null))
                    dispatch(actions.setUploadFilesCountDown({ uploadFilesCountDown: 1 }))
                    dispatch(apiRequest(requestData))
                }
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
    // const defaultValues = useSelector(state => state.session.defaultValues)
    const finish = ((values: any) => {
        // const formValues = getFormValuesWithTabs(values, valueTabs)
        // const requestData = createRequestDataToSaveFormValues(formValues, 'XTSProduct', defaultValues)

        const requestData = requestData_SaveObject(dataObject)
        if (defaultPicture) {
            requestData.body.objects[0].picture = defaultPicture
        }

        const { apiRequest, actions } = getXTSSlice(dataType)

        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    })

    // finishFailed
    // Hàm sự kiện khi có lỗi trên Form
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    /////////////////////////////////////////
    // UOM row page
    const [productUOMRowOpen, setProductUOMRowOpen] = useState()
    const [productUOMRow, setProductUOMRow] = useState({})

    // const openProductUOMRow = (row) => {
    //     // setProductUOMRow(row)
    //     // setProductUOMRowOpen(true)          // Tạm thời chưa dùng
    // }

    // const updateUOMRow = (productUOMRow) => {
    //     setProductUOMRowOpen(false)
    //     if (productUOMRow) {

    //     }
    //     updateTabRow('products', productUOMRow, valueTabs, setValueTabs)
    // }

    /////////////////////////////////////////
    // Blocker

    // // Biến lưu dấu hiệu về việc cấm quay lại trang trước khi bấm nút Back trên Browser
    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         !choiceOpen && currentLocation.pathname !== nextLocation.pathname
    // );

    /////////////////////////////////////////////
    // Pictures

    const dataType_AttachedFile = 'XTSProductAttachedFile'
    const [pictures, setPictures] = useState<XTSMediaItem[]>([])
    const [newPictures, setNewPictures] = useState<XTSMediaItem[]>([])
    const [deletedPictures, setDeletedPictures] = useState<XTSMediaItem[]>([])
    const [defaultPicture, setDefaultPicture] = useState<XTSMediaItem>()

    const pictureProps = { dataType: dataType_AttachedFile, pictures, newPictures, deletedPictures, setNewPictures, setDeletedPictures, setDefaultPicture }
    // const imageProps = { height: '400px' }
    const imageProps = {}

    // const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)
    const _pictures = dataObject['_pictures']
    useEffect(() => {
        setPictures(_pictures.map(
            // item => ({ ...item.file, imageSrc: fileStorageURL + item.fileName }
            (item: XTSFileRow) => item.file))
    }, [_pictures])

    /////////////////////////////////////////
    // props 

    const commonItemProps = { form, dataObject, setPageInfo, }

    /////////////////////////////////////////////
    // 

    return (
        <div className='product-edit' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Pictures {...pictureProps} imageProps={imageProps} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                form={form}

            >
                <Card style={{ margin: 5 }}>

                    <FormInput
                        itemName='objectId'
                        dataType='XTSProduct'
                        itemProps={{
                            className: 'hidden',
                            label: 'ObjectId',
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
                            label: 'Tên gọi sản phẩm',
                            required: true
                        }}
                        inputProps={{
                            placeholder: 'Nhập tên gọi',
                            allowClear: true,
                            required: true
                        }}
                        {...commonItemProps}
                    />
                    <FormInput
                        itemName='sku'
                        dataType='String'
                        itemProps={{
                            label: 'Mã sản phẩm',
                            required: false,
                        }}
                        inputNumberProps={{
                            placeholder: 'Nhập mã sản phẩm',
                            allowClear: true,
                            // required: true,
                        }}
                        {...commonItemProps}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <FormInput
                            itemName='_price'
                            dataType='Number'
                            itemProps={{
                                label: 'Đơn giá',
                                required: true,
                                style: { width: 90 },
                            }}
                            inputNumberProps={{
                                placeholder: 'Nhập đơn giá',
                                // allowClear: true,
                                required: true,
                            }}
                            {...commonItemProps}
                        />
                        <FormInput
                            itemName='measurementUnit'
                            dataType='XTSUOMClassifier'
                            itemProps={{
                                label: 'Đơn vị tính',
                                required: true,
                                style: { width: 100 },
                            }}
                            inputProps={{
                                placeholder: 'Nhập đơn vị tính',
                                allowClear: true,
                                readOnly: true,
                            }}
                            {...commonItemProps}
                        />

                        <FormInput
                            itemName='_uomCoefficient'
                            dataType='Number'
                            itemProps={{
                                label: 'Hệ số Ri',
                                required: false,
                                style: { width: 100 },
                            }}
                            inputNumberProps={{
                                placeholder: 'Nhập hệ số Ri',
                                // allowClear: true,
                                readOnly: false,
                            }}
                            {...commonItemProps}
                        />
                    </div>
                    <FormInput
                        itemName='descriptionFull'
                        dataType='String'
                        multiline={true}
                        itemProps={{
                            label: 'Tên gọi để in',
                        }}
                        inputProps={{
                            placeholder: 'Nhập tên gọi để in',
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

                    {/* <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    dataSource={formData?.uoms || []}
                    renderItem={(row) => (
                        <List.Item>
                            <ProductUOMCard
                                row={row}
                                openProductUOMRow={openProductUOMRow}
                            />
                        </List.Item>
                    )}
                /> */}

                </Card>

                <Modal
                    title='Soạn dòng đơn vị tính'
                    open={productUOMRowOpen}
                    footer={[
                        // <Button key='back' onClick={handleCancel}>Hủy bỏ</Button>,
                    ]}
                >
                    <ProductUOMRowEditPage
                        row={productUOMRow}
                    />
                </Modal>

            </Form>

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshObject, }}
                // action1={{ onClick: addProduct, title: 'Thêm ĐVT', icon: < AppstoreAddOutlined /> }}
                saveItem={{ onClick: () => { form.submit() } }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectEditPage