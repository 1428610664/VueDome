import {getToken} from 'common/js/cache'
import axios from "axios"
import {setIsLogin, removeToken} from 'common/js/cache'
import { UTM_OT } from './config'

import store from 'store/index'
import * as types from 'store/mutation-types'


export default function jsonp(url, data, option, type) {
	url += (url.indexOf('?') < 0 ? '?' : '&') +"Token="+encodeURIComponent(getToken())
	if(window.plus){
		data.utm_uid = plus.device.uuid
		// data.utm_sys = plus.os.name.toLowerCase()
		data.utm_ver = plus.os.version
		// data.utm_ot = UTM_OT
	}
	
	if(type){
		return new Promise((resolve, reject) => {
			axios.post(url, data, option).then((data) =>{
				if(data.data.Code == 101){
					setIsLogin(false)
					removeToken()
					store.commit(types.SET_ISLOGIN, false)
				}
				resolve(data.data)
			}).catch((error) => {
				reject(error)
			})
		})
	}else{
		return new Promise((resolve, reject) => {
			axios.get(url, {params: data}, option).then((data) =>{
				if(data.data.Code == 101){
					setIsLogin(false)
					removeToken()
					store.commit(types.SET_ISLOGIN, false)
				}
				resolve(data.data)
			}).catch((error) => {
				reject(error)
			})
		})
	}
	/*
	data.Token = getToken()
	let parmas = type ? data : {params: data}
	return new Promise((resolve, reject) => {
		axios[type ? "post" : "get"](url, parmas, option).then((data) =>{
			resolve(data.data)
		}).catch((error) => {
			reject(error)
		})
	})*/
}

export function param(data) {
	let url = ''
	for(var k in data) {
		let value = data[k] !== undefined ? data[k] : ''
		url += '&' + k + '=' + encodeURIComponent(value)
	}
	return url ? url.substring(1) : ''
}