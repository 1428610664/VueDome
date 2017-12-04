import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'

// 获取未读公告条数 http://192.168.0.188:8088/Bulletin/GetCount
export function getNoticeCount(){
	let url = path + "/Bulletin/GetCount"
	let data = Object.assign({}, commonParams, {})
	return jsonp(url, data, options)
}

// 获取公告列表  http://192.168.0.188:8088/Bulletin/GetList?pageindex=1&pagesize=5
export function getList(parma){
	let url = path + "/Bulletin/GetList"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 获取公告详情 http://192.168.0.188:8088/Bulletin/getdetail?bulletinId=85   
export function getdetail(id){
	let url = path + "/Bulletin/getdetail"
	let data = Object.assign({}, commonParams, {bulletinId: id})
	return jsonp(url, data, options)
}




