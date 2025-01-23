
/////////////////////////////////////////////
// 

import { useEffect, useState } from 'react'
import { Button, Card, InputNumber, Modal } from 'antd'
import { ArrowLeftOutlined, CheckOutlined, ClearOutlined, PicCenterOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// 

import { XTSObject } from '../../data-objects/types-common'

/////////////////////////////////////////////
// 

import './index.css'

/////////////////////////////////////////////
// 

interface NumpadProps {
    open: boolean
    min?: number
    max?: number
    // amount: number
    dataObject: XTSObject
    itemName: string
    title: string
    description: string
    onChange: (amount: number | undefined) => void
}

interface AmountInputProps {
    min?: number
    max?: number
    // amount: number
    dataObject: any
    itemName: string
    title: string
    description: string
    renderKey?: number
    onChange: (amount: number) => void
}

/////////////////////////////////////////////
// 

const AmountInput: React.FC<AmountInputProps> = (props) => {

    const { dataObject } = props
    const [amount, setAmount] = useState(0)
    const [numpadOpen, setNumpadOpen] = useState(false)

    const onChange = (amount: number | undefined) => {
        setNumpadOpen(false)
        if (amount !== undefined) {
            (dataObject as any)[props.itemName] = amount
            setAmount(amount)
            props.onChange(amount)
        }
    }

    const openAmountInput = () => {
        setNumpadOpen(true)
    }

    const objectAmount = (dataObject as any)[props.itemName]
    useEffect(() => {
        setAmount(objectAmount)
    }, [objectAmount])

    /////////////////////////////////////////////
    // 

    return (
        <div className=''>
            <div className='amount-input-title'>
                {props.description}
            </div>
            <InputNumber
                className='amount-input-field'
                readOnly={true}
                value={amount}
                onClick={openAmountInput}
            />

            <Numpad
                open={numpadOpen}
                min={props.min}
                max={props.max}
                dataObject={props.dataObject}
                itemName={props.itemName}
                title={props.title}
                description={props.description}
                onChange={onChange}
            />
        </div>
    )
}

const Numpad: React.FC<NumpadProps> = (props) => {

    // const [amount, setAmount] = useState((props.dataObject as any)[props.itemName])
    const [amount, setAmount] = useState(0)

    const clearAmount = () => {
        setAmount(0)
    }

    const fillAmount = () => {
        if (props.max) {
            setAmount(props.max)
        }
    }

    const enterAmount = () => {
        props.onChange(amount)
    }

    const cancelInput = () => {
        props.onChange(undefined)
    }

    const backspace = () => {
        setAmount(Math.floor(amount / 10));
    }

    const enterDigit = (e: any) => {
        const digit = Number(e.target.innerText)
        let coefficient = 10
        if (e.target.innerText === '00') {
            coefficient = 100
        } else if (e.target.innerText === '000') {
            coefficient = 1000
        }
        const newAmount = amount * coefficient + digit

        if (props.min !== undefined && newAmount < props.min) {
            return
        } else if (props.max !== undefined && newAmount > props.max) {
            return
        } else if (newAmount.toString().length <= 12) {
            setAmount(newAmount)
        }
    }

    /////////////////////////////////////////////
    //

    const formater = new Intl.NumberFormat('vi-VN')

    useEffect(() => {
        if (props.open) {
            setAmount(0)
        }
    }, [props.open])

    /////////////////////////////////////////////
    //

    return (

        <Modal
            open={props.open}
            title={props.title}
            onCancel={cancelInput}
            footer={[]}
        >
            <Card className='amount-input'>
                <div className='amount-input-description'>
                    <div>{props.description}</div>
                    <b>{formater.format((props.dataObject as any)[props.itemName])}</b>
                </div>
                <div className='amount-input-result'>
                    {formater.format(amount)}
                </div>
                <div className='amount-input-group'>
                    <div className='amount-input-group-numpad' >
                        <div className='amount-input-numpad-row' >
                            <Button className='amount-input-button' onClick={enterDigit}>1</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>2</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>3</Button>
                        </div>
                        <div className='amount-input-numpad-row' >
                            <Button className='amount-input-button' onClick={enterDigit}>4</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>5</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>6</Button>
                        </div>
                        <div className='amount-input-numpad-row' >
                            <Button className='amount-input-button' onClick={enterDigit}>7</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>8</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>9</Button>
                        </div>
                        <div className='amount-input-numpad-row' >
                            <Button className='amount-input-button' onClick={enterDigit}>0</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>00</Button>
                            <Button className='amount-input-button' onClick={enterDigit}>000</Button>
                        </div>
                    </div>

                    <div className='amount-input-group-commands'>
                        <Button
                            className='amount-input-command'
                            onClick={backspace}
                            icon={<ArrowLeftOutlined />}
                        >
                            Lùi
                        </Button>
                        <Button
                            className='amount-input-command'
                            onClick={clearAmount}
                            icon={<ClearOutlined />}
                        >
                            Xóa
                        </Button>
                        <Button
                            className='amount-input-command'
                            onClick={fillAmount}
                            icon={<VerticalAlignBottomOutlined />}
                        >
                            Điền
                        </Button>
                        <Button
                            className='amount-input-command'
                            onClick={enterAmount}
                            icon={<CheckOutlined />}
                            type='primary'
                        >
                            OK
                        </Button>
                    </div>
                </div>

            </Card >
        </Modal >
    )
}

export default AmountInput