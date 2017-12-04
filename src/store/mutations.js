import * as types from './mutation-types'

const mutations = {
	[types.SET_ISLOGIN](state, login) {
		state.isLogin = login
	},
	[types.SET_USERDATA](state, data) {
		state.userData = data
	},
	[types.SET_NOTICE_COUNT](state, data){
		state.noticeCount = data
	},
	[types.SET_TASK_COUNT](state, data){
		state.taskCount = data
	},
	[types.SET_OUTSOURCEDESC](state, data) {
		state._outsourceDesc = data
	},
	[types.SET_UPLOAD_FILE_LIST](state, list) {
		state.upLoadFileList = list
	},
	[types.SET_FLOW_ARR_LIST_NUM](state, data) {
		state.flowAttListNum = data
	},
	[types.SET_POST_LIST](state, data) {
		state.postList = data
	},
	[types.SET_STAFF_LIST](state, data) {
		state.staffList = data
	},
	[types.SET_IS_UPLOAD](state, data) {
		state.isUpload = data
	}
	
}

export default mutations

