document.addEventListener('DOMContentLoaded', function() {    
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
