const {Telegraf, Markup, session} = require('telegraf');
const LocalSession = require('telegraf-session-local');
const KeywordUserInput = require('./services/KeywordUserInput');
const NotesFilter = require('./services/NotesFilter');
const Formating = require('./helpers/formating');
const bot = new Telegraf('1796040437:AAEDgh10xOSvXGL-ibmt9pTJBwmSjafzh4k');

const markupHome = Markup
        .keyboard(['/catat', '/lihat', '/anggaran'])
        .oneTime()
        .resize()

const markupFilter = Markup
        .keyboard(['/bulan_ini', '/bulan_lalu'])
        .oneTime()
        .resize()

// bot.use(Telegraf.log());
bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.command('catat', ctx => {
    ctx.session.startWrite = true;
    ctx.replyWithMarkdown(`Apa yang akan di catat hari ini? Contoh: \`Sayur 2000\``);
});
bot.command('lihat', ctx => {
    ctx.replyWithMarkdown(`Daftar yang mana? `, markupFilter);
});
bot.command('anggaran', ctx => {
    ctx.session.budget = ctx.session.budget || 0;
    ctx.session.writeBudget = true;
    ctx.replyWithMarkdown(`Anggaran dibulan ini: ${ctx.session.budget} \n Masukkan nilai baru untuk mengupdate anggaran.`);
});
bot.command('bulan_ini', ctx => {
    let now = new Date();
    let listItem = `<b>List Catatan Bulan ${now.getMonth() + 1} </b> \n \n`;
    let totalPrice = 0; 
    let notes = ctx.session.notes;
    let notesFilterService = new NotesFilter(notes);
    let budget = ctx.session.budget;
    let totalInDay = 0;

    notesFilterService.filterByDay().map(itemByDay => {
        listItem += `<u> ${itemByDay.date} </u> \n`;
        itemByDay.data.forEach(note => {
            listItem += ` -${note.textMessage} \n`;
            totalPrice += Number(note.price);
            totalInDay += Number(note.price);
        });
        listItem += `TOTAL: ${Formating.currencyFormat(totalInDay, 'Rp. ')}`;
        listItem += `\n`;
        totalInDay = 0;
        return itemByDay;
    });

    listItem += `\n <b> TOTAL: ${Formating.currencyFormat(totalPrice, 'Rp. ')} </b>`;
    if(budget){
        listItem += `\n <b> SISA ANGGARAN: ${Formating.currencyFormat(budget - totalPrice, 'Rp. ')} </b>`;
    }
    ctx.replyWithHTML(`${listItem}`, markupHome);
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
        ctx.replyWithMarkdown(`Dicatat!. \`${ctx.message.text}\``, markupHome);
        return next();
    }

    if(ctx.session.writeBudget){
        if(isNaN(ctx.message.text)) {
            ctx.reply('Input tidak sesuai.', markupHome);
            return next();
        }
        ctx.session.budget = ctx.message.text;
        ctx.reply(`Dicatat!. Anggaran anda sekarang: ${ctx.session.budget}`);
        ctx.session.writeBudget = false;
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