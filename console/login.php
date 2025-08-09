<?php
include 'common.php';

if ($user->hasLogin()) {
    $response->redirect($options->adminUrl);
}
$rememberName = htmlspecialchars(\Typecho\Cookie::get('__typecho_remember_name', ''));
\Typecho\Cookie::delete('__typecho_remember_name');

$bodyClass = 'body-100';

include 'header.php';
?>
<link rel="stylesheet" href="css/foxmoe-auth.css" />
<style>
/* 页面特定微调（若需要） */
/* 这里可以追加仅登录页差异 */
</style>
<div class="foxmoe-login-layout">
  <div class="foxmoe-login-hero">
    <img id="foxmoeHero" src="" data-src="https://www.dmoe.cc/random.php" alt="Background" referrerpolicy="no-referrer" decoding="async" />
    <div class="foxmoe-login-overlay">
      <h1><?php echo htmlspecialchars($options->title); ?></h1>
      <p>欢迎回来，继续创作你的故事。</p>
    </div>
  </div>
  <div class="foxmoe-login-panel fade-in-scale">
    <div class="foxmoe-login-header">
      <h2 class="title">登录到</h2>
      <div class="subtitle">Foxmoe通行证账户</div>
    </div>
    <form action="<?php $options->loginAction(); ?>" method="post" name="login" role="form">
      <div class="foxmoe-field">
        <label for="name">用户名</label>
        <input type="text" id="name" name="name" value="<?php echo $rememberName; ?>" autocomplete="username" autofocus />
      </div>
      <div class="foxmoe-field">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" autocomplete="current-password" />
      </div>
      <div class="foxmoe-actions">
        <button type="submit" class="foxmoe-login-btn">登录</button>
        <input type="hidden" name="referer" value="<?php echo $request->filter('html')->get('referer'); ?>" />
        <label class="foxmoe-remember" for="remember">
          <input<?php if(\Typecho\Cookie::get('__typecho_remember_remember')): ?> checked<?php endif; ?> type="checkbox" name="remember" value="1" id="remember" /> 记住我
        </label>
      </div>
    </form>
    <p class="foxmoe-more">
      <?php if($options->allowRegister): ?><a href="<?php $options->registerUrl(); ?>">注册账号</a> · <?php endif; ?>     
         <a href="<?php $options->siteUrl(); ?>">返回首页</a>
    </p>
  </div>
</div>
<script>
(function(){
  var img = document.getElementById('foxmoeHero');
  if(!img) return;
  function load(){ if(img.dataset.loaded) return; var real = img.getAttribute('data-src'); if(!real) return; var t = new Image(); t.referrerPolicy='no-referrer'; t.onload=function(){ img.src = real; img.dataset.loaded='1'; img.classList.add('loaded'); }; t.src= real + (real.indexOf('?')>-1?'&':'?') + 'ts=' + Math.floor(Date.now()/60000); }
  if('requestIdleCallback' in window){ requestIdleCallback(load,{timeout:1500}); } else { window.addEventListener('load', load); }
})();
</script>
<?php include 'common-js.php'; ?>
<?php include 'footer.php'; ?>
