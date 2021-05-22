const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, update_scene} = require('../../tools/tools.js')
const menu_and_bar = new Scenes.WizardScene(
	'menu_and_bar',
	async (ctx) => {
		ctx.replyWithPhoto({source: fs.createReadStream('./img/5.jpg')})
		await sleep(1000)
		log_user_message(ctx, "Меню и бар")
		ctx.reply(`${ctx.session.user.name}, выберите пункт меню`, Markup.keyboard([["Меню"],["Бар"],["Залы"],["Назад"]]).resize())
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			if(ctx.message.text != "Меню" && ctx.message.text != "Бар" && ctx.message.text != "Залы" && ctx.message.text != "Назад"){
				ctx.reply("Неизвестная команда", Markup.keyboard([["Меню"],["Бар"],["Залы"],["Назад"]]).resize())
			}else {
				if(ctx.message.text == "Меню"){
					log_user_message(ctx, "Меню")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/11.jpg')})
					await sleep(500)
					for(var i = 6; i <= 10; ++i){
						ctx.replyWithPhoto({source: fs.createReadStream('./img/' + i + ".jpg")})
					}
					await sleep(500)
				}else if(ctx.message.text == "Бар"){
					log_user_message(ctx, "Бар")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/12.jpg')})
				}else if(ctx.message.text == "Залы"){
					//картинка черный зал
					log_user_message(ctx, "залы")
					ctx.replyWithPhoto({source: fs.createReadStream('./img/black_hole.png')})
					await sleep(1000)
					ctx.reply(`\nЗал black hall (130м2)\nВместимость 50 человек
					
					Уникальность данного зала в возможности его трансформации из стильного современного в наполненный образами и деталями интерьера 18 века.`
					)
					//картинка караоке
					ctx.replyWithPhoto({source: fs.createReadStream('./img/caraoce.png')})
					await sleep(1000)
					ctx.reply(`Караоке холл (98м2)\nВместимость 30 человек
					Зал с живой музыкой и кальяном. Подходит для шумных и веселых компаний. По пятницам и субботам есть караоке. В дневное время зал прекрасно подойдёт для деловых переговоров и романтических встреч. Так же возможно использование караоке холла как банкетного зала.
					`)
					//картинка зимний сад
					ctx.replyWithPhoto({source: fs.createReadStream('./img/winter.png')})
					await sleep(1000)
					ctx.reply(`Зимний сад (98м2)\nВместимость 30 человек
					Зал с тихой спокойной фоновой музыкой, для некурящих, с уютной атмосферой,
					подходящей для романтических свиданий и семейных мероприятий.
					`)
					//картинка терраса
					ctx.replyWithPhoto({source: fs.createReadStream('./img/terrasa.png')})
					await sleep(1000)
					ctx.reply(`Летняя терраса\nНастоящий оазис в центре города.
					Наша зеленая парковая терраса не оставит равнодушным даже самого изысканного гостя. Вековые сосны, журчащие фонтаны, ароматные цветы и все это в самом центре Минска.
					`)
				}else if(ctx.message.text == "Назад"){
					update_scene(ctx, 'start_menu')
					return ctx.scene.enter('start_menu')
				}
				//переход в меню бронирования
				update_scene(ctx, 'after_menue')
				ctx.scene.enter('after_menue')
				return ctx.scene.leave();
			}
		}
	}
)
module.exports = {
    scene: menu_and_bar
}