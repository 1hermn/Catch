const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const after_menu = new Scenes.WizardScene(
	'after_menue',
	(ctx) => {
		ctx.reply(`Чем я могу помочь ещё, ${ctx.session.user.name}?`, Markup.keyboard([["Посмотреть меню"], ["Забронировать стол"],["Назад"]]))
		return ctx.wizard.next();
	},
	(ctx) => {
		if(ctx.message){
			log_user_message(ctx, "После меню")
			if(ctx.message.text == "Посмотреть меню"){
				update_scene(ctx, 'menu_and_bar')
				ctx.scene.enter('menu_and_bar')
			}else if(ctx.message.text == "Забронировать стол"){
				update_scene(ctx, 'bill_the_table')
				ctx.scene.enter('bill_the_table')
			}else if(ctx.message.text == "Назад"){
				update_scene(ctx, 'start_menu')
				ctx.scene.enter('start_menu');
			}else {
				ctx.reply("Неизвестная команда", Markup.keyboard([["Посмотреть меню"], ["Забронировать стол"],["Назад"]]))
			}
		}
	}
)
module.exports = {
    scene: after_menu
}