import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'
import {getToken} from 'common/js/cache'


/* 搜索岗位 */
export function searchjob(parma){
	let url = path + "/user/searchjob"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

/* 搜索职员 http://192.168.0.188:8088/user/SearchStandardList?key=%E5%B0%8F*/
export function searchStandardList(parma){
	let url = path + "/user/SearchStandardList"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}