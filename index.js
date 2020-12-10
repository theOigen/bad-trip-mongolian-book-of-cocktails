if(process.env.NODE_ENV !== 'production')
    require('dotenv').config()


const Telegraf = require('telegraf');
const express = require('express');
const expressApp = express();

const API_TOKEN = process.env.TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://obscure-inlet-12047.herokuapp.com';

const bot = new Telegraf(API_TOKEN);

if(process.env.NODE_ENV !== 'development'){
    bot.telegram.getMe().then((botInfo) => {
        bot.options.username = botInfo.username
    })
    bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
    console.log('bot webhook setup')
}




expressApp.use(bot.webhookCallback(`/bot${API_TOKEN}`));

const {
    getCocktailByName,
    getCocktailsByIngredient,
    getRandomCocktail,
    getMongolian,
    getInspiration,
} = require('./src/core/api-bridge/bridge')



bot.command('inspiration', async(ctx) => {
    try {
        console.log('stats command');
        ctx.reply(getInspiration());
    } catch (e) {
        console.log("Something went wrong while inspiration " + e);
        ctx.reply(`Some server problem, contact bot creator @TGIfr`);
    }
});

// bot.command('lastfive', async(ctx) => {
//     try {
//
//         console.log('lastfive command');
//         ctx.reply(res);
//     } catch (e) {
//         console.log("Something went wrong while lastfive " + e);
//         ctx.reply(`Some server problem, contact bot creator @TGIfr and pray for backup`);
//     }
// });
//
// bot.command('gaveto', async (ctx) => {
//     try {
//
//         ctx.reply(`#ключи передано ${owner}`);
//     } catch (e) {
//         console.log("Something went wrong while saving in gaveto" + e);
//         ctx.reply(`Some server problem, contact bot creator @TGIfr`);
//     }
// });
//
// bot.command('gotkeys', async (ctx) => {
//     try {
//
//         console.log("Saved owner in gotkeys");
//         console.log(owner);
//         console.log(ctx.message.from.id);
//         ctx.reply(`#ключи тепер у ${owner}`);
//     } catch (e) {
//         console.log("Something went wrong while saving in gotkeys " + e);
//         ctx.reply(`Some server problem, contact bot creator @TGIfr`);
//     }
// });
//
// bot.command('keys', async (ctx) => {
//     try {
//
//         console.log('keys command');
//         ctx.reply(`#ключи у ${res.owner}`);
//     } catch (e) {
//         console.log("Error while finding " + e);
//         ctx.reply(`Some server problem, contact bot creator @TGIfr`);
//     }
// });

bot.command('hui', async (ctx) => {
    ctx.replyWithMarkdown('Test Reply [](https://i.stack.imgur.com/PBP8S.jpg?s=32&g=1)')
    ctx.reply(`И что ты хотел тут увидеть?
    Аффтар: TGIfr
    Дизигн: max
    Аффтар идеи и главный по работе с апи: Oigen`);
});

bot.command('start', async (ctx) => {
    ctx.reply(`Welcome, stranger!
    Have a sit and enjoy some cocktails cause when we live we live in clover and when we die we die all over\n
    /start - get info about commands
    /getbyname *name* - get cocktail by name. In english, please!
    /getbyingredient *ingredient* - get some cocktails by ingredient
    /random - get random cocktail
    /mongolian - press F
    /inspiration - get some sport inspiration, pal!`);
});


// and at the end just start server on PORT
expressApp.get('/', (req, res) => {
    res.send('Hello World!');
});
expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

if(process.env.NODE_ENV === 'development')
    bot.startPolling()
