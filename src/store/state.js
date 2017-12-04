import {getIsLogin, getUserInfo} from 'common/js/cache'


const state = {
	isLogin : getIsLogin(),
	userData : getUserInfo(),
	
	noticeCount: 0,			// 公告通知
	taskCount: 0,			// 我的待办
	upLoadFileList: [],		// 上传附件列表
	flowAttListNum: 0,		// 服务器附件列表条数
	
	postList: [],			// 选中搜索岗位
	staffList: [],			// 选中搜索员工
	
	isUpload: true,			// 附件是否可上传
	
	_outsourceDesc : {}
}

export default state