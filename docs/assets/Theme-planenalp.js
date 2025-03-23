//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

document.addEventListener('DOMContentLoaded', function() {    
    let currentUrl = window.location.pathname;
    //let currentHost = window.location.hostname;
    
    // ==================== 禁用自动主题功能 START ====================
    window.themeSettings = {
        "dark": ["dark","moon","#00f0ff","dark-blue"],
        "light": ["light","sun","#ff5000","github-light"]
    };

    window.modeSwitch = function() {
        const currentMode = document.documentElement.getAttribute('data-color-mode');
        const newMode = currentMode === "light" ? "dark" : "light";  // ← 确保只有light/dark
        localStorage.setItem("meek_theme", newMode);
        window.changeTheme(...themeSettings[newMode]);
    }

    // ===== 修改1：增强localStorage劫持 =====
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        if(key === "meek_theme") {
            const value = originalGetItem.call(localStorage, key);
            return (value === "auto" || value === null) ? "light" : value; // 处理null和auto
        }
        return originalGetItem.apply(localStorage, arguments);
    };

    // ===== 修改2：强化DOM监控 =====
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if(mutation.attributeName === "data-color-mode") {
                const mode = document.documentElement.getAttribute("data-color-mode");
                if(mode !== "light" && mode !== "dark") { // 禁止任何非标准值
                    document.documentElement.setAttribute("data-color-mode", "light");
                }
            }
        });
    }).observe(document.documentElement, { attributes: true });

    // ===== 修改3：双重初始化保障 =====
    (function initTheme() {
        let theme = localStorage.getItem("meek_theme") || "light"; // 强制默认值
        if(theme === "auto") theme = "light"; // 二次过滤
        document.documentElement.setAttribute("data-color-mode", theme);
        localStorage.setItem("meek_theme", theme);
    })();
    // ==================== 禁用自动主题功能 END ====================
    
    // ==================== 随机背景图 START ====================
    const bgSwitcher = (function() {
        const FORMAT_PRIORITY = ['webp', 'avif', 'heif', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];
        const MAX_PARALLEL = 3;
        let currentVersion = 0;
        const loadQueue = [];
        const formatCache = new Map();

        async function probeFormat(baseUrl) {
            if (formatCache.has(baseUrl)) {
                return formatCache.get(baseUrl);
            }

            const probes = FORMAT_PRIORITY.map(ext => {
                const url = `${baseUrl}.${ext}`;
                return new Promise(resolve => {
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            });

            for (const urlPromise of probes) {
                const result = await urlPromise;
                if (result) {
                    formatCache.set(baseUrl, result);
                    return result;
                }
            }
            return null;
        }

        async function createLoader(targetTheme, version) {
            const prefix = targetTheme === 'dark' ? 'bgDark' : 'bgLight';
            const totalImages = 10;
            const randomNum = Math.floor(Math.random() * totalImages) + 1;
            const baseUrl = `https://planenalp.github.io/bg/${prefix}${randomNum}`;

            try {
                const finalUrl = await probeFormat(baseUrl);
                if (!finalUrl || version !== currentVersion) return false;

                document.documentElement.style.setProperty('--bgURL', `url("${finalUrl}")`);
                return true;
            } catch {
                return false;
            }
        }

        async function processQueue() {
            while (loadQueue.length > 0 && loadQueue.length < MAX_PARALLEL) {
                const { targetTheme, version } = loadQueue.shift();
                if (version !== currentVersion) continue;

                const success = await createLoader(targetTheme, version);
                if (!success && version === currentVersion) {
                    loadQueue.push({ targetTheme, version });
                }
            }
        }

        return {
            switchTheme: function(targetTheme) {
                currentVersion++;
                loadQueue.push({ targetTheme, version: currentVersion });
                processQueue();
            }
        };
    })();

    // 主题监听模块 ==================================================
    let lastTheme = null;
    const observer = new MutationObserver(function(mutations) {
        const newTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        if (newTheme === lastTheme) return;
        
        lastTheme = newTheme;
        bgSwitcher.switchTheme(newTheme);
    });
    observer.observe(document.documentElement, { 
        attributes: true,
        attributeFilter: ['data-color-mode', 'data-light-theme', 'data-dark-theme']
    });
    // ==================== 随机背景图 END ====================

    
    
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
            --border-color: #d0d7de;
            --SideNav-bgColor: #f6f8facc; /* 白色背景，透明度80% */
            --SideNav-hover-bgColor: #002fa7; /* 文章标题高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --btn-hover-bgColor: #002fa7; /* 按钮高亮颜色 */
            --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            /* --bgURL: url("https://planenalp.github.io/bgDark.webp"); */
            --avatarURL: url("https://planenalp.github.io/avatar-white.svg");
            --body-bgColor: #0d1117b3; /* 黑色背景，透明度70% */
            --blogTitle-color: #ffffff;
            --subTitle-color: #ffffff;
            --border-color: #30363d;
            --SideNav-bgColor: #161b22cc; /* 黑色背景，透明度80% */
            --SideNav-hover-bgColor: #002fa7; /* 文章标题高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --btn-hover-bgColor: #002fa7; /* 按钮高亮颜色 */
            --box-shadow: 0 0 transparent; /* 添加阴影 */
        }

        /* 背景图 */
        html {    
            background: var(--bgURL) no-repeat center center fixed;
            background-size: cover;
            transition: background-image 0.15s linear !important;
        }

        /* 创建固定定位的伪元素作为背景层确保移动端背景固定 */
        html::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            background: var(--bgURL) no-repeat center center;
            background-size: cover;
            transition: background-image 0.15s linear;
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
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(1.02);
            box-shadow: var(--box-shadow);
            transition: 0.1s; /* 弹起动画时长 */
        }

        /* 主页文章列表点击缩放 */
        .SideNav-item:active {
            transform: scale(1.0);
        }

        /* 关闭标签和时间的圆角 */
        .Label, .label {
            border-radius: unset;
        }

        /* 右上角按钮触碰背景颜色 */
        .btn-invisible:hover {
            background-color: var(--btn-hover-bgColor);
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

        // ==================== 随机背景图初始主题同步 START ====================
        const initTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        bgSwitcher.switchTheme(initTheme);
        // ==================== 随机背景图初始主题同步 END ====================
    }


    //文章页主题------------------------------------------------------------------------------
    
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('文章页主题');

        let style = document.createElement("style");
        style.innerHTML = `

        /* 默认亮主题配色 */
        :root {
            --body-bgColor: #ffffffb3; /* 白色背景，透明度70% */
            --header-bgColor: #002fa7;
            --postTitle-color: #ffffff;
            --btn-hover-bgColor: #ffffff; /* 按钮高亮颜色 */
            --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --body-bgColor: #0d1117b3; /* 黑色背景，透明度70% */
            --header-bgColor: #002fa7;
            --postTitle-color: #ffffff;
            --btn-hover-bgColor: #30363d; /* 按钮高亮颜色 */
            --box-shadow: 0 0 transparent; /* 添加阴影 */
        }

        /* 背景图 */
        html {    
            background: var(--bgURL) no-repeat center center fixed;
            background-size: cover;
            transition: background-image 0.15s linear !important;
        }

        /* 创建固定定位的伪元素作为背景层确保移动端背景固定 */
        html::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            background: var(--bgURL) no-repeat center center;
            background-size: cover;
            transition: background-image 0.15s linear;
        }

        /* 主体布局 */
        body {
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
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
        
        /* 右上角按钮触碰背景颜色 */
        .btn-invisible:hover {
            background-color: var(--btn-hover-bgColor);
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

        // ==================== 随机背景图初始主题同步 START ====================
        const initTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        bgSwitcher.switchTheme(initTheme);
        // ==================== 随机背景图初始主题同步 END ====================
    } 


    // 搜索页主题--------------------------------------------------------------------
    
    else if (currentUrl.includes('/tag')) {
        console.log('应用搜索页主题');
        let style = document.createElement("style");
        style.innerHTML = `

        /* 默认亮主题配色 */
        :root {
            --body-bgColor: #ffffffb3; /* 白色背景，透明度70% */
            --header-bgColor: #002fa7;
            --tagTitle-color: #ffffff;
            --SideNav-bgColor: #f6f8facc; /* 白色背景，透明度80% */
            --SideNav-hover-bgColor: #002fa7; /* 文章标题高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --btn-hover-bgColor: #ffffff; /* 按钮高亮颜色 */
            --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
        }
        /* 暗主题配色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --body-bgColor: #0d1117b3; /* 黑色背景，透明度70% */
            --header-bgColor: #002fa7;
            --tagTitle-color: #ffffff;
            --SideNav-bgColor: #161b22cc; /* 黑色背景，透明度80% */
            --SideNav-hover-bgColor: #002fa7; /* 文章标题高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --btn-hover-bgColor: #30363d; /* 按钮高亮颜色 */
            --box-shadow: 0 0 transparent; /* 添加阴影 */
        }

        /* 背景图 */
        html {    
            background: var(--bgURL) no-repeat center center fixed;
            background-size: cover;
            transition: background-image 0.15s linear !important;
        }

        /* 创建固定定位的伪元素作为背景层确保移动端背景固定 */
        html::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            background: var(--bgURL) no-repeat center center;
            background-size: cover;
            transition: background-image 0.15s linear;
        }

        /* 主体布局 */
        body {
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
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

        /* 主页文章列表 */
        .SideNav {
            background: var(--SideNav-bgColor);
            min-width: unset;
        }

        /* 主页文章列表悬停高亮 */
        .SideNav-item:hover {
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(1.02);
            box-shadow: var(--box-shadow);
            transition: 0.1s; /* 弹起动画时长 */
        }

        /* 关闭标签和时间的圆角 */
        .Label, .label {
            border-radius: unset;
        }

        #content > nav > a:nth-child(1) > div.listLabels > span.Label.LabelName {
            background-color: transparent;
        }

        #content > nav > a:nth-child(1) > div.listLabels > span.Label.LabelTime {
            background-color: transparent;
        }

        /* 右上角按钮触碰背景颜色 */
        .btn-invisible:hover {
            background-color: var(--btn-hover-bgColor);
        }

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            /* 回归禁用 tagTitle
            .tagTitle {
                display: unset !important;
                font-size: 14px !important;
            }
            回归禁用 tagTitle */
            .LabelTime{
                display:unset !important;
            }
            .LabelName{
                display:none !important;
            }
        }
        
        `;
        document.head.appendChild(style);

        // ==================== 随机背景图初始主题同步 START ====================
        const initTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        bgSwitcher.switchTheme(initTheme);
        // ==================== 随机背景图初始主题同步 END ====================
    }
})
