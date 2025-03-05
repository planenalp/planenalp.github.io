document.addEventListener('DOMContentLoaded', function() {    
    let currentUrl = window.location.pathname;
    //let currentHost = window.location.hostname;

    //主页主题------------------------------------------------------------------------------
    
    if (currentUrl == '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('应用主页主题');
        let style = document.createElement("style");
        style.innerHTML = `

        #header {
            height: 130px;
            /* display: flex; */
            padding-top: 10px;
            padding-bottom: 10px;
            /* border-bottom: 1px solid var(--borderColor-muted, var(--color-border-muted)); */
            background-color: #002fa7;
        }

        h1 {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .title-right {
            justify-content: center;
            align-items: center;
        }

        /*
        @media (max-width: 600px) {
            body {padding: 8px;}
            .avatar {width:40px;height:40px;}
            .blogTitle{display:none;}
            #buttonRSS{display:none;}
            .LabelTime{display:none;}
        }
        */



        `;
        document.head.appendChild(style);
    }


    //文章页主题------------------------------------------------------------------------------
    
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('文章页主题');

        let style = document.createElement("style");
        style.innerHTML = `

        /* 顶栏改色 */
        #header {
            background-color: #002FA7;
        }

        /* 顶栏字体缩进10px */
        .postTitle {
            margin-left: 10px;
        }

        /* 文章字体缩进10px */
        #postBody {
            margin: 10px;
        }

        `;
        document.head.appendChild(style);
    } 


    // 搜索页主题--------------------------------------------------------------------
    
    else if (currentUrl.includes('/tag')) {
        console.log('应用搜索页主题');
        let style = document.createElement("style");
        style.innerHTML = `
        
        /* 顶栏改色 */
        #header {
            background-color: #002FA7;
        }

        /* 顶栏字体缩进10px */
        .tagTitle {
            margin-left: 10px;
        }
        
        /* 搜索布局 */
        .subnav-search {
            width: 230px; 
        }
        
        `;
        document.head.appendChild(style);
    }
})
