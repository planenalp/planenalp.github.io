
// 填入每页显示的文章数
var itemsPerPage = 15;

//填入 config.json 中的 "singlePage":[] 自定义页面的数量
var custompages = 2;

//---------------------------------------------------------------------

// XML文件路径
var xmlUrl = `${window.location.origin}/rss.xml`;

// 获取当前页数
function getCurrentPage() {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/page(\d+)\.html/);
    // console.log(match ? parseInt(match[1]) : 1);
    return match ? parseInt(match[1]) : 1;
}

// 插入页码元素，链接
function appendPageLink(pagination, pageNumber, currentPage) {
    var pageLink = document.createElement('a');
    pageLink.href = pageNumber === 1 ? `${window.location.origin}` : `${window.location.origin}/page${pageNumber}.html`;
    pageLink.textContent = pageNumber;
    if (pageNumber === currentPage) {
        pageLink.classList.add('current-page');
    }
    pagination.insertBefore(pageLink, pagination.children[pagination.children.length - 1]);
}

// 插入省略号
function appendDots(pagination) {
    var dots = document.createElement('span');
    dots.textContent = '...';
    pagination.insertBefore(dots, pagination.children[pagination.children.length - 1]);
}

// 插入分页条
function updatePagination(totalPages, currentPage) {
    var pagination = document.querySelector('.pagination');

    // 清除现有页码
    while (pagination.children.length > 2) {
        pagination.removeChild(pagination.children[1]);
    }

    if (totalPages <= 10) {
        for (var i = 1; i <= totalPages; i++) {
            appendPageLink(pagination, i, currentPage);
        }
    } else {
        appendPageLink(pagination, 1, currentPage);
        appendPageLink(pagination, 2, currentPage);
        appendPageLink(pagination, 3, currentPage);

        if (currentPage > 5) {
            appendDots(pagination);
        }

        var startPage = Math.max(4, currentPage - 2);
        var endPage = Math.min(totalPages - 3, currentPage + 2);

        for (var i = startPage; i <= endPage; i++) {
            appendPageLink(pagination, i, currentPage);
        }

        if (currentPage < totalPages - 4) {
            appendDots(pagination);
        }

        appendPageLink(pagination, totalPages - 2, currentPage);
        appendPageLink(pagination, totalPages - 1, currentPage);
        appendPageLink(pagination, totalPages, currentPage);
    }

    // 添加样式
    var style = document.createElement('style');
    style.textContent = `
        /* light 主题颜色 */
        :root {
            --color-current-page-bg: #002fa7;
            --color-current-page-text: #f5f5f5;
            --color-hover-bg: #002fa7;
            --color-hover-text: #f5f5f5;
            --color-active-bg: #002fa7;
            --color-active-text: #f5f5f5;
            --box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        /* dark 主题颜色 */
        [data-color-mode=light][data-light-theme=dark],
        [data-color-mode=light][data-light-theme=dark]::selection,
        [data-color-mode=dark][data-dark-theme=dark],
        [data-color-mode=dark][data-dark-theme=dark]::selection {
            --color-current-page-bg: #002fa7;
            --color-current-page-text: #f5f5f5;
            --color-hover-bg: #002fa7;
            --color-hover-text: #f5f5f5;
            --color-active-bg: #002fa7;
            --color-active-text: #f5f5f5;
            --box-shadow: 0 0 transparent;
        }
        
        /* 分页插件主体 */
        .pagination a {
            border: unset;
            border-radius: unset;
            transition: 0.1s ease;
            -webkit-tap-highlight-color: transparent; /* 修复某些安卓设备的点击外框 */
            -webkit-touch-callout: none; /* 禁用 iOS 长按弹出菜单 */
            -webkit-user-select: none; /* 禁用 iOS Safari 和其他 WebKit 内核浏览器的文本选择 */
            -moz-user-select: none; /* 适用于 Firefox */
            -ms-user-select: none; /* 适用于 IE10+ 和 Edge */
            user-select: none; /* 标准语法 */
            outline: none !important; /* 解决按压边框闪烁 */
        }
        
        /* 当前页面 */
        .pagination a.current-page {
            border: unset;
            background-color: var(--color-current-page-bg);
            color: var(--color-current-page-text);
            box-shadow: var(--box-shadow);
            transition: 0.1s ease;
        }

        /* 悬停状态 */
        @media (any-hover: hover) {
            .pagination a:hover {
                border-color: transparent;
                background-color: var(--color-hover-bg);
                color: var(--color-hover-text);
                box-shadow: var(--box-shadow);
                transition: 0.1s ease;
            }
        }

        /* 点击状态 */
        .pagination a:active {
            background-color: var(--color-active-bg);
            color: var(--color-active-text);
            box-shadow: var(--box-shadow);
            transform: scale(0.9);
            transition: 0.1s ease;
        }
        
        /* 强制覆盖原文件 @media (min-width: 544px) 才激活 display: inline-block 的设定 */
        .pagination > :nth-child(2),
        .pagination > :nth-last-child(2),
        .pagination > .current,
        .pagination > .gap {
            display: inline-block !important;
        }
    `;
    document.head.appendChild(style);
}

// 主
fetch(xmlUrl)
    .then(response => response.text())
    .then(data => {
        var parser = new DOMParser();

        var xmlDoc = parser.parseFromString(data, "text/xml");

        // 查找所有item标签
        var items = xmlDoc.getElementsByTagName("item");

        // console.log(items.length);

        var itemslength = items.length - custompages;

        // 如果总条数小于等于每页显示的文章数，停止
        if (itemslength <= itemsPerPage) {
            return;
        }

        // 计算总页数
        var totalPages = Math.ceil(itemslength / itemsPerPage);

        // 获取当前页
        var currentPage = getCurrentPage();

        // 插入分页条
        updatePagination(totalPages, currentPage);
    })
    .catch(error => console.error('Error fetching XML:', error));
