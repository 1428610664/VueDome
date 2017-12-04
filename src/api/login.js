import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'


export function login(parma){
	let url = path + "/login/login"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

export function logout(){
	let url = path + "/login/logout"
	return jsonp(url, commonParams, options)
}
