const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_news, checkPermForAdmin, checkPermForDirector} = require('../../tools/tools.js');
const news_menu = new Scenes.WizardScene(
	'news_menu',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
			["Удалить новость"],
			["Добавить новость"],
            ["Посмотреть новости"],
            ["Назад"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Добавить новость": {
                    return ctx.scene.enter('add_new')
				}
				case "Удалить новость": {
					return ctx.scene.enter('delete_new')
				}
                case "Посмотреть новости": {
                    const news = await get_news();
                    ctx.reply("Акции, которые есть в базе")
                    for(var i = 0; i < news.length; ++i) {
                        ctx.reply(`${news[i].id}.${news[i].text}`)
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
    scene: news_menu
}