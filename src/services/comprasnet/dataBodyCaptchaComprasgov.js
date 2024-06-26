import axios from 'axios';

async function getCaptchaComprasGov() {
    try {
        const url = 'https://api.hcaptcha.com/getcaptcha/b8bbded1-9d04-4ace-9952-b67cde081a7b';
        const token = 'eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIwNDA1Mjk4MTUzNyIsInRpcG8iOiJGIiwiaWRlbnRpZmljYWNhb19mb3JuZWNlZG9yIjoiMTUxMzUyOTIwMDAxNDciLCJpZF9zZXNzYW8iOjUzMjE0MjcwLCJvcmlnZW1fc2Vzc2FvIjoiVyIsImF1dGVudGljYWNhbyI6IkwiLCJuaXZlaXNfY29uZmlhYmlsaWRhZGUiOlsxLDIsM10sInRpcG9fZm9ybmVjZWRvciI6IkoiLCJwb3J0ZV9mb3JuZWNlZG9yIjoiMSIsImlhdCI6MTcxOTQxMjAwOSwiZXhwIjoxNzE5NDEyNjA5fQ.BigQvkxA_bOwUO9Wg5AFNp3e_MmcmK1_Jk87POtR1vnWxjbhPMM5W4BGWI5BNJpLpvu0LIR1L9TSS41Jchb5ESlzCalt1PYboDqNwXgXrzU7vWpD4seqqIUV0KQmXdsfVqbWDXkileRNIfjHkak39gN66EPT2qTlyp-hOZ3bamR4jHMxYRfSTrLP-jvVF942XXge18pT2usBNWXpiJmS_zC92Vm_dK9mvjqeuH09jUPln3qoIXoRu0saeAO5drNOWuIlxoKYo-Pdwf6gbSVTOBeaJVRNHFNfuHULZPm4xpPnhbDftfxxyfZcCGjd8CLjN5gfRH5N7pAVZIMilRzReC0X-St4HDmVnKrsMv5KukXb7FJQBOZu_ifZwExyMC4UTkYqcZAnoDfx3bw_CUo6xniy8Yn4zymLhJSoztAw27Sy7WoxOY8qjSP-XnI8jwAuaMEWOK448Oyhyb0WDtB6UsJzR7T5XTrxdYIZKE8DNT73wK6P_FUhhdAi0k9Y0jzIvnL9a-JFPk9oTo8MXaTdn-19A7A3_DAGOEos5LC_iC4h7jdyL68RrN9TVWcNXU7gDgFEvsODL4AmjI7CiKoHKsvkPjEV3TyOl7dCUDNUpGLtL_0VPd2YnUHjcE9mdXLBIcwJE-8DUUU5vmzVahQAqFZGHyUWPhiNKXrI5zUYrF8';
        const body = '';
        const response = await axios.post(url, body, {
            headers: {
                Authorization: `Bearer  ${token}`
            }
        })

        const captcha = response.data.generated_pass_UUID;
        const chat = await getChatComprasGov(captcha);
        console.log(response.data, chat)
    } catch (error) {
        console.log(error)
    }

}

const getChatComprasGov = async () => {
    const response = await axios.get(`https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-mensagem/v2/chat/92719005900092024?size=5&page=0&legadoAsp=false&captcha=${captcha}`)
    console.log(response.data)
}

