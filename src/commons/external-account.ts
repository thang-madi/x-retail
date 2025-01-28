import { TWA } from "./telegram"

export function getExternalAccountData() {

    const navigatorData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
    }
    const deviceInfo = JSON.stringify(navigatorData)

    const telegramId = TWA.initDataUnsafe.user?.id || 'Telegram-1234'
    const zaloId = null

    // const deviceId = getLocalDeviceId()
    // const userToken = getLocalUserToken()
    const deviceId = 'Device-123'
    const userToken = 'Token-123'
    const externalAccountData = {
        telegramId,
        zaloId,
        deviceId,
        userToken,
        deviceInfo,
    }

    return externalAccountData
}