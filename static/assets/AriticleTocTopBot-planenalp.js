
//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

////////// 动态加载 CSS 样式 start //////////
function loadResource(type, attributes) {
	if (type === 'style') {
		const style = document.createElement('style');
		style.textContent = attributes.css;
		document.head.appendChild(style);
	}
}
////////// 动态加载 CSS 样式 end //////////

////////// 创建目录 start //////////
function createTOC() {
	const tocElement = document.createElement('div');
	tocElement.className = 'toc';
	document.body.appendChild(tocElement);// 将目录 <div> 插入到 <body> 中

	const markdownBody = document.querySelector('.markdown-body');
	const headings = markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
	headings.forEach(heading => {
		if (!heading.id) {
			heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
		}
		const link = document.createElement('a');
		link.href = '#' + heading.id;
		link.textContent = heading.textContent;
		// 添加公共类名 'toc-link'
		link.className = 'toc-link';
		// 根据标题标签动态添加不同的类名
		link.classList.add('toc-' + heading.tagName.toLowerCase());
		// 获取标题级别并计算 margin-left
		if (heading.tagName !== 'H1') {
		  const level = parseInt(heading.tagName.charAt(1)); // 获取标题级别
		  link.style.marginLeft = `${(level - 1) * 10}px`;  // 计算缩进
		}
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetElement = document.getElementById(heading.id);
			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth'
				});
			}
			//toggleTOC(); // 点击后关闭目录-已注释
		});
		tocElement.appendChild(link);
	});
}
////////// 创建目录 end //////////

////////// 目录按钮切换功能 start //////////
function toggleTOC() {
	const tocElement = document.querySelector('.toc');
	const tocIcon = document.querySelector('.toc-icon');
	if (tocElement) {
		tocElement.classList.toggle('show');
		tocIcon.classList.toggle('active');
		tocIcon.innerHTML = tocElement.classList.contains('show') ?
			'<svg viewBox="0 0 24 24"><path d="M4 4l16 16M4 20L20 4"/></svg>' : //X图标
			'<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>'; //汉堡图标
	}
}
////////// 目录按钮切换功能 end //////////

