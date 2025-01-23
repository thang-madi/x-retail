import { XTSSupplierInvoice } from "../../data-objects/types-application";

interface SupplierInvoiceLabels {
    counterpartyLabel: string
    counterpartyPlaceHolder: string
}

export function getLabels(dataObject: XTSSupplierInvoice): SupplierInvoiceLabels {

    if (dataObject.operationKind?.presentation === 'Người bán trả lại tiền') {
        return {
            counterpartyLabel: 'Nhà cung cấp',
            counterpartyPlaceHolder: 'Chọn nhà cung cấp',
        }
    } else {
        return {
            counterpartyLabel: 'Khách hàng',
            counterpartyPlaceHolder: 'Chọn khách hàng',
        }
    }

}