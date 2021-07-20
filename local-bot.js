const {Telegraf, Markup, session} = require('telegraf');
const LocalSession = require('telegraf-session-local');
const KeywordUserInput = require('./services/KeywordUserInput');
const bot = new Telegraf('1796040437:AAEDgh10xOSvXGL-ibmt9pTJBwmSjafzh4k');

const markupHome = Markup
        .keyboard(['/catat'])
        .oneTime()
        .resize()

bot.use(Telegraf.log());
bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.command('catat', ctx => {
    ctx.session.startWrite = true;
    ctx.replyWithMarkdown(`Apa yang akan di catat hari ini? Contoh: \`Sayur 2000\``);
});
bot.on('text', (ctx, next) => {
    if(ctx.session.startWrite){
        ctx.session.notes = ctx.session.notes || [];
        ctx.session.startWrite = false;

        let keywordUserService = new KeywordUserInput(ctx);

        ctx.session.notes.push({
            date: new Date(), 
            textMessage: ctx.message.text, 
            item: keywordUserService.item,
            price: keywordUserService.price
        });
        ctx.replyWithMarkdown(`Dicatat!. \`${ctx.message.text}\``);
        return next();
    }

    ctx.reply('Silahkan tuliskan command yang di inginkan.', markupHome);
  })
  
bot.command('/stats', (ctx) => {
    ctx.replyWithMarkdown(`Database has \`${ctx.session.counter}\` messages from @${ctx.from.username || ctx.from.id}`)
})

bot.command('/remove', (ctx) => {
    ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx.session)}\``)
    // Setting session to null, undefined or empty object/array will trigger removing it from database
    ctx.session = null
})

bot.launch();