const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const about_us = new Scenes.WizardScene(
	'about_us',
	async (ctx) => {
		log_user_message(ctx, "Пользователь сохранён")
		ctx.reply(`Чем я могу вам помочь, ${ctx.session.user.name}?`, Markup.keyboard([["О нас"]]).resize())
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			if(ctx.message.text == "О нас"){
				log_user_message(ctx, "О нас");
				ctx.replyWithPhoto({source: fs.createReadStream('./img/1.jpg')})
				await sleep(1000)
				ctx.reply(`
Catch the moment: have a taste\n\n
Премиальные кальяны, изысканные блюда с морепродуктами, живая музыка, 
зажигательное караоке и громкие безбашенные вечеринки, 
а может просто неспешный кофе брейк на террасе с видом на Немигу? 
Теперь не нужно выбирать, ведь всю многогранность вашего выбора обеспечат три зала ресторана Catch.
Что все это объединяет? Неизменно теплая забота о гостях, а также совершенствование, чтобы заслуженно быть для вас любимым местом города.`)
				
				update_scene(ctx, 'start_menu')
				return ctx.scene.enter('start_menu');
			}else {
				ctx.reply("Что-то неизвестное, попробуйте ещё раз", Markup.keyboard([["О нас"]]).resize())
			}
		}
	}
)
module.exports = {
    scene: about_us
}