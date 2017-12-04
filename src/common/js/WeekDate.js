export default function GetWeekDate(time) {
	let now = new Date(time)
	this.nowDayOfWeek = now.getDay()
	this.nowYear = now.getYear()
	this.nowMonth = now.getMonth()
	this.nowDay = now.getDate()
	this.nowYear += (this.nowYear < 2000) ? 1900 : 0
	this.nowDayOfWeek = this.nowDayOfWeek == 0 ? 7 : this.nowDayOfWeek
}

GetWeekDate.prototype = {
	// 时间转字符串 date2str(new Date(curTime),"yyyy-MM-dd hh:mm:ss") 
	date2str: function(x, y) {
		let z = {
			y: x.getFullYear(),
			M: x.getMonth() + 1,
			d: x.getDate(),
			h: x.getHours(),
			m: x.getMinutes(),
			s: x.getSeconds()
		}
		return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
			return((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
		})
	},
	// 格式化时间 yyyy-MM-dd
	formatDate: function(date) {
		let myyear = date.getFullYear()
		let mymonth = date.getMonth() + 1
		let myweekday = date.getDate()
		if(mymonth < 10) {
			mymonth = "0" + mymonth
		}
		if(myweekday < 10) {
			myweekday = "0" + myweekday
		}
		return(myyear + "-" + mymonth + "-" + myweekday)
	},
	// 获得本周的开端日期  
	getWeekStartDate: function() {
		let weekStartDate = new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1)
		return this.formatDate(weekStartDate)
	},
	// 获得本周的停止日期  
	getWeekEndDate: function() {
		let weekEndDate = new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek + 1))
		return this.formatDate(weekEndDate)
	},
	// 获取前一周的开端日期
	getBeforeWeekStartDate: function() {
		let curWeekStartDate = this.getWeekStartDate().replace(/-/g, '/')
		let day = 24 * 60 * 60 * 1000 * 7
		return this.formatDate(new Date(new Date(curWeekStartDate).getTime() - day))
	},
	// 获取前一周的停止日期
	getBeforeWeekEndDate: function() {
		let curWeekStartDate = this.getWeekStartDate().replace(/-/g, '/')
		let day = 24 * 60 * 60 * 1000
		return this.formatDate(new Date(new Date(curWeekStartDate).getTime() - day))
	},
	// 获得本周周一~周日的年月日
	getAWeedkYMD: function() {
		let ymdArr = []
		for(let i = 0; i < 7; i++) {
			ymdArr.push(this.date2str(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + i + 1), 'yyyy-MM-dd'))
		}
		return ymdArr
	}
}