//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

//执行指定的回调函数
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
    const bgManager = (function() {
        const STORAGE_KEY = "bg_state";
        const BG_PREFIX = "https://planenalp.github.io/bg/";
        const FORMATS = ['webp', 'avif', 'heif', 'png', 'jpg'];
        
        let currentLoadID = 0;
        const formatCache = new Map();

        // 状态存取
        function getBgState() {
            try {
                const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (state?.url && state?.theme) return state;
            } catch(e) { /* 忽略解析错误 */ }
            return null;
        }

        function saveBgState(url, theme) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                url, 
                theme,
                timestamp: Date.now()
            }));
        }

        // 格式探测
        async function detectFormat(base) {
            if (formatCache.has(base)) return formatCache.get(base);

            for (const ext of FORMATS) {
                const url = `${base}.${ext}`;
                if (await testImage(url)) {
                    formatCache.set(base, url);
                    return url;
                }
            }
            return null;
        }

        function testImage(url) {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        }

        // 核心加载逻辑
        async function loadBackground(theme, forceUpdate) {
            const loadID = ++currentLoadID;
            const currentState = getBgState();

            // 使用缓存条件验证
            if (!forceUpdate && currentState?.theme === theme) {
                applyBackground(currentState.url);
                return;
            }

            // 生成新背景
            const typePrefix = theme === "dark" ? "bgDark" : "bgLight";
            const randomNum = Math.floor(Math.random() * 10) + 1;
            const baseURL = `${BG_PREFIX}${typePrefix}${randomNum}`;

            try {
                const finalURL = await detectFormat(baseURL);
                if (loadID !== currentLoadID) return; // 防止过期加载

                if (finalURL) {
                    applyBackground(finalURL);
                    saveBgState(finalURL, theme);
                }
            } catch (e) {
                console.error("背景加载失败:", e);
            }
        }

        function applyBackground(url) {
            document.documentElement.style.setProperty("--bgURL", `url("${url}")`);
        }

        return {
            updateTheme: function(newTheme, force = false) {
                loadBackground(newTheme, force);
            }
        };
    })();

    // 主题变更监听
    const themeObserver = new MutationObserver((_, obs) => {
        const theme = document.documentElement.dataset.colorMode || "light";
        bgManager.updateTheme(theme, true); // 主题变化强制刷新
    });
    themeObserver.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ["data-color-mode"] 
    });
    // ==================== 初始化流程 ====================
    (function mainInit() {
        injectStyles();
        
        // 首次加载逻辑
        const initialTheme = document.documentElement.dataset.colorMode;
        if (isHomePage) {
            document.documentElement.classList.add("home-theme");
            const isFirstVisit = !sessionStorage.getItem("homeVisit");
            bgManager.updateTheme(initialTheme, isFirstVisit);
            sessionStorage.setItem("homeVisit", "true");
        } else {
            bgManager.updateTheme(initialTheme);
        }
    })();
    // ==================== 随机背景图 END ====================

    // ==================== 全局CSS变量定义 START ====================
    const globalStyle = document.createElement('style');
    globalStyle.innerHTML = `
    /* 通用默认亮主题配色 */
    :root {
        /* --bgURL: url("https://planenalp.github.io/bgLight.webp"); */
        --avatarURL: url("https://planenalp.github.io/avatar-blue.svg");
        --body-bgColor: #ffffffb3;
        --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        --header-bgColor: #002fa7;
        --blogTitle-color: #002fa7;
        --subTitle-color: #002fa7;
        --postTitle-color: #002fa7;
        --tagTitle-color: #ffffff;
        --border-color: #d0d7de;
        --SideNav-bgColor: #f6f8facc;
        --SideNav-hover-bgColor: #002fa7;
        --text-hover-color: #ffffff;
        --themeSwitch-color: #656d76;
    }
    /* 通用暗主题配色 */
    [data-color-mode=light][data-light-theme=dark],
    [data-color-mode=light][data-light-theme=dark]::selection,
    [data-color-mode=dark][data-dark-theme=dark],
    [data-color-mode=dark][data-dark-theme=dark]::selection {
        /* --bgURL: url("https://planenalp.github.io/bgDark.webp"); */
        --avatarURL: url("https://planenalp.github.io/avatar-white.svg");
        --body-bgColor: #0d1117b3;
        --box-shadow: 0 0 transparent;
        --header-bgColor: #002fa7;
        --blogTitle-color: #ffffff;
        --subTitle-color: #ffffff;
        --postTitle-color: #ffffff;
        --tagTitle-color: #ffffff;
        --border-color: #30363d;
        --SideNav-bgColor: #161b22cc;
        --SideNav-hover-bgColor: #002fa7;
        --text-hover-color: #ffffff;
        --themeSwitch-color: #7d8590;
    }

    /* 主页主题 */
    .home-theme {
        --btn-hover-bgColor: #002fa7;
    }
    [data-color-mode=dark].home-theme,
    [data-light-theme=dark].home-theme {
        --btn-hover-bgColor: #002fa7;
    }

    /* 文章页主题 */
    .post-theme {
        --btn-hover-bgColor: #002fa7; /* 按钮高亮颜色 */
    }
    [data-color-mode=dark].post-theme,
    [data-light-theme=dark].post-theme {
        --btn-hover-bgColor: #002fa7; /* 按钮高亮颜色 */
    }
    
    /* 搜索页主题 */
    .search-theme {
        --btn-hover-bgColor: #ffffff; /* 按钮高亮颜色 */
    }
    [data-color-mode=dark].search-theme,
    [data-light-theme=dark].search-theme {
        --btn-hover-bgColor: #ffffff; /* 按钮高亮颜色 */
    }
     */

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
    `;
    document.head.appendChild(globalStyle);
    // ==================== 全局CSS变量定义 END ====================

    
    //主页主题------------------------------------------------------------------------------
    if (currentUrl == '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('应用主页主题');
        document.documentElement.classList.add('home-theme');
        const style = document.createElement("style");
        style.innerHTML = `

        /* 主体布局 */
        body {
            max-width: 1000px;
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
        }
        
        /* header布局 */
        #header {
            height: 165px;
            position: relative; /* 父元素 #header 设置定位 */
            border-bottom: unset;
            margin-bottom: unset;
        }

        #header h1 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 10px;
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

        /* 副标题居中+移位 */
        #content > div {
            margin-bottom: unset !important;
            text-align: center;  /* 子元素（副标题）水平居中 */
            height: 75px;
            color: var(--subTitle-color);
        }

        /* 按钮位置 */
        .title-right {
            margin: unset; /* 重置原参数 */
            margin-top: 190px; /* 用百分比会崩 */
            margin-left: 50%;
            transform: translateX(-50%);
            position: absolute;
        }

        /* 按钮悬停色 */
         .btn:hover {
            background-color: var(--btn-hover-bgColor);
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
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
        document.documentElement.classList.add('post-theme');
        const style = document.createElement("style");
        style.innerHTML = `

        /* 主体布局 */
        body {
            max-width: 1000px;
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
        }
        
        /* 顶栏改色 */
        #header {
            display: flex; /* header 居中 */
            flex-direction: column; /* header 居中 */
            align-items: center; /* header 居中 */
            padding-bottom: unset;
        }

        /* 顶栏字体颜色 */
        .postTitle {
            color: var(--postTitle-color);
        }

        /* 按钮组件 */
        .title-right {
            margin: unset; /* header 居中 */
        }

        /* 按钮右间隔去除 */
        .title-right .circle {
            margin-right: unset; /* header 居中 */
        }
        
        /* 按钮悬停色 */
        .btn-invisible:hover {
            background-color: var(--btn-hover-bgColor);
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
        }

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .postTitle{
                font-size: 24px !important; /* header 居中 */
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
        document.documentElement.classList.add('search-theme');
        const style = document.createElement("style");
        style.innerHTML = `

        /* 主体布局 */
        body {
            max-width: 1000px;
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
        }
        
        /* 顶栏改色 */
        #header {
            height: 140px; /* header 居中 */
            display: flex; /* header 居中 */
            flex-direction: column; /* header 居中 */
            align-items: center; /* header 居中 */
            background-color: var(--header-bgColor);
            padding-bottom: unset;
            border-bottom: unset;
        }

        /* 顶栏字体颜色 */
        .tagTitle {
            color: var(--tagTitle-color);
        }

        /* 搜索+按钮区域 */
        .title-right {
            margin: unset; /* header 居中 */
            display: flex; /* header 居中 */
            flex-wrap: wrap; /* header 居中 */
            justify-content: center; /* header 居中 */
        }
        
        /* 搜索布局 */
        .subnav-search {
            width: 100%; /* header 居中 */
            margin-top: unset; /* header 居中 */
            margin-left: unset; /* header 居中 */
            margin-right: unset; /* header 居中 */
            display: flex; /* header 居中 */
            justify-content: center; /* header 居中 */
        }

        /* 搜索输入框布局 */
        .subnav-search-input {
            width: 100%; /* header 居中 */
        }

        /* 按钮取消右间隔 */
        .title-right .circle {
            margin-right: unset; /* header 居中 */
        }
        
        /* 按钮悬停色 */
        .btn-invisible:hover {
            background-color: var(--btn-hover-bgColor);
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
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

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            #header {
            height: 130px; /* header 居中 */
            }
            .tagTitle {
                display: unset !important;
                font-size: 20px !important; /* header 居中 */
            }
            .LabelTime{
                display: unset !important;
            }
            .LabelName{
                display: none !important;
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
