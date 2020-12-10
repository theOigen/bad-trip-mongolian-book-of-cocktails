if(process.env.NODE_ENV !== 'production')
    require('dotenv').config()


const Telegraf = require('telegraf');
const express = require('express');
const expressApp = express();

const API_TOKEN = process.env.TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'localhost';

const bot = new Telegraf(API_TOKEN);

const KEY = process.env.YOUTUBE_API_KEY;

const {
    getCocktailByName,
    getCocktailsByIngredient,
    getRandomCocktail,
    getMongolian,
    getInspiration,
} = require('./src/core/api-bridge/bridge')

const {
    getParameter,
    formatCocktailWithPreview,
} = require('./src/utils/telegramMessages.js')

const {
    getFirstVideoLink
} = require('./src/core/api-bridge/youtubeApi')

if(process.env.NODE_ENV !== 'development'){
    bot.telegram.getMe().then((botInfo) => {
        bot.options.username = botInfo.username
    })
    bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
    console.log('bot webhook setup')
}




expressApp.use(bot.webhookCallback(`/bot${API_TOKEN}`));




bot.command('inspiration', async(ctx) => {
    try {
        console.log('inspiration command');
        ctx.reply(getInspiration());
    } catch (e) {
        console.log("Something went wrong while inspiration " + e);
        ctx.reply(`Some server problem, contact bot creator @TGIfr`);
    }
});

bot.command('getbyname', async(ctx) => {
    try {
        let parameter = getParameter( ctx.message.text)
        if (parameter === undefined) {
            ctx.reply(`No parameter`)
            return
        }
        let cocktails = await getCocktailByName(parameter)
        if (!cocktails.length) {
            ctx.reply(`cocktail with name ${parameter} not found`)
            return
        }
        let cocktail = formatCocktailWithPreview(cocktails[0])

        console.log('getbyname command');
        ctx.replyWithMarkdown(cocktail)
        ctx.reply(await getFirstVideoLink(cocktails[0].name, KEY))
    } catch (e) {
        if(e.name === 'param' || e.name === 'TypeError: Cannot read property \'length\' of undefined'){
            ctx.reply('No parameter')
            console.log("No parameter at getbyname")
        } else {
            console.log("Something went wrong while getbyname " + e.name);
            ctx.reply("No parameter")
        }
    }
});


bot.command('getbyingredient', async (ctx) => {
    try {
        let parameter = getParameter( ctx.message.text)
        if (parameter === undefined) {

            ctx.reply(`No parameter`)
            return
        }
        let cocktails = await getCocktailsByIngredient(parameter)
        if (!cocktails.length) {
            ctx.reply(`cocktails with ingredient ${parameter} not found`)
            return
        }

        console.log('getbyingredient command');
        cocktails.forEach(c => ctx.replyWithMarkdown(formatCocktailWithPreview(c[0])))
    } catch (e) {
        if(e.name === 'param' || e.name === 'TypeError: Cannot read property \'length\' of undefined'){
            ctx.reply(e)
            console.log("No parameter at getbyingredient")
        } else {
            console.log("Something went wrong while getbyingredient " + e);
            ctx.reply("No parameter")
        }
    }
});

bot.command('random', async (ctx) => {
    try {
        let cocktail = await getRandomCocktail()

        console.log('random command');
        ctx.replyWithMarkdown(formatCocktailWithPreview(cocktail))
    } catch (e) {
        console.log("Something went wrong while random command " + e);
        ctx.reply(`Some server problem, contact bot creator @TGIfr`);
    }
});

bot.command('mongolian', async (ctx) => {
    try {

        console.log('mongolian command')
        ctx.replyWithMarkdown(getMongolian())

    } catch (e) {
        console.log("Error while mongolian command " + e);
        ctx.reply(`Some server problem, contact bot creator @TGIfr`);
    }
});

bot.command('hui', async (ctx) => {
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

if(process.env.NODE_ENV === 'development'){
    bot.telegram.deleteWebhook()
    bot.startPolling()

}

