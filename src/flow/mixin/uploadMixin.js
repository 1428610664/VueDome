import {uploadPaths} from 'api/commonFlow'
import utils from 'common/js/utils'
import { Toast, openCamera, openGallery, pickAllFile} from 'common/js/H5Utils'
import {mapActions, mapGetters} from 'vuex'

let isUpload = false

/*
	上传文件 
*/
export const uploadMixin = {
	data(){
		return {
			// 待删除
			upMark:false,
			directorName: '' // 上传文件文件夹
		}
	},
	computed: {
		...mapGetters([
			'upLoadFileList',
		])
	},
	methods: {
		...mapActions([
			'insertUpLoadFileList'
		]),
		
		// 待删除
		_openFiles(fileId) {
			var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false
			if(ie) {
				document.getElementById(fileId).click()
			} else {
				var a = document.createEvent("MouseEvents")
				a.initEvent("click", true, true)
				document.getElementById(fileId).dispatchEvent(a)
			}
		},
        changeFile1 : function(el){
            var v = document.getElementById("file1").value
            if(utils.isEmpty(v))return
            if(this.upMark)return
            this.upMark = true
            this._upFile1(v)
        },
        _upFile1 : function(v){
            var _this = this
            this.$vux.loading.show({text: '上传中...'})
            $("#upform1").ajaxSubmit({
            	//url: uploadPaths()+"&directorName="+_this.directorName,
                url: uploadPaths()+"&flowId="+this.$route.query.flowid,
                type: "post",
                enctype: "multipart/form-data",
                dataType: "json",
                success: function(data){
                    _this.upMark = false
                    _this._success1(data)
                },
                error: function(data){
                	_this._error1()
                    _this.upMark = false
                    console.log("提交失败："+JSON.stringify(data))
                }
            });
        },
		_selectFile1(){
			let Parmas = [{title: "拍照"}, {title: "从手机相册选择"}, {title: "选择文件"}]
			let _this = this
			//let uploadPath = uploadPaths()+"&directorName="+_this.directorName
			let uploadPath = uploadPaths()+"&flowId="+this.$route.query.flowid
			plus.nativeUI.actionSheet({title: "上传文件",cancel: "取消",buttons: Parmas}, function(b) {
				switch (b.index) {
					case 0:
						break
					case 1:
						openCamera(uploadPath, _this._success1, _this._progress1, _this._error1)
						break
					case 2:
						openGallery(uploadPath, _this._success1, _this._progress1, _this._error1)
						break
					case 3:
						pickAllFile(uploadPath, _this._success1, _this._progress1, _this._error1)
						break
				}
			})
		},
		_success1(data){
			setTimeout(() => {
        		this.$vux.loading.hide()
        		isUpload = false
        		if(data.Result){
        			let file = {
		            	Filename: data.Data.FileName,
						DirectorName: data.Data.DirectorName,
						CreatEmp: data.Data.CreateEmp,
						CreatTime: data.Data.CreateTime,
						FileSize: data.Data.FileSize,
						Url: data.Data.Url,
						IsTemp: data.Data.IsTemp
		           }
        			this.content.unshift(file)
        			console.log(this.content.length +"-------------"+console.log(JSON.stringify(this.content)))
		            this.insertUpLoadFileList(file)
		            this.directorName = data.Data.DirectorName
        		}else{
        			Toast("上传失败")
        		}
        	}, 800)
		},
		_error1(){
			this.$vux.loading.hide()
			Toast("上传失败")
		},
		_progress1(jd){
			if(!isUpload){
				isUpload = true
				this.$vux.loading.show({text: '上传中...'})
			}
			console.log("上传进度："+jd)
		}
	}
}