import { httpsCallable } from "firebase/functions"
import { useDispatch } from "react-redux"
import { getExternalAccountData } from "../commons/external-account"
import { auth, fireBaseFunctions } from "./config"
import { signInWithCustomToken } from "firebase/auth"

import { actions } from "../data-storage/slice-session"

const FirebaseConnect: React.FC = () => {

    const dispatch = useDispatch()

    // customToken
    const createCustomToken = httpsCallable(fireBaseFunctions, 'createCustomToken')

    const externalAccountData = getExternalAccountData()
    console.log('externalAccountData: ', externalAccountData)
    // console.log('Dữ liệu gửi lên (JSON):', JSON.stringify(externalAccountData));
    // // createCustomToken({ uid: 'USER_UID', externalAccountId, externalAccountOwner })
    // const { telegramId, zaloId, deviceId, deviceInfo, userToken } = externalAccountData

    createCustomToken(externalAccountData)
        .then((result: any) => {
            const customToken = result.data.customToken
            // console.log('result: ', result)
            // console.log('customToken: ', customToken)
            // const { sliceName, actions, apiRequest } = getXTSSlice('XTSSession')
            dispatch(actions.setParams({ idToken: customToken }))
            return signInWithCustomToken(auth, customToken)
        })
        .then((userCredential) => {
            console.log('User signed in with custom token:', userCredential?.user)
        })
        .catch((error) => {
            console.error('Error signing in with custom token:', error)
        })
    /////////////////////////////////////////
    //  

    return (
        <div >

        </div >

    )
}

export default FirebaseConnect