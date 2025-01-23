import { checkParams, connectParams } from "./connect-params"

export interface DownloadFileParams {
    url?: string
    fileName: string
}

export const downloadFile = async (params: DownloadFileParams) => {

    let url = params.url
    if (!url) {
        url = connectParams.urlDownload
        url = checkParams.url
    }

    const abc: string = url
    try {
        const response = await fetch(abc)
        const blob = await response.blob()

        // Tạo URL cho Blob và tạo liên kết tải về
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', params.fileName)
        document.body.appendChild(link)

        // Thực hiện lệnh tải về và xóa bỏ link sau khi tạo
        link.click()
        document.body.removeChild(link)

    } catch (error) {
        console.error('Error downloading the file', error)
    }
}

