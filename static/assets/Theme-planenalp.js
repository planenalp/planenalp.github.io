
// 添加触摸事件支持允许移动端实现图标按压特效
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchend', function() {}, { passive: true });

// 执行指定的回调函数
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
        /* --bgURL: url("https://planenalp.github.io/bg/bgLight.webp"); */
        /* avatar-blue.svg */
        --avatarURL: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IueZvS/ngbDlupXok53miYsiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE2MDAgMTUyMi42OSI+PHBhdGggZD0iTTUzOS4xOCAwYzgwLjg5LS4wMyA5Ny44IDExNi41NCAxMTguMjMgMTgwLjY2IDIuNTIgMTMuNTYgNS4wNCAyNy4xMiA3LjU3IDQwLjY3IDcuODggNy4yNSAxNS43NiAxNC41IDIzLjY1IDIxLjc1LTEuMDUgOS42My02LjkxIDEwLjE3LTEwLjQgMTcuMDMtMi40MiA4Ljk0IDMuMzggMjIuMzcgNy41NyAyOC4zOCA2Ljg1IDEuMDMgOC43NSAxLjE5IDExLjM1IDYuNjJsLTkuNDYgMTEuMzVjOC41MSAyOC42OSAxNy4wMyA1Ny4zOCAyNS41NCA4Ni4wNyAxLjg5IDE2LjA4IDMuNzggMzIuMTYgNS42OCA0OC4yNCA3LjkxIDM3LjE1IDE2LjE2IDc2LjE5IDI1LjU0IDExNC40NSA1LjM3IDIxLjkxIDQuODggNzAuNzYgMTYuMDggODYuMDcgMTMuNCAxOC4zMyA0NS4xNyA2LjEzIDU3LjctMy43OCAyNy4zOC0yMS42NiAxOS45Ny02Ny4yNiAyOS4zMi0xMDcuODMgOS44OC00Mi44NCAxOC4yNi05NS41MiAyNi40OC0xNDAuOTMgMS41OC0xNi4wOCAzLjE1LTMyLjE2IDQuNzMtNDguMjQgOC4xNy0zOS41NCAyMy40OC0xMTAuMzEgMTYuMDgtMTU4LjktOS44Ny02NC43Ny0yLjczLTE3NS42MSA3MC45NC0xNTYuMDYgNTUuOTQgMTQuODQgNjEuNDYgODQuMjcgNzEuODggMTQ1LjY2bDEuODkgNTkuNTljLjMyIDIwLjgxLjYzIDQxLjYyLjk1IDYyLjQzIDguMjMgNTEuNjIuMjEgMTE3LjI1LTYuNjIgMTYyLjY5bDEuODkgMjcuNDNjLTIuODQgMjYuNDgtNS42OCA1Mi45Ny04LjUxIDc5LjQ1LTguOTkgNDcuNTItMjAuNTIgMTEwLjExLTguNTEgMTYxLjc0IDYuMTggMjYuNTUtMTAuMjIgNTEuMjktNC43MyA3NS42NyAxMS4xOSA0OS42NyA0Ny43MyA4OC44NiA3MS44OCAxMjcuNjkgOC45MiAxNC4zNCAyMS42MyAyMy41OCAyMy42NSA0Ni4zNS0xMS45NSA4LjYxLTIyLjQ2IDMxLjQ1LTExLjM1IDQ2LjM1IDEyLjYgMi4yMSAyNS4zMi04LjkgMzguNzgtMTEuMzUgMTUuMS0yLjc1IDIyLjc5IDExLjQ5IDM2Ljg5IDQuNzMgMjEuMjYtMTAuMiAzMy4yOC0yOS4xNiA1MC4xMy00My41MSA2Mi40OC01My4yIDEyMC4wOC0xNDQuNzIgMTk2Ljc0LTE3OS43MSA1Ny43NS0yNi4zNiAxNDUuMzQtNDIuNzIgMTc0Ljk4IDE5Ljg2IDExLjUyIDI0LjMyLTIuMiA1MS40NS0xNi4wOCA2Mi40My0xNS4xMyAxMS4zNS0zMC4yNyAyMi43LTQ1LjQgMzQuMDVsLTUyLjAyIDUwLjEzYy0yMC43NiAxNi42NS00My4wMyAzNi4wNC01OS41OSA1Ni43NS0zNi4wNSA0NS4xLTczLjg2IDkxLjg1LTEwNC4wNCAxNDEuODgtMTUuNTIgMjUuNzMtMTkuMzIgNTkuODYtMzkuNzMgODAuNC0zMy43MyAyNS44NS02Ny40NyA1MS43MS0xMDEuMjEgNzcuNTYtNTAuODEgNDAuMi05Mi44NCA4OS43My0xNDYuNjEgMTI3LjY5LTY4LjM2IDQ4LjI3LTE5Ni4xOSA0NS43My0yNTQuNDMtOC41MS44Ny00OC40IDc2LjUyLTQ1LjUzIDEwNS45My02Ny4xNSAxNC0xMC4zIDI3LjIyLTM3LjU5IDI5LjMyLTU4LjY0Ljg1LTguNS00LjQ0LTIxLjY2LTUuNjgtMzIuMTYtMi4yNy0xOS4zIDExLjU0LTMxLjA3IDEuODktNDYuMzUtNi4xNC05LjcxLTE5LjMxLTEzLjg0LTI4LjM4LTIwLjgxLTEyLjE2LTkuMzUtMjAuNzItMjMuMDktMzMuMS0zMi4xNi00Mi4xNSAxNi45OS0yNC44OS00Ljk2LTU1LjgtOS40Ni0xMS4wMyA4LjY4LTEyLjc4IDIzLjY5LTI3LjQzIDI5LjMyLTQxLjI0IDE1Ljg1LTc0LjY2LTkuNi04OC45MSAzOC43OCA2LjQ4IDE2LjY0IDI2LjA5IDI2LjcxIDMwLjI3IDQyLjU2IDcuNjMgMjguOTQtMjkuMDcgNDIuMjUtMTkuODYgNzEuODggMS44NyA2LjAzIDkuMDcgNi44MiAxMi4zIDExLjM1IDYuOTQgMTEuNjYgMTMuODcgMjMuMzMgMjAuODEgMzUgMy45NSAxMy45Mi0zLjUxIDI3Ljg1LTQuNzMgMzUuOTRsMy43OCAzNy44M2MtMi40MyAxMS43Mi0zMi4zOSA0Mi41Ni00OC4yNCA0MC42Ny0xMS4wMy0zLjE1LTIyLjA3LTYuMzEtMzMuMS05LjQ2LTExLjI0IDcuMzgtMjguODMgMjYuNjItNTAuMTMgMTguOTItMTEuMDUtNC0xNy4yMy0xMC0zNS04LjUxLTE0LjEzIDEuMTgtMjguNjIgMjMuNDMtNDEuNjIgNC43My0xMS42My0xNi43My04LjUtNjAuODgtMTcuMDMtODEuMzRMNDYzLjUyIDEzOThjLTMyLjUxLTUxLjk2LTY4LjQtMTA5LjYzLTg3Ljk2LTE3Mi4xNC0xMC4wNi0zMi4xNC0xMS4zNC02NC4wNS0xOC45Mi05OC4zNy03LjkyLTM1Ljg4LTE2LjU0LTgxLjQ5LTI0LjU5LTEyMC4xMi01LjE0LTI0LjY0LTQuNzktNDcuODYtMTMuMjQtNjguMS0xNC4wNC0zMy42My00MC41LTUyLjk0LTYxLjQ4LTc5LjQ1LTM1LjY5LTQ1LjA5LTcwLjIzLTg5LjA4LTEwNC45OS0xMzUuMjYtMjIuOC0zMC4yOC01MC44NC01Ny42Ni03My43OC04Ny45Ni0xNS43Ni0yMy4wMS0zMS41My00Ni4wMy00Ny4yOS02OS4wNS0xMy4xMy0xNi43Ni00Mi44Mi00OC41OC0yNi40OC04MS4zNCAzMy44Ni02Ny45MSA5OC41NS04LjYxIDEyNS44IDIzLjY1IDI5LjM3IDM0Ljc3IDY0LjIzIDY1LjkzIDkyLjY5IDEwMS4yMWw0Ni4zNSA1MC4xM2MyNy40OCAyMS45OCA1Ny40IDQ4LjM0IDc5LjQ1IDc1LjY3IDguNTYgMTAuNjEgMTkuOSAxNy41MiAzMS4yMSAyNS41NCAzMi4zOSAyMi45NiA0Ny42NSAyNS4yNyA3Ni42MS00LjczLjM1LTIxLjM3LTEzLjM3LTM2LjYtMTkuODYtNTIuMDItMTEuMzUtMjktMjIuNy01OC4wMS0zNC4wNS04Ny4wMi0xMi4zNC0zMS4zNC0yNy4yNC02MS42MS0zOC43OC05MC44bC0xMi4zLTUyLjAyYy0xMC4wOS0yOS0yMC4xOC01OC4wMS0zMC4yNy04Ny4wMi05LjY3LTM2LjE1LTE4LjQtNzAuMDYtMzAuMjctMTA0Ljk5LTE2LjQzLTQ4LjM2LTUwLjA4LTE0OC44OSAxMy4yNC0xNzAuMjUgMzguMTItMTIuODYgNjguNDkgOS43OCA4MS4zNCAzMi4xNiAxNS43NiA0OS44MSAzMS41MyA5OS42MyA0Ny4yOSAxNDkuNDRDNDYyLjM5IDM3Ny4wNCA1MDQuMzIgNDUwIDUzMy41IDUzMC42OGMxMy41MiAzNy4zOCAxNS43MiA4My44IDM1Ljk0IDExNS4zOSA1LjA0IDcuODcgMjEuNDYgMjYuNTEgMzQuMDUgMTQuMTkgNy4wOS02Ljk0IDMuMzItMjguMzEgMC0zNi44OS0xMy4wNy0zMy43OC0yNi4wNC02Ny43NC0zNS0xMDQuOTktMTMuMzMtNTUuNDEtMjMuMjQtMTEwLjkyLTM1Ljk0LTE2OS4zMS0uOTUtMTQuODItMS44OS0yOS42NC0yLjg0LTQ0LjQ1LTQuNjgtMjguOTgtNi4wNS01Ni40Ni0xMi4zLTgzLjIzLTkuMzQtNDAuMDctMjEuNDQtNzUuNzYtMzAuMjctMTE4LjIzLTIuOTItMTQuMDgtMTAuMTktMzcuODEtOC41MS01NC44NiAyLjEzLTIxLjczIDIzLjU2LTQwLjE5IDQyLjU2LTQ2LjM1TDUzOS4xNi4wNnoiIGZpbGw9IiMwMDJmYTciIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==");
        --body-bgColor: #ffffffb3;
        --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        --blogTitle-color: #002fa7;
        --subTitle-color: #002fa7;
        --postTitle-color: #002fa7;
        --tagTitle-color: #002fa7;
        --btn-hover-bgColor: #002fa7;
        --icon-hover-color: #f5f5f5;
        --SideNav-bgColor: #f6f8facc;
        --SideNav-hover-bgColor: #002fa7;
        --LabelTime-bgColor: #002fa7;
        --LabelName-bgColor: #007fff;
        --text-hover-color: #f5f5f5;
        --themeSwitch-color: #656d76;
    }
    /* 通用暗主题配色 */
    [data-color-mode=light][data-light-theme=dark],
    [data-color-mode=light][data-light-theme=dark]::selection,
    [data-color-mode=dark][data-dark-theme=dark],
    [data-color-mode=dark][data-dark-theme=dark]::selection {
        /* --bgURL: url("https://planenalp.github.io/bg/bgDark.webp"); */
        /* avatar-whitesmoke.svg */
        --avatarURL: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IuiTneW6leeZveaJiyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYwMCAxNTIyLjY5Ij48cGF0aCBkPSJNNTM5LjE4IDBjODAuODktLjAzIDk3LjggMTE2LjU0IDExOC4yMyAxODAuNjYgMi41MiAxMy41NiA1LjA0IDI3LjEyIDcuNTcgNDAuNjcgNy44OCA3LjI1IDE1Ljc2IDE0LjUgMjMuNjUgMjEuNzUtMS4wNSA5LjYzLTYuOTEgMTAuMTctMTAuNCAxNy4wMy0yLjQyIDguOTQgMy4zOCAyMi4zNyA3LjU3IDI4LjM4IDYuODUgMS4wMyA4Ljc1IDEuMTkgMTEuMzUgNi42MmwtOS40NiAxMS4zNWM4LjUxIDI4LjY5IDE3LjAzIDU3LjM4IDI1LjU0IDg2LjA3IDEuODkgMTYuMDggMy43OCAzMi4xNiA1LjY4IDQ4LjI0IDcuOTEgMzcuMTUgMTYuMTYgNzYuMTkgMjUuNTQgMTE0LjQ1IDUuMzcgMjEuOTEgNC44OCA3MC43NiAxNi4wOCA4Ni4wNyAxMy40IDE4LjMzIDQ1LjE3IDYuMTMgNTcuNy0zLjc4IDI3LjM4LTIxLjY2IDE5Ljk3LTY3LjI2IDI5LjMyLTEwNy44MyA5Ljg4LTQyLjg0IDE4LjI2LTk1LjUyIDI2LjQ4LTE0MC45MyAxLjU4LTE2LjA4IDMuMTUtMzIuMTYgNC43My00OC4yNCA4LjE3LTM5LjU0IDIzLjQ4LTExMC4zMSAxNi4wOC0xNTguOS05Ljg3LTY0Ljc3LTIuNzMtMTc1LjYxIDcwLjk0LTE1Ni4wNiA1NS45NCAxNC44NCA2MS40NiA4NC4yNyA3MS44OCAxNDUuNjZsMS44OSA1OS41OWMuMzIgMjAuODEuNjMgNDEuNjIuOTUgNjIuNDMgOC4yMyA1MS42Mi4yMSAxMTcuMjUtNi42MiAxNjIuNjlsMS44OSAyNy40M2MtMi44NCAyNi40OC01LjY4IDUyLjk3LTguNTEgNzkuNDUtOC45OSA0Ny41Mi0yMC41MiAxMTAuMTEtOC41MSAxNjEuNzQgNi4xOCAyNi41NS0xMC4yMiA1MS4yOS00LjczIDc1LjY3IDExLjE5IDQ5LjY3IDQ3LjczIDg4Ljg2IDcxLjg4IDEyNy42OSA4LjkyIDE0LjM0IDIxLjYzIDIzLjU4IDIzLjY1IDQ2LjM1LTExLjk1IDguNjEtMjIuNDYgMzEuNDUtMTEuMzUgNDYuMzUgMTIuNiAyLjIxIDI1LjMyLTguOSAzOC43OC0xMS4zNSAxNS4xLTIuNzUgMjIuNzkgMTEuNDkgMzYuODkgNC43MyAyMS4yNi0xMC4yIDMzLjI4LTI5LjE2IDUwLjEzLTQzLjUxIDYyLjQ4LTUzLjIgMTIwLjA4LTE0NC43MiAxOTYuNzQtMTc5LjcxIDU3Ljc1LTI2LjM2IDE0NS4zNC00Mi43MiAxNzQuOTggMTkuODYgMTEuNTIgMjQuMzItMi4yIDUxLjQ1LTE2LjA4IDYyLjQzLTE1LjEzIDExLjM1LTMwLjI3IDIyLjctNDUuNCAzNC4wNWwtNTIuMDIgNTAuMTNjLTIwLjc2IDE2LjY1LTQzLjAzIDM2LjA0LTU5LjU5IDU2Ljc1LTM2LjA1IDQ1LjEtNzMuODYgOTEuODUtMTA0LjA0IDE0MS44OC0xNS41MiAyNS43My0xOS4zMiA1OS44Ni0zOS43MyA4MC40LTMzLjczIDI1Ljg1LTY3LjQ3IDUxLjcxLTEwMS4yMSA3Ny41Ni01MC44MSA0MC4yLTkyLjg0IDg5LjczLTE0Ni42MSAxMjcuNjktNjguMzYgNDguMjctMTk2LjE5IDQ1LjczLTI1NC40My04LjUxLjg3LTQ4LjQgNzYuNTItNDUuNTMgMTA1LjkzLTY3LjE1IDE0LTEwLjMgMjcuMjItMzcuNTkgMjkuMzItNTguNjQuODUtOC41LTQuNDQtMjEuNjYtNS42OC0zMi4xNi0yLjI3LTE5LjMgMTEuNTQtMzEuMDcgMS44OS00Ni4zNS02LjE0LTkuNzEtMTkuMzEtMTMuODQtMjguMzgtMjAuODEtMTIuMTYtOS4zNS0yMC43Mi0yMy4wOS0zMy4xLTMyLjE2LTQyLjE1IDE2Ljk5LTI0Ljg5LTQuOTYtNTUuOC05LjQ2LTExLjAzIDguNjgtMTIuNzggMjMuNjktMjcuNDMgMjkuMzItNDEuMjQgMTUuODUtNzQuNjYtOS42LTg4LjkxIDM4Ljc4IDYuNDggMTYuNjQgMjYuMDkgMjYuNzEgMzAuMjcgNDIuNTYgNy42MyAyOC45NC0yOS4wNyA0Mi4yNS0xOS44NiA3MS44OCAxLjg3IDYuMDMgOS4wNyA2LjgyIDEyLjMgMTEuMzUgNi45NCAxMS42NiAxMy44NyAyMy4zMyAyMC44MSAzNSAzLjk1IDEzLjkyLTMuNTEgMjcuODUtNC43MyAzNS45NGwzLjc4IDM3LjgzYy0yLjQzIDExLjcyLTMyLjM5IDQyLjU2LTQ4LjI0IDQwLjY3LTExLjAzLTMuMTUtMjIuMDctNi4zMS0zMy4xLTkuNDYtMTEuMjQgNy4zOC0yOC44MyAyNi42Mi01MC4xMyAxOC45Mi0xMS4wNS00LTE3LjIzLTEwLTM1LTguNTEtMTQuMTMgMS4xOC0yOC42MiAyMy40My00MS42MiA0LjczLTExLjYzLTE2LjczLTguNS02MC44OC0xNy4wMy04MS4zNEw0NjMuNTIgMTM5OGMtMzIuNTEtNTEuOTYtNjguNC0xMDkuNjMtODcuOTYtMTcyLjE0LTEwLjA2LTMyLjE0LTExLjM0LTY0LjA1LTE4LjkyLTk4LjM3LTcuOTItMzUuODgtMTYuNTQtODEuNDktMjQuNTktMTIwLjEyLTUuMTQtMjQuNjQtNC43OS00Ny44Ni0xMy4yNC02OC4xLTE0LjA0LTMzLjYzLTQwLjUtNTIuOTQtNjEuNDgtNzkuNDUtMzUuNjktNDUuMDktNzAuMjMtODkuMDgtMTA0Ljk5LTEzNS4yNi0yMi44LTMwLjI4LTUwLjg0LTU3LjY2LTczLjc4LTg3Ljk2LTE1Ljc2LTIzLjAxLTMxLjUzLTQ2LjAzLTQ3LjI5LTY5LjA1LTEzLjEzLTE2Ljc2LTQyLjgyLTQ4LjU4LTI2LjQ4LTgxLjM0IDMzLjg2LTY3LjkxIDk4LjU1LTguNjEgMTI1LjggMjMuNjUgMjkuMzcgMzQuNzcgNjQuMjMgNjUuOTMgOTIuNjkgMTAxLjIxbDQ2LjM1IDUwLjEzYzI3LjQ4IDIxLjk4IDU3LjQgNDguMzQgNzkuNDUgNzUuNjcgOC41NiAxMC42MSAxOS45IDE3LjUyIDMxLjIxIDI1LjU0IDMyLjM5IDIyLjk2IDQ3LjY1IDI1LjI3IDc2LjYxLTQuNzMuMzUtMjEuMzctMTMuMzctMzYuNi0xOS44Ni01Mi4wMi0xMS4zNS0yOS0yMi43LTU4LjAxLTM0LjA1LTg3LjAyLTEyLjM0LTMxLjM0LTI3LjI0LTYxLjYxLTM4Ljc4LTkwLjhsLTEyLjMtNTIuMDJjLTEwLjA5LTI5LTIwLjE4LTU4LjAxLTMwLjI3LTg3LjAyLTkuNjctMzYuMTUtMTguNC03MC4wNi0zMC4yNy0xMDQuOTktMTYuNDMtNDguMzYtNTAuMDgtMTQ4Ljg5IDEzLjI0LTE3MC4yNSAzOC4xMi0xMi44NiA2OC40OSA5Ljc4IDgxLjM0IDMyLjE2IDE1Ljc2IDQ5LjgxIDMxLjUzIDk5LjYzIDQ3LjI5IDE0OS40NEM0NjIuMzkgMzc3LjA0IDUwNC4zMiA0NTAgNTMzLjUgNTMwLjY4YzEzLjUyIDM3LjM4IDE1LjcyIDgzLjggMzUuOTQgMTE1LjM5IDUuMDQgNy44NyAyMS40NiAyNi41MSAzNC4wNSAxNC4xOSA3LjA5LTYuOTQgMy4zMi0yOC4zMSAwLTM2Ljg5LTEzLjA3LTMzLjc4LTI2LjA0LTY3Ljc0LTM1LTEwNC45OS0xMy4zMy01NS40MS0yMy4yNC0xMTAuOTItMzUuOTQtMTY5LjMxLS45NS0xNC44Mi0xLjg5LTI5LjY0LTIuODQtNDQuNDUtNC42OC0yOC45OC02LjA1LTU2LjQ2LTEyLjMtODMuMjMtOS4zNC00MC4wNy0yMS40NC03NS43Ni0zMC4yNy0xMTguMjMtMi45Mi0xNC4wOC0xMC4xOS0zNy44MS04LjUxLTU0Ljg2IDIuMTMtMjEuNzMgMjMuNTYtNDAuMTkgNDIuNTYtNDYuMzVMNTM5LjE2LjA2eiIgZmlsbD0iI2Y1ZjVmNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+");
        --body-bgColor: #0d1117b3;
        --box-shadow: 0 0 transparent;
        --blogTitle-color: #f5f5f5;
        --subTitle-color: #f5f5f5;
        --postTitle-color: #f5f5f5;
        --tagTitle-color: #f5f5f5;
        --btn-hover-bgColor: #002fa7;
        --icon-hover-color: #f5f5f5;
        --SideNav-bgColor: #161b22cc;
        --SideNav-hover-bgColor: #002fa7;
        --LabelTime-bgColor: #002fa7;
        --LabelName-bgColor: #007fff;
        --text-hover-color: #f5f5f5;
        --themeSwitch-color: #7d8590;
    }

    /* 主页主题 */
    .home-theme {
        /* backup */
    }
    [data-color-mode=dark].home-theme,
    [data-light-theme=dark].home-theme {
        /* backup */
    }

    /* 文章页主题 */
    .post-theme {
        /* backup */;
    }
    [data-color-mode=dark].post-theme,
    [data-light-theme=dark].post-theme {
        /* backup */
    }
    
    /* 搜索页主题 */
    .search-theme {
        /* backup */
    }
    [data-color-mode=dark].search-theme,
    [data-light-theme=dark].search-theme {
        /* backup */
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
    
    `;
    document.head.appendChild(globalStyle);
    // ==================== 全局CSS变量定义 END ====================

    // ==================== Avatar点击跳转 START ====================
    const avatarElement = document.getElementById('avatarImg') || document.querySelector('.avatar');
    if (avatarElement) {
        avatarElement.style.cursor = 'pointer';
        avatarElement.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://klein.blue'; // 替换成你的目标链接
        });
    }
    // ==================== Avatar点击跳转 END ====================

    
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
            height: 175px;
            position: relative; /* 父元素 #header 设置定位 */
            border-bottom: unset; /* 去除分割线 */
            margin-bottom: unset;
        }

        #header h1 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
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
            margin-top: 10px;
            margin-bottom: 10px;
            transition: 0.1s !important; /* 强制指定动画时长 */
            object-fit: unset !important; /* 强制清除自动缩放 */
            background-color: transparent !important; /* 强制清除背景颜色 */
            border-radius: unset !important; /* 强制清除圆形框设置 */
            box-shadow: none !important; /* 强制清除边框 */
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }

        @media (any-hover: hover) {
            .avatar:hover {
                transform: scale(1.1) !important;
            }
        }

        @media (any-hover: none) {
            .avatar:hover {
                transform: scale(1.0) !important;
            }
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
            margin-top: 200px; /* 用百分比会崩 */
            margin-left: 50%;
            transform: translateX(-50%);
            position: absolute;
        }

        /* 按钮 */
        .btn {
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }

        /* 按钮悬停色 */
        @media (any-hover: hover) {
            .btn:hover {
                background-color: var(--btn-hover-bgColor);
                transition: 0.1s ease;
                .octicon { color: var(--icon-hover-color); }
                #themeSwitch { color: var(--icon-hover-color); }
            }
        }

        @media (any-hover: none) {
            .btn:hover {
                background-color: unset;
            }
        }

        /* 按钮按压 */
        .btn:active {
            background-color: var(--btn-hover-bgColor);
            transform: scale(0.9);
            transition: 0.1s ease;
            .octicon { color: var(--icon-hover-color); }
            #themeSwitch { color: var(--icon-hover-color); }
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
        }

        /* 文章列表主体 */
        .SideNav {
            background: transparent; /* 背景透明 */
            min-width: unset;
            border: unset !important; /* 移除边框 */
        }

        /* 文章列表单项整栏 */
        .SideNav-item {
            display: flex; /* 文章列表靠左双行 */
            flex-direction: column; /* 文章列表靠左双行 */
            padding: 10px 10px !important; /* 减少多余间隔 */
            border-top: unset; /* 移除边框 */
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }

        /* 文章列表悬停高亮 */
        @media (any-hover: hover) {
            .SideNav-item:hover {
                background-color: var(--SideNav-hover-bgColor);
                color: var(--text-hover-color);
                box-shadow: var(--box-shadow);
                /* transform: scale(1.02); */
                transition: 0.1s ease; /* 弹起动画时长 */
                .SideNav-icon { color: var(--icon-hover-color); }
                /* .Label { border: 1px solid var(--icon-hover-color); } */
            }
        }
        
        @media (any-hover: none) {
            .SideNav-item:hover {
                background-color: unset;
            }
        }

        /* 文章列表按压 */
        .SideNav-item:active {
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            box-shadow: var(--box-shadow);
            transform: scale(0.98);
            transition: 0.1s ease;
            .SideNav-icon { color: var(--icon-hover-color); }
            /* .Label { border: 1px solid var(--icon-hover-color); } */
        }

        /* 移除顶部线 */
        .SideNav-item:first-child {
            border-top: unset;
        }
        
        /* 移除底部线 */
        .SideNav-item:last-child {
            box-shadow: unset;
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
            white-space: normal; /* 默认值，允许自动换行 */
            overflow-wrap: break-word; /* 允许长单词/URL在任意字符间断行 */
            word-break: break-word; /* 优先保持单词完整，空间不足时再断开 */
        }

        /* 文章列表第二行 .LabelTime + .LabelName */
        .listLabels {
            width: 100%; /* 文章列表靠左双行 */
            display: flex !important; /* 文章列表靠左双行 */
            flex-wrap: wrap; /* 解锁 Label 自动换行 */
        }

        .LabelTime {
            order: 1; /* 调整两种 Label 顺序 */
            margin-left: unset !important; /* 去除左侧间隔 */
            background-color: var(--LabelTime-bgColor) !important;
        }
        .LabelName {
            order: 2; /* 调整两种 Label 顺序 */
            background-color: var(--LabelName-bgColor) !important;
        }

        /* 标签（背景色不能关闭，因为 .LabelName 字色没法自定义，除非隐藏 .LabelName） */
        /* 方案1：首页 + 搜索页 Label 边框移除，分别指定 .LabelName 和 .LabelTime 背景色（用这个） */
        /* 方案2：首页 + 搜索页 Label 边框透明，hover + active 边框 #f5f5f5，分别指定 .LabelName 和 .LabelTime 背景色*/
        /* 方案3：首页隐藏 .LabelName + 仅保留 .LabelTime（去掉背景色，字色改黑色/灰色+ hover + active 白色），搜索页按方案2 */
        .Label {
            border-radius: unset; /* 圆角关闭 */
            /* border: 1px solid transparent; 默认隐藏边框 */
            border: unset;
        }
        
        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .avatar {
                width:80px !important; /* 标题缩小 */
                height:80px !important; /* 标题缩小 */
            }
            #header {
                height: 135px; /* 标题缩小 */
                padding-bottom: unset; /* 标题缩小 */
            }

            #header h1 a {
                font-size: 25px; /* 标题缩小 */
            }

            .title-right {
                margin-top: 160px; /* 标题缩小 */
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
            border-bottom: unset; /* 去除分割线 */
        }

        /* 顶栏字体颜色 */
        .postTitle {
            color: var(--postTitle-color);
        }

        /* 按钮组件 */
        .title-right {
            margin: unset; /* header 居中 */
        }

        /* 按钮右间隔去除+底部间隔 */
        .title-right .circle {
            margin-right: unset; /* header 居中 */
            margin-bottom: 2px !important; /* header 居中 */
        }

        /* 按钮 */
        .btn {
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }
        
        /* 按钮悬停色 */
        @media (any-hover: hover) {
            .btn:hover {
                background-color: var(--btn-hover-bgColor);
                transition: 0.1s ease;
                .octicon { color: var(--icon-hover-color); }
                #themeSwitch { color: var(--icon-hover-color); }
            }
        }

        @media (any-hover: none) {
            .btn:hover {
                background-color: unset;
            }
        }

        /* 按钮按压 */
        .btn:active {
            background-color: var(--btn-hover-bgColor);
            transform: scale(0.9);
            transition: 0.1s ease;
            .octicon { color: var(--icon-hover-color); }
            #themeSwitch { color: var(--icon-hover-color); }
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
        }

        /* 评论按钮 */
        #cmButton {
            border-radius: unset; /* 去除圆角 */
            border: unset; /* 去除边框 */
        }
        
         /* 评论按钮悬停 */
        @media (any-hover: hover) {
            #cmButton:hover {
                background-color: var(--btn-hover-bgColor);
                color: var(--text-hover-color);
            }
        }
        
        /* 评论按钮按压 */
        #cmButton:active {
            background-color: var(--btn-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(0.98);
            transition: 0.1s ease;
        }

        /* 文章主体 */
        #postBody {
            border-bottom: unset; /* 去除分割线 */
        }
        
        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .postTitle{
                font-size: 24px !important; /* header 居中 */
                margin-top: 10px; /* header 居中 */
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
            padding: 5px;
            padding-bottom: unset;
            border-bottom: unset; /* 去除分割线 */
        }
        
        /* 顶部搜索标签 */
        .tagTitle {
            color: var(--tagTitle-color); /* 顶栏字体颜色 */
            white-space: normal; /* 默认值，允许自动换行 */
            overflow-wrap: break-word; /* 允许长单词/URL在任意字符间断行 */
            word-break: break-word; /* 优先保持单词完整，空间不足时再断开 */
            margin-bottom: 15px; /* header 居中 */
        }

        /* 搜索 + 按钮区域 */
        .title-right {
            margin: unset; /* header 居中 */
            display: flex; /* header 居中 */
            flex-wrap: wrap; /* header 居中 */
            justify-content: center; /* header 居中 */
        }

        /* 按钮底部间隔 */
        .title-right .circle {
            margin-top: 2px !important; /* header 居中 */
            margin-bottom: 2px !important; /* header 居中 */
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
            border-radius: unset; /* 去除圆角 */
            border: unset; /* 去除边框 */
        }

        /* 搜索按钮 */
        .subnav-search button {
            border: unset; /* 去除边框 */
            border-radius: unset; /* 去除圆角 */
        }

        /* 搜索失败字符 */
        #content > div.notFind {
            white-space: normal; /* 默认值，允许自动换行 */
            overflow-wrap: break-word; /* 允许长单词/URL在任意字符间断行 */
            word-break: break-word; /* 优先保持单词完整，空间不足时再断开 */
        }

        /* 按钮取消右间隔 */
        .title-right .circle {
            margin-right: unset; /* header 居中 */
        }

        /* 按钮 */
        .btn {
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }
        
        /* 按钮悬停色 */
        @media (any-hover: hover) {
            /* 所有按钮 */
            .btn:hover {
                background-color: var(--btn-hover-bgColor);
                transition: 0.1s ease;
                /* 所有按钮 SVG 图标 */
                .octicon { color: var(--icon-hover-color); }
                /* 主题切换 SVG 图标 */
                #themeSwitch { color: var(--icon-hover-color); }
            }
            /* 搜索按钮 */
            .subnav-search button:hover {
                background-color: var(--btn-hover-bgColor);
                color: var(--text-hover-color);
                transition: 0.1s ease;
            }
        }

        @media (any-hover: none) {
            .btn:hover {
                background-color: unset;
            }
        }

        /* 按钮按压 */
        .btn:active {
            background-color: var(--btn-hover-bgColor);
            transform: scale(0.9);
            transition: 0.1s ease;
            .octicon { color: var(--icon-hover-color); }
            #themeSwitch { color: var(--icon-hover-color); }
        }

        /* 搜索按钮按压 */
        .subnav-search button:active {
            background-color: var(--btn-hover-bgColor);
            color: var(--text-hover-color);
            transform: scale(0.9);
            transition: 0.1s ease;
        }

        /* 按钮图标色 */
        #themeSwitch {
            color: var(--themeSwitch-color);
        }

        /* 文章列表主体 */
        .SideNav {
            background: transparent; /* 背景透明 */
            min-width: unset;
            border: unset !important; /* 移除边框 */
        }

        /* 文章列表单项整栏 */
        .SideNav-item {
            display: flex; /* 文章列表靠左双行 */
            flex-direction: column; /* 文章列表靠左双行 */
            padding: 10px 10px !important; /* 减少多余间隔 */
            border-top: unset; /* 移除边框 */
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }

        /* 文章列表悬停高亮 */
        @media (any-hover: hover) {
            .SideNav-item:hover {
                background-color: var(--SideNav-hover-bgColor);
                color: var(--text-hover-color);
                box-shadow: var(--box-shadow);
                /* transform: scale(1.02); */
                transition: 0.1s ease; /* 弹起动画时长 */
                .SideNav-icon { color: var(--icon-hover-color); }
                /* .Label { border: 1px solid var(--icon-hover-color); } */
            }
        }
        
        @media (any-hover: none) {
            .SideNav-item:hover {
                background-color: unset;
            }
        }

        /* 文章列表按压 */
        .SideNav-item:active {
            background-color: var(--SideNav-hover-bgColor);
            color: var(--text-hover-color);
            box-shadow: var(--box-shadow);
            transform: scale(0.98);
            transition: 0.1s ease;
            .SideNav-icon { color: var(--icon-hover-color); }
            /* .Label { border: 1px solid var(--icon-hover-color); } */
        }

        /* 移除顶部线 */
        .SideNav-item:first-child {
            border-top: unset;
        }
        
        /* 移除底部线 */
        .SideNav-item:last-child {
            box-shadow: unset;
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
            white-space: normal; /* 默认值，允许自动换行 */
            overflow-wrap: break-word; /* 允许长单词/URL在任意字符间断行 */
            word-break: break-word; /* 优先保持单词完整，空间不足时再断开 */
        }

        /* 文章列表第二行 .LabelTime + .LabelName */
        .listLabels {
            width: 100%; /* 文章列表靠左双行 */
            display: flex !important; /* 文章列表靠左双行 */
            flex-wrap: wrap; /* 解锁 Label 自动换行 */
        }

        .LabelTime {
            order: 1; /* 调整两种 Label 顺序 */
            margin-left: unset !important; /* 去除左侧间隔 */
            background-color: var(--LabelTime-bgColor) !important;
        }
        .LabelName {
            order: 2; /* 调整两种 Label 顺序 */
            background-color: var(--LabelName-bgColor) !important;
        }

        /* 标签（背景色不能关闭，因为 .LabelName 字色没法自定义，除非隐藏 .LabelName） */
        /* 方案1：首页 + 搜索页 Label 边框移除，分别指定 .LabelName 和 .LabelTime 背景色（用这个） */
        /* 方案2：首页 + 搜索页 Label 边框透明，hover + active 边框 #f5f5f5，分别指定 .LabelName 和 .LabelTime 背景色*/
        /* 方案3：首页隐藏 .LabelName + 仅保留 .LabelTime（去掉背景色，字色改黑色/灰色+ hover + active 白色），搜索页按方案2 */
        .Label {
            border-radius: unset; /* 圆角关闭 */
            /* border: 1px solid transparent; 默认隐藏边框 */
            border: unset; /* 取消边框 */
            webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }

        /* 顶部 #taglabel 悬停 */
        @media (any-hover: hover) {
            #taglabel .Label:hover {
                background-color: var(--SideNav-hover-bgColor) !important;
                color: var(--text-hover-color) !important;
                transition: 0.1s ease;
            }
        }

        /* 顶部 #taglabel 按压 */
        #taglabel .Label:active {
            background-color: var(--SideNav-hover-bgColor) !important;
            color: var(--text-hover-color) !important;
            transform: scale(0.9);
            transition: 0.1s ease;
        }

        /* 重新定义 max-width: 768px 参数下的值，原为 600px */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
            }
            .tagTitle {
                display: unset !important;
                font-size: 20px !important; /* header 居中 */
                margin-top: 10px; /* header 居中 */
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
