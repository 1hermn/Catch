const { Telegraf, Markup, Scenes, session, Stage } = require('telegraf');
const fs = require('fs')
const config = require('./config.json')
const {sleep, checkPermForAdmin, get_user, log_user_message, get_user_scene, checkPermForDirector} = require('./tools/tools.js')

const bot = new Telegraf(config.token);
const fetch = require('node-fetch');

//Сделать отправку отзывов(позже)

//Уведомление для пользователя(позже)

//Также добавить в статистику:
	//Новости
	//Акции

const date = new Date();
console.log(date, " Загружаю сцены для пользователей")

var stageArray = [];
//загрузка сцен для пользователя
files = fs.readdirSync("./controllers/User/")
files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const { scene } = require(`./controllers/User/${file}`)
    let methoddName = file.split(".")[0];
    console.log("Сцена", methoddName, " загружена")
    stageArray.push(scene)
});
console.log(date, " Загружаю сцены для администраторов")
//загрузка сцен для админа
files = fs.readdirSync("./controllers/Admin/")
files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const { scene } = require(`./controllers/Admin/${file}`)
    let methoddName = file.split(".")[0];
    console.log("Сцена", methoddName, " загружена")
    stageArray.push(scene)
});


const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://Admin:GLeB201520@176.57.208.24:27017/catch?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', err => {
  console.log(date, ' Я не могу подключиться к базе данных!', err)
})
db.once('open', () => {
  console.log(date, ' Подключился к базе данных!')
})

const stage = new Scenes.Stage(stageArray)

stage.command('admin', async ctx => {
	let count = await checkPermForAdmin(ctx.message.from.id)
	if(count >= 1){
		let count_d = await checkPermForDirector(ctx.message.from.id)
		if(count_d >= 1){
			ctx.scene.enter('director')		
		}else {
			ctx.scene.enter('admin')
		}
	}else {
		ctx.reply("Неизвестная команда!")
	}
})

bot.use(session());
bot.use(stage.middleware())

bot.on("message", Telegraf.optional(
	async (ctx) => {
		let scene = await get_user_scene(ctx)
		if(scene && scene != 'null' && ctx.message.text != "/admin"){
			let user_info = await get_user(ctx)
			if(user_info){
				ctx.session.user = {}
				ctx.session.user.name = user_info.name;
				ctx.session.user.phone = user_info.phone;
				ctx.session.user.id = user_info.id
				ctx.session.user.cout = 0;
			}
			ctx.reply("Бот возобновляет свою работу. Нажмите на кнопку ещё раз")
			return ctx.scene.enter(scene);
		}
	}
))

stage.command("start", async ctx => {
	log_user_message(ctx, "Начало беседы")
	let user_info = await get_user(ctx)
	if(user_info){
		ctx.session.user = {}
		ctx.session.user.name = user_info.name;
		ctx.session.user.phone = user_info.phone;
		ctx.session.user.id = user_info.id
		ctx.session.user.cout = 0;	
	}
	let scene = await get_user_scene(ctx)
	if(!scene || scene == 'null'){
		ctx.reply('Здравствуйте. Я бот Алина', {reply_markup: {remove_keyboard: true}});
		return ctx.scene.enter('get_name');
	}
})

bot.start(async (ctx) => {
	log_user_message(ctx, "Начало беседы")
	let user_info = await get_user(ctx)
	if(user_info){
		ctx.session.user = {}
		ctx.session.user.name = user_info.name;
		ctx.session.user.phone = user_info.phone;
		ctx.session.user.id = user_info.id
		ctx.session.user.cout = 0;
	}
	let scene = await get_user_scene(ctx)
	if(!scene || scene == 'null'){
		ctx.reply('Здравствуйте. Я бот Алина', {reply_markup: {remove_keyboard: true}});
		return ctx.scene.enter('get_name');
	}
})
console.log(date, " Бот готов к работе")
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
