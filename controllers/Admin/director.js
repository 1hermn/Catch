const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, mailing, get_user, count_users, updateStats, checkPermForDirector, get_admins} = require('../../tools/tools.js')
const director = new Scenes.WizardScene(
    'director',
    async (ctx) => {
        let userInfo = await get_user(ctx)
		if(userInfo){
			ctx.session.user = {}
			ctx.session.user.name = userInfo.name;
			ctx.session.user.phone = userInfo.phone;
			ctx.session.user.id = userInfo.id
			ctx.reply(`Добро пожаловать в меню директора, ${userInfo.name}`)
		}
		let count = await count_users();
		ctx.session.user.count = count;
		const admin_crontrol = Markup.keyboard([
			["Посмотреть статистику бота"],
            ["Посмотреть статистику администраторов"],
			["Изменить акции"],
            ["Изменить новости"],
			[`Сделать рассылку для ${ctx.session.user.count} пользователей`],
            ["Добавить администратора"],
			["Выход"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
    },
    async (ctx) => {
        var count = await checkPermForDirector(ctx.message.from.id)
        if(count >= 1){
            if(ctx.message){
                switch (ctx.message.text) {
                    case "Посмотреть статистику бота": {
                        ctx.reply("Количество пользователей у бота:\nСтатистика в реальном времени:")
                        ctx.reply("https://analytics.google.com/analytics/web/template?uid=OLCTML15SlGjpjAXnfzrqQ")
                        break;
                    }
                    case "Добавить администратора": {
                        return ctx.scene.enter("add_admin")
                    }
                    case "Посмотреть статистику администраторов": {
                        var admins = await get_admins();
                        ctx.reply("Получаю статистику...")
                        for(var i = 0; i < admins.length; i++) {
                            ctx.reply(`Админ: ${admins[i].name}\nСтатистика отправленных(добавленных):\n Рассылки: ${admins[i].stats.mails}\n Новости: ${admins[i].stats.news}\n Акции: ${admins[i].stats.actions}`)
                        }
                        break;
                    }
                    case `Сделать рассылку для ${ctx.session.user.count} пользователей`: {
                        ctx.reply("Введите текст");
                        return ctx.scene.enter("admin_mails")
                    }
                    case "Изменить акции": {
                        return ctx.scene.enter("actions_menu")
                    }
                    case "Изменить новости": {
                        return ctx.scene.enter("news_menu")
                    }
                    case "Выход": {
                        return ctx.scene.enter('get_name');
                    }
                    default:
                        break;
                }
            }
        }
    }
)
module.exports = {
    scene: director
}