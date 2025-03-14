function loadResource(type, attributes) {
   if (type === 'style') {
       const style = document.createElement('style');
       style.textContent = attributes.css;
       document.head.appendChild(style);
   }
}

function createTOC() {
   const tocElement = document.createElement('div');
   tocElement.className = 'toc';
   
   const contentContainer = document.querySelector('.markdown-body');
   contentContainer.appendChild(tocElement);

   const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
   headings.forEach(heading => {
       if (!heading.id) {
           heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
       }
       const link = document.createElement('a');
       link.href = '#' + heading.id;
       link.textContent = heading.textContent;
      
       link.className = 'toc-link';
       link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
       link.addEventListener('click', function(e) {
           e.preventDefault();
           const targetElement = document.getElementById(heading.id);
           if (targetElement) {
               targetElement.scrollIntoView({ behavior: 'smooth' });
           }
       });
       tocElement.appendChild(link);
   });
}

function highlightTOC() {
    const headings = document.querySelectorAll('.markdown-body h1, h2, h3, h4, h5, h6');
    const tocLinks = document.querySelectorAll('.toc a');
    let lastActive = null;

    function onScroll() {
        let current = null;
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight * 0.3) {
                current = heading;
            }
        });

        if (current) {
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current.id) {
                    link.classList.add('active');
                    lastActive = link;
                }
            });
        } else if (lastActive) {
            lastActive.classList.remove('active');
        }
    }
    
    window.addEventListener('scroll', onScroll);
}

function toggleTOC() {
   const tocElement = document.querySelector('.toc');
   const tocIcon = document.querySelector('.toc-icon');
   if (tocElement) {
       tocElement.classList.toggle('show');
       tocIcon.classList.toggle('active');
       tocIcon.innerHTML = tocElement.classList.contains('show') 
           ? '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
           : '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
   }
}

document.addEventListener("DOMContentLoaded", function() {
   createTOC();
   highlightTOC();
   const css = `
       .toc a.active {
           background-color: var(--toc-hover);
           padding-left: 5px;
           border-radius: 6px;
           font-weight: bold;
       }
   `;
   loadResource('style', {css: css});

   const tocIcon = document.createElement('div');
   tocIcon.className = 'toc-icon';
   tocIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
   tocIcon.onclick = (e) => {
       e.stopPropagation();
       toggleTOC();
   };
   document.body.appendChild(tocIcon);

   document.addEventListener('click', (e) => {
       const tocElement = document.querySelector('.toc');
       if (tocElement && tocElement.classList.contains('show') && !tocElement.contains(e.target) && !e.target.classList.contains('toc-icon')) {
           toggleTOC();
       }
   });
});
