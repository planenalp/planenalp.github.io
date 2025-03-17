
document.addEventListener('DOMContentLoaded', () => {

	//////////////// 引入fancybox所需的css文件以及所需的绑定函数 start ////////////////
	document.head.appendChild(Object.assign(document.createElement('link'), {
		rel: 'stylesheet',
		href: 'https://testingcf.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css'
	}));
	Fancybox.bind('[data-fancybox="gallery"]', {});
	//////////////// 引入fancybox所需的css文件以及所需的绑定函数 end ////////////////

});
