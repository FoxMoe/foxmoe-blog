$(document).ready(function() {
    Components.init();
});

const Components = {
    init() {
        this.initImageLazy();
        this.initTooltips();
        this.initModals();
        this.initAnimateOnScroll();
        this.initSmoothAnimations();
        this.addComponentStyles();
    },

    // 图片懒加载
    initImageLazy() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $img = $(entry.target);
                        const src = $img.data('src');
                        if (src) {
                            $img.attr('src', src).removeAttr('data-src');
                            imageObserver.unobserve(entry.target);
                        }
                    }
                });
            });

            $('img[data-src]').each(function() {
                imageObserver.observe(this);
            });
        }
    },

    // 工具提示
    initTooltips() {
        // 初始化时将所有 title 复制到 data-title，保留 title
        $('[title]').each(function() {
            const $element = $(this);
            if (!$element.attr('data-title')) {
                $element.attr('data-title', $element.attr('title'));
            }
            $element.off('.tooltip'); // 防止重复绑定

            $element.on('mouseenter.tooltip', function(e) {
                const title = $element.attr('data-title');
                if (!title) return;
                // 阻止原生 tooltip
                this._oldTitle = $element.attr('title');
                $element.attr('title', '');
                const $tooltip = $('<div class="tooltip"></div>').text(title);
                $('body').append($tooltip);
                const rect = this.getBoundingClientRect();
                $tooltip.css({
                    position: 'fixed',
                    top: rect.top - $tooltip.outerHeight() - 8,
                    left: rect.left + (rect.width - $tooltip.outerWidth()) / 2,
                    zIndex: 10000
                }).fadeIn(200);
            });

            $element.on('mouseleave.tooltip', function() {
                // 离开时恢复 title
                if (typeof this._oldTitle !== 'undefined') {
                    $element.attr('title', this._oldTitle);
                    delete this._oldTitle;
                }
                $('.tooltip').fadeOut(200, function() {
                    $(this).remove();
                });
            });
        });
    },

    // 模态框
    initModals() {
        $(document).on('click', '.post-article-img', function() {
            const src = $(this).attr('src');
            if (!src) return;

            const $modal = $(`
                <div class="image-modal">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <img src="${src}" alt="查看图片">
                        <button class="modal-close">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                </div>
            `);

            $('body').append($modal);
            $modal.fadeIn(300);

            $modal.on('click', '.modal-close, .modal-backdrop', function() {
                $modal.fadeOut(300, function() {
                    $modal.remove();
                });
            });

            $(document).on('keydown.modal', function(e) {
                if (e.key === 'Escape') {
                    $modal.fadeOut(300, function() {
                        $modal.remove();
                    });
                    $(document).off('keydown.modal');
                }
            });
        });
    },

    // 滚动动画
    initAnimateOnScroll() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $element = $(entry.target);
                        $element.addClass('animate-in');

                        $element.find('.post-tag, .social-link, .tag-item, .category-item').each(function(index) {
                            $(this).css('animation-delay', `${index * 0.1}s`);
                        });
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            $('.widget, .post-card, .section-title').each(function() {
                animationObserver.observe(this);
            });
        }
    },

    // 平滑动画
    initSmoothAnimations() {
        $('.post-card').hover(
            function() { $(this).addClass('hovered'); },
            function() { $(this).removeClass('hovered'); }
        );

        $('.btn, .fab, .page-btn').on('click', function() {
            const $btn = $(this);
            $btn.addClass('clicked');
            setTimeout(() => $btn.removeClass('clicked'), 200);
        });

        $('.search-input').focus(function() {
            $(this).parent().addClass('focused');
        }).blur(function() {
            $(this).parent().removeClass('focused');
        });
    },

    // 添加组件样式
    addComponentStyles() {
        const styles = `
            <style id="component-styles">
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: none;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                -webkit-backdrop-filter: blur(4px);
                backdrop-filter: blur(4px);
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 90vw;
                max-height: 90vh;
            }
            
            .modal-content img {
                max-width: 100%;
                max-height: 100%;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
            }
            
            .modal-close {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 40px;
                height: 40px;
                border: none;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: var(--shadow-lg);
                color: var(--text-primary);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tooltip {
                display: none;
                pointer-events: none;
                background: var(--dark-bg);
                color: white;
                padding: 6px 12px;
                border-radius: var(--radius-md);
                font-size: var(--font-size-sm);
                white-space: nowrap;
                box-shadow: var(--shadow-lg);
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .post-card.hovered {
                box-shadow: var(--shadow-xl);
            }
            
            .clicked {
                transform: scale(0.95);
                transition: transform 0.1s ease;
            }
            
            .category-hover {
                background: var(--primary-50);
                transform: translateX(4px);
                transition: all 0.2s ease;
            }
            
            .recommend-hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
            }
            
            img.loaded {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            img.error {
                opacity: 0.5;
                filter: grayscale(100%);
            }
            </style>
        `;

        if (!$('#component-styles').length) {
            $('head').append(styles);
        }
    }
};

// 性能优化组件
const Performance = {
    init() {
        this.optimizeImages();
    },

    // 图片优化
    optimizeImages() {
        $('img').each(function() {
            const $img = $(this);

            // 添加加载状态
            $img.on('load', function() {
                $img.addClass('loaded');
            });

            // 错误处理
            $img.on('error', function() {
                $img.addClass('error');
                // 显示占位图
                const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+aXoOazleWKoOi9vTwvdGV4dD48L3N2Zz4=';
                $img.attr('src', placeholder);
            });
        });
    }
};

// 辅助功能
const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReader();
        this.setupFocusManagement();
    },

    // 键盘导航
    setupKeyboardNavigation() {
        // 空格键激活按钮
        $(document).on('keydown', 'button', function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });

        // 回车键激活链接
        $(document).on('keydown', 'a', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    },

    // 屏幕阅读器支持
    setupScreenReader() {
        // 为图片添加alt属性
        $('img:not([alt])').attr('alt', '装饰图片');

        // 为按钮添加aria-label
        $('.fab:not([aria-label])').each(function() {
            const title = $(this).attr('title') || '操作按钮';
            $(this).attr('aria-label', title);
        });

        // 为表单添加标签
        $('.search-input').attr('aria-label', '搜索文章');
    },

    // 焦点管理
    setupFocusManagement() {
        // 模态框焦点陷阱
        $(document).on('keydown', '.search-overlay.active', function(e) {
            if (e.key === 'Tab') {
                const $focusableElements = $(this).find('input, button').filter(':visible');
                const $firstElement = $focusableElements.first();
                const $lastElement = $focusableElements.last();

                if (e.shiftKey && document.activeElement === $firstElement[0]) {
                    e.preventDefault();
                    $lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === $lastElement[0]) {
                    e.preventDefault();
                    $firstElement.focus();
                }
            }
        });
    }
};

// 初始化所有组件
$(function() {
    Performance.init();
    Accessibility.init();
});

// 页面跳转前移除所有 tooltip，防止残留
$(document).on('click', 'a', function() {
    if ($('.tooltip').length) {
        $('.tooltip').remove();
    }
});
