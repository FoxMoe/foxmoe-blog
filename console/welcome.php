<?php
include 'common.php';
include 'header.php';
include 'menu.php';
?>

<div class="main">
    <div class="body container foxmoe-welcome-wrapper">
        <?php include 'page-title.php'; ?>
        <style>
        .foxmoe-welcome-hero{position:relative;overflow:hidden;border-radius:26px;padding:42px clamp(24px,4vw,56px);background:linear-gradient(135deg,#ec4899,#f472b6);color:#fff;box-shadow:0 18px 42px -12px rgba(236,72,153,.55),0 8px 22px -8px rgba(0,0,0,.25);display:flex;flex-direction:column;gap:30px;}
        .foxmoe-welcome-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 75% 25%,rgba(255,255,255,.35),transparent 60%);mix-blend-mode:overlay;pointer-events:none;}
        .foxmoe-welcome-head h2{margin:0;font-size:clamp(1.9rem,3.2vw,3rem);font-weight:800;letter-spacing:-.03em;line-height:1.05;}
        .foxmoe-welcome-head p{margin:12px 0 0;font-size:clamp(.9rem,1.1vw,1rem);opacity:.9;max-width:680px;}
        .foxmoe-welcome-actions{display:flex;flex-wrap:wrap;gap:14px;}
        .foxmoe-welcome-actions a, .foxmoe-welcome-actions button{appearance:none;border:none;cursor:pointer;text-decoration:none;--grad:linear-gradient(135deg,#fff,#ffe4f1);--fg:#ec4899;padding:12px 18px;border-radius:14px;font-size:.85rem;font-weight:600;letter-spacing:.5px;display:inline-flex;align-items:center;gap:6px;color:var(--fg);background:var(--grad);box-shadow:0 6px 20px -6px rgba(255,255,255,.4),0 2px 8px -2px rgba(0,0,0,.25);transition:transform .25s,box-shadow .25s;position:relative;}
        .foxmoe-welcome-actions a:hover, .foxmoe-welcome-actions button:hover{transform:translateY(-3px);box-shadow:0 14px 30px -10px rgba(255,255,255,.55),0 6px 20px -6px rgba(0,0,0,.3);}
        .foxmoe-welcome-actions a.primary, .foxmoe-welcome-actions button.primary{background:linear-gradient(135deg,#fff,#ffeaf5);}
        .foxmoe-welcome-list{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;}
        .foxmoe-welcome-list li{background:rgba(255,255,255,.12);backdrop-filter:blur(4px);padding:18px 20px;border-radius:16px;box-shadow:0 4px 14px -6px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.2);display:flex;flex-direction:column;gap:6px;}
        .foxmoe-welcome-list a{color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;letter-spacing:.3px;}
        .foxmoe-welcome-list a:hover{text-decoration:underline;}
        .foxmoe-welcome-foot{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:.7rem;opacity:.85;}
        .foxmoe-welcome-foot a{color:#fff;text-decoration:none;}
        .foxmoe-welcome-foot a:hover{text-decoration:underline;}
        @media (prefers-color-scheme: dark){ .foxmoe-welcome-hero{background:linear-gradient(135deg,#50223a,#ec4899);} }
        @media (max-width:860px){ .foxmoe-welcome-hero{padding:40px 30px;border-radius:22px;} .foxmoe-welcome-head h2{font-size:2.2rem;} }
        @media (max-width:560px){ .foxmoe-welcome-actions{flex-direction:column;align-items:stretch;} .foxmoe-welcome-actions a, .foxmoe-welcome-actions button{width:100%;justify-content:center;} }
        </style>
        <div class="row typecho-page-main" role="main">
            <div class="col-mb-12">
                <div class="foxmoe-welcome-hero" id="foxmoe-welcome">
                    <div class="foxmoe-welcome-head">
                        <h2><?php _e('欢迎回来, %s', $user->screenName); ?></h2>
                        <p><?php _e('这里是您的 Foxmoe 控制中枢。开始创作、管理内容或微调站点设置。祝您写作愉快!'); ?></p>
                    </div>
                    <ul class="foxmoe-welcome-list">
                        <?php if($user->pass('contributor', true)): ?>
                        <li><a href="<?php $options->adminUrl('write-post.php'); ?>"><?php _e('撰写第一篇/新文章'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('分享你的想法'); ?></span></li>
                        <li><a href="<?php $options->adminUrl('manage-posts.php'); ?>"><?php _e('管理文章'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('草稿 / 发布 / 更新'); ?></span></li>
                        <li><a href="<?php $options->adminUrl('manage-comments.php'); ?>"><?php _e('审核评论'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('互动与反馈'); ?></span></li>
                        <?php if($user->pass('administrator', true)): ?>
                        <li><a href="<?php $options->adminUrl('options-general.php'); ?>"><?php _e('站点配置'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('标题 / 时区 / 语言'); ?></span></li>
                        <li><a href="<?php $options->adminUrl('plugins.php'); ?>"><?php _e('插件扩展'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('功能增强'); ?></span></li>
                        <li><a href="<?php $options->adminUrl('themes.php'); ?>"><?php _e('外观主题'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('风格与定制'); ?></span></li>
                        <?php endif; ?>
                        <?php else: ?>
                        <li><a href="<?php $options->siteUrl(); ?>"><?php _e('浏览站点'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('查看前台'); ?></span></li>
                        <?php endif; ?>
                        <li><a href="<?php $options->siteUrl(); ?>"><?php _e('访问首页'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('新窗口查看'); ?></span></li>
                        <li><a href="<?php $options->adminUrl('profile.php#change-password'); ?>" class="operate-delete"><?php _e('修改密码'); ?></a><span style="opacity:.65;font-size:.7rem;"><?php _e('提升安全'); ?></span></li>
                    </ul>
                    <div class="foxmoe-welcome-actions">
                        <a class="primary" href="<?php $options->adminUrl('write-post.php'); ?>"><?php _e('快速写作'); ?> →</a>
                        <a href="<?php $options->adminUrl('manage-posts.php'); ?>"><?php _e('内容管理'); ?></a>
                        <a href="<?php $options->adminUrl('plugins.php'); ?>"><?php _e('插件'); ?></a>
                        <a href="<?php $options->adminUrl('themes.php'); ?>"><?php _e('主题'); ?></a>
                        <a href="<?php $options->adminUrl('options-general.php'); ?>"><?php _e('设置'); ?></a>
                        <a href="<?php $options->siteUrl(); ?>" target="_blank" rel="noopener"><?php _e('前台'); ?></a>
                    </div>
                    <div class="foxmoe-welcome-foot">
                        <span><?php _e('当前主题'); ?>: <?php echo htmlspecialchars($options->theme); ?></span>
                        <span>· PHP <?php echo PHP_VERSION; ?></span>
                        <span>· MySQL <?php echo $db->getVersion(); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include 'copyright.php';
include 'common-js.php';
include 'footer.php';
?>
