const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep,
	log_user_message,
	mailing,
	get_user,
	count_users,
	updateStats, checkPermForDirector, checkPermForAdmin} = require('../../tools/tools.js');
const admin_mails = new Scenes.WizardScene(
    'admin_mails',
    async (ctx) => {
        ctx.reply("Введите текст рассылки")
        ctx.wizard.next()
    },
	(ctx) => {
		if(ctx.message){
			ctx.session.user.text = ctx.message.text;
			ctx.reply(`Вы ввели:\n${ctx.message.text}`);

			ctx.reply(`Отправить ?`, Markup.keyboard([
				["Да"],["Нет"]
			]))
			return ctx.wizard.next();
		}
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Да": {
					mailing(ctx, ctx.session.user.text)
					updateStats(ctx.message.from.id)
			        let count = await checkPermForAdmin(ctx.message.from.id)
                    if(count >= 1){
                        let count_d = await checkPermForDirector(ctx.message.from.id)
                        if(count_d >= 1){
                            ctx.scene.enter('director')		
                        }else {
                            ctx.scene.enter('admin')
                        }
                    }
				}
				case "Нет": {
					break;
				}
				default:
					break;
			}
		}
	}
)
module.exports = {
    scene: admin_mails
}