import { XTSSupplierInvoice } from "../../data-objects/types-application";

interface SupplierInvoiceLabels {
    counterpartyLabel: string
    counterpartyPlaceHolder: string
}

export function getLabels(dataObject: XTSSupplierInvoice): SupplierInvoiceLabels {

    if (dataObject.operationKind?.presentation === 'Nhận hàng bán bị trả lại') {
        return {
            counterpartyLabel: 'Khách hàng',
            counterpartyPlaceHolder: 'Chọn khách hàng',
        }
    } else {
        return {
            counterpartyLabel: 'Nhà cung cấp',
            counterpartyPlaceHolder: 'Chọn nhà cung cấp',
        }
    }

}