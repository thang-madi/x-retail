
export function XTSEnum(_type: string): any {

    try {
        const XTSEnum = eval(`${_type}`)
        return XTSEnum
    } catch (error) {
        //
    }
}

export const XTSGender = {
    Male: {
        _type: "XTSObjectId",
        dataType: "XTSGender",
        id: "Male",
        presentation: "Nam",
    },
    Female: {
        _type: "XTSObjectId",
        dataType: "XTSGender",
        id: "Female",
        presentation: "Nữ",
    },
    Unknown: {
        _type: "XTSObjectId",
        dataType: "XTSGender",
        id: "Unknown",
        presentation: "Bí mật",
    },
}

export const XTSCounterpartyKind = {
    LegalEntity: {
        _type: "XTSObjectId",
        dataType: "XTSCounterpartyKind",
        id: "LegalEntity",
        presentation: "Doanh nghiệp",
    },
    IndividualEntrepreneur: {
        _type: "XTSObjectId",
        dataType: "XTSCounterpartyKind",
        id: "IndividualEntrepreneur",
        presentation: "Cá nhân kinh doanh",
    },
    Individual: {
        _type: "XTSObjectId",
        dataType: "XTSCounterpartyKind",
        id: "Individual",
        presentation: "Cá nhân",
    },
    StateAuthority: {
        _type: "XTSObjectId",
        dataType: "XTSCounterpartyKind",
        id: "StateAuthority",
        presentation: "Cơ quan chức năng",
    },
}

export const XTSSalesOrderState = {
    Editing: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "Editing",
        presentation: "Đang soạn",
    },
    ToPrepay: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "ToPrepay",
        presentation: "Chờ trả trước",
    },
    Preparing: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "Preparing",
        presentation: "Đang chuẩn bị",
    },
    // Transporting: {
    //     _type: "XTSObjectId",
    //     dataType: "XTSSalesOrderState",
    //     id: "Transporting",
    //     presentation: "Đang vận chuyển",
    // },
    Delivered: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "Delivered",
        presentation: "Đã giao hàng",
    },
    Completed: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "Completed",
        presentation: "Đã hoàn thành",
    },
    Delete: {
        _type: "XTSObjectId",
        dataType: "XTSSalesOrderState",
        id: "Cancelled",
        presentation: "Đã hủy",
    },
}

export const XTSStructuralUnitType = {
    Warehouse: {
        _type: "XTSObjectId",
        dataType: "XTSStructuralUnitType",
        id: "Warehouse",
        presentation: "Kho hàng",
    },
    Retail: {
        _type: "XTSObjectId",
        dataType: "XTSStructuralUnitType",
        id: "Retail",
        presentation: "Quầy bán lẻ",
    },
    RetailAccrualAccounting: {
        _type: "XTSObjectId",
        dataType: "XTSStructuralUnitType",
        id: "RetailAccrualAccounting",
        presentation: "Bán lẻ (cơ sở dồn tích)",
    },
    ShopWarehousesGroup: {
        _type: "XTSObjectId",
        dataType: "XTSStructuralUnitType",
        id: "ShopWarehousesGroup",
        presentation: "Nhóm kho cửa hàng",
    },
    Department: {
        _type: "XTSObjectId",
        dataType: "XTSStructuralUnitType",
        id: "Department",
        presentation: "Bộ phận",
    },


}

export const XTSContractKind = {
    Warehouse: {
        _type: "XTSObjectId",
        dataType: "XTSContractKind",
        id: "WithSupplier",
        presentation: "Với người bán",
    },
    Retail: {
        _type: "XTSObjectId",
        dataType: "XTSContractKind",
        id: "WithCustomer",
        presentation: "Với người mua",
    },
    RetailAccrualAccounting: {
        _type: "XTSObjectId",
        dataType: "XTSContractKind",
        id: "FromPrincipal",
        presentation: "Với người đặt ký gửi",
    },
    ShopWarehousesGroup: {
        _type: "XTSObjectId",
        dataType: "XTSContractKind",
        id: "WithAgent",
        presentation: "Với người nhận bán hộ",
    },
    Department: {
        _type: "XTSObjectId",
        dataType: "XTSContractKind",
        id: "Other",
        presentation: "Khác",
    },
}

