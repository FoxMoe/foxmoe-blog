<?php
include 'common.php';

if ($user->hasLogin() || !$options->allowRegister) {
    $response->redirect($options->siteUrl);
}
$rememberName = htmlspecialchars(\Typecho\Cookie::get('__typecho_remember_name'));
$rememberMail = htmlspecialchars(\Typecho\Cookie::get('__typecho_remember_mail'));
\Typecho\Cookie::delete('__typecho_remember_name');
\Typecho\Cookie::delete('__typecho_remember_mail');

$bodyClass = 'body-100';

include 'header.php';
?>
<link rel="stylesheet" href="css/foxmoe-auth.css" />
<style>
/* 页面特定微调（仅注册页差异可放这里） */
</style>
<div class="foxmoe-login-layout">
  <div class="foxmoe-login-hero">
    <img id="foxmoeHero" src="" data-src="https://www.dmoe.cc/random.php" alt="Background" referrerpolicy="no-referrer" decoding="async" />
    <div class="foxmoe-login-overlay">
      <h1><?php echo htmlspecialchars($options->title); ?></h1>
      <p>欢迎，创建你的故事。</p>
    </div>
  </div>
  <div class="foxmoe-login-panel fade-in-scale">
    <div class="foxmoe-login-header">
      <h2 class="title">注册到</h2>
      <div class="subtitle">Foxmoe通行证账户</div>
    </div>
    <form action="<?php $options->registerAction(); ?>" method="post" name="register" role="form">
      <div class="foxmoe-field">
        <label for="name">用户名</label>
        <input type="text" id="name" name="name" value="<?php echo $rememberName; ?>" autocomplete="username" autofocus />
      </div>
      <div class="foxmoe-field">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" autocomplete="new-password" />
      </div>
      <div class="foxmoe-field">
        <label for="confirm">确认密码</label>
        <input type="password" id="confirm" name="confirm" autocomplete="new-password" />
      </div>
    <div class="foxmoe-field">
        <label for="mail">邮箱</label>
        <input type="email" id="mail" name="mail" value="<?php echo $rememberMail; ?>" autocomplete="email" />
      </div>
      <button type="submit" class="foxmoe-login-btn">注册</button>
    </form>
    <p class="foxmoe-more">
      <a href="<?php $options->adminUrl('login.php'); ?>">已有账号? 登录</a>
      · <a href="<?php $options->siteUrl(); ?>">返回首页</a>
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
