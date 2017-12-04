import storage from 'good-storage'

const IS_LOGIN = '__isLogin__'
const USER_INFO = '__userInfo__'
const TOKEN = '__token__'

export function setIsLogin(val){
	storage.set(IS_LOGIN, val)
}

export function getIsLogin(){
	return storage.get(IS_LOGIN, false)
}

export function setUserInfo(val){
	storage.set(USER_INFO, val)
}

export function getUserInfo(){
	return storage.get(USER_INFO, {})
}

export function setToken(val){
	storage.set(TOKEN, val)
}

export function getToken(){
	return storage.get(TOKEN, '')
}
export function removeToken(){
	return storage.remove(TOKEN)
}