document.addEventListener("DOMContentLoaded", function() {
	createTOC();
	const combinedCss = `
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
			width: 250px;
			max-height: 50vh;
			background-color: var(--toc-link-bgColor);
			border-radius: 10px;
			padding: 10px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
			overflow-y: auto;
			z-index: 99;
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
			backdrop-filter: blur(15px);
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
		/* 针对 Firefox */
		.toc {
			scrollbar-width: thin; /* 滚动条宽度：auto 或 thin */
			scrollbar-color: #9fc6e3 transparent; /* 滚动条颜色+轨道颜色(透明) */
		}
		.toc.show {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
		}
		.toc a {
			display: block;
			color: var(--fgColor-default);
			text-decoration: none;
			padding: 6px;
			font-size: 14px;
			line-height: 1.5;
			border-radius: 8px;
			transition: background-color 0.2s ease;
		}
		.toc a:hover {
			background-color: #6be5ff99;
			transform:translate(1px,1px);
		}
		.toc-icon {
			position: fixed;
			bottom: 7%;
			right: 15px;
			cursor: pointer;
			background-color: rgba(255, 255, 255, 0.8);
			color: #333;
			border-radius: 50%;
			width: 51px;
			height: 51px;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2px 10px rgba(0,0,0,0.1);
			z-index: 1001;
			transition: all 0.3s ease;
			user-select: none;
			-webkit-tap-highlight-color: transparent;
			outline: none;
		}
		.toc-icon:hover {
			transform: scale(1.1);
			background-color: #fff;
		}
		.toc-icon:active {
			transform: scale(0.9);
		}
		.toc-icon.active {
			background-color: #fff;
			color: #333;
		}
		.toc-icon svg {
			width: 24px;
			height: 24px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
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
		.back-to-top, .back-to-bot {
		    position: fixed;
		    right: 20px;
		    z-index: 1000;
		    width: 40px;
		    height: 40px;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    padding: 0;
		    margin: 0;
		    border: 1px solid var(--toc-icon-color);
		    border-radius: 50%;
		    background-color: var(--toc-icon-bgColor);
		    color: var(--toc-icon-color);
		    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
		    opacity: 0;
		    visibility: hidden;
		    transition: all 0.1s ease;
		    font-size: 24px;
		    cursor: pointer;
		    user-select: none;
		    -webkit-tap-highlight-color: transparent;
		    outline: none;
		}
		.back-to-top {
		    bottom: 190px;
		}
		.back-to-bot {
		    bottom: 70px;
		}
		.back-to-top.show, .back-to-bot.show {
		    opacity: 1;
		    visibility: visible;
		}
		.back-to-top:hover, .back-to-bot:hover {
		    border-color: var(--toc-icon-hover-color);
		    background-color: var(--toc-icon-hover-bgColor);
		    color: var(--toc-icon-hover-color);
		    transform: scale(1.1);
		}
		.back-to-top:active, .back-to-bot:active {
		    transform: scale(0.9);
		}
		.back-to-top svg, .back-to-bot svg {
		    width: 24px;
		    height: 24px;
		    fill: none;
		    stroke: currentColor;
		    stroke-width: 2;
		    stroke-linecap: round;
		    stroke-linejoin: round;
		}
		@media (max-width: 768px) {
			.toc {
				width: 200px;
				max-height: 40vh;
			}
			.toc-icon {
				width: 40px;
				height: 40px;
				bottom: 15px;
				right: 15px;
			}
			.toc-icon svg {
				width: 20px;
				height: 20px;
			}
		}

		@media (max-width: 768px) {
		 .toc-icon {
			bottom: 7%;
		 }
		}
		.toc-link.toc-active {
			background-color: #3db9d399;
			font-weight: bold;
			box-shadow: inset -2px -2px 6px #ffffff42, inset 2px 2px 6px #00000080;
		}
	`;
	loadResource('style', { css: combinedCss });

	////////// 创建目录按钮 TOC 切换图标 start //////////
	const tocIcon = document.createElement('div');
	tocIcon.className = 'toc-icon';
	tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>'; //初始化加载汉堡图标
	tocIcon.onclick = (e) => {
		e.stopPropagation();
		toggleTOC();
	};
	document.body.appendChild(tocIcon);
	////////// 创建目录按钮 TOC 切换图标 end //////////

	////////// 点击页面其他区域时隐藏目录 start //////////
	document.addEventListener('click', (e) => {
		const tocElement = document.querySelector('.toc');
		if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && !e
			.target.classList.contains('toc-icon')) {
			toggleTOC();
		}
	});
	////////// 点击页面其他区域时隐藏目录 end //////////

	////////// 创建滚动页面高亮菜单 start //////////
	function highlightTOC() {
		const tocLinks = document.querySelectorAll('.toc-link');
		const fromTop = window.scrollY + 10;
		let currentHeading = null;
		tocLinks.forEach(link => {
			const href = link.getAttribute('href'); // 获取 href 属性
			const sectionId = href.substring(1); // 去掉 # 得到 ID
			const section = document.getElementById(sectionId); // 根据 ID 获取元素
			if (section && section.offsetTop <= fromTop) {
				currentHeading = link;
			}
		});
	
		tocLinks.forEach(link => {
			link.classList.remove('toc-active');
		});
		if (currentHeading) {
			currentHeading.classList.add('toc-active');
			// 确保当前高亮的目录项在可视区域的中间
			currentHeading.scrollIntoView({
				block: 'center',   // 确保当前高亮项滚动到视图中间位置
				inline: 'nearest'  // 可选，保持水平滚动条不动
			});
		}
	}
	document.addEventListener('scroll', highlightTOC);
	////////// 创建滚动页面高亮菜单 end //////////

	////////// 创建返回顶部和返回底部按钮 start //////////
	const btnTop = document.createElement('button');
	btnTop.className = 'back-to-top';
	btnTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 14l8-8 8 8"/></svg>';
	document.body.appendChild(btnTop);

	const btnBot = document.createElement('button');
	btnBot.className = 'back-to-bot';
	btnBot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 10l8 8 8-8"/></svg>';
	document.body.appendChild(btnBot);

	btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
	});
	btnBot.addEventListener('click', () => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
	});

	function updateButtons() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            scrollTop > 100
                ? btnTop.classList.add('show')
                : btnTop.classList.remove('show');
            scrollTop + windowHeight < documentHeight - 100
                ? btnBot.classList.add('show')
                : btnBot.classList.remove('show');
	}
	window.addEventListener('scroll', updateButtons);
	window.addEventListener('resize', updateButtons);
	updateButtons();
	////////// 创建返回顶部和返回底部按钮 end //////////
});
