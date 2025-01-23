/////////////////////////////////////////////
// Standard's

// import { useEffect, useState } from 'react'
// import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Modal, List, Card, Space } from 'antd'

/////////////////////////////////////////////
// Application's

import { FormInput } from '../../components/FormItems'
// import { useChoicePage } from '../../hooks/use-page'
// import { formDataToItemValue } from '../../data-exchange/common-use'
// import ChoicePage from '../../hocs/choice-page'
import { useEffect } from 'react'
import { useCreatePage, UseCreatePageParams } from '../../hooks/usePage'

/////////////////////////////////////////////
// Main component

export const ProductUOMCard: React.FC<any> = (props) => {           // ProductUOMCard

    const uomRow = props.row
    console.log('uomRow', uomRow)

    return (
        <Card>
            <div>
                #{uomRow?._lineNumber}
            </div>
            <div>
                Đơn vị tính: {uomRow?.uom_presentation}
            </div>
            <div>
                Hệ số: {uomRow?.coefficient}
            </div>
            <div>
                Đơn giá: {uomRow?.price}
            </div>
        </Card>
    )
}

export const ProductUOMRowEditPage: React.FC<any> = (props) => {

    const { dataRow } = props

    useEffect(() => {
        form.setFieldsValue(dataRow)
    }, [dataRow])

    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    // const {
    //     choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     initialItemValue,
    //     choiceItemValue,

    // } = useChoicePage({ pageOwnerId: props.pageId })

    const cancel = () => {
        props.updateProductRow()
    }

    const OK = () => {
        // const formData = row
        props.updateProductRow(dataRow)
    }

    // // Hàm sự kiện khi bấm nút OK trên biểu mẫu Modal ChoicePage
    // const handleOk = (value) => {
    //     setChoiceOpen(false);
    // }

    // // Hàm sự kiện khi bấm nút Cancel trên biểu mẫu Modal ChoicePage
    // const handleCancel = () => {
    //     setChoiceOpen(false)
    //     // setProductRowOpen(false)
    // }

    /////////////////////////////////////////////
    // props

    const commonItemProps = { form, dataObject: dataRow }

    /////////////////////////////////////////////
    //    

    return (
        <Card>
            <div>
                Dòng: {dataRow?._lineNumber}
            </div>
            <div>
                Product: {dataRow?.product}
            </div>
            <div>
                Quantity: {dataRow?.quantity}
            </div>
            <Form
                // onFinish={finish}
                // onFinishFailed={finishFailed}
                form={form}
            >
                <FormInput
                    itemName='product'
                    dataType='XTSProduct'
                    itemProps={{
                        label: 'Sản phẩm',
                        // initialValue: formDataToItemValue(row, 'product'),
                    }}
                    inputProps={{
                        placeholder: 'Nhập sản phẩm',
                        allowClear: true,
                        required: true
                    }}
                    {...commonItemProps}
                // form={form}
                // openChoicePage={openChoicePage}
                />
                <FormInput
                    itemName='quantity'
                    dataType='Number'
                    itemProps={{
                        label: 'Số lượng',
                        required: true,
                    }}
                    inputNumberProps={{
                        placeholder: 'Nhập số lượng',
                        // allowClear: true,
                        required: true,
                        min: 1
                    }}
                    {...commonItemProps}
                />
                <FormInput
                    itemName='price'
                    dataType='Number'
                    itemProps={{
                        label: 'Đơn giá',
                    }}
                    inputNumberProps={{
                        placeholder: 'Nhập đơn giá',
                        // allowClear: true,
                        required: true,
                    }}
                    {...commonItemProps}
                />
                <FormInput
                    itemName='total'
                    dataType='Number'
                    itemProps={{
                        label: 'Thành tiền',
                    }}
                    inputNumberProps={{
                        placeholder: 'Thành tiền',
                        // allowClear: true,
                        required: true,
                    }}
                    {...commonItemProps}
                />

                <Space>
                    <Button block htmlType='button' onClick={OK}>Đồng ý</Button>
                    <Button block htmlType='button' onClick={cancel}>Hủy bỏ</Button>
                </Space>
            </Form>
            {/* <Modal
                title='Chọn phần tử'
                open={choiceOpen}
                footer={[
                    <Button key='back' onClick={handleCancel}>Cancel</Button>,
                ]}
            >
                <ChoicePage
                    initialItemValue={initialItemValue}
                    setChoiceOpen={setChoiceOpen}
                    setFieldsValue={form.setFieldsValue}
                />
            </Modal> */}
        </Card>
    )
}

/////////////////////////////////////////////
// Export's
