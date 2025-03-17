//包含懒加载的主题

document.addEventListener('DOMContentLoaded', function() {
    
    	//////////////// 懒加载图片 start ////////////////
	const ob = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				const imgContainer = img.previousElementSibling;
				const handleError = (isError = false) => {
					if (imgContainer && imgContainer.classList.contains('ImgLazyLoad-circle')) {
						imgContainer.style.display = 'none';
					}
					if (isError) {
						const errorContainer = document.createElement('div');
						errorContainer.classList.add('Imgerror-container');
						errorContainer.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" style="height:60px;" class="Imgerror" viewBox="0 0 1024 1024"><path fill="#ff5b5b" d="M320 896h-77.833L515.92 622.253a21.333 21.333 0 0 0 3.16-26.133l-89.427-149.053 165.427-330.86A21.333 21.333 0 0 0 576 85.333H96a53.393 53.393 0 0 0-53.333 53.334v746.666A53.393 53.393 0 0 0 96 938.667h224A21.333 21.333 0 0 0 320 896zM96 128h445.48L386.253 438.46a21.333 21.333 0 0 0 .787 20.513L474 603.86l-69.333 69.333-89.62-89.653a53.333 53.333 0 0 0-75.427 0L85.333 737.827v-599.16A10.667 10.667 0 0 1 96 128zM85.333 885.333v-87.166l184.46-184.454a10.667 10.667 0 0 1 15.08 0l89.627 89.62L181.833 896H96a10.667 10.667 0 0 1-10.667-10.667zm192-458.666C336.147 426.667 384 378.813 384 320s-47.853-106.667-106.667-106.667S170.667 261.187 170.667 320s47.853 106.667 106.666 106.667zm0-170.667a64 64 0 1 1-64 64 64.073 64.073 0 0 1 64-64zM928 128H661.333a21.333 21.333 0 0 0-19.08 11.793l-.046.087c-.04.087-.087.173-.127.253L535.587 353.127a21.333 21.333 0 1 0 38.16 19.08l100.773-201.54H928a10.667 10.667 0 0 1 10.667 10.666V652.5L783.713 497.54a53.333 53.333 0 0 0-75.426 0L571.08 634.747a21.333 21.333 0 0 0-3.153 26.153l24.666 41.08-203.646 244.36a21.333 21.333 0 0 0 16.386 34.993H928A53.393 53.393 0 0 0 981.333 928V181.333A53.393 53.393 0 0 0 928 128zm0 810.667H450.88L635.053 717.66a21.333 21.333 0 0 0 1.907-24.667l-23.933-39.886L738.46 527.68a10.667 10.667 0 0 1 15.08 0l185.127 185.153V928A10.667 10.667 0 0 1 928 938.667z"/></svg><p class="Imgerror-message">图片错误</p>`;
						img.parentNode.insertBefore(errorContainer, img.nextSibling);
						img.style.display = 'none';
					} else {
						img.classList.remove('ImgLazyLoad-circle');
						img.classList.add('ImgLoaded');
					}
				};

				img.src = img.getAttribute('img-src');
				ob.unobserve(img);

				img.onload = () => handleError(false);
				img.onerror = () => handleError(true);
			}
		});
	}, {
		rootMargin: '0px 0px 500px 0px',
	});

	document.querySelectorAll('[img-src]').forEach(img => ob.observe(img));
	//////////////// 懒加载图片 end ////////////////

	//////////////// 引入fancybox所需的css文件以及所需的绑定函数 start ////////////////
	document.head.appendChild(Object.assign(document.createElement('link'), {
		rel: 'stylesheet',
		href: 'https://testingcf.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css'
	}));
	Fancybox.bind('[data-fancybox="gallery"]', {});
	//////////////// 引入fancybox所需的css文件以及所需的绑定函数 end ////////////////
    
    let currentUrl = window.location.pathname;
    //let currentHost = window.location.hostname;

    // 主页主题------------------------------------------------------------------------------
    if (currentUrl == '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('应用主页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        /* header布局 */
        #header {
            height: 175px;
            position: relative;
            background-color: #002FA7B3;
            border-bottom: unset;
            margin-bottom: unset;
        }
        #header h1 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        /* avatar尺寸 */
        .avatar {
            width: 100px;
            height: 100px;
            transition: 0.1s;
            object-fit: unset;
            background-color: transparent;
            border-radius: unset !important;
            box-shadow: none;
        }
        .avatar:hover {
            transform: scale(1.1) !important;
        }
        .avatar:active {
            transform: scale(0.9) !important;
        }
        #header h1 a {
            margin-left: unset;
            font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
        }
        .blogTitle {
            display: unset;
        }
        /* 自定义按钮 */
        .title-right {
            margin: unset;
            margin-top: 200px;
            margin-left: 50%;
            transform: translateX(-50%);
            position: absolute;
        }
        /* 副标题居中+移位 */
        #content > div {
            margin-bottom: unset !important;
            text-align: center;
            background-color: #002FA7B3;
            height: 75px;
        }
        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .blogTitle {
                display: unset !important;
            }
            #buttonRSS {
                display: unset !important;
            }
            .LabelTime {
                display: unset !important;
            }
            .LabelName {
                display: none !important;
            }
        }
        `;
        document.head.appendChild(style);
    }

    // 文章页主题------------------------------------------------------------------------------
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('文章页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        /* 顶栏改色 */
        #header {
            background-color: #002FA7B3;
            padding-bottom: unset;
            border-bottom: unset;
        }
        /* 顶栏字体缩进5px */
        .postTitle {
            margin-left: 5px;
        }
        /* 文章字体缩进5px */
        #postBody {
            margin: 5px;
        }
        /* 重新定义 max-width: 768px 参数下的值 */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .postTitle {
                font-size: 24px !important;
            }
        }
        `;
        document.head.appendChild(style);

        // 图片插入处理：转换符合特定格式的图片标签为延迟加载格式
        let postBodyElement = document.getElementById('postBody');
        if (postBodyElement) {
            let post_body = postBodyElement.innerHTML;

            // 默认情况插入图片的匹配规则：<p> -> <a> -> <img>
            if (post_body.indexOf('<p><a target="_blank" rel=') !== -1) {
                post_body = post_body.replace(
                    /<p>\s*<a[^>]*?href="([^"]+)"[^>]*?><img[^>]*?src="\1"[^>]*?><\/a>\s*<\/p>/gs,
                    function(match, p1) {
                        return '<div class="ImgLazyLoad-circle"></div>\n<img data-fancybox="gallery" img-src="' + p1 + '">';
                    }
                );
            }

            // 通用插入图片的匹配规则：<a> -> <img>
            if (post_body.indexOf('<a target="_blank" rel=') !== -1) {
                post_body = post_body.replace(
                    /<a[^>]*?href="([^"]+)"[^>]*?><img[^>]*?src="\1"[^>]*?><\/a>/gs,
                    function(match, p1) {
                        return '<div class="ImgLazyLoad-circle"></div>\n<img data-fancybox="gallery" img-src="' + p1 + '">';
                    }
                );
            }
            postBodyElement.innerHTML = post_body;
        }
    } 

    // 搜索页主题--------------------------------------------------------------------
    else if (currentUrl.includes('/tag')) {
        console.log('应用搜索页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        /* 顶栏改色 */
        #header {
            background-color: #002FA7B3;
            padding-bottom: unset;
            border-bottom: unset;
        }
        /* 顶栏字体缩进5px */
        .tagTitle {
            margin-left: 5px;
        }
        /* 搜索布局 */
        .subnav-search {
            width: 230px;
        }
        /* 重新定义 max-width: 768px 参数下的值 */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .tagTitle {
                display: unset !important;
                font-size: 14px !important;
            }
            .LabelTime {
                display: unset !important;
            }
            .LabelName {
                display: none !important;
            }
        }
        `;
        document.head.appendChild(style);
    }
});
