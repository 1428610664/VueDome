import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'

export function getInfo(){
	let url = path + "/login/getuserinfo"
	return jsonp(url, commonParams, options)
}


// 常用申请 http://192.168.0.188:8088/mytask/privatetask?topnum=5
export function privateTask(){
	let url = path + "/mytask/privatetask"
	return jsonp(url, commonParams, options)
}