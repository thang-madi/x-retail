/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'


/////////////////////////////////////////////
// Application's

import { useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { XTSObjectIndexProps } from '../../data-objects/types-components'
import { TWA } from '../../commons/telegram'
import { ChatCheckOutline } from 'antd-mobile-icons'
import { FormInput } from '../../components/FormItems'
import { generateUUID } from '../../commons/common-use'


/////////////////////////////////////////////
// Main component

interface XTSSettings {
    homeShortcut: string,
}

const SettingsPage: React.FC<XTSObjectIndexProps> = (props) => {

    const dispatch = useDispatch()

    /////////////////////////////////////////////
    // Open page

    const [form] = Form.useForm()
    const [dataObject, setDataObjet] = useState<XTSSettings>({ homeShortcut: 'unsupported' })

    const [pageId] = useState(generateUUID())

    const openPageParams: UseOpenPageParams = {
        pageId: pageId,
        pageName: 'Settings',
        pageTitle: 'Settings',
        // reopen: false
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Set Home shortcut

    const createHomeShortcut = () => {
        if (TWA.checkHomeShortcut) {
            const { homeShortcut } = dataObject
            console.log('homeShortcut', homeShortcut)
            // if (homeShortcut !== 'unsupported' && homeShortcut !== 'added') {
            TWA.addToHomeScreen()
            // }
        }
    }

    useEffect(() => {
        if (TWA.checkHomeShortcut) {
            TWA.checkHomeShortcut((status: string) => {
                setDataObjet({ homeShortcut: status })
                console.log('status', status)
            })
        }
    }, [])

    /////////////////////////////////////////////
    // Main component

    const commonItemProps = { form, dataObject }

    return (
        <div>
            <p>Settings</p>
            <Form
                // onFinish={finish}
                // onFinishFailed={finishFailed}
                form={form}
            >
                <FormInput
                    itemName='homeShortcut'
                    dataType='Boolean'
                    itemProps={{
                        label: 'Biểu tượng trên màn hình Home',
                    }}
                    checkerProps={{
                        unCheckedChildren: dataObject.homeShortcut,
                        checkedChildren: dataObject.homeShortcut,
                        value: (dataObject.homeShortcut === 'added'),
                        onChange: createHomeShortcut,
                    }}
                    {...commonItemProps}
                />
            </Form>
        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default SettingsPage