(function(){
  function $(id){return document.getElementById(id)}
  function showUnavailable(){
    var main=$(".main");
    if(!main)return;
    var old=$("materialComingSoon");
    if(old)old.remove();
    Array.prototype.forEach.call(main.children,function(el){el.style.display='none'});
    var box=document.createElement('section');
    box.id='materialComingSoon';
    box.className='panel center material-coming-soon';
    box.innerHTML='<div class="coming-soon-mark">山水待续</div><h2>素材完善中，敬请期待</h2><p>当前曲目的练习、参考音频与画卷素材正在完善中。</p>';
    main.appendChild(box);
  }
  function restore(){
    var main=$(".main");
    if(!main)return;
    var box=$("materialComingSoon");
    if(box)box.remove();
    Array.prototype.forEach.call(main.children,function(el){el.style.display=''});
  }
  function check(){
    if(window.currentSongId&&window.currentSongId!=='liushui')showUnavailable();
    else restore();
  }
  function init(){
    var select=$("songSelect");
    if(select)select.addEventListener('change',function(){setTimeout(check,0)});
    check();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
