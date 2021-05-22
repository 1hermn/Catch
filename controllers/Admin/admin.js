const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, mailing, get_user, count_users, updateStats} = require('../../tools/tools.js');
const admin = new Scenes.WizardScene(
	'admin',
	async (ctx) => {
		let userInfo = await get_user(ctx)
		if(userInfo){
			ctx.session.user = {}
			ctx.session.user.name = userInfo.name;
			ctx.session.user.phone = userInfo.phone;
			ctx.session.user.id = userInfo.id
			ctx.reply(`Добро пожаловать в админ- меню, ${userInfo.name}`)
		}
		let count = await count_users();
		ctx.session.user.count = count;
		const admin_crontrol = Markup.keyboard([
			["Посмотреть статистику бота"],
			["Изменить акции"],
			["Измени новости"],
			[`Сделать рассылку для ${ctx.session.user.count} пользователей`],
			["Выход"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	(ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Посмотреть статистику бота": {
					ctx.reply("Количество пользователей у бота:\nСтатистика в реальном времени:")
					ctx.reply("https://analytics.google.com/analytics/web/template?uid=OLCTML15SlGjpjAXnfzrqQ")
					break;
				}
				case `Сделать рассылку для ${ctx.session.user.count} пользователей`: {
					ctx.reply("Введите текст");
					ctx.scene.enter("admin_mails")
					return ctx.wizard.back()
				}
				case "Изменить акции": {
					return ctx.scene.enter("actions_menu")
				}
				case "Изменить новости": {
					return ctx.scene.enter("news_menu")
				}
				case "Выход": {
					return ctx.scene.enter('get_name');
				}
				default:
					break;
			}
		}
	}
)
module.exports = {
    scene: admin
}