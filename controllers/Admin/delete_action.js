const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {checkPermForAdmin, checkPermForDirector, _delete_action} = require('../../tools/tools.js');
const delete_action = new Scenes.WizardScene(
	'delete_action',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
            ["Назад"]
		])
		ctx.reply("Отправьте номер акции, которую хотите удалить", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Назад": {
			        let count = await checkPermForAdmin(ctx.message.from.id)
                    if(count >= 1){
                        let count_d = await checkPermForDirector(ctx.message.from.id)
                        if(count_d >= 1){
                            return ctx.scene.enter('director')		
                        }else {
                            return ctx.scene.enter('admin')
                        }
                    }
				}
				default:
					break;
			}
            ctx.session.user.action_text = ctx.message.text;
            ctx.reply(`Вы ввели:\n${ctx.session.user.action_text}\nТекст этой акции:...\nУдалить?`, Markup.keyboard([
                ["Да"],
                ["Нет"]
            ]))
            return ctx.wizard.next();
		}
	},
    async (ctx) => {
        if(ctx.message) {
            switch (ctx.message.text) {
                case "Да":
                    ctx.reply("Удалено")
                    _delete_action(ctx.session.user.action_text)
                    break;
                case "Нет":
                    ctx.reply("Отменяю")
                    break;
                default:
                    break;
            }
            let count = await checkPermForAdmin(ctx.message.from.id)
            if(count >= 1){
                let count_d = await checkPermForDirector(ctx.message.from.id)
                if(count_d >= 1){
                    return ctx.scene.enter('director')		
                }else {
                    return ctx.scene.enter('admin')
                }
            }
        }
    }
)
module.exports = {
    scene: delete_action
}