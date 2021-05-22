const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {sleep, log_user_message, add_user, get_user, mailing, update_scene} = require('../../tools/tools.js')
const get_name =  new Scenes.WizardScene(
    'get_name',
  async (ctx) => {
      let userInfo = await get_user(ctx)
      if(userInfo){
        ctx.session.user = {}
		ctx.session.user.name = userInfo.name;
		ctx.session.user.phone = userInfo.phone;
		ctx.session.user.id = userInfo.id
        ctx.reply(`Добро пожаловать, ${userInfo.name}`)
        return ctx.scene.enter('about_us');
      }
      ctx.reply('Как я могу к вам обращаться?');
      ctx.session.user = {};
      return ctx.wizard.next();
  },
  async (ctx) => {
      if(ctx.message){
        ctx.session.user.name = ctx.message.text;
        log_user_message(ctx, "Отправлено имя")
        ctx.reply('Оставьте, пожалуйста, контактный номер телефона, по которому мы сможем с Вами связаться',
        {
        "reply_markup": {
            "resize_keyboard": true,
            "keyboard": [
            [
                {
                "text": "Отправить номер телефона",
                "request_contact": true
                },
            ]
            ]
        }
        }
        )
        ctx.reply("Если номер телефона скрыт, отправте его сообщением")
        return ctx.wizard.next();
      }
  }, 
  (ctx) => {
      if(ctx.message.contact){
        ctx.session.user.phone = ctx.message.contact.phone_number;
        //сохраняем
        add_user(ctx, ctx.session.user.name, ctx.session.user.phone)
        return ctx.scene.enter('about_us');
      }else if(ctx.message.text){
          var phone = ctx.message.text.match(/\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m)
          if(phone){
            ctx.session.user.phone = ctx.message.text
            ctx.reply("Сохранено!")
            add_user(ctx, ctx.session.user.name, ctx.session.user.phone)
            update_scene(ctx, 'about_us')
            return ctx.scene.enter('about_us');
          }else {
              console.log(phone)
              ctx.reply("Ошибка! Введите существующий номер")
          }
      }
  }

)
module.exports = {
    scene: get_name
}