const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const add_review = new Scenes.WizardScene(
	'add_review',
	(ctx) => {
		ctx.reply(`${ctx.session.user.name}, напишите ваш отзыв`,  Markup.keyboard([["Назад"]]))
		return ctx.wizard.next();
	},
	(ctx) => {
		if(ctx.message){
			if(ctx.message.text != "Назад"){
				log_user_message(ctx, "Оставлен отзыв")
				ctx.reply(`${ctx.session.user.name}, ваш отзыв: ${ctx.message.text}`);
				log_user_message(ctx, "Новый отзыв")
				ctx.scene.enter('after_menue')
				return ctx.scene.leave();
			}else {
				update_scene(ctx, 'start_menu')
				return ctx.scene.enter('start_menu');
			}
		}
	}
)
module.exports = {
    scene: add_review
}