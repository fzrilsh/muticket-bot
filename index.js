const express = require('express')
const app = express()

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    },
    webVersionCache: {
        type: "remote",
        remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.post('/send', async function(req, res){
    const { message, no } = req.body
    if(!message || !no) return res.status(422)

    let msg = await client.sendMessage(formatPhone(no), message)
    return res.json(msg)
})

client.on('qr', (qr) => console.log('QR RECEIVED', qr))
client.on('ready', () => {
    console.log('Client is ready!')
    app.listen(3000)
})
client.initialize();

function formatPhone(no) {
    no = no.replace(/\D/g, '');

    if (no.startsWith('0')) no = '62' + no.slice(1) + '@c.us';
    else if (no.startsWith('62')) no += '@c.us';

    return no;
}
