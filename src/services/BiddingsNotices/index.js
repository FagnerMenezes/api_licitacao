const { dataSetPortalComprasPublicas } = require("../comprasPublicas/getBiddingsNotices");
const { getDataPCNP } = require("../pncp/getBiddingsPncp");

/**
 * @param {{ uasg: any; edital: any; pagina: any; dt_inicio: any; dt_fim: any;  }} dataBody
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { data?: any[]; total_biddings?: number; total_pages?: any; error?: any; }): void; new (): any; }; }; }} dataBody
 */
async function getDataBidding(dataBody) {
    try {
        const { pagina, dt_inicio, dt_fim } = dataBody;
        let data = [];
        let total = 0;
        // const totalPageComprasnet = 0;

        //if (pagina <= 1 && dt_inicio !== "") {
        const dataSetFinish = await Promise.all([
            getDataPCNP("1", "1000", dt_inicio, dt_fim),
            dataSetPortalComprasPublicas(dataBody, 1)
        ]);
        data = dataSetFinish.flatMap((f) => f);
        console.log("finalizou");
        // }
        return { data, total, total_pages: 0 };
    } catch (error) {
        console.error(error.message, "getDataBidding");
        return [];
    }
}

module.exports = {
    getDataBidding,
};
