import { generateUUID } from "./common-use"

/////////////////////////////////////////////
// Local storage

function setLocalDeviceId(deviceId: string): void {
    localStorage.setItem("deviceId", deviceId)
}

function getLocalDeviceId() {
    var deviceId = localStorage.getItem("deviceId")
    if (!deviceId) {
        deviceId = generateUUID()
        setLocalDeviceId(deviceId)
    }
    return deviceId
}

function setLocalUserToken(userToken: string) {
    localStorage.setItem("userToken", userToken)
}

function getLocalUserToken() {
    return localStorage.getItem("userToken")
}

export {
    setLocalUserToken,
    getLocalUserToken,
    setLocalDeviceId,
    getLocalDeviceId,
}