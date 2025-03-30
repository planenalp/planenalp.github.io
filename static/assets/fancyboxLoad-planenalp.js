//不同博客记得修改 const fancyboxLink 代码中 fancybox.css 对应的链接位置

document.addEventListener("DOMContentLoaded", function() {
    // ==================== 替换图片链接 START ====================
    /**
     * 替换图片链接
     * 将 <p><a><img></a></p> 或 <a><img></a> 结构替换为带有懒加载动画和 data-src 的 <img> 标签
     */
    function replaceImageLinks() {
        // 处理 <p><a> 包裹的情况
        document.querySelectorAll('p > a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement; // 获取 <a> 标签
            const p = a.parentElement;   // 获取 <p> 标签
            if (a.href && a.href === img.src) { // 确保 <a> 的 href 和 <img> 的 src 相同
                const div = document.createElement('div'); // 创建加载动画容器
                div.classList.add('ImgLazyLoad-circle'); // 添加加载动画的类名
                const newImg = document.createElement('img'); // 创建新的 <img> 标签
                newImg.setAttribute('data-fancybox', 'gallery'); // 设置 Fancybox 属性
                newImg.setAttribute('data-src', a.href); // 设置 data-src 属性为图片链接
                newImg.setAttribute('alt', ''); // 设置 alt 属性为空
                const fragment = document.createDocumentFragment(); // 创建文档片段
                fragment.appendChild(div); // 将加载动画容器添加到片段
                fragment.appendChild(newImg); // 将新图片添加到片段
                p.replaceWith(fragment); // 用新结构替换原来的 <p> 标签
                observer.observe(newImg); // 使用 IntersectionObserver 观察新图片
            }
        });

        // 处理不在 <p> 中的 <a> 包裹的情况
        document.querySelectorAll('a[target="_blank"][rel] > img').forEach(function(img) {
            const a = img.parentElement; // 获取 <a> 标签
            if (a.parentElement && a.parentElement.tagName.toLowerCase() !== 'p' && a.href && a.href === img.src) {
                const div = document.createElement('div'); // 创建加载动画容器
                div.classList.add('ImgLazyLoad-circle'); // 添加加载动画的类名
                const newImg = document.createElement('img'); // 创建新的 <img> 标签
                newImg.setAttribute('data-fancybox', 'gallery'); // 设置 Fancybox 属性
                newImg.setAttribute('data-src', a.href); // 设置 data-src 属性为图片链接
                newImg.setAttribute('alt', ''); // 设置 alt 属性为空
                const fragment = document.createDocumentFragment(); // 创建文档片段
                fragment.appendChild(div); // 将加载动画容器添加到片段
                fragment.appendChild(newImg); // 将新图片添加到片段
                a.replaceWith(fragment); // 用新结构替换原来的 <a> 标签
                observer.observe(newImg); // 使用 IntersectionObserver 观察新图片
            }
        });
    }
    // ==================== 替换图片链接 END ====================

    // ==================== 懒加载图片 START ====================
    /**
     * 使用 IntersectionObserver 实现图片懒加载
     * 当图片进入视口时加载，并处理加载成功或失败的情况
     */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { // 当图片进入视口时触发
                    const img = entry.target; // 获取当前观察的目标图片
                    const imgContainer = img.previousElementSibling; // 获取前面的加载动画容器
                    const handleError = (isError = false) => { // 定义处理图片加载成功或失败的函数
                        if (imgContainer && imgContainer.classList.contains('ImgLazyLoad-circle')) {
                            imgContainer.style.display = 'none'; // 隐藏加载动画
                        }
                        if (isError) { // 如果图片加载失败
                            const errorContainer = document.createElement('div'); // 创建错误提示容器
                            errorContainer.classList.add('Imgerror-container'); // 添加错误容器的类名
                            errorContainer.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" style="height:60px;" class="Imgerror" viewBox="0 0 1024 1024">
                                    <path fill="#ff5b5b" d="M320 896h-77.833L515.92 622.253a21.333 21.333 0 0 0 3.16-26.133l-89.427-149.053 165.427-330.86A21.333 21.333 0 0 0 576 85.333H96a53.393 53.393 0 0 0-53.333 53.334v746.666A53.393 53.393 0 0 0 96 938.667h224A21.333 21.333 0 0 0 320 896zM96 128h445.48L386.253 438.46a21.333 21.333 0 0 0 .787 20.513L474 603.86l-69.333 69.333-89.62-89.653a53.333 53.333 0 0 0-75.427 0L85.333 737.827v-599.16A10.667 10.667 0 0 1 96 128zM85.333 885.333v-87.166l184.46-184.454a10.667 10.667 0 0 1 15.08 0l89.627 89.62L181.833 896H96a10.667 10.667 0 0 1-10.667-10.667zm192-458.666C336.147 426.667 384 378.813 384 320s-47.853-106.667-106.667-106.667S170.667 261.187 170.667 320s47.853 106.667 106.666 106.667zm0-170.667a64 64 0 1 1-64 64 64.073 64.073 0 0 1 64-64zM928 128H661.333a21.333 21.333 0 0 0-19.08 11.793l-.046.087c-.04.087-.087.173-.127.253L535.587 353.127a21.333 21.333 0 1 0 38.16 19.08l100.773-201.54H928a10.667 10.667 0 0 1 10.667 10.666V652.5L783.713 497.54a53.333 53.333 0 0 0-75.426 0L571.08 634.747a21.333 21.333 0 0 0-3.153 26.153l24.666 41.08-203.646 244.36a21.333 21.333 0 0 0 16.386 34.993H928A53.393 53.393 0 0 0 981.333 928V181.333A53.393 53.393 0 0 0 928 128zm0 810.667H450.88L635.053 717.66a21.333 21.333 0 0 0 1.907-24.667l-23.933-39.886L738.46 527.68a10.667 10.667 0 0 1 15.08 0l185.127 185.153V928A10.667 10.667 0 0 1 928 938.667z"/>
                                </svg>
                                <p class="Imgerror-message">图片错误</p>
                            `; // 设置错误提示的 HTML 内容
                            img.parentNode.insertBefore(errorContainer, img.nextSibling); // 在图片后插入错误提示
                            img.style.display = 'none'; // 隐藏加载失败的图片
                        } else { // 如果图片加载成功
                            img.classList.add('ImgLoaded'); // 为图片添加加载完成的类名
                        }
                    };

                    // 从 data-src 获取真实地址并赋值给 src，开始加载图片
                    img.src = img.getAttribute('data-src');
                    observer.unobserve(img); // 停止观察当前图片

                    img.onload = () => handleError(false); // 图片加载成功时的回调
                    img.onerror = () => handleError(true); // 图片加载失败时的回调
                }
            });
        },
        {
            rootMargin: '0px 0px 500px 0px' // 设置观察范围，图片在视口下方 500px 时开始加载
        }
    );
    // ==================== 懒加载图片 END ====================

    // ==================== Fancybox 绑定及配置 START ====================
    /**
     * 动态添加 Fancybox CSS 并绑定 Fancybox 功能
     */
    // 动态添加 Fancybox 的 CSS 文件
    const fancyboxLink = Object.assign(document.createElement('link'), {
        rel: 'stylesheet', // 设置 link 标签的 rel 属性
        href: 'https://planenalp.github.io/assets/fancybox.css' // 设置 Fancybox CSS 的地址（请根据实际需要修改）
    });
    document.head.appendChild(fancyboxLink); // 将 CSS 文件添加到 <head> 中

    // 绑定 Fancybox 到带有 data-fancybox="gallery" 的元素
    Fancybox.bind('[data-fancybox="gallery"]', {
        srcAttr: 'data-src' // 指定 Fancybox 使用 data-src 属性中的地址作为图片源
    });
    // ==================== Fancybox 绑定及配置 END ====================

    // ==================== 手动插入外链图片 START ====================
    /**
     * 支持手动插入外链图片
     * 将 <p><code>Image="URL"</code></p> 替换为懒加载图片，支持 Fancybox
     */
    if (document.querySelector(".markdown-body")) { // 检查是否存在 markdown-body 元素
        document.querySelectorAll('.markdown-body p').forEach(p => {
            const code = p.querySelector('code.notranslate'); // 查找 <p> 中的 <code> 标签
            if (code && code.textContent.startsWith('Image="') && code.textContent.endsWith('"')) {
                const url = code.textContent.slice(7, -1); // 从 <code> 中提取图片 URL

                // 创建新元素
                const div = document.createElement('div'); // 创建加载动画容器
                div.classList.add('ImgLazyLoad-circle'); // 添加加载动画的类名
                const img = document.createElement('img'); // 创建新的 <img> 标签
                img.setAttribute('data-fancybox', 'gallery'); // 设置 Fancybox 属性
                img.setAttribute('data-src', url); // 设置 data-src 属性为提取的 URL
                img.setAttribute('alt', ''); // 设置 alt 属性为空

                // 替换 <p> 为新结构
                const fragment = document.createDocumentFragment(); // 创建文档片段
                fragment.appendChild(div); // 将加载动画容器添加到片段
                fragment.appendChild(img); // 将新图片添加到片段
                p.replaceWith(fragment); // 用新结构替换原来的 <p> 标签

                // 立即观察新插入的图片
                observer.observe(img);
            }
        });
    }
    // ==================== 手动插入外链图片 END ====================

    // 在所有替换完成后，执行图片链接替换并观察已有图片
    replaceImageLinks(); // 调用替换图片链接的函数
    document.querySelectorAll('[data-src]').forEach(img => observer.observe(img)); // 观察所有带有 data-src 的图片
});
