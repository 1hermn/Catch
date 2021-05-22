const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_actions, checkPermForAdmin, checkPermForDirector} = require('../../tools/tools.js');
const actions_menu = new Scenes.WizardScene(
	'actions_menu',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
			["Удалить акцию"],
			["Добавить акцию"],
            ["Посмотреть акции"],
            ["Назад"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Добавить акцию": {
                    return ctx.scene.enter('add_action')
				}
				case "Удалить акцию": {
					return ctx.scene.enter('delete_action')
				}
                case "Посмотреть акции": {
                    const actions = await get_actions();
                    ctx.reply("Акции, которые есть в базе")
                    for(var i = 0; i < actions.length; ++i) {
                        ctx.reply(`${actions[i].id}.${actions[i].text}`)
                    }
                    break;
                }
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
		}
	}
)
module.exports = {
    scene: actions_menu
}