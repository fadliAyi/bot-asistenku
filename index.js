const express = require('express');
const app = express();
const {Telegraf} = require('telegraf');
const bot = new Telegraf('1796040437:AAEDgh10xOSvXGL-ibmt9pTJBwmSjafzh4k', {
	telegram: { webhookReply: true },
});
const port = 3080;

bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message))
app.get('/test', (req, res) => {
    console.log('request masuk');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.json({status: true});
});

app.post('/webhook', async (req,res) => {
    console.log(req);
    
    return await bot.handleUpdate(req.body, res).then((rv) => {
      // if it's not a request from the telegram, rv will be undefined, but we should respond with 200
      return !rv && res.sendStatus(200)
    });
})

bot.launch();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})