import jsonp from 'common/js/jsonp'
import {commonParams, path, options} from './config'
import {getToken} from 'common/js/cache'

export function actionJson(no, src){
	const urlJson = {
		No10: [`/${src}/Next`, "确认发送"],				// 发送
		No11: ["/flow/Delete", "确认删除"],				// 删除
		No12: ["/flow/Back", "确认退回"],				// 退回
		No13: ["/flow/Skip", "是否跳转"],				// 跳转
		No14: [`/${src}/Assign`, "是否指派"],			// 指派
		No15: ["/flow/Break", "确认暂停"],				// 暂停
		No16: ["/flow/Restore", "是否恢复"],				// 恢复
		No17: ["/flow/Termination", "是否终止"],			// 终止
		No19: ["/flow/Remind", "催办"],					// 催办
		No22: [`/${src}/Temporary`, "是否暂存"],			// 暂存/保存
		No23: ["/flow/Jointly", "是否协办"],				// 协办
		No24: ["/flow/Backtrack", "是否回朔"],			// 回朔
		No25: ["/flow/Recall", "是否撤回当前步骤"],		// 撤回
		No26: ["/flow/Remove", "是否移除当前步骤"],		// 移除
		No999: [`/${src}/FreeFlow`, "是否发送"]			// 自由发送
	}
	return urlJson["No"+no]
}

export const uploadPath = path + '/flow/uploadfile?Token=' + encodeURIComponent(getToken())

export function uploadPaths(){
	return path + '/flow/uploadfile?Token=' + encodeURIComponent(getToken())
}
	
	
export function commonFn(url, parma){
	url = path + url
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options, true)
}

/* 获取流信息 */
export function getFlowinfo(parma){
	let url = path + "/flow/flowinfo"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

/* 获取form数据  */
export function getFlowforminfo( src, parma){
	let url = path + `/${src}/flowforminfo`
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

/* 设置为已读 */
export function readBacklog( parma){
	let url = path + "/flow/ReadBacklog"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}


// 协办  获取所有部门接口  http://192.168.0.188:8088/user/getalldept
export function getAlldept(){
	let url = path + "/user/getalldept"
	let data = Object.assign({}, commonParams, {})
	return jsonp(url, data, options)
}
// 协办 获取部门下所有职员信息  http://192.168.0.188:8088/user/GetDeptStandardList?deptCode=004
export function getDeptStandardList(parma){
	let url = path + "/user/GetDeptStandardList"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 获取所有环节	http://192.168.0.188:8088/flow/GetNodeByModelId?flowModelId=1330&flownodeid=296
export function getNodeByModelId(parma){
	let url = path + "/flow/GetNodeByModelId"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 获取环节处理职员  http://192.168.0.188:8088/flow/GetNodeUserList?flownodeid=381
export function getNodeUserList(parma){
	let url = path + "/flow/GetNodeUserList"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 查询流程处理过程列表	 http://192.168.0.188:8088/flow/GetProcess?flowid=1569 
export function getProcess(parma){
	let url = path + "/flow/GetProcess"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 查询环节处理列表 http://192.168.0.188:8088/flow/GetNodeProcess?flowid=1569 
export function getNodeProcess(parma){
	let url = path + "/flow/GetNodeProcess"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 表单展示规则	http://192.168.0.188:8088/flow/GetFormShow?flowpageid=12&flowmodelid=1370&flownodeid=426
export function getFormShow(parma){
	let url = path + "/flow/GetFormShow"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 删除外包明细 http://192.168.0.188:8088/outsrc/DelDetailById?prikeyId=1 
export function delDetailById(src, id){
	let url = path + `/${src}/DelDetailById`
	let data = Object.assign({}, commonParams, {prikeyId: id})
	return jsonp(url, data, options)
}

// 获取流程附件列表 http://192.168.0.188:8088/flow/GetFlowAttachment?flowid=1636
export function getFlowAttachment(parma){
	let url = path + "/flow/GetFlowAttachment"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}



// 删除流程附件 http://192.168.0.188:8088/flow/DelFile?attId=1
export function delFile(parma){
	let url = path + "/flow/DelFile"
	let data = Object.assign({}, commonParams, parma)
	return jsonp(url, data, options)
}

// 获取枚举列表（添加明细 - 费用类型） http://192.168.0.188:8088/common/GetEnum?key=outsrc_prop 
export function getEnum(key){
	let url = path + "/common/GetEnum"
	let data = Object.assign({}, commonParams, {key: key})
	return jsonp(url, data, options)
}



