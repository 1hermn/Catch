const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const start_menu = new Scenes.WizardScene(
	'start_menu',
	(ctx) => {
		let name = "НЕИЗВЕСТНЫЙ"
		if(ctx.session.user){
			name = ctx.session.user.name 
		}
		ctx.reply(`${name}, если хотите знать больше, выберите пункт меню`, Markup.keyboard([["Контакты"],["Меню и бар"],["Забронировать стол"],["Новости и акции"],["Оставить отзыв"]]).resize())
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			if(ctx.message.text == "Контакты"){
				log_user_message(ctx, "контакты")
				update_scene(ctx, 'contacts')
				ctx.scene.enter('contacts');
			}else if(ctx.message.text == "Меню и бар"){
				log_user_message(ctx, "меню и бар")
				update_scene(ctx, 'menu_and_bar')
				ctx.scene.enter('menu_and_bar')
			}else if(ctx.message.text == "Забронировать стол"){
				log_user_message(ctx, "Забронировать стол")
				update_scene(ctx, 'bill_the_table')
				ctx.scene.enter('bill_the_table')
			}else if(ctx.message.text == "Новости и акции"){
				log_user_message(ctx, "Новости и акции")
				update_scene(ctx, 'news_and_actions')
				ctx.scene.enter('news_and_actions')
			}else if(ctx.message.text == "Оставить отзыв"){
				log_user_message(ctx, "оставить отзыв")
				update_scene(ctx, 'add_review')
				ctx.scene.enter('add_review')
			}else if(ctx.message.text == "/admin"){ 
				if(check_perm(ctx.message.from.id)){
					ctx.reply("Добро пожаловать в админ-панель")
					ctx.scene.enter('admin');
				}else {
					ctx.reply("Неизвестная команда!")
				}
			}else {
				ctx.reply("Неизвестная команда", Markup.keyboard([["Контакты"],["Меню и бар"],["Забронировать стол"],["Новости и акции"],["Оставить отзыв"]]).resize())
			}
		}
	}
)
module.exports = {
    scene: start_menu
}