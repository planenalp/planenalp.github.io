//允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, false);

document.addEventListener('DOMContentLoaded', function() {    
    let currentUrl = window.location.pathname;
    //let currentHost = window.location.hostname;

    ////////// 随机背景核心逻辑 start //////////
    // ================= 全局配置 =================
    const config = {
        themes: {
            light: { prefix: 'bgLight' },
            dark:  { prefix: 'bgDark' }
        },
        formats: ['webp', 'jpg', 'jpeg', 'png', 'avif', 'gif'],
        detection: {
            maxNumber: 100,
            timeout: 800,
            retryFormats: 3
        },
        preload: {
            count: 2,
            maxParallel: 4
        },
        baseUrl: 'https://planenalp.github.io/'
    };

    // ================= 状态管理 =================
    let themeCache = new Map();
    let preloadQueue = new Set();
    let currentPreview = null;

    // ================= 核心函数 =================
    async function updateRandomBackground() {
        try {
            const theme = getCurrentTheme();
            const themeInfo = await getThemeInfo(theme.prefix);
            
            if (!themeInfo.valid) throw new Error('无可用图片');
            
            const { path, number } = await generateRandomImage(themeInfo);
            
            document.documentElement.style.setProperty('--bgURL', `url("${config.baseUrl}${path}")`);
            
            currentPreview = { 
                prefix: theme.prefix,
                number,
                maxNumber: themeInfo.maxNumber
            };
            
            schedulePreload();

        } catch (error) {
            console.error('背景加载失败:', error);
            document.documentElement.style.setProperty('--bgURL', 'url("fallback.webp")');
        }
    }

    async function getThemeInfo(prefix) {
        if (themeCache.has(prefix)) {
            return themeCache.get(prefix);
        }

        let low = 1, high = config.detection.maxNumber;
        let maxFound = 0;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const exists = await checkExists(prefix, mid);
            if (exists) {
                maxFound = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        const info = {
            valid: maxFound > 0,
            maxNumber: maxFound,
            prefix
        };
        themeCache.set(prefix, info);
        return info;
    }

    async function checkExists(prefix, number, format) {
        const url = `${config.baseUrl}${prefix}${number}.${format}`;
        try {
            return await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
                setTimeout(() => resolve(false), config.detection.timeout);
            });
        } catch {
            return false;
        }
    }

    // ================= 辅助函数 =================
    function getCurrentTheme() {
        const colorMode = document.documentElement.getAttribute('data-color-mode') || 'light';
        return config.themes[colorMode] || config.themes.light;
    }

    async function generateRandomImage(themeInfo) {
        const randomNumber = Math.floor(Math.random() * themeInfo.maxNumber) + 1;
        const shuffledFormats = shuffleArray([...config.formats]);
        
        for (const format of shuffledFormats.slice(0, config.detection.retryFormats)) {
            if (await checkExists(themeInfo.prefix, randomNumber, format)) {
                return { 
                    path: `${themeInfo.prefix}${randomNumber}.${format}`,
                    number: randomNumber
                };
            }
        }
        throw new Error('无可用格式');
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function schedulePreload() {
        requestIdleCallback(() => {
            if (!currentPreview) return;
            
            const candidates = [];
            for (let i = 1; i <= config.preload.count; i++) {
                const number = (currentPreview.number + i) % currentPreview.maxNumber || 1;
                candidates.push(...getRandomFormatCandidates(currentPreview.prefix, number));
            }
            
            candidates.filter(url => !preloadQueue.has(url))
                     .slice(0, config.preload.maxParallel)
                     .forEach(url => {
                         preloadQueue.add(url);
                         new Image().src = `${config.baseUrl}${url}`;
                     });
        });
    }

    function getRandomFormatCandidates(prefix, number) {
        return shuffleArray([...config.formats])
            .slice(0, 2)
            .map(format => `${prefix}${number}.${format}`);
    }

    // ================= 初始化 =================
    const observer = new MutationObserver(() => {
        themeCache.clear();
        updateRandomBackground();
    });
    observer.observe(document.documentElement, { 
        attributes: true,
        attributeFilter: ['data-color-mode']
    });
    ////////// 随机背景核心逻辑 end //////////
    
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
            --border-color: #30363d;
            --SideNav-bgColor: #21262dcc; /* 黑色背景，透明度80% */
            --btnSideNav-hover-bgColor: #002fa7; /* 高亮颜色 */
            --text-hover-color: #ffffff; /* 文章列表高亮字体颜色 */
            --box-shadow: 0 0 transparent; /* 添加阴影 */
        }

        /* 背景图 */
        html {    
            background: var(--bgURL) no-repeat center center fixed;
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

        /* 主页文章列表内边框 */
        .SideNav-item {
            border-color: var(--border-color);
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
        
        updateRandomBackground(); // 随机背景核心逻辑
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
