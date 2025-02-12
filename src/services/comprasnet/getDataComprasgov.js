const { default: axios } = require("axios");

//const siteKey = 'b8bbded1-9d04-4ace-9952-b67cde081a7b';
const siteKey = "b8bbded1-9d04-4ace-9952-b67cde081a7b";
const code_captcha =
  "W1_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.3gAHp3Bhc3NrZXnFA7Pf968iGwt22iT9n6bb1hiTbcl-nMBfVuMsPolXIJAihSQAMDMUlZH7R3fMtE5uckEpREMMwY8Y0C4o0WYnMbJlBgQkfFvK7PxJ4_xWhKrYaomc8FKgTwS2KT7cp1ApVKYCOCbOnn4A8N6615t8juzm0PjaY1fBF5DvcXDZATpH0VW0XJ53zUIgUtl7ilLWbfV54hHpEogk9jYFj9Efe4m0tSYBL5yPUaq8ozwc0m2Lo4fSujwRyD5nX5p9pdHS2CpMCOrZvr8o9qUkNA0hvUT0JYanrG_bEGzKAEUgXkx0GZs_XT7ZrfCviiDt4pZ2Qzt4Yr3S_vtqM3MoEnWsmoldmCgQOwXkv-LYVfhV0BzJSuEVVLMz1csRyqfHJxcoHAdEk4Oqu6Hu2naKQ1nJq1fpTT7Vr6PRvIW9BC2Mddb67NsEWNcE_OVndgC_0iMc1j4zpw-HrG7Bj4paMtVPGjRD-816XDB9JUzbd87sPdyymW5Op4CPr-cRyTuhqtyV-CqZD59gMd5kR2m2RofHW3RbNcq3Kw3798ed0axgCFw67R86ik0zh221ZPuAvsRN9s_N3WRysgLsjGrzHtbYACJQLQNFQVqRREkfulesEppVWJDgFcny5VhS4Mgpw3nTm7vNwFXqxoesydbEu-zETC3-cS3cM7FpCzqYVLo_hFJlIMalK-AjeqFBYme0msQ8FDsT4keqmcR_tCtoiTk5p0duLgTijduQCDWKBClvJ0R_JsUjkb1MncxiGOcPE6-B5GJ7cB-_7GJhX-u6L-G0vsUyNs_D2OonzEKNX9iBiTJ7R4aAbohG2MM4CMgkg1fRp7Fj5_o1ERi1U4DpqmXHbMU3kcaBNH4Jg8hp8_L6WjW7GAJHuZ6UqkuPglrfF33mfuxdVaJthOny8SV3SRQBF1H72icyy_1FxCJkveuIuoFHe8P8wsoKaGDvHdtQiJbmrr2dpf5JakwrGMsgJarYAdkJjLEaXRqhdlLLmu_LU8HKsCTd4Dge5kD5k8CSiQL6S_-Ba9Q7iZGBdHUxK2XzGOnj17F3kKRS51SqH8lPdrW5nqtaYgmLB_k76R7YEYKvYsfefm8BPaSDcY2cpRtX6oc3MPlOEXY_TIfpbMF0W9nzPMOr5fNcLh49PcWY7C0nI8kMGqrJiDDBwAobCxM-3ys7VXnSmoIhy5-KpnDORfvwbwgAudtiC33JdvpWA-lG1bMHAXLlXHeZJVE-456XtCEERKnjkPxXj6zAp5kaArSshsMBwKdzaXRla2V52SRiOGJiZGVkMS05ZDA0LTRhY2UtOTk1Mi1iNjdjZGUwODFhN2KjZXhwzmeFMnSicGQApWNkYXRh1AAApmNkYXRhMtQAAKJrcqgxMzE1N2VlMQ.XKeWXn2O-8zwpyGx06me0yLfnxbuY1vgX3HfwAGj0G4";

const tk =
  "eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIwNDA1Mjk4MTUzNyIsInRpcG8iOiJGIiwiaWRlbnRpZmljYWNhb19mb3JuZWNlZG9yIjoiMTUxMzUyOTIwMDAxNDciLCJpZF9zZXNzYW8iOjY4NzQ0NTQ2LCJvcmlnZW1fc2Vzc2FvIjoiVyIsImF1dGVudGljYWNhbyI6IkwiLCJuaXZlaXNfY29uZmlhYmlsaWRhZGUiOlsxLDIsM10sInRpcG9fZm9ybmVjZWRvciI6IkoiLCJwb3J0ZV9mb3JuZWNlZG9yIjoiMSIsImlhdCI6MTczNjc4MTY2OSwiZXhwIjoxNzM2NzgyMjY5fQ.cUpLCyQe2brBGcr8DHRXHzohjMy5SZT9VEmW2gugqpDT6FyFKhMeOswean9rfOJH1bp-3a2ZSr4WsK8opPWaJZ6S9pSV0mVw47GcVhLXdD15QkJaDuJH2blQyE2hiLQQ7ZLdVhLsNEkQoPpcU4naCAHwoZHB5Iw6YxlouLlJjcLkw5hnFZSC0hsQucokuYXoWpQYdjo1023k4_K07u_C3u_mA4JFr7V04rGT-xrlNCPDhrGIGbilbSVCtCUfJlqXQkXi5eUUqRabpTcOavshx1IVa223iKhwe7sga9kA_xOtflTGyqAqAUFGTNIEBfPIuBxaOFd79wf2keCwDYw8iC00_Tu7HHL_f9HxiTV5MjDYRtLdSFe6vqz2Fl8ebXf3xOCVFeiRLe75mRtp3L7FYqzs_qq4UPdN8CNyvlpd31Gd6bcoV_QUIsKYSXoXFljciDTbb-bNW_zf6KB9t4W0ek-1d7mACX32aPyYiBBdFlsCBDZZTxEh4LtxHBMBW6T8pUI-g7IwmlpRHPn9-V7i4Nnc3pKDtSOD5g5srcEQA3O3ZSUWGRs-ekenKEdHskClnErg2fIxA9gMacOe-ZFJKRgy8oQCIHS2ZMe8tv3hdNWRZd6Fg6KlD8ASb11I6t4mvE4Owea3pp1d2vtVDLeD5wlR-uXg5F62K8lblLU7dU4";

