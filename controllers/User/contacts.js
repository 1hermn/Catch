const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const contacts = new Scenes.WizardScene(
	'contacts',
	async (ctx) => {
		ctx.replyWithPhoto({source: fs.createReadStream('./img/2.jpg')})
		await sleep(1000)
		log_user_message(ctx, "Показаны контакты")
		ctx.reply(`+ 375 (29) 163-60-00\nг. Минск, ул. Мясникова, 25\ncatchminsk@gmail.com`, Markup.keyboard([["Как доехать"],["Время работы"],["Назад"]]))
		return ctx.wizard.next();
	},
	async (ctx) => {
		update_scene(ctx, 'contacts')
		if(ctx.message){
			if(ctx.message.text != "Как доехать" && ctx.message.text != "Время работы" && ctx.message.text != "Назад"){
				ctx.reply("Неизвестная команда", Markup.keyboard([["Как доехать"],["Время работы"],["Назад"]]))
			}else {
				if(ctx.message.text == "Как доехать"){
					log_user_message(ctx, "как доехать")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/3.png')})
					await sleep(1000)
					ctx.reply("ул. Мясникова, 25 (центр города, шаговая доступность от метро «Немига»)");
					
				}else if(ctx.message.text == "Время работы"){
					log_user_message(ctx, "время работы")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/4.jpg')})
					await sleep(1000)
					ctx.reply(`Воскресенье-четверг: с 12.00 до 23.00\nПятница и суббота: с 12.00 до 06.00 (караоке)
					`)
					
				}else if(ctx.message.text == "Назад"){
					return ctx.scene.enter('about_us');
				}
				ctx.scene.enter('after_menue');
				return ctx.scene.leave();
			}
		}
	}
)
module.exports = {
	scene: contacts
}