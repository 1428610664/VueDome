import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'

// 获取流程类型	http://192.168.0.188:8088/flow/GetFlowPage
export function getFlowPage(){
	let url = path + "/flow/GetFlowPage"
	let data = Object.assign({}, commonParams, {})
	return jsonp(url, data, options)
}

// 根据流程类型获取流程模版列表	http://192.168.0.188:8088/flow/GetModelByPageId?flowPageId=12
export function getModelByPageId(parma){
	let url = path + "/flow/GetModelByPageId"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}