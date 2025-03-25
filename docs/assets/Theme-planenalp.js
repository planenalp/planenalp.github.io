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
    const bgSwitcher = (function() {
        // 新增：背景状态存储键名
        const BG_STORAGE_KEY = 'meek_bg_state';
        const FORMAT_PRIORITY = ['webp', 'avif', 'heif', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];
        const MAX_PARALLEL = 3;
        let currentVersion = 0;
        const loadQueue = [];
        const formatCache = new Map();

        // 新增：获取存储的背景状态
        function getStoredBg() {
            try {
                const stored = JSON.parse(localStorage.getItem(BG_STORAGE_KEY));
                if (stored && stored.url && stored.theme) {
                    return stored;
                }
            } catch(e) {
                console.warn('Failed to parse background state:', e);
            }
            return null;
        }

        // 新增：存储背景状态
        function storeBgState(url, theme) {
            localStorage.setItem(BG_STORAGE_KEY, JSON.stringify({
                url: url,
                theme: theme,
                timestamp: Date.now()
            }));
        }

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

        // 修改：增加主题匹配检查
        async function createLoader(targetTheme, version) {
            const stored = getStoredBg();
            
            // 如果已有缓存且主题匹配，直接应用
            if (stored && stored.theme === targetTheme) {
                document.documentElement.style.setProperty('--bgURL', `url("${stored.url}")`);
                return true;
            }

            const prefix = targetTheme === 'dark' ? 'bgDark' : 'bgLight';
            const totalImages = 10;
            const randomNum = Math.floor(Math.random() * totalImages) + 1;
            const baseUrl = `https://planenalp.github.io/bg/${prefix}${randomNum}`;

            try {
                const finalUrl = await probeFormat(baseUrl);
                if (!finalUrl || version !== currentVersion) return false;

                document.documentElement.style.setProperty('--bgURL', `url("${finalUrl}")`);
                storeBgState(finalUrl, targetTheme); // 存储新背景
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
            switchTheme: function(targetTheme, forceRefresh = false) {
                const stored = getStoredBg();
                
                // 强制刷新或主题不匹配时才加载新背景
                if (forceRefresh || !stored || stored.theme !== targetTheme) {
                    currentVersion++;
                    loadQueue.push({ targetTheme, version: currentVersion });
                    processQueue();
                } else {
                    // 直接应用缓存背景
                    document.documentElement.style.setProperty('--bgURL', `url("${stored.url}")`);
                }
            }
        };
    })();

    // 主题监听模块 ==================================================
    let lastTheme = null;
    const observer = new MutationObserver(function(mutations) {
        const newTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        if (newTheme === lastTheme) return;
        
        lastTheme = newTheme;
        // 新增：主题切换时强制刷新背景
        bgSwitcher.switchTheme(newTheme, true);
    });
    observer.observe(document.documentElement, { 
        attributes: true,
        attributeFilter: ['data-color-mode', 'data-light-theme', 'data-dark-theme']
    });

    // 新增：判断是否首页首次加载
    let isInitialHomeLoad = (
        (currentUrl === '/' || 
        currentUrl.includes('/index.html') || 
        currentUrl.includes('/page')) && 
        !sessionStorage.getItem('homeVisited')
    );
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

        /* 文章列表主体 */
        .SideNav {
            background: var(--SideNav-bgColor);
            min-width: unset;
        }

        /* 文章列表悬停高亮 */
        .SideNav-item:hover {
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(1.02);
            box-shadow: var(--box-shadow);
            transition: 0.1s; /* 弹起动画时长 */
        }

        /* 文章列表点击缩放 */
        .SideNav-item:active {
            transform: scale(1.0);
        }

        /* 文章列表单项整栏 */
        .SideNav-item {
            display: flex; /* 文章列表靠左双行 */
            flex-direction: column; /* 文章列表靠左双行 */
            padding: 10px 10px !important; /* 减少多余间隔 */
        }

        /* 文章列表首行 .SideNav-icon + .listTitle */
        .d-flex {
            display: flex !important; /* 文章列表靠左双行 */
            width: 100%; /* 文章列表靠左双行 */
            padding-bottom: 5px; /* 底部留 5px 间隔 */
        }

        .SideNav-icon {
            margin-right: 10px !important; /* 减少多余间距 */ 
            flex-shrink: 0; /* 文章列表靠左双行，禁止图标压缩导致间距消失 */
        }

        .listTitle {
            white-space: unset; /* 解锁换行 */
        }

        /* 文章列表第二行 .LabelTime + .LabelName */
        .listLabels {
            width: 100%; /* 文章列表靠左双行 */
            display: flex !important; /* 文章列表靠左双行 */
            flex-wrap: wrap; /* 解锁 Label 自动换行 */
        }

        .LabelTime {
            order: 1; /* 调整两种 Label 顺序 */
        }
        .LabelName {
            order: 2; /* 调整两种 Label 顺序 */
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
            #header {
                height: 145px; /* 标题缩小 */
                padding-bottom: unset; /* 标题缩小 */
            }

            #header h1 a {
                font-size: 25px; /* 标题缩小 */
            }

            .title-right {
                margin-top: 170px; /* 标题缩小 */
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
                display:unset !important; /* 文章列表靠左双行 */
            }
        }

        `;
        document.head.appendChild(style);

        // ==================== 随机背景图初始主题同步 START ====================
        // 修改：只有首次加载或强制刷新时才切换背景
        const initTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        bgSwitcher.switchTheme(initTheme, isInitialHomeLoad);
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
        // 修改：直接应用存储的背景
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
            background: var(--body-bgColor);
            box-shadow: var(--box-shadow);
        }
        
        /* 顶栏改色 */
        #header {
            display: flex; /* header 居中 */
            flex-direction: column; /* header 居中 */
            align-items: center; /* header 居中 */
            background-color: var(--header-bgColor);
            padding: 5px;
            padding-bottom: unset;
            border-bottom: unset;
        }
        
        .tagTitle {
            color: var(--tagTitle-color); /* 顶栏字体颜色 */
            white-space: unset; /* 顶栏字体允许自动换行 */
            padding-bottom: 5px; /* 和搜索栏间隔5px */
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

        /* 文章列表主体 */
        .SideNav {
            background: var(--SideNav-bgColor);
            min-width: unset;
        }

        /* 文章列表悬停高亮 */
        .SideNav-item:hover {
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(1.02);
            box-shadow: var(--box-shadow);
            transition: 0.1s; /* 弹起动画时长 */
        }

        /* 文章列表点击缩放 */
        .SideNav-item:active {
            transform: scale(1.0);
        }

        /* 文章列表单项整栏 */
        .SideNav-item {
            display: flex; /* 文章列表靠左双行 */
            flex-direction: column; /* 文章列表靠左双行 */
            padding: 10px 10px !important; /* 减少多余间隔 */
        }

        /* 文章列表首行 .SideNav-icon + .listTitle */
        .d-flex {
            display: flex !important; /* 文章列表靠左双行 */
            width: 100%; /* 文章列表靠左双行 */
            padding-bottom: 5px; /* 底部留 5px 间隔 */
        }

        .SideNav-icon {
            margin-right: 10px !important; /* 减少多余间距 */ 
            flex-shrink: 0; /* 文章列表靠左双行，禁止图标压缩导致间距消失 */
        }

        .listTitle {
            white-space: unset; /* 解锁换行 */
        }

        /* 文章列表第二行 .LabelTime + .LabelName */
        .listLabels {
            width: 100%; /* 文章列表靠左双行 */
            display: flex !important; /* 文章列表靠左双行 */
            flex-wrap: wrap; /* 解锁 Label 自动换行 */
        }

        .LabelTime {
            order: 1; /* 调整两种 Label 顺序 */
        }
        .LabelName {
            order: 2; /* 调整两种 Label 顺序 */
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
            .tagTitle {
                display: unset !important;
                font-size: 20px !important; /* header 居中 */
            }
            .LabelTime{
                display: unset !important;
            }
            .LabelName{
                display: unset !important;
            }
        }
        
        `;
        document.head.appendChild(style);

        // ==================== 随机背景图初始主题同步 START ====================
        // 修改：直接应用存储的背景
        const initTheme = document.documentElement.getAttribute('data-color-mode') || 'light';
        bgSwitcher.switchTheme(initTheme);
        // ==================== 随机背景图初始主题同步 END ====================
    }
})