export const XTSOperationKindsSalesInvoice = {
    SaleToCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "SaleToCustomer",
        presentation: "Bán cho khách hàng",
    },
    TransferForCommission: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "TransferForCommission",
        presentation: "Chuyển đi ký gửi",
    },
    TransferToProcessing: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "TransferToProcessing",
        presentation: "Chuyển đi thuê gia công",
    },
    TransferForSafeCustody: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "TransferForSafeCustody",
        presentation: "Chuyển đi gửi giữ hộ",
    },
    ReturnToSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "ReturnToSupplier",
        presentation: "Trả lại hàng cho người bán",
    },
    ReturnToPrincipal: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "ReturnToPrincipal",
        presentation: "Trả lại hàng cho người đặt ký gửi",
    },
    ReturnFromProcessing: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "ReturnFromProcessing",
        presentation: "Nhận lại từ thuê gia công",
    },
    ReturnFromSafeCustody: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSalesInvoice",
        id: "ReturnFromSafeCustody",
        presentation: "Trả lại hàng nhận giữ hộ",
    },
}

export const XTSOperationKindsSupplierInvoice = {
    ReceiptFromSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReceiptFromSupplier",
        presentation: "Mua hàng từ nhà cung cấp",
    },
    ReceptionForCommission: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReceptionForCommission",
        presentation: "Nhận hàng nhận bán hộ",
    },
    ReceptionIntoProcessing: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReceptionIntoProcessing",
        presentation: "Tiếp nhận để gia công",
    },
    ReceptionForSafeCustody: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReceptionForSafeCustody",
        presentation: "Tiếp nhận để giữ hộ",
    },
    ReturnFromCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReturnFromCustomer",
        presentation: "Nhận hàng bán bị trả lại",
    },
    ReturnFromAgent: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReturnFromAgent",
        presentation: "Nhận hàng ký gửi bị trả lại",
    },
    ReturnFromSubcontractor: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReturnFromSubcontractor",
        presentation: "Nhận hàng từ người gia công",
    },
    ReturnFromSafeCustody: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsSupplierInvoice",
        id: "ReturnFromSafeCustody",
        presentation: "Nhận trả lại hàng gửi giữ hộ ",
    },
}

export const XTSOperationKindsCashReceipt = {
    FromCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "FromCustomer",
        presentation: "Thu tiền từ khách hàng",
    },
    FromSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "FromSupplier",
        presentation: "Nhận trả lại từ người bán",
    },
    FromAdvanceHolder: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "FromAdvanceHolder",
        presentation: "Thu lại tạm ứng cá nhân",
    },
    RetailIncome: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "RetailIncome",
        presentation: "Doanh thu bán lẻ",
    },
    RetailIncomeAccrualAccounting: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "RetailIncomeAccrualAccounting",
        presentation: "Doanh thu bán lẻ (cơ sở dồn tích)",
    },
    CurrencyPurchase: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "CurrencyPurchase",
        presentation: "Mua ngoại hối",
    },
    Other: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "Other",
        presentation: "Thu khác",
    },
    OtherSettlements: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "OtherSettlements",
        presentation: "Hạch toán khác",
    },
    SettlementsByCredits: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "SettlementsByCredits",
        presentation: "Hạch toán khoản vay",
    },
    LoanReturnByEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "LoanReturnByEmployee",
        presentation: "Thu tiền nhân viên vay",
    },
    ReceiptOfCashInBank: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "ReceiptOfCashInBank",
        presentation: "Thu tiền từ tài khoản ngân hàng",
    },
    EntrepreneurPesonalFinances: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "EntrepreneurPesonalFinances",
        presentation: "Tài chính cá nhân",
    },
    FromOurCompany: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "FromOurCompany",
        presentation: "Thu từ công ty chúng ta",
    },
    ReceiptFromCurrencySale: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashReceipt",
        id: "ReceiptFromCurrencySale",
        presentation: "Thu tiền bán ngoại hối",
    },

}

export const XTSOperationKindsPaymentReceipt = {
    FromCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "FromCustomer",
        presentation: "Thu từ khách hàng",
    },
    FromSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "FromSupplier",
        presentation: "Thu từ người bán",
    },
    FromAdvanceHolder: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "FromAdvanceHolder",
        presentation: "Thu tiền tạm ứng cá nhân",
    },
    CurrencyPurchase: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "CurrencyPurchase",
        presentation: "Mua ngoại hối",
    },
    Other: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "Other",
        presentation: "Thu khác",
    },
    OtherSettlements: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "OtherSettlements",
        presentation: "Hạch toán khác",
    },
    Taxes: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "Taxes",
        presentation: "Nhận hoàn thuế",
    },
    SettlementsByCredits: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "SettlementsByCredits",
        presentation: "Hạch toán khoản vay",
    },
    LoanReturnByEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "LoanReturnByEmployee",
        presentation: "Thu tiền nhân viên vay",
    },
    PaymentByCardsReceipt: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "PaymentByCardsReceipt",
        presentation: "Thu tiền theo thẻ ngân hàng",
    },
    CashContribution: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "CashContribution",
        presentation: "Thu tiền vào tài khoản",
    },
    TransferFromAnotherAccount: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "TransferFromAnotherAccount",
        presentation: "Chuyển sang tài khoản khác",
    },
    FromCourierCompanyMail: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "FromCourierCompanyMail",
        presentation: "Nhận tiền đang chuyển",
    },
    PaymentReceiptByCredits: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "PaymentReceiptByCredits",
        presentation: "Thu tiền khoản vay",
    },
    FromOurCompany: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "FromOurCompany",
        presentation: "Thu từ công ty chúng ta",
    },
    ReceiptFromCurrencySale: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentReceipt",
        id: "ReceiptFromCurrencySale",
        presentation: "Thu tiền bán ngoại hối",
    },

}

