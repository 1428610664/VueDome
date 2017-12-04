import * as types from './mutation-types'

export const insertUpLoadFileList = function ({commit, state}, data) {
	let upLoadFileList = state.upLoadFileList.slice()
	upLoadFileList.unshift(data)
	commit(types.SET_UPLOAD_FILE_LIST, upLoadFileList)
}

export const delUpLoadFileList = function ({commit, state}, data) {
	let upLoadFileList = state.upLoadFileList.slice()
	let delIndex = upLoadFileList.findIndex((item) => {
		return item.FileName = data.FileName
	})
	upLoadFileList.splice(delIndex, 1)
	commit(types.SET_UPLOAD_FILE_LIST, upLoadFileList)
}
