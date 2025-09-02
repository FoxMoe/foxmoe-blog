$(document).ready(function () {
    App.init();
});

const App = {
    init() {
        this.initNavigation();
        this.initTheme();
        this.initSearch();
        this.initFAB();
        this.initScrollEffects();
        this.initRuntimeCounter();
        this.initPjax();
        this.initMarkdown();
        this.initCardClick();
    },

    initHightight(){
        console.log("highlight");
        if (typeof Prism !== 'undefined') {
var pres = document.getElementsByTagName('pre');
                for (var i = 0; i < pres.length; i++){
                    if (pres[i].getElementsByTagName('code').length > 0)
                        pres[i].className  = 'line-numbers';}
Prism.highlightAll(true,null);}
    },

    initMarkdown() {
        // const renderMarkdown = () => {
        //     if (typeof editormd !== "undefined" && document.getElementById("content")) {
        //         editormd.markdownToHTML("content", {
        //             htmlDecode: "style,script,iframe",
        //             emoji: true,
        //             taskList: true,
        //             tex: true,
        //             flowChart: true,
        //             sequenceDiagram: true,
        //         });
        //     }
        // };
        // renderMarkdown();
        // $(document).on('pjax:complete', renderMarkdown);
    },

    initCardClick() {
        const handleCardClick = (e) => {
            const card = e.target.closest('.post-card');
            if (!card || e.target.closest('a')) return;
            
            const url = card.getAttribute('data-url');
            if (url) {
                if (window.Pjax) {
                    new Pjax().handleLink(card.querySelector('.post-title-link'));
                } else {
                    window.location.href = url;
                }
            }
        };

        $(document).off('click.cardClick').on('click.cardClick', '.post-card', handleCardClick);
    },

    initNavigation() {
        const $header = $('.header');
        const $mobileMenuBtn = $('.mobile-menu-btn');
        const $navMenu = $('.nav-menu');
        const $navLinks = $('.nav-link');
        let lastScrollTop = 0;
        let ticking = false;
        const skipLegacyMenu = !!window.__NEW_HEADER_NAV; // 新版导航

        const updateHeader = () => {
            const scrollTop = $(window).scrollTop();

            if (scrollTop > 100) {
                $header.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
            }

            if (scrollTop > lastScrollTop && scrollTop > 200) {
                $header.css('transform', 'translateY(-100%)');
            } else {
                $header.css('transform', 'translateY(0)');
            }
            lastScrollTop = scrollTop;
            ticking = false;
        };

        $(window).on('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });

        if(!skipLegacyMenu){
            $mobileMenuBtn.on('click', () => {
                $navMenu.toggleClass('active');
                const icon = $mobileMenuBtn.find('.material-icons').text();
                $mobileMenuBtn.find('.material-icons').text(
                    icon === 'menu' ? 'close' : 'menu'
                );
            });
        }

        $navLinks.on('click', function (e) {
            const target = $(this).attr('href');

            if (target && target.startsWith('#')) {
                e.preventDefault();
                $navLinks.removeClass('active');
                $(this).addClass('active');

                $navMenu.removeClass('active');
                $mobileMenuBtn.find('.material-icons').text('menu');

                const $target = $(target);
                if ($target.length) {
                    $('html, body').animate({
                        scrollTop: $target.offset().top - 80
                    }, 600);
                }
            } else {
                $navMenu.removeClass('active');
                $mobileMenuBtn.find('.material-icons').text('menu');
            }
        });
    },

    initTheme() {
        const $body = $('body');
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedFontSize = localStorage.getItem('fontSize') || 'normal';

        // 应用保存的主题
        this.setTheme(savedTheme);
        this.setFontSize(savedFontSize);

        $(document).off('click.themeToggle').on('click.themeToggle', '.theme-toggle', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            App.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // 字体大小切换
        let fontSizeIndex = ['small', 'normal', 'large'].indexOf(savedFontSize);
        const fontSizes = ['small', 'normal', 'large'];

        $(document).off('click.fontSizeToggle').on('click.fontSizeToggle', '.font-size', (e) => {
            e.preventDefault();
            e.stopPropagation();

            fontSizeIndex = (fontSizeIndex + 1) % fontSizes.length;
            this.setFontSize(fontSizes[fontSizeIndex]);
            localStorage.setItem('fontSize', fontSizes[fontSizeIndex]);
        });
    },

    initPjax() {
        // 加载条
        let $loadingBar = $('.page-loading-bar');
        if ($loadingBar.length === 0) {
            $loadingBar = $('<div class="page-loading-bar"></div>');
            $('body').append($loadingBar);
        }

        this.ensureArchiveCss();

        if (!$.support.pjax) {
            return;
        }

        console.log(`%cFoxmoe Blog Engine v1.1 %cMade with %c❤ %c!`, 'color: magenta;','color: white;','color: red;','color: white;');

        $(document).pjax(
            'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript:"])',
            '.main-container',
            { fragment: '.main-container', timeout: 8000 }
        );

        $(document).on('pjax:send', function () {
            $loadingBar.removeClass('progress-30 progress-60 progress-80 progress-100 fade-out').addClass('active');
            setTimeout(() => $loadingBar.addClass('progress-30'), 80);
            setTimeout(() => $loadingBar.addClass('progress-60'), 180);
        });

        $(document).on('pjax:end', () => {
            $('html, body').scrollTop(0);
            const savedTheme = localStorage.getItem('theme') || 'light';
            App.setTheme(savedTheme);
            App.updateActiveNav();
            $(window).trigger('scroll');

            // 归档CSS
            this.ensureArchiveCss();

            // PJAX 后重新初始化运行时计时器
            this.initRuntimeCounter();
            this.initMarkdown();
            this.initHightight();
            this.initCardClick();

            // 重新初始化 tooltip
            if (window.Components && typeof Components.initTooltips === 'function') {
                Components.initTooltips();
            }

            $loadingBar.addClass('progress-100');
            setTimeout(() => {
                $loadingBar.addClass('fade-out');
                setTimeout(() => {
                    $loadingBar.removeClass('active progress-30 progress-60 progress-80 progress-100 fade-out');
                }, 300);
            }, 200);
        });
    },

    ensureArchiveCss() {
        try {
            // 判断页面是否含有归档容器
            if (document.querySelector('.archive-container')) {
                var loaded = !!document.querySelector('link[data-archive-css="1"]');
                if (!loaded) {
                    var href = (window.THEME_URL || '') + 'css/archive.css';
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    link.setAttribute('data-archive-css', '1');
                    document.head.appendChild(link);
                }
            }
        } catch (e) {
        }
    },

    setTheme(theme) {
        const $root = $('html');
        const $body = $('body');
        const $themeIcon = $('.theme-toggle .material-icons');

        // 过渡类
        $root.addClass('theme-animating');
        clearTimeout(this._themeAnimatingTimer);
        this._themeAnimatingTimer = setTimeout(() => {
            $root.removeClass('theme-animating');
        }, 260);

        $root.removeClass('light-theme dark-theme');
        $body.removeClass('light-theme dark-theme');

        // data-theme
        if (theme === 'dark') {
            $root.addClass('dark-theme');
            $body.addClass('dark-theme');
            $root.attr('data-theme', 'dark');
        } else {
            $root.attr('data-theme', 'light');
        }

        // 更新图标
        setTimeout(() => {
            if ($themeIcon.length) {
                $themeIcon.text(theme === 'light' ? 'dark_mode' : 'light_mode');
            }
        }, 10);
    },

    setFontSize(size) {
        const $body = $('body');
        $body.removeClass('font-size-small font-size-large');

        if (size !== 'normal') {
            $body.addClass(`font-size-${size}`);
        }
    },

    initSearch() {
        const $searchBtn = $('.search-btn');
        const $searchContainer = $('.search-container');
        const $searchClose = $('.search-close');
        const $searchInput = $('.search-input');
        const $searchSubmit = $('.search-submit');

        $searchBtn.on('click', () => {
            $searchContainer.addClass('active');
            setTimeout(() => $searchInput.focus(), 300);
        });

        $searchClose.on('click', () => {
            $searchContainer.removeClass('active');
            $searchInput.val('');
        });

        $(document).on('keydown', (e) => {
            if (e.key === 'Escape' && $searchContainer.hasClass('active')) {
                $searchContainer.removeClass('active');
                $searchInput.val('');
            }
        });

        $searchSubmit.on('click', () => {
            this.performSearch($searchInput.val());
        });

        $searchInput.on('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch($searchInput.val());
            }
        });

        $(document).on('click', (e) => {
            if (!$searchContainer.is(e.target) &&
                $searchContainer.has(e.target).length === 0 &&
                !$searchBtn.is(e.target) &&
                $searchBtn.has(e.target).length === 0) {
                $searchContainer.removeClass('active');
            }
        });
    },

    performSearch(query) {
        if (!query.trim()) return;
        console.log('搜索:', query);
        $('.search-overlay').removeClass('active');
    },

    initFAB() {
        const $fabContainer = $('.fab-container');
        const $mainFab = $('.main-fab');
        const $backToTop = $('.back-to-top');

        $mainFab.on('click', () => {
            $fabContainer.toggleClass('active');
        });

        $backToTop.on('click', () => {
            $('html, body').animate({ scrollTop: 0 }, { duration: 600, easing: 'easeOutCubic' });
            $fabContainer.removeClass('active');
        });

        $(window).on('scroll', $.throttle(100, () => {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > 200) { $backToTop.addClass('show'); } else { $backToTop.removeClass('show'); }
        }));

        $(document).on('click', (e) => {
            if (!$fabContainer.is(e.target) && $fabContainer.has(e.target).length === 0) {
                $fabContainer.removeClass('active');
            }
        });
    },

    initScrollEffects() {
        let scrollTicking = false;

        const updateScrollEffects = () => {
            $('.fade-in-up:not(.visible)').each(function () {
                const $element = $(this);
                const elementTop = $element.offset().top;
                const windowBottom = $(window).scrollTop() + $(window).height();

                if (elementTop < windowBottom - 50) {
                    $element.addClass('visible');
                }
            });
            scrollTicking = false;
        };

        $(window).on('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(updateScrollEffects);
                scrollTicking = true;
            }
        });
    },

    initRuntimeCounter() {
        const attr = (document.body && document.body.getAttribute('data-runtime-start')) || '';
        const parsed = this.parseRuntimeStart(attr);
        const startDate = parsed || new Date('2025-01-01T00:00:00');
        this._runtimeStart = startDate;

        const updateRuntime = () => {
            const el = document.getElementById('runtime');
            if (!el) return;
            const now = new Date();
            const diff = now - this._runtimeStart;
            if (isNaN(diff) || diff < 0) { el.textContent = '--'; return; }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            el.textContent = `${days}天${hours}小时${minutes}分钟`;
        };

        // 避免重复定时器
        if (this._runtimeTimer) clearInterval(this._runtimeTimer);
        updateRuntime();
        this._runtimeTimer = setInterval(updateRuntime, 60000);
    },

    // 解析 YYYY-MM-DD 或 YYYY-MM-DD HH:MM[:SS]
    parseRuntimeStart(str) {
        if (!str || typeof str !== 'string') return null;
        const s = str.trim();
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
        if (!m) return null;
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10) - 1;
        const d = parseInt(m[3], 10);
        const hh = m[4] ? parseInt(m[4], 10) : 0;
        const mm = m[5] ? parseInt(m[5], 10) : 0;
        const ss = m[6] ? parseInt(m[6], 10) : 0;
        const dt = new Date(y, mo, d, hh, mm, ss);
        return isNaN(dt.getTime()) ? null : dt;
    },

    updateActiveNav() {
        // 更新导航菜单的激活状态
        const currentPath = window.location.pathname;
        $('.nav-link').removeClass('active');

        $('.nav-link').each(function () {
            const linkPath = new URL($(this).attr('href'), window.location.origin).pathname;
            if (linkPath === currentPath) {
                $(this).addClass('active');
            }
        });
    },
};

// 保留工具函数
$.throttle = function (delay, fn) {
    let timeoutID = null;
    let lastExec = 0;

    function wrapper() {
        const elapsed = +new Date() - lastExec;
        const args = Array.prototype.slice.call(arguments);
        const exec = () => {
            lastExec = +new Date();
            fn.apply(this, args);
        };

        clearTimeout(timeoutID);
        if (elapsed > delay) {
            exec();
        } else {
            timeoutID = setTimeout(exec, delay - elapsed);
        }
    }
    return wrapper;
};

$.easing.easeOutCubic = function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};
