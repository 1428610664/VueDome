import Vue from 'vue'
import Router from 'vue-router'

import Login from 'components/login/login'
import Home from 'components/home/home'
import Apply from 'components/apply/apply'
import Pending from 'components/pending/pending'
import Me from 'components/me/me'
//import FlowPage from 'components/flow-page/flow-page'
import FlowList from 'components/flow-list/flow-list'
import Outsourcemanage from 'components/outsourcemanage/outsourcemanage'
import Personal from 'components/personal/personal'
import Notice from 'components/notice/notice'
import NoticeDesc from 'components/notice-desc/notice-desc'
import ModifyPSW from 'components/modifypsw/modifypsw'
import OutsourceDesc from 'components/outsource-desc/outsource-desc'
import TreatmentProcess from 'components/treatment-process/treatment-process'
import ProcessList from 'components/process-list/process-list'
import EnclosureList from 'flow/enclosure-list/enclosure-list'

import Search from 'flow/search/search'

import Myapply from 'components/myapply/myapply'
import MyProcess from 'components/my-process/my-process'
/*
const Login = (resolve) => {
	import('components/login/login').then((module) => {
		resolve(module)
	})
}
const Home = (resolve) => {
	import('components/home/home').then((module) => {
		resolve(module)
	})
}
const Apply = (resolve) => {
	import('components/apply/apply').then((module) => {
		resolve(module)
	})
}
const Pending = (resolve) => {
	import('components/pending/pending').then((module) => {
		resolve(module)
	})
}
const Me = (resolve) => {
	import('components/me/me').then((module) => {
		resolve(module)
	})
}
const FlowPage = (resolve) => {
	import('components/flow-page/flow-page').then((module) => {
		resolve(module)
	})
}
const FlowList = (resolve) => {
	import('components/flow-list/flow-list').then((module) => {
		resolve(module)
	})
}
const Outsourcemanage = (resolve) => {
	import('components/outsourcemanage/outsourcemanage').then((module) => {
		resolve(module)
	})
}
const Personal = (resolve) => {
	import('components/personal/personal').then((module) => {
		resolve(module)
	})
}

const Notice = (resolve) => {
	import('components/notice/notice').then((module) => {
		resolve(module)
	})
}
const NoticeDesc = (resolve) => {
	import('components/notice-desc/notice-desc').then((module) => {
		resolve(module)
	})
}
const ModifyPSW = (resolve) => {
	import('components/modifypsw/modifypsw').then((module) => {
		resolve(module)
	})
}
const OutsourceDesc = (resolve) => {
	import('components/outsource-desc/outsource-desc').then((module) => {
		resolve(module)
	})
}
const TreatmentProcess = (resolve) => {
	import('components/treatment-process/treatment-process').then((module) => {
		resolve(module)
	})
}
const ProcessList = (resolve) => {
	import('components/process-list/process-list').then((module) => {
		resolve(module)
	})
}*/

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '/home',
		component: Home
	}, {
		path: '/login',
		component: Login
	}, {
		path: '/apply',
		component: Apply,
		children: [{
			path: ':id',
			component: FlowList,
			children: [{
				path: 'outsourcemanage',
				component: Outsourcemanage,
				children: [{
					path: 'outsourceDesc',
					component: OutsourceDesc
				}, {
					path: 'process',
					component: TreatmentProcess,
					children: [{
						path: 'list',
						component: ProcessList
					}]
				},{
					path: 'enclosure-list',
					component: EnclosureList
				},{
					path: 'search',
					component: Search
				}]
			}]
		}]
	}, {
		path: '/pending',
		component: Pending,
		children: [{
			path: 'outsourcemanage',
			component: Outsourcemanage,
			children: [{
				path: 'outsourceDesc',
				component: OutsourceDesc
			}, {
				path: 'process',
				component: TreatmentProcess,
				children: [{
					path: 'list',
					component: ProcessList
				}]
			},{
				path: 'enclosure-list',
				component: EnclosureList
			},{
				path: 'search',
				component: Search
			}]
		}]
	}, {
		path: '/me',
		component: Me,
		children: [{
				path: 'personal',
				component: Personal,
				children: [{
					path: 'modifypsw',
					component: ModifyPSW
				}]
			},{
				path: 'notice',
				component: Notice,
				children: [{
					path: ':id',
					component: NoticeDesc
				}]
			},{
				path: 'myapply',
				component: Myapply,
				children: [{
					path: 'outsourcemanage',
					component: Outsourcemanage,
					children: [{
						path: 'outsourceDesc',
						component: OutsourceDesc
					}, {
						path: 'process',
						component: TreatmentProcess,
						children: [{
							path: 'list',
							component: ProcessList
						}]
					},{
						path: 'enclosure-list',
						component: EnclosureList
					},{
						path: 'search',
						component: Search
					}]
				}]
			},{
				path: 'my-process',
				component: MyProcess,
				children: [{
					path: 'myapply',
					component: Myapply,
					children: [{
						path: 'outsourcemanage',
						component: Outsourcemanage,
						children: [{
							path: 'outsourceDesc',
							component: OutsourceDesc
						}, {
							path: 'process',
							component: TreatmentProcess,
							children: [{
								path: 'list',
								component: ProcessList
							}]
						},{
							path: 'enclosure-list',
							component: EnclosureList
						},{
							path: 'search',
							component: Search
						}]
					}]
				}]
			}
		]
	}]
})

Router.prototype.goBack = function() {　　
	this.isBack = true　　
	window.history.go(-1)
}