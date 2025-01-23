
import { createXTSObject } from "../data-objects/common-use"
import { XTSObject } from "../data-objects/types-common"

// OK
export function updateTabRow(dataObject: XTSObject, tabName: string, rowData: any, setDataObject: any) {

    if (rowData) {
        const valueTab = (dataObject as { [key: string]: any })[tabName]
        // console.log('valueTab', valueTab)
        const lineIndex = valueTab.findIndex((row: any) => row._lineNumber === rowData._lineNumber)
        // console.log('rowData._lineNumber', rowData._lineNumber)
        if (lineIndex !== -1) {
            valueTab[lineIndex] = rowData
        } else {
            // console.log('updateTableRow.rowData 2', lineIndex)
            var max = 0
            for (let item of valueTab) {
                max = max > item._lineNumber ? max : item._lineNumber
            }
            rowData._lineNumber = max + 1
            valueTab.push(rowData)
        }
        setDataObject(createXTSObject(dataObject._type, dataObject))
    }
}

// OK
// Xóa bỏ 1 dòng có trong bảng với tên tabName 
export function deleteTabRow(dataObject: XTSObject, tabName: string, _lineNumber: number, setDataObject: any) {

    const valueTab = (dataObject as { [key: string]: any })[tabName]
    const lineIndex = valueTab.findIndex((row: any) => row._lineNumber === _lineNumber)
    if (lineIndex !== -1) {
        valueTab.splice(lineIndex, 1)
    }

    // const newTable = valueTab.filter((item: any) => item._lineNumber !== _lineNumber)
    // console.log('dataObject', dataObject)
    setDataObject(createXTSObject(dataObject._type, dataObject))
}

// Sau này sẽ bỏ dần không dùng
// function getFormValuesWithTabs(formValues: {[key:string]: any}, state: any) {

//     const valueTabs = {}
//     for (let tabName in state) {
//         valueTabs[tabName] = state[tabName]
//     }
//     return { ...formValues, ...valueTabs }
// }

/////////////////////////////////////////////
// Export's
