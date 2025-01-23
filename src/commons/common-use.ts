
import { v5 as uuidv5 } from 'uuid'
import { NAMESPACE } from './constants'
import dayjs, { Dayjs } from 'dayjs'
import { XTSObject } from '../data-objects/types-common'
import { compareXTSValues } from '../data-objects/common-use'
import { XTSListFilterItem, XTSListSortItem } from '../data-storage/interfaces'

import { saveAs } from 'file-saver'
import JSZip from 'jszip'

/////////////////////////////////////////////
// UUID

export function newUUID(inputString: string) {
    return uuidv5(inputString, NAMESPACE)
}

export function generateUUID(): string {

    const randomString = Date.now().toString(16)
    let dt = Number("0x" + randomString)

    function randomDig(c: string, dt: number): string {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    }

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => randomDig(c, dt))

    return uuid
}

export function emptyUUID() {
    return '00000000-0000-0000-0000-000000000000'
}


/////////////////////////////////////////////
// Date/Time format

export function formatDateTime(date: Date): string {

    return `${formatDate(date)}T${formatTime(date)}`
}

export function formatDate(date: Date): string {

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function formatTime(date: Date): string {

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}

export function isDate(string: string): boolean {

    const regexDate = /^\d{4}-\d{2}-\d{2}$/
    const regexDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

    return regexDateTime.test(string) || regexDate.test(string)
}

export function stringToDayjs(string: string): Dayjs | undefined {

    if (isDate(string)) {
        return dayjs(string)
    }
}

export function dayjsToString(dayjs: Dayjs): string {
    return dayjs.format('YYYY-MM-DDTHH:mm:ss')
}


/////////////////////////////////////////////
// Currency format

export function formatCurrency(number: number): string {

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

export function VND(number: number): string {

    return `${number.toLocaleString('vi-VN')} đồng`
}

/////////////////////////////////////////////
// Random number

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/////////////////////////////////////////////
// Local storage


/////////////////////////////////////////////
// Clipboard

export function copyToClipboard(textToCopy: string): void {
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // alert(`${textToCopy} đã được sao chép vào Clipboard!`)
        })
        .catch(err => {
            // console.error('Lỗi khi sao chép vào Clipboard:', err);
        })
}

/////////////////////////////////////////////
// String

export function capitalizeFirstLetter(string: string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

/////////////////////////////////////////////
// Array

export function arraySort(objects: XTSObject[], sortBy: XTSListSortItem[]) {
    return objects.sort((object1: XTSObject, object2: XTSObject) => {
        let result = 0
        for (let sortItem of sortBy) {
            const value1 = (object1 as any)[sortItem.key]
            const value2 = (object2 as any)[sortItem.key]
            const result = compareXTSValues(value1, value2) * (sortItem.descending && -1 || 1)
            if (result !== 0) {
                return result
            }
        }
        return result
    });
}

export function arrayFilter(objects: XTSObject[], filter: XTSListFilterItem[]) {
    if (filter.length === 0) {
        return objects
    } else {
        return objects.filter(item => {
            return filter.every(filterItem => {
                const itemValue = (item as any)[filterItem.key]
                // const ABC = compareXTSValues(itemValue, filterItem.value)
                // console.log('itemValue, filterItem, ABC', itemValue, filterItem, ABC)
                return compareXTSValues(itemValue, filterItem.value) === 0
            })
        })
    }
}


/////////////////////////////////////////////
// Download files - option 1

// async function downloadFile(url: string, folder: string): Promise<void> {
//     const localFilename = path.basename(url)
//     const localPath = path.join(folder, localFilename)
//     const response = await fetch(url)
//     const buffer = await response.arrayBuffer()
//     fs.writeFileSync(localPath, Buffer.from(buffer))
// }

// export async function downloadFiles(urls: string[], folder: string) {
//     for (const url of urls) {
//         try {
//             await downloadFile(url, folder)
//             console.log(`Download completed for ${url}`)
//         } catch (error) {
//             console.error(`Failed to download ${url}:`, error)
//         }
//     }
// }


/////////////////////////////////////////////
// Download files - option 2

const extractFileName = (url: string): string => {
    const urlParts = url.split('/')
    return urlParts[urlParts.length - 1]
}

export function downloadFile(imageURL: string) {
    try {
        const fileName = extractFileName(imageURL)
        saveAs(imageURL, fileName)
        console.log(`Download completed for ${imageURL}`)
    } catch (error) {
        console.error(`Failed to download ${imageURL}:`, error)
    }
}

export const downloadAndZipImages = async (imagerURLs: string[], zipFileName: string) => {
    const zip = new JSZip()
    for (const url of imagerURLs) {
        const response = await fetch(url, { mode: 'no-cors' })
        const blob = await response.blob()
        const fileName = url.split('/').pop()
        if (fileName) {
            zip.file(fileName, blob)
        }
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `${zipFileName}.zip`)
}