export const XTSOperationKindsCashPayment = {
    Salary: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "Salary",
        presentation: "Chi theo bảng thanh toán tiền lương",
    },
    SalaryForEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "SalaryForEmployee",
        presentation: "Chi tiền lương cho người lao động",
    },
    Taxes: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "Taxes",
        presentation: "Chi nộp thuế",
    },
    ToAdvanceHolder: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "ToAdvanceHolder",
        presentation: "Chi tạm ứng cá nhân",
    },
    ToCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "ToCustomer",
        presentation: "Chi cho khách hàng",
    },
    ToSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "ToSupplier",
        presentation: "Chi cho người bán",
    },
    Other: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "Other",
        presentation: "Chi khác",
    },
    TransferToCashCR: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "TransferToCashCR",
        presentation: "Chuyển tiền sang quầy thu ngân",
    },
    LoanIssuanceToEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "LoanIssuanceToEmployee",
        presentation: "Chi cho nhân viên vay",
    },
    SettlementsByCredits: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "SettlementsByCredits",
        presentation: "Hạch toán khoản vay",
    },
    OtherSettlements: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "OtherSettlements",
        presentation: "Hạch toán khác",
    },
    ToExpenses: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "ToExpenses",
        presentation: "Chi phí",
    },
    CashInBank: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "CashInBank",
        presentation: "Nộp tiền mặt vào ngân hàng",
    },
    EntrepreneurPesonalFinances: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "EntrepreneurPesonalFinances",
        presentation: "Tài chính cá nhân",
    },
    OurCompany: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsCashPayment",
        id: "OurCompany",
        presentation: "Chi cho công ty chúng ta",
    },

}

export const XTSOperationKindsPaymentExpense = {
    ToSupplier: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "ToSupplier",
        presentation: "Chi cho người bán",
    },
    ToCustomer: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "ToCustomer",
        presentation: "Chi cho khách hàng",
    },
    ToAdvanceHolder: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "ToAdvanceHolder",
        presentation: "Chi tạm ứng cá nhân",
    },
    Salary: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "Salary",
        presentation: "Chi theo bảng thanh toán tiền lương",
    },
    Taxes: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "Taxes",
        presentation: "Chi nộp thuế",
    },
    Other: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "Other",
        presentation: "Chi khác",
    },
    OtherSettlements: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "OtherSettlements",
        presentation: "Hạch toán khác",
    },
    SettlementsByCredits: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "SettlementsByCredits",
        presentation: "Hạch toán khoản vay",
    },
    LoanIssuanceToEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "LoanIssuanceToEmployee",
        presentation: "Chi vay cho người lao động",
    },
    ReturnPaymentToPaymentCards: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "ReturnPaymentToPaymentCards",
        presentation: "Hoàn tiền vào thẻ ngân hàng",
    },
    ToExpenses: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "ToExpenses",
        presentation: "Chi phí",
    },
    CashWithdrawal: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "CashWithdrawal",
        presentation: "Rút tiền từ tài khoản",
    },
    TransferToAnotherAccountSalary: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "TransferToAnotherAccount",
        presentation: "Chuyển sang tài khoản khác",
    },
    SalaryForEmployee: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "SalaryForEmployee",
        presentation: "Chi lương cho người lao động",
    },
    EntrepreneurPesonalFinances: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "EntrepreneurPesonalFinances",
        presentation: "Tài chính cá nhân",
    },
    CreditSalesReturn: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "CreditSalesReturn",
        presentation: "Trả lại khoản vay",
    },
    BankCommission: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "BankCommission",
        presentation: "Phí ngân hàng",
    },
    OurCompany: {
        _type: "XTSObjectId",
        dataType: "XTSOperationKindsPaymentExpense",
        id: "OurCompany",
        presentation: "Chi cho công ty chúng ta",
    },

}

