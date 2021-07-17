const app = require('express')();
const {Telegraf} = require('telegraf');
const bot = new Telegraf('1796040437:AAEDgh10xOSvXGL-ibmt9pTJBwmSjafzh4k');

app.get('test-server', (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.json({status: true});
});

app.post('webhook', (req,res) => {
    bot.command('hello', ctx => {
        ctx.reply('hello from webhook');
    });
})