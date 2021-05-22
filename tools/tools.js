const config = require('../config.json')
const { User } = require('../models/User.js')
const { Admin } = require('../models/Admin.js')
const { amoCRMToken } = require('../models/Amo.js')
const { Action } = require('../models/Action.js')
const { New } = require('../models/New.js')
const fetch = require('node-fetch');
var ua = require('universal-analytics');

//##################################ОБЩИЕ####################################
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
//функция запросов
async function amo_request(url, method, body){
	const access_token = await getToken();
	var res = await fetch(`${config.amo.domain}${url}`, {
        method: method,
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + access_token
	 	},
    })
	var json = await res.json()
	return json
}
//логируем сообщения в аналитику
function log_user_message(ctx, intent){
	var visitor = ua(config.gaid, ctx.message.from.id, {strictCidFormat: false});
	visitor.pageview("/"+intent).send()
}
//отправлялка. Посмотреть, может задержку поставить
async function mailing(ctx, text){
	let json = await User.find();
	ctx.reply("Отправляю...")
	json.forEach(usr => {
		try{
			ctx.tg.sendMessage(usr.id, `${text}`)
		}catch(err){
			ctx.reply(`Ошибка при отправке пользователю\nTELEGRAM ID:${usr.id}\nИмя:${usr.name}`)
		}
	})
	ctx.reply("Рассылка завершена")
}
async function bill(ctx){
	const usr = await get_user(ctx)
	const contact_id = usr.contact_id

	const body = [
		{
			"name": `Бронирование: ${ctx.session.bills.month} ${ctx.session.bills.day} ${ctx.session.bills.time}`,
			"created_by": 7068022,
			"_embedded": {
				"contacts": [
					{
						"id" : contact_id
					}
				]
			}
		}
	]
	var json = await amo_request('/api/v4/leads', 'POST', body)
	const id = json._embedded.leads[0].id
	new_task(ctx, id)
	var user = await get_user(ctx)
	user.bills.push(id)
	user.save();
}

async function new_task(ctx, lead_id){
	const cur = new Date()
	const date = new Date(cur.getFullYear(),ctx.session.bills.month - 1,ctx.session.bills.day, ctx.session.bills.time)
	const milliseconds = date.getTime()/1000;
	const body = [
		{
			"task_type_id": 1,
			"text": "Бронирование столика Catch",
			"complete_till": milliseconds,
			"entity_id": lead_id,
			"entity_type": "leads"
		}
	]
	const json = await amo_request('/api/v4/tasks', 'POST', body)
	console.log(json)
}



async function count_users(){
	var count = await User.find().countDocuments();
	return count
}

async function delete_action(id){
	Action.find({id : Number(id)}).remove().exec()
}
async function delete_new(id){
	New.find({id : Number(id)}).remove().exec()
}
//###########################################################################
//##################################add-#####################################
async function add_user(ctx, name, phone){
	const user = new User({
		name: name,
		phone: phone,
		id: ctx.message.from.id,
		admin: false,
		scene: 'null',
		contact_id: 0
	})
	user.save(function(err){
		if(err) return console.log(err);
		 
		console.log("Новый пользователь сохранён,", user);
	});
	//добавляем в контакты
	const body = [
		{
			"first_name": name,
			"custom_fields_values": [
				{
					"field_id": 643969,
					"values": [
						{
							"value": phone
						}
					]
				},
				{
					"field_id": 702819,
					"values": [
						{
							"value": "Бот Catch"
						}
					]
				}
			]
		}
	]
	const json = await amo_request('/api/v4/contacts', 'POST', body)
	console.log(json)
	const id = json._embedded.contacts[0].id
	var usr = await get_user(ctx)
	usr.contact_id = id
	usr.save()
	console.log("Новый пользователь добавлнен в CRM, id контакта в базе обновлён")

}

function addAdmin(forward){
	const admin = new Admin({
		name: forward.first_name,
		id: forward.id,
		isDirector: false,
		stats: {
			mails: 0,
			news: 0,
			actions: 0
		}
	})
	admin.save();
}
async function addAction(text){
	const actions = await Action.find();
	var id = 0;
	for(var i = 0; i < actions.length; i++){
		if(actions[i].id > id){
			id = actions[i].id;
		}
	}
	id++
	const action = new Action({
		text: text,
		id: id
	})
	action.save();
}
async function addNew(text){
	const news = await New.find();
	var id = 0;
	for(var i = 0; i < news.length; i++){
		if(news[i].id > id){
			id = news[i].id;
		}
	}
	id++
	const _new = new New({
		text: text,
		id: id
	})
	_new.save();
}
//#####################################################################################################
//###########################################getters###############################################

async function getToken(){
    let tokens = await amoCRMToken.findOne({id: 0});
    return tokens.access_token
}

async function get_user(ctx){
	let json = await User.findOne({id: ctx.message.from.id})
	return json
}

async function get_user_scene(ctx){
	let usr = await get_user(ctx)
	if(usr != null) {
		return usr.scene
	}
}
async function get_actions(){
	const actions = await Action.find();
	return actions
}
async function get_news(){
	const news = await New.find();
	return news
}
async function get_admins(){	
	let json = await Admin.find();
	return json;
}
//######################################################################################################
//############################################updaters#################################################
async function updateStats(id){
	let json = await Admin.findOne({id: id})
	json.stats.mails = json.stats.mails + 1;
	json.save();
}
async function updateStats_news(id){
	let json = await Admin.findOne({id: id})
	json.stats.news = json.stats.news + 1;
	json.save();
}
async function updateStats_actions(id){
	let json = await Admin.findOne({id: id})
	json.stats.actions = json.stats.actions + 1;
	json.save();
}
async function update_scene(ctx, name){
	let usr = await get_user(ctx)
	if(usr) {
		usr.scene = name;
		usr.save();
	}
}
//#########################################################chekers#####################################
async function checkPermForAdmin(id){	
	let json = await Admin.findOne({id: id}).countDocuments()
	return json;
}

async function checkPermForDirector(id){
	let json = await Admin.findOne({id: id, isDirector: true}).countDocuments()
	return json;
}

//###########################################################################################################

module.exports = {
    sleep,
    checkPermForAdmin,
    log_user_message,
	add_user,
	addNew,
	get_user,
	get_actions,
	get_news,
	mailing,
	count_users,
	update_scene,
	updateStats_news,
	updateStats_actions,
	get_user_scene,
	bill,
	updateStats,
	checkPermForDirector,
	addAdmin,
	addAction,
	_delete_action: delete_action,
	_delete_new: delete_new,
	get_admins
}