
export const TWA = (window as any).Telegram.WebApp as any

// Dùng tại component AppHeader
export function telegramSettings(onClickBackButton: () => void) {

    const telegramId = TWA.initDataUnsafe.user?.id
    if (telegramId) {
        TWA.offEvent('backButtonClicked')
        TWA.BackButton.onClick(onClickBackButton)
        TWA.BackButton.show()

        TWA.expand()

        TWA.disableVerticalSwipes()
        TWA.enableClosingConfirmation()
    }
}

export function isFullscreenAndroid(): boolean {
    return Boolean(TWA.isFullscreen && TWA.platform === 'android')
    // return true
}

export function isFullscreenIOS(): boolean {
    return Boolean(TWA.isFullscreen && TWA.platform === 'ios')
}

export function isFullscreenTDesktop(): boolean {
    return Boolean(TWA.isFullscreen && TWA.platform === 'tdesktop')
}

export function isFullsize(): boolean {
    return Boolean(TWA.isFullsize)
}

export function isTDesktop(): boolean {
    return Boolean(TWA.platform === 'tdesktop')
}

export function isWindows(): boolean {
    return Boolean(TWA.platform === 'windows')
}

export function isMacOS(): boolean {
    return Boolean(TWA.platform === 'macos')
}

export function isAndroid(): boolean {
    return Boolean(TWA.platform === 'android')
}

export function isIOS(): boolean {
    return Boolean(TWA.platform === 'ios')
}
