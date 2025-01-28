
import 'firebase/firestore'
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';
import { getExternalAccountData } from '../commons/external-account';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,                             // "AIzaSyCKzJaSHaWFMfvIc5_GMScHv5GGqaQ96VY",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,                     //"fir-b73c8.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,                       //"fir-b73c8",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,               //"fir-b73c8.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,      //"30275030113",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,                               //"1:30275030113:web:dc3fa50277b1d39832ae20"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Authentication
const auth = getAuth(app)

// db
const db = getFirestore(app)

// customToken
const functions = getFunctions(app)

// const testOnCall = httpsCallable(functions, 'testOnCall')
// console.log('functions: ', functions)
// console.log('testOnCall: ', 'Hello world!')

// testOnCall('Hellog world!')

// async function callTestOnCall() {
//     const responsse = await testOnCall('Hellog world!')
//     console.log('result: ', responsse.data)
// }

// callTestOnCall()

// testOnCall('Hellog world!')
//     .then((result: any) => {
//         console.log('result: ', result)
//     })
//     .catch((error) => {
//         console.error('Error: ', error)
//     })

const createCustomToken = httpsCallable(functions, 'createCustomToken')

const externalAccountData = getExternalAccountData()
console.log('externalAccountData: ', externalAccountData)
// console.log('Dữ liệu gửi lên (JSON):', JSON.stringify(externalAccountData));
// // createCustomToken({ uid: 'USER_UID', externalAccountId, externalAccountOwner })
// const { telegramId, zaloId, deviceId, deviceInfo, userToken } = externalAccountData


createCustomToken(externalAccountData)
    .then((result: any) => {
        const customToken = result.data.customToken
        console.log('result: ', result)
        console.log('customToken: ', customToken)
        return signInWithCustomToken(auth, customToken)
    })
    .then((userCredential) => {
        console.log('User signed in with custom token:', userCredential?.user)
    })
    .catch((error) => {
        console.error('Error signing in with custom token:', error)
    })



export { db, auth }