/**
 * @description PEGA O CAPTCHA NO PORTAL COMPRASGOV
 * @param {string} token
 * @returns response com o captcha
 */
async function getCaptchaComprasGov(token) {
  try {
    const url =
      "https://api.hcaptcha.com/getcaptcha/b8bbded1-9d04-4ace-9952-b67cde081a7b";
    const bodyContent = `{"type": "hsw", "req": "${tk}"}`;
    const response = await axios.post(url, bodyContent, {
      headers: {
        Authorization: `Bearer  ${tk}`,
        Accept: "application/json,application/octet-stream",
        "Content-Type": "application/octet-stream",
        //"Content-Type": "application/json",
      },
    });
    console.log(response);
    //return = response.data.generated_pass_UUID;
  } catch (error) {
    //console.error("Erro na requisição:", error);
    if (error.response) {
      console.error(
        "Status code:",
        error.response.status,
        "Error" + error.message
      );
    }
  }
}

/**
 * @description EXTRAIR O CHAT DO PORTAL COMPRASGOV
 * @param {string} codeBidding
 * @param {string} size_page
 * @param {string} page
 * @param {string} captcha
 * @returns Objeto json
 * @param {any} token
 */
async function getChatComprasGov(codeBidding, size_page, page, captcha, token) {
  try {
    const response = await axios.get(
      `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-mensagem/v2/chat/${codeBidding}?size=${size_page}&${page}=0&legadoAsp=false&captcha=${captcha}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    /**
     * @type {DataMsg}
     */
    const dataBody = response.data;
    console.log(dataBody);
    return {
      data: dataBody,
      status: response.status,
      msg: response.statusText,
    };
  } catch (error) {
    const response = {
      data: [],
      status: error.response.status,
      msg: error.message,
    };
    console.log(response);
  }
}

/**
 * @typedef {Object} Data
 * @property {string} codeLicitacao - Código da licitação.
 * @property {string} token - Token de autenticação.
 * @property {string} page - Número da página.
 * @property {string} size - Total de itens da página.
 */

/**
 * @description PEGA O CAPTCHA NO PORTAL COMPRASGOV
 * @param {Data} data
 */
async function getChat(data) {
  try {
    const { token, codeLicitacao, page, size } = data;
    const captcha = await getCaptchaComprasGov(token);
    const chat = await getChatComprasGov(
      codeLicitacao,
      size,
      page,
      captcha,
      token
    );
    //console.log(captcha)
    return { data: [], status: "", msg: "" }; //chat
  } catch (error) {
    console.log(error.messsage);
  }
}

/**
 * @param {string} token
 */
async function getRetoken(token) {
  try {
    const url =
      "https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-usuario/v2/sessao/fornecedor/retoken";
    const response = await axios
      .put(url, "", {
        headers: {
          Authorization: `Bearer  ${tk}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error.response.status, error.message);
      });
    //const token = response;
    //console.log(token);
  } catch (error) {
    console.log(error);
  }
}

async function createTaskCaptcha() {
  try {
    const body = {
      clientKey: "ec8254f0e237492c8bd5e74ce3948eb4",
      task: {
        type: "RecaptchaV3TaskProxyless",
        websiteURL: "https://cnetmobile.estaleiro.serpro.gov.br",
        websiteKey: "b8bbded1-9d04-4ace-9952-b67cde081a7b", //6LeFY7UUAAAAANq3IRQtuH9hQFugmh_OR9OlQHaW",
      },
    };
    const response = await axios
      .post("https://api.2captcha.com/createTask", body, {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          getResultTaskCaptcha(response.data.taskId);
        }, 5000);
      });
  } catch (error) {}
}

/**
 * @param {string} taskId
 */
async function getResultTaskCaptcha(taskId) {
  try {
    const body = {
      clientKey: "ec8254f0e237492c8bd5e74ce3948eb4",
      taskId: taskId,
    };
    const response = await axios
      .post("https://api.2captcha.com/getTaskResult", body)
      .then((response) => console.log(response));
  } catch (error) {}
}

module.exports = {
  getChat,
};

//getCaptchaComprasGov("");
//getRetoken("");
//createTaskCaptcha();
//getResultTaskCaptcha("78451476503");
//getChatComprasGov("38025905900382024", "5", "1", code_captcha, tk);
