//const Grecaptcha = require('grecaptcha')
//const client = new Grecaptcha('6LfDaU8fAAAAAFrPjMep4rCAXOsk2qzSepmohhNT');
//const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`

const getChaveBec = async () => {
  // e.preventDefault();
  //const {token}=req.body
  const dadosBec = {
    TextLogin: "15135292000147",
    TextSenha: "ERCOM2019",
    chkAceite: "on",
    hdnRecaptchaToken:
      "03AFcWeA5CRYi0EcHfzNyBi0o1YPCxgB3Cy88Uazg53z9NqQNV1PU9zENCHAHprZiIWhayFs7UGYJ7ea-RfcF0pVOjiH_RaUUhqqoWjbOe5r5NDyIbho8rUBjmedyxmSFUZLpz9K9gDbI20f4HcrN0pyVHFdQMBVF8Akc-w9e12k7qMUvlcbx6XltjPr5nryy1m_NSpigxwLnzjYdTKFkefjw4mb2V03e11qJAFsj1bFbixMIs_J5sSNyIhW88HcDMz7s4s4kIznT7hYaRxGiLlZcAlMsWiDh8hDfaKrISsunCNwr82SlVR0E9tgDKJZuP9JEZOwLtVnoopY-gdr8pHgVmKRmHcMcart14NczoBV7X_5fIMVssERcj1zDhG-6ImpK9hlVhmX_kRO1mAIZzcf6pXK4RmTQiDvmdO0wDGyAUUPXO9N1XQb_ssfmGYsl58rM0jjEWwDw78T7rAmBAyZB5ZQQHEDyiIphgwomL0R8riBh9Sj6usw_2LY3_-KI35UmzsYdp4ZB76XtPkH7cVy6SA7qaDeBDFEta5Fb5wQQT6KzaAEFPFJqN-gMkz16lK4PyLqfWPdtbKuuywywUdss6GgohMC-93-8TlIuC2rdLzivdC-kls0HdqsHceYCUXB3tJhsia7BdJVg2cPaxwYSzPSlOXKAJP-Fu2HGAVjcZtgdHYU0zb4djSqrrbii1lvryEWO3Mk7n2W6ooEb--hDf4mrvE8QpYLUvypqjNvd_xwxyGyVVqgQBJxfNBlRMclYI3IZCFgqyNu5PS9V1h1aumu6vuJGFTuO4Ah2TMMMa93oUne5ed7_PFwDoS5-6u7n4Zg5VSzBiINB9ScxxHeg6yYn_U1sfF14b7I3Ntwi1wnZgSKB9ejnhzIFfphLXdMeL_YcLsTb0hsnLyUrbpZnadEMd2LXlAJ-ypJwKY0EbgeELfqGJH2_pVYKKGwYWrNfe6R8vjfEGcEP83SFom4H2TYX9Vw0N_qMMubihOv-frKGeQvAqrMLKF89LX5i92AXB2SwZpzx4i7K7r1Dc6UWUsC6lbMw2w4Throlf0MboNnxwRf3VWPtLsDLQ8rBphyOOWRi-0xfFWRF6M0ETJrsddy1-h-Om8gMFrI8HpRh8fchhdVXuRfaV9plV17aXF-HprpjOaxKQ4N_E1AJ3bwB45zfcJR576Ewexp6YegcEqH8oCxocR-lLdXzKUNVpKPBtHFPSO4WYI9h-yf05Kp94KUqJd1Mf8cF_p1p_LjjdVSxexQDq-IztYLGQ4FTtDUNs0pvQrYwgZw-H27zlIj0MAwXLkpmLQ3T6srU7Xg3-Scr0D5uvM6Euk4iFtSty6aJkI239WODiegvYcZAqsKRUHFFnFW5DZD8Yde_ifdqj8hTycD1xoNAGRUPgRV4m7d-lqquhaL0tAZ6HGGYLWOlbEOdDNfYktI5bezRi0W-8FEWu9SHPTCY",
    __EVENTTARGET: "Btn_Confirmar",
  };
  let reqOptions = {
    url: "https://www.bec.sp.gov.br/fornecedor_ui/LoginFornecedor.aspx?chave=",
    method: "POST",
    data: `TextLogin=${dadosBec.TextLogin}&TextSenha=${dadosBec.TextSenha}&chkAceite=${dadosBec.chkAceite}&hdnRecaptchaToken=${dadosBec.hdnRecaptchaToken}&__EVENTTARGET=${dadosBec.__EVENTTARGET}`,
  };

  //var chaveRecaptcha = "6LfDaU8fAAAAAFrPjMep4rCAXOsk2qzSepmohhNT";
  try {
    const response = await fetch(reqOptions.url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      },
      method: "POST",
      data: reqOptions.data,
    });
    console.log(response.status);
    return response;
  } catch (err) {
    return err;
  }
};
module.exports = getChaveBec;
