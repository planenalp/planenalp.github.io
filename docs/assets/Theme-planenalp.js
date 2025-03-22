//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

document.addEventListener('DOMContentLoaded', function() {    
    let currentUrl = window.location.pathname;
    //let currentHost = window.location.hostname;

    ////////// 根据主题分别从 bgLight123 和 bgDark123 各三张中随机展示背景图片 start //////////
    // 新增：随机背景函数 ------------------------------------------
    function updateRandomBackground() {
        const colorMode = document.documentElement.getAttribute('data-color-mode') || 'light';
        const prefix = colorMode === 'dark' ? 'bgLight' : 'bgDark'; // 新逻辑：亮主题使用 bgDark，暗主题使用 bgLight，此行实现反向选择
        //const prefix = colorMode === 'dark' ? 'bgDark' : 'bgLight'; // 原逻辑：亮主题使用 bgLight，暗主题使用 bgDark
        const totalImages = 3; // 根据实际图片数量修改
        
        const randomNum = Math.floor(Math.random() * totalImages) + 1;
        const bgUrl = `url("https://planenalp.github.io/${prefix}${randomNum}.webp")`;
        
        document.documentElement.style.setProperty('--bgURL', bgUrl);
    }

    // 新增：主题变化监听 ------------------------------------------
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-color-mode' || 
                mutation.attributeName === 'data-light-theme') {
                updateRandomBackground();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    ////////// 根据主题分别从 bgLight123 和 bgDark123 各三张中随机展示背景图片 end //////////
    
    //主页主题------------------------------------------------------------------------------
    if (currentUrl == '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('应用主页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        
        /* 默认亮主题配色 */
        :root {
            /* --bgURL: url("https://planenalp.github.io/bgLight.webp"); */
            --avatarURL: url("https://planenalp.github.io/avatar-blue.svg");
            --body-bgColor: #ffffffb3; /* 白色背景，透明度70% */
            --blogTitle-color: #002fa7;
            --subTitle-color: #002fa7;
            --SideNav-bgColor: #ffffffcc; /* 白色背景，透明度80% */
            --btnSideNav-hover-bgColor: #002fa7; /* 高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            /* --bgURL: url("https://planenalp.github.io/bgDark.webp"); */
            --avatarURL: url("https://planenalp.github.io/avatar-white.svg");
            --body-bgColor: #21262db3; /* 黑色背景，透明度70% */
            --blogTitle-color: #ffffff;
            --subTitle-color: #ffffff;
            --SideNav-bgColor: #21262dcc; /* 黑色背景，透明度80% */
            --btnSideNav-hover-bgColor: #002fa7; /* 高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --box-shadow: 0 0 transparent; /* 添加阴影 */
        }

        /* 背景图 */
        html {    
            background: url('https://godpan.com/bg.webp') no-repeat center center fixed;
            background-size: cover;
        }

        /* 主体布局 */
        body {
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
        }
        
        /* header布局 */
        #header {
            height: 175px;
            position: relative; /* 父元素 #header 设置定位 */
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
        /* 若保留圆形实心旋转 Avatar 效果就仅保留 .avatar 及 width + height 参数，其余参数和 #avatarImg 和 .avatar:hover 和 .avatar:active 删除 */
        #avatarImg {
            content: var(--avatarURL) !important;
        }
        
        .avatar {
            width: 100px;
            height: 100px;
            transition: 0.1s !important; /* 强制指定动画时长 */
            object-fit: unset !important; /* 强制清除自动缩放 */
            background-color: transparent !important; /* 强制清除背景颜色 */
            border-radius: unset !important; /* 强制清除圆形框设置 */
            box-shadow: none !important; /* 强制清除边框 */
        }

        .avatar:hover {
            transform: scale(1.1) !important;
        }

        .avatar:active {
            transform: scale(0.9) !important;
        }

        #header h1 a {
            margin-left: unset; /* 无Avatar状态去除左侧间隔保证标题居中 */
            font-family:
                "PingFang SC",     /* 苹方（macOS/iOS） */
                "Microsoft YaHei", /* 微软雅黑（Windows） */
                "Noto Sans SC",    /* 思源黑体（Linux/Android） */
                sans-serif;        /* 最终回退到无衬线字体 */
            color: var(--blogTitle-color);
        }

        .blogTitle {
            display: unset; /* 重置属性取消默认屏幕过窄自动隐藏标题 */
        }

        /* 自定义按钮 */
        .title-right {
            margin: unset; /* 重置原参数 */
            margin-top: 200px; /* 用百分比会崩 */
            margin-left: 50%;
            transform: translateX(-50%);
            position: absolute;
        }

        /* 副标题居中+移位 */
        #content > div {
            margin-bottom: unset !important;
            text-align: center;  /* 子元素（副标题）水平居中 */
            height: 75px;
            color: var(--subTitle-color);
        }

        /* 主页文章列表 */
        .SideNav {
            background: var(--SideNav-bgColor);
            min-width: unset;
        }

        /* 主页文章列表悬停高亮 */
        .SideNav-item:hover {
            background-color: var(--btnSideNav-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(1.01);
            box-shadow: var(--box-shadow);
            transition: 0.1s; /* 弹起动画时长 */
        }

        .SideNav-item:active {
            transform: scale(1.0);
        }

        /* 右上角按钮触碰背景颜色 */
        .btn-invisible:hover {
            background-color: var(--btnSideNav-hover-bgColor);
        }
        
        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .avatar {
                width:100px !important;
                height:100px !important;
            }
            .blogTitle{
                display:unset !important;
                }
            #buttonRSS{
                display:unset !important;
            }
            .LabelTime{
                display:unset !important;
            }
            .LabelName{
                display:none !important;
            }
        }

        `;
        document.head.appendChild(style);
        
        ////////// 根据主题分别从 bgLight123 和 bgDark123 各三张中随机展示背景图片 start //////////
        // 新增：初始化随机背景
        updateRandomBackground();
        ////////// 根据主题分别从 bgLight123 和 bgDark123 各三张中随机展示背景图片 end //////////
    }


    //文章页主题------------------------------------------------------------------------------
    
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('文章页主题');

        let style = document.createElement("style");
        style.innerHTML = `

        /* 默认亮主题配色 */
        :root {
            --header-bgColor: #002FA7;
            --postTitle-color: #FFFFFF;
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --header-bgColor: #002FA7;
            --postTitle-color: #FFFFFF;
        }

        /* 背景图 */
        html {    
            background: url('https://planenalp.github.io/bg.webp') no-repeat center center fixed;
            background-size: cover;
        }
        
        /* 顶栏改色 */
        #header {
            background-color: var(--header-bgColor);
            padding-bottom: unset;
            border-bottom: unset;
        }

        /* 顶栏字体缩进5px */
        .postTitle {
            margin-left: 5px;
            color: var(--postTitle-color);
        }

        /* 文章字体缩进5px */
        #postBody {
            margin: 5px;
        }

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .postTitle{
                font-size:24px !important;
            }
        }

        `;
        document.head.appendChild(style);
    } 


    // 搜索页主题--------------------------------------------------------------------
    
    else if (currentUrl.includes('/tag')) {
        console.log('应用搜索页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        
        /* 默认亮主题配色 */
        :root {
            --header-bgColor: #002FA7;
            --tagTitle-color: #FFFFFF;
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --header-bgColor: #002FA7;
            --tagTitle-color: #FFFFFF;
        }

        /* 背景图 */
        html {    
            background: url('https://planenalp.github.io/bg.webp') no-repeat center center fixed;
            background-size: cover;
        }
        
        /* 顶栏改色 */
        #header {
            background-color: var(--header-bgColor);
            padding-bottom: unset;
            border-bottom: unset;
        }

        /* 顶栏字体缩进5px */
        .tagTitle {
            margin-left: 5px;
            color: var(--tagTitle-color);
        }
        
        /* 搜索布局 */
        .subnav-search {
            width: 230px; 
        }

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .tagTitle {
                display: unset !important;
                font-size: 14px !important;
            }
            .LabelTime{
                display:unset !important;
            }
            .LabelName{
                display:none !important;
            }
        }
        
        `;
        document.head.appendChild(style);
    }
})
