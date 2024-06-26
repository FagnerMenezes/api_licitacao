// const puppeteer = require('puppeteer-extra').default;
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const fs = require('fs')
// puppeteer.use(StealthPlugin());

// async function getTokenComprasGov() {

//     const browser = await puppeteer.launch({
//         headless: false,
//         args: [
//             '--ignore-certificate-errors',
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--disable-accelerated-2d-canvas',
//             '--disable-gpu',
//             '--window-size=1920x1080',
//             '--proxy-server=direct://',
//             '--proxy-bypass-list=*'
//         ],
//     });
//     // Lançar o navegador
//     try {
//         console.log('executando código')
//         const page = await browser.newPage();
//         const url = 'https://sso.acesso.gov.br/login?';
//         const url_ = 'http://sso.acesso.gov.br/authorize?response_type=code&client_id=comprasnet.gov.br&scope=openid+profile+email+phone+govbr_confiabilidades&redirect_uri=https://www.comprasnet.gov.br/seguro/landing_sso.asp';
//         await page.setRequestInterception(true);
//         page.on('request', (request) => {
//             if (request.isNavigationRequest() && request.frame() === page.mainFrame() && request.url().startsWith('https')) {
//                 const headers = request.headers();
//                 headers['DNT'] = '1';
//                 request.continue({ headers });
//             } else {
//                 request.continue();
//             }
//             // const resourceType = request.resourceType();
//             // if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
//             //     request.abort();
//             // } else {
//             //     request.continue();
//             // }
//         });
//         await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
//         // Navegar para a URL desejada
//         await page.goto(url, { waitUntil: 'load' });
//         await page.mouse.move(100, 100);
//         await page.mouse.move(200, 200);
//         await page.mouse.move(300, 300);
//         await time(1000);
//         await page.type('#accountId', '04052981537', { delay: '200' })
//         await time(1000);
//         await page.click('#enter-account-id', { delay: 200 })

//         await page.waitForNavigation();

//         await page.type('#password', 'Fa281084@', { delay: '200' })
//         await page.click('#submit-button', { delay: 100 });
//         console.log('senha enviada')
//         await page.goto(url_);

//         await page.waitForSelector('#CNPJ2');
//         const radioSelector = '#CNPJ2';
//         await page.waitForSelector(radioSelector); // Espera o input radio aparecer
//         await page.evaluate((selector) => {
//             document.querySelector(selector).checked = true;
//         }, radioSelector);

//         await page.waitForSelector('.actions');
//         await page.evaluate(() => {

//             const buttons = document.getElementsByTagName('button');
//             if (buttons.length >= 5) {
//                 buttons[4].click();
//             } else {
//                 console.error('Quinto botão não encontrado.');
//             }
//         });
//         await page.waitForSelector('html > frameset');
//         await time(2000)
//         await page.goto('https://www.comprasnet.gov.br/assinadas/dispensa_eletronica.asp');
//         // Monitorar novos alvos (abas/janelas)
//         const [newPage] = await Promise.all([
//             new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
//         ]);

//         // Esperar a nova página carregar completamente
//         await newPage.waitForNavigation({ waitUntil: 'load' });

//         // Pegar os dados do sessionStorage na nova aba
//         const sessionData = await newPage.evaluate(() => {
//             return {
//                 accessToken: sessionStorage.getItem('accessToken'),
//                 refreshToken: sessionStorage.getItem('refreshToken')
//             };
//         });

//         //console.log(sessionData);
//         return sessionData;
//     } catch (error) {
//         console.error('Erro:', error);
//     } finally {
//         await browser.close();
//     }

// }

// const time = async (tempo) => {
//     //await page.evaluate(() => {
//     return new Promise(resolve => {
//         setTimeout(resolve, tempo); // Tempo em milissegundos (3 segundos neste caso)
//     });
//     //});
// }

// module.exports = {
//     getTokenComprasGov
// }
// //getTokenComprasGov()