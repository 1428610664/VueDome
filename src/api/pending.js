import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'

// 待办任务列表 http://192.168.0.188:8088/mytask/Message?pagesize=10&pageindex=1
export function getTaskList(parma){
	let url = path + "/mytask/Message"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 未完成的任务条数 http://192.168.0.188:8088/mytask/count
export function getTaskCount(){
	let url = path + "/mytask/count"
	return jsonp(url, commonParams, {})
}


// 我的审请列表  http://192.168.0.188:8088/mytask/myapply?pagesize=10&pageindex=1
export function getMyapply(parma){
	let url = path + "/mytask/myapply"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 我已审批列表  http://192.168.0.188:8088/mytask/myapproval?pagesize=10&pageindex=1
export function getMyapproval(parma){
	let url = path + "/mytask/myapproval"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 我的流程
export function getMyFlow(parma){
	let url = path + "/mytask/GetMyFlow"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}
