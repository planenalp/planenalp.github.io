//////////////// 文章目录代码块 part1 start ////////////////

//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

	//////////////// 插入css的函数 start ////////////////
function loadResource(type, attributes) {
	if (type === 'style') {
		const style = document.createElement('style');
		style.textContent = attributes.css;
		document.head.appendChild(style);
	}
}
	//////////////// 插入css的函数 end ////////////////

let tocTitle // 全局声明变量

	//////////////// 创建toc目录html结构 start ////////////////
function createTOC() {
	const tocElement = document.createElement('div');
	tocElement.className = 'toc';

	// 创建 toc-title 容器并添加到 toc 元素中
	tocTitle = document.createElement('div');
	tocTitle.className = 'toc-title';
	tocElement.appendChild(tocTitle);

	// 将目录 <div> 插入到 <body> 中
	document.body.appendChild(tocElement);

	// 获取文章标题并设置排版
	const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
	headings.forEach(heading => {
		if (!heading.id) {
			heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
		}
		const link = document.createElement('a');
		link.href = `#${heading.id}`;
		link.textContent = heading.textContent;
		link.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
		if (heading.tagName !== 'H1') {
			const level = parseInt(heading.tagName.charAt(1));
			link.style.marginLeft = `${(level - 1) * 10}px`;
		}
		link.addEventListener('click', function(e) {
			// 添加点击事件, 平滑滚动到对应的标题位置
			e.preventDefault();
			document.getElementById(heading.id).scrollIntoView();
		});
		// 将链接添加到 toc-title 容器中
		tocTitle.appendChild(link);
	});
}
	//////////////// 创建toc目录html结构 end ////////////////

function toggleTOC() {
	const tocElement = document.querySelector('.toc');
	const tocIcon = document.querySelector('.ArticleTOC');
	if (tocElement && tocIcon) {
		tocElement.classList.toggle('show');
		tocIcon.classList.toggle('active');
		tocIcon.style.boxShadow = tocIcon.classList.contains('active') ?
			'6px 6px 14px 0 var(--header-btn-shadowColor) inset, -7px -7px 12px 0 var(--header-btn-shadowColor2) inset' :
			'';
	}
}
//////////////// 文章目录代码块 part1 end ////////////////

document.addEventListener('DOMContentLoaded', () => {
	//////////////// 文章目录代码块 part2 start ////////////////
	createTOC();
	//绑定按钮点击切换显示目录
	const tocIcon = document.querySelector('.ArticleTOC');
	if (tocIcon) {
		tocIcon.onclick = (e) => {
			e.stopPropagation();
			toggleTOC();
		};
	}
		//////////////// 添加 CSS 样式 start ////////////////
	const css = `
		:root {
			--toc-link-bgColor: #ffffffb8;
			--toc-h1-after-bgColor: #1b9dff
		}
		[data-color-mode=light][data-light-theme=dark],
		[data-color-mode=light][data-light-theme=dark]::selection,
		[data-color-mode=dark][data-dark-theme=dark],
		[data-color-mode=dark][data-dark-theme=dark]::selection {
			--toc-link-bgColor: #121d23ab;
			--toc-h1-after-bgColor: #43dbff
		}
		.toc {
			position: fixed;
			bottom: 13%;
			right: 0;
			transform: translateX(50%);
			display: flex;
			flex-direction: column;
			width: 250px;
			max-height: 50vh;
			background-color: var(--toc-link-bgColor);
			border-radius: 10px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
			overflow: hidden;
			z-index: 99;
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
			backdrop-filter: blur(15px);
			scrollbar-width: thin; /* Firefox 滚动条宽度：auto 或 thin */
			scrollbar-color: #9fc6e3 transparent; /* Firefox 滚动条颜色+轨道颜色(透明) */
		}
		/* 滚动条样式 */
		.toc::-webkit-scrollbar {
			width: 4px; 
		}
		.toc::-webkit-scrollbar-thumb {
			background: #9fc6e3;
			border-radius: 20px;
		}
		.toc::-webkit-scrollbar-thumb:hover {
			background: #6baedf;
		}
		.toc.show {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
		}
		.toc .toc-title a {
			display: block;
			color: var(--fgColor-default);
			text-decoration: none;
			padding: 6px;
			font-size: 14px;
			line-height: 1.5;
			border-radius: 8px;
			transition: background-color 0.2s ease;
		}
		.toc .toc-title a:hover {
			background-color: #6be5ff99;
			transform:translate(1px,1px);
		}
		.toc-h1{
			position: relative;
			padding-left: 10px;
		}
		.toc-h1::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 3px;
			height: 60%;
			background-color: var(--toc-h1-after-bgColor);
			transform: translateY(-50%);
		}
		/* 目录按钮 */
		.toc-btn{
			display: inherit;
			position: sticky;
			top: 0;
			z-index: 999999;
		}
		.toc-btn div{
			display: flex;
			justify-content: center;
			width:100%;
			box-shadow: 2px 4px 16px #7982a01f;
			cursor: pointer;
		}
		.toc-btn div:active{box-shadow: inset -2px -2px 6px var(--header-btn-shadowColor),inset 2px 2px 6px var(--header-btn-shadowColor2);
		}
		.toc-btn a{
			color: var(--title-right-svgColor);
			padding: 9px 11px;
		}
		.toc-btn div:hover a{color:var(--title-right-svgHovercolor);
		}
		/* 标题 */
		.toc-title{
			padding: 10px 10px 0;
			max-height: calc(50vh - 59px);
			overflow-y: auto;
			overflow-y: scroll;
		}
		.toc-title::-webkit-scrollbar {
			display: none;
		}
		.toc-title {
			scrollbar-width: none;
		}
		@media (max-width: 768px) {
		}
		@media (max-width: 768px) {
			.toc {
				width: 200px;
				max-height: 40vh;
			}
			.toc-title{
				padding: 5px 8px 0;
			}
			.back-to-top {
				bottom: 2%;
				width: 40px;
				height: 40px;
				font-size: 20px;
			}
		}
		.toc-link.toc-active {
			background-color: #3db9d399;
			font-weight: bold;
			box-shadow: inset -2px -2px 6px #ffffff42, inset 2px 2px 6px #59595980;
		}
	`;

	loadResource('style', { css });
		//////////////// 添加 CSS 样式 end ////////////////
	
	// 滚动切换高亮标题
	const highlightTOC = () => {
		const tocLinks = document.querySelectorAll('.toc-link');
		const fromTop = window.scrollY + 10;
		let currentHeading = null;
		// 遍历目录链接，查找当前显示的标题
		tocLinks.forEach(link => {
			const section = document.getElementById(link.getAttribute('href').substring(1));
			if (section && section.offsetTop <= fromTop) {
				currentHeading = link;
			}
		});
		// 清除所有高亮
		tocLinks.forEach(link => link.classList.remove('toc-active'));
		if (currentHeading) {
			currentHeading.classList.add('toc-active');
			currentHeading.scrollIntoView({ block: 'center', inline: 'nearest' });
		}
	};
	// 添加全局滚动监听
	document.addEventListener('scroll', highlightTOC);
	//////////////// 文章目录代码块 part2 end ////////////////
});
