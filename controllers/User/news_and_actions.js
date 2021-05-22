const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene, get_actions, get_news} = require('../../tools/tools.js')
const news_and_actions = new Scenes.WizardScene(
	'news_and_actions',
	async (ctx) => {
		ctx.replyWithPhoto({source: fs.createReadStream('./img/13.jpg')})
		await sleep(1000)
		ctx.reply(`${ctx.session.user.name}, выберите пункт меню`, Markup.keyboard([["Новости"],["Акции"],["Назад"]]).resize())
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			if(ctx.message.text != "Новости" && ctx.message.text != "Акции" && ctx.message.text != "Назад"){
				ctx.reply("Неизвестная команда", Markup.keyboard([["Новости"],["Акции"],["Назад"]]).resize())
			}else {
				if(ctx.message.text == "Новости"){
					log_user_message(ctx, "Новости")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/14.jpg')})
					await sleep(1000)
					const news = await get_news();
                    for(var i = 0; i < news.length; ++i) {
                        ctx.reply(`${news[i].text}`)
                    }
				}else if(ctx.message.text == "Акции"){
					log_user_message(ctx, "Акции")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/15.jpg')})
					await sleep(1000)
					const actions = await get_actions();
                    for(var i = 0; i < actions.length; ++i) {
                        ctx.reply(`${actions[i].text}`)
                    }
				}else if(ctx.message.text == "Назад"){
					update_scene(ctx, 'start_menu')
					return ctx.scene.enter('start_menu')
				}
				update_scene(ctx, 'after_menue')
				ctx.scene.enter('after_menue')
				return ctx.scene.leave();
			}
		}
	}
)
module.exports = {
    scene: news_and_actions
}