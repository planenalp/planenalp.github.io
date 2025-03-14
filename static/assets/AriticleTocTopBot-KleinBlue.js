(() => {
  // ... 保留之前的 injectStyles 和 createTOC 函数 ...

  // 修改后的 createTOC 函数，添加平滑滚动
  const createTOC = () => {
    const contentContainer = document.querySelector('.markdown-body');
    if (!contentContainer) return;
    const toc = document.createElement('div');
    toc.className = 'toc';
    contentContainer.prepend(toc);

    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      if (!heading.id) {
        heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
      }
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.dataset.id = heading.id;
      link.className = 'toc-link';
      link.style.paddingLeft = `${(parseInt(heading.tagName[1]) - 1) * 10}px`;
      
      // 添加点击事件处理，使用平滑滚动
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.id);
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' // 确保标题在视口顶部对齐
          });
        }
      });
      
      toc.appendChild(link);
    });
  };

  // 优化后的高亮判断逻辑
  const highlightTOC = () => {
    const tocLinks = document.querySelectorAll('.toc-link');
    const fromTop = window.scrollY + window.innerHeight * 0.1; // 调整为视口高度的10%
    
    let currentActive = null;
    let closestDistance = Infinity;

    tocLinks.forEach(link => {
      const section = document.getElementById(link.dataset.id);
      if (!section) return;
      
      // 使用更精确的位置计算
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const distance = Math.abs(sectionTop - fromTop);

      // 寻找最接近的标题
      if (distance < closestDistance && sectionTop <= fromTop) {
        closestDistance = distance;
        currentActive = link;
      }
    });

    tocLinks.forEach(link => link.classList.remove('active-toc'));
    if (currentActive) {
      currentActive.classList.add('active-toc');
      // 仅在需要时滚动目录项
      const toc = document.querySelector('.toc');
      if (toc.scrollHeight > toc.clientHeight) {
        currentActive.scrollIntoView({ 
          block: 'center',
          behavior: 'auto' // 禁用目录自身的平滑滚动
        });
      }
    }
  };

  // ... 保留 toggleTOC 和其他函数 ...

  // 在 DOMContentLoaded 中添加防抖优化
  document.addEventListener('DOMContentLoaded', () => {
    createTOC();

    // ... 保留样式注入和按钮创建代码 ...

    // 添加防抖的滚动监听
    let isScrolling;
    window.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        highlightTOC();
        updateButtons();
      }, 100); // 调整防抖时间为 100ms
    }, { passive: true });

    // ... 保留其他事件监听 ...
  });
})();
