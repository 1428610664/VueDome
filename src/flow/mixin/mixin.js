import { commonFn, actionJson, getFlowinfo, getFlowforminfo, readBacklog, getFormShow, uploadPath, uploadPaths, getEnum} from 'api/commonFlow'
import utils from 'common/js/utils'
import { Toast, openCamera, openGallery, pickAllFile} from 'common/js/H5Utils'
import {mapActions, mapMutations, mapGetters} from 'vuex'

/*
	Form表单公共部分 
*/
export const formMixin = {
	data(){
		return {
			Flowid:  this.$route.query.flowid | 0,
			flowInfoData: null,		// 流信息数据
			subMark: false, 		// 节流处理
			FlowActions: [],		// 底部按钮
			FormShow:{},			// 表单展示规则
			
			Co: false,				// 协办
			CoId: '', 				// 协办请求id
			Assign: false,			// 指派
			AssignUser: [],			// 指派用户列表
			AssignDept: [],			// 指派岗位列表
			Link: false,			// 跳转
			LinkData: {},			// 跳转请求数据
			FlowAttNum: 0,			// 服务器附件条数
			
			// 待删除
			upMark:false,
		}
	},
	created(){
		
		setTimeout(() => {
			this.init()
			this.iptFocus()
		},800)
	},
	computed: {
		...mapGetters([
			'upLoadFileList',
			'flowAttListNum'
		]),
		cptUpLoadListSize(){
			return this.upLoadFileList.length + this.flowAttListNum
		}
    },
	methods: {
		...mapMutations({
			setFlowAttListNum: 'SET_FLOW_ARR_LIST_NUM',
			setUploadFileList: 'SET_UPLOAD_FILE_LIST',
			setIsUpload: 'SET_IS_UPLOAD'
		}),
		...mapActions([
			'insertUpLoadFileList'
		]),
		iptFocus(){
			let inputs = document.getElementById("content").getElementsByTagName("input")
			let textareas = document.getElementById("content").getElementsByTagName("textarea")
		    for (let i = 0, ilen = inputs.length; i < ilen; i++){
				if (inputs[i].type == 'text' || inputs[i].type == 'number'){
					inputs[i].addEventListener("focus", (e) => {
						let top = this._getImgTop(e.currentTarget)- 60
						// $("#content").animate({scrollTop: top})
						setTimeout(() => {
							document.getElementById("content").scrollTop = top
						}, 400)
					}, false)
				}
			}
		 	for (let i = 0, ilen = textareas.length; i < ilen; i++){
				textareas[i].addEventListener("focus", (e) => {
					let top = this._getImgTop(e.currentTarget)- 60
					// $("#content").animate({scrollTop: top})
					setTimeout(() => {
						document.getElementById("content").scrollTop = top
					}, 400)
				}, false)
			}
		},
		_getImgTop(obj){
			let top = 0
			while(obj){
				top+=obj.offsetTop
				obj = obj.offsetParent
			}
			return top
		},
		// 待删除
		openFile0(fileId) {
			var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false
			if(ie) {
				document.getElementById(fileId).click()
			} else {
				var a = document.createEvent("MouseEvents")
				a.initEvent("click", true, true)
				document.getElementById(fileId).dispatchEvent(a)
			}
		},
        changeFile0 : function(){
            var v = document.getElementById("file0").value
            if(utils.isEmpty(v))return
            if(this.upMark)return
            this.upMark = true
            this.upFile0(v)
        },
        upFile0 : function(v){
            var _this = this
            $("#upform0").ajaxSubmit({
                url: uploadPaths(),
                type: "post",
                enctype: "multipart/form-data",
                dataType: "json",
                success: function(data){
                    _this.upMark = false
                    console.log("上传："+JSON.stringify(data))
                    _this.insertUpLoadFileList({
                    	Filename: data.Data.FileName,
						DirectorName: data.Data.DirectorName,
						CreatEmp: data.Data.CreateEmp,
						CreatTime: data.Data.CreateTime,
						FileSize: data.Data.FileSize,
						Url: data.Data.Url
                    })
                },
                error: function(data){
                    _this.upMark = false
                    console.log("提交失败："+JSON.stringify(data))
                }
            });
        },
		init(){
			this.setFlowAttListNum(0)
			this.setUploadFileList([])
			this.setIsUpload(true)
			
			this.getLevel()
			this.getFlowinfo()
			this.getFlowforminfo()
		},
		getFlowinfo(){
			let flowid = this.Flowid == 0 ? null : this.Flowid
			let flowmodelid = this.$route.query.flowmodelid
			getFlowinfo({flowModelId: flowmodelid,flowid: flowid}).then((data) => {
				if(!data.Result){
					Toast(data.Message)
					this.$router.goBack()
					return
				}
				
				this.Opinion = data.Data.Opinion
				this.flowInfoData = data.Data
				this.FlowActions = data.Data.FlowActions
				this.setIsUpload(this._findIndexUpload(this.FlowActions) != -1)
				if(data.Data.Flow.Urgenlevel){
					this.urgenlevel = data.Data.Flow.Urgenlevel
				}
				if(!utils.isEmpty(data.Data.Flow.Title)) this.Flowtitle = data.Data.Flow.Title
				this.setFlowAttListNum(data.Data.FlowAttNum)
				
				this.getFormShow()
				this.readBacklog()
			}, (error) => {
				
			})
		},
		getFlowforminfo(){
			let flowmodelid = this.$route.query.flowmodelid
			getFlowforminfo( this.UrlPrefix, {flowModelId: flowmodelid,flowid:this.Flowid}).then((data) => {
				if(data.Result){
					var d = data.Data.OutSrc
					for(var k in d){
						if(this.$data.hasOwnProperty(k)){
							if(k == "OutsrcStdate" || k == "OutsrcEddate" || k == "RentOutsrcdate"){
								this.$data[k] = utils.getDate(d[k])
							}else{
								this.$data[k] = d[k]
							}
						}
					}
					for(var i = 0, ilen = data.Data.OutSrcDetails.length; i < ilen; i++){
						data.Data.OutSrcDetails[i].Paydate = utils.getDate(data.Data.OutSrcDetails[i].Paydate)
						data.Data.OutSrcDetails[i].Isoutsrcend = data.Data.OutSrcDetails[i].Isoutsrcend == 1 ? true : false
					}
					this.DetailList = data.Data.OutSrcDetails
				}
			})
		},
		getFormShow(){
			let flownodeid = this.flowInfoData.FlowNode.FlowNodeId
			let flowmodelId = this.$route.query.flowmodelid
			let flowpageid = this.$route.query.flowpageid
			let reqData = {flownodeid: flownodeid, flowmodelId: flowmodelId,flowpageid: flowpageid}
			getFormShow(reqData).then((data) => {
				if(data.Result){
					this.FormShow = data.Data
				}
			}, (error) => {
				
			})
		},
		getLevel(){
			getEnum("urgenlevel").then((data) => {
				let arr = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					if(i == 0)this.urgenlevel = data[i].EnumCode
					arr.push({key: data[i].EnumCode, value: data[i].EnumValue})
				}
				this.novalidate.urgenlevelList = arr
			})
		},
		readBacklog(){
			if(this.Flowid && this.flowInfoData.FlowNode.FlowNodeId){
				readBacklog({flownodeid: this.flowInfoData.FlowNode.FlowNodeId, flowid: this.Flowid})
			}
		},
		event(i, mark){
			if(mark){
				this.$refs.outFooter.hideMore()
			}
			if(i == 18){
				window.plus ? this._selectFile0() : this.openFile0("file0")
				return 
			}
			// 验证
			let flag = this._validate()	
			if(!flag) return
			
			let url = actionJson(i, this.UrlPrefix)[0]
			let msg = actionJson(i, this.UrlPrefix)[1]
			let reqData = this._getParma()
			
			// 环节跳转
			if(i == 13){
				if(this.Link){
					Object.assign(reqData, this.LinkData)
				}else{
					this.$refs.selectLink.show({flownodeid: this.flowInfoData.FlowNode.FlowNodeId, flowmodelId: this.$route.query.flowmodelid}, i)
					return
				}
			}
			// 指派提交前处理
			if(i == 14){
				if(this.Assign){
					reqData.User = this.AssignUser
					reqData.Dept = this.AssignDept
				}else{
					this.$refs.assign.show(i)
					return
				}
			}
			// 协办提交前处理
			if(i == 23){
				if(this.Co){
					reqData.JointlyUser = this.CoId
				}else{
//					this.$refs.CoUser.show("选择协办人", 0, i)
					this.$refs.CoUser.show([], i, '选择协办人')
					return
				}
			}
			
			console.log(url+"-----reqData----------"+JSON.stringify(reqData))
			if(window.plus){
				let _this = this
				plus.nativeUI.confirm(msg, function(e){
					if(e.index==1){
						_this.confirm(i, mark, reqData, url)
					}
				},"提示",["取消","确定"])
			}else{
				this.confirm(i, mark, reqData, url)
			}
		},
		confirm(i, mark, reqData, url){
			// 节流
			if(this.subMark)return
			this.subMark = true
			this.$vux.loading.show({text: '提交中...'})
			commonFn(url, reqData).then((data) => {
				console.log(JSON.stringify(data))
				this.subMark = false
				this.$vux.loading.hide()
				Toast(data.Message)
				if(data.Result)this.Flowid = data.Data
				this._restoreDefault()	// 恢复默认
				this.init()				// 重新请求数据刷新页面
			}, (error) => {
				this.subMark = false
				this.$vux.loading.hide()
			})
		},
		toEnclosureList(mark){
			// let path = this.$route.path
			// this.$router.push({path: path + '/enclosure-list',query:{flowid: this.Flowid}})	
			if(!mark){
				let path = this.$route.path
				this.$router.push({path: path + '/enclosure-list',query:{flowid: this.Flowid}})				
			}else{
				Toast("不可编辑")
			}
		},
		toProcess(){
			let path = this.$route.path
			this.$router.push({path: path + '/process',query:{flowid: this.Flowid}})
		},
		selectUser(data, i,mark){
			if(!mark){			// 协办
				this.Co = true
				this.CoId = data.id
			}else if(mark){	// 指派
				this.Assign = true
				this.AssignUser = data.userResult
				this.AssignDept = data.postResult
			}
			this.event(i)
		},
		selectCoUser(data, mark, i){
			let CoId = ''
			for(let i = 0, ilen = data.length; i < ilen; i++){
				CoId += data[i].key + ","
			}
			CoId = CoId.substring(0, CoId.length - 1)
			this.Co = true
			this.CoId = CoId
			this.event(i)
		},
		selectLink(data, i){
			this.Link = true
			this.LinkData = data
			this.event(i)
		},
		back(){
			if(window.plus){
				plus.nativeUI.confirm("确认取消吗？", function(e){
					if(e.index==1){
						window.history.back()
					}
				},"提示",["取消","确定"])
			}else{
				window.history.back()
			}
			
		},
		_selectFile0(){
			let Parmas = [{title: "拍照"}, {title: "从手机相册选择"}, {title: "选择文件"}]
			let _this = this
			plus.nativeUI.actionSheet({title: "上传文件",cancel: "取消",buttons: Parmas}, function(b) {
				switch (b.index) {
					case 0:
						break
					case 1:
						openCamera(_this._success0, _this._progress0, _this._error0)
						break
					case 2:
						openGallery(_this._success0, _this._progress0, _this._error0)
						break
					case 3:
						pickAllFile(_this._success0, _this._progress0, _this._error0)
						break
				}
			})
		},
		_success0(data){
			console.log(JSON.stringify(data))
			this.insertUpLoadFileList({
            	Filename: data.Data.FileName,
				DirectorName: data.Data.DirectorName,
				CreatEmp: data.Data.CreateEmp,
				CreatTime: data.Data.CreateTime,
				FileSize: data.Data.FileSize,
				Url: data.Data.Url
            })
		},
		_error0(){
			Toast("上传失败")
		},
		_progress0(jd){
			console.log("上传进度："+jd)
		},
		_getParma() {
			let param = {
				FlowPageId: this.$route.query.flowpageid,
				FlowNodeId: this.flowInfoData.FlowNode.FlowNodeId,
				IsFreeFlow: this.flowInfoData.IsFreeFlow,
				FlowModelId: this.$route.query.flowmodelid
			}
			let reqData = Object.assign({}, this.$data, param)

			delete reqData.subMark
			delete reqData.FlowActions
			delete reqData.flowInfoData
			delete reqData.FormShow
			delete reqData.UrlPrefix
			delete reqData.Co
			delete reqData.CoId
			delete reqData.Assign
			delete reqData.AssignUser
			delete reqData.AssignDept
			delete reqData.Link
			delete reqData.LinkData
			delete reqData.FlowAttNum
			delete reqData.novalidate
			
			for(let i=0, ilen = reqData.DetailList.length; i < ilen; i++){
				reqData.DetailList[i].Isoutsrcend = reqData.DetailList[i].Isoutsrcend ? 1 : 0
			}
			reqData.UpLoadList = []
			for(let i=0, ilen = this.upLoadFileList.length; i < ilen; i++){
				reqData.UpLoadList.push({
					FileName: this.upLoadFileList[i].Filename,
					DirectorName: this.upLoadFileList[i].DirectorName
				})
			}
			return reqData
		},
		_restoreDefault(){
			this.novalidate.Opinion = ""
			this.Co = false			// 协办
			this.CoId = '' 			// 协办请求id
			this.Assign = false		// 指派
			this.AssignUser = []	// 指派用户列表
			this.AssignDept = []	// 指派岗位列表
			this.Link = false		// 跳转
			this.LinkData = {}		// 跳转请求数据
		},
		_findIndexUpload(list){
			return list.findIndex((item) => {
				return item.TypeId == 18
			})
		},
		_check(data, mark){
			if(data){
				if(mark){
					return data.visibility == 1 ? true : false
				}else{
					return data.edittable == 0 ? true : false
				}
			}else{
				return mark ? true : false
			}
		}
	}
}

