
/////////////////////////////////////////////
// Standard's

import PDFReport from '.'

/////////////////////////////////////////////
// Application's

/////////////////////////////////////////////
// Object's

/////////////////////////////////////////////
// Main component

const SettlementWithCustomersReport: React.FC = () => {

    /////////////////////////////////////////
    // 

    return (
        <PDFReport
            reportId='SettlementWithCustomersReport'
            reportParams={[]}
            reportTitle='Báo cáo công nợ với khách hàng'
        />
    )
}

/////////////////////////////////////////////
// Export's

export default SettlementWithCustomersReport