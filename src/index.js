import './setupPublicPath';
import React from 'react';
import ReactDOM from 'react-dom';

// import { Application } from "@yulintu/freesia-bootstrap";
import { Application } from "@yulintu/freesia-design";
// import { Application } from "@yulintu/freesia-design-mobile";

import templates from "./templates";

import './css/global.less';
import './css/index.less';

function render(props = {}) {
	ReactDOM.render(
		<Application global={{}} templates={templates} {...props} />,
		props.container ? props.container.querySelector('#root') : document.querySelector('#root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
	render();
}



// 以下为微前端的钩子函数

export async function bootstrap() {
	console.log('microapp bootstrap');
}

export async function mount(props) {
	console.log('microapp mount', props);
	render(props);
}

export async function unmount(props) {
	console.log('microapp unmount', props);
	ReactDOM.unmountComponentAtNode(props?.container ? props?.container.querySelector('#root') : document.querySelector('#root'));
}