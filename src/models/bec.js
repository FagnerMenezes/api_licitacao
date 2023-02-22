//const Grecaptcha = require('grecaptcha')
//const client = new Grecaptcha('6LfDaU8fAAAAAFrPjMep4rCAXOsk2qzSepmohhNT');
//const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`
const Bec = {

    getDadosBec:function  getRecaptchaToken(req,res){
       // e.preventDefault();
       const {token}=req.body
       const dadosBec = {
        TextLogin: "15135292000147",
        TextSenha: "ERCOM2019",
        chkAceite: "on",
        hdnRecaptchaToken: "03AFY_a8V7K9AG11udM7CSEVbHtK6-8xOF4iOXEQkGeGIK1CDNCdi3hSCTmuTV7UNufXk9U4rdpwPjDFmtDJ63fcGWPqqfQli0l90Ye91e-pM_kyxhg-dmb0ZRXGZGJ9FZJweH6zEjGgUhry4WL51Sm2c2knsw5GMC0R2emuyUudz-aMufIzWti-QaZkM0R8vteyZ6FH7ywRBPjBx248Rsg5aJ5YrswvBSDkFHP4IkDPAlws_FTypBSgtDUBsHJCqKdmv2vKfrl9AhGkc5u32WQaFzVH_4dkeKm_3ZmC4_Ubpo8IUNi5aycUbWIOTzHGvnr_mzJs-Tx21838nHLEAujhEdDjDuzrjnKeuEF0Iplz33KCzf61Bu4RZVnWhsLHCFelRH2fR3XnrrIbancyshCVlTuu1iN1MTZSw5jTlOrDoNzvkkzvtTaY_HK30gXFdDKtd4kkAG6Ah6oPd8Ex90OOAYYmR1W2SOdIqneUZ4riqkGKHgxrlhgDuZC6rdPFLATvWEinVgboPU_XqzYeF3zxWEnO7w5iKmf3sCjuQImJ4HqAyjX6EtK7fKXOE2vLiRC5J8SbqIfZzCnUWWBoqy_8YMpDZ1vonS_DxHD1i74J-jnbgr-iG6OccTHRUCmk65cEcCU4VVaUjXLEoQcFnldpRt61dKGvTXLr3156uirJf-NJ0dxb2cjSgPGfZ79NbbJ1YiiVIsVKo6o5_nJZcCDMLJZqreoF2yk5k9dT5P617LgdywoJFsvQZhhAH5DqjCbkVcYMv_AQI3Hb5gNXOtPMEIoKrQEVIwwAG9y8UsK8q47ln4dOdzJILL9VaOWl7ihIolEC-cgFS1BxzdUD-695uFlMp9q0N_eZRxiGcHeO7sH9YYr9RaJ6WUT87foRUjz_CnP8vVD8R640HfnfqhokwuXnI-4wej5lXTzsZOWQbncLXQ47JpoEUEujjmqf-QP2jgBxaM_NeFlJoYF6D_9cXN5ZlWS6BLTrccqVQ6B8OSyqE1Nn6CXd_YX8-ZMcTRy7NXMYNSj19nz0QOD0z1xdOzslEcqpR2g25L5iWBRsuIBLJpH5uHa57GrzE84goO9bFFu2gi0dv_zl7Q0CFindf5xhl24HBJr67YVTT06szRBXoDbHOpKsr89kUj7EhIIa2WWyEPNukEkuMSD46JRZ6rHJ6hRF9gsXNzpZT8e6lpnRBTRQs1doM2ZzxoAfHZ6PBFF-C2y5cUyKD6uCFSNJqL0vDQx7zaYbDWaDsAEl2hfL52qfw9ycSQcag1_6CM-41vScRMYIrtRNK3rQaUzZuuUYIa9fs_q3A8VjgnNpLg8UY-o2552ijuz-kor5DQ-NUzodsqRUg-EvZ_1xKX2dIk8IGF-x_RROCzm2s63TKHR9vhiSRkySH1Ac3sAUFPIw7SsDPaPyjySEMjVeULHpFTMDHI34Ogzew0OqeDQ4lduTHQs-hjRKirW3TG08J-4dl3_YRbdRQgqzxK1WB-TR8CRL0KKdbVYpJpKI4gixdocTXW55NOeB5-le2bO-tu2wPo-aKuNNY-KYneQG21vEAvd1WGhUqGLmHUhAMOPhnW_vCOxnoATyDkqcnBfRZpkHeoiDtq3A3USwRgLZVXbPbvWAeMVoEDk22X_rfQ6vVpD_IqMQZBe5cLmdA0WF7awtQz5suo_tu4yYHY35Z9MPYdMnlPBI5xTKKlzl5U8PsFibi_2KRckdgND1w_4xLvB6dESgNHBnOdXIhAViAcRMkzRVUjmUxWmv0c5w8OzcTW_PWBoF31QeY",
        __EVENTTARGET: "Btn_Confirmar",
      };
      let reqOptions = {
        url: "https://www.bec.sp.gov.br/fornecedor_ui/LoginFornecedor.aspx?chave=",
        method: "POST",
        data: `TextLogin=${dadosBec.TextLogin}&TextSenha=${dadosBec.TextSenha}&chkAceite=${dadosBec.chkAceite}&hdnRecaptchaToken=${dadosBec.hdnRecaptchaToken}&__EVENTTARGET=${dadosBec.__EVENTTARGET}`,
      };

        //var chaveRecaptcha = "6LfDaU8fAAAAAFrPjMep4rCAXOsk2qzSepmohhNT";
     return  fetch(reqOptions.url,{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Accept":"*/*",
        },
        method:"POST",
        data:reqOptions.data

       }).then((response)=>{
        return response.text();
       //res.setHeader("name", "teste")
       // res.json(response)
       }).catch( (error)=>{console.error(error.message);});
    }

}

module.exports = Bec


