/* 语印设备身份：匿名共享语印；设备号用于后台识别，琴友编号只显示随机感数字。 */
(function(){
  var DEVICE_KEY="qjDeviceId", LABEL_KEY="qjUserLabel";
  function deviceId(){
    var id=localStorage.getItem(DEVICE_KEY);
    if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():"dev-"+Date.now()+"-"+Math.random().toString(36).slice(2,10);localStorage.setItem(DEVICE_KEY,id)}
    return id;
  }
  function userLabel(){
    var label=localStorage.getItem(LABEL_KEY);
    if(!label){label=String(Math.floor(1000+Math.random()*9000));localStorage.setItem(LABEL_KEY,label)}
    return label;
  }
  function sharedLabel(id){
    var s=String(id||""),hash=0,i;
    for(i=0;i<s.length;i++)hash=((hash<<5)-hash+s.charCodeAt(i))|0;
    return String(1000+Math.abs(hash)%9000);
  }
  function esc(s){return String(s==null?"":s).replace(/[&<>\"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})}
  function songId(){return window.currentSongId||"liushui"}
  function labelForUser(id){
    if(window.currentUser&&id===window.currentUser.id)return "我 · 琴友"+userLabel();
    return "琴友 · "+sharedLabel(id);
  }
  async function loadAllYuyin(){
    if(!window.sb)return;
    var box=document.getElementById("sealList"),count=document.getElementById("sealCount");
    if(!box)return;
    try{
      var section=(typeof window.currentPart!=="undefined"?window.currentPart+1:1);
      var result=await window.sb.from("yuyin").select("id,user_id,song_id,section,type,content,created_at").eq("song_id",songId()).eq("section",section).order("created_at",{ascending:false}).limit(50);
      if(result.error)throw result.error;
      var rows=result.data||[];
      if(count)count.textContent=rows.length+" 枚语印";
      if(!rows.length){box.innerHTML='<div class="note"><p>这一段还没有语印。留下第一枚，给后来琴友一点线索。</p><small>匿名共享 · 本设备会自动获得一个琴友编号</small></div>';return}
      box.innerHTML=rows.map(function(row){
        var type=esc(row.type||"语印"),content=esc(row.content||"");
        var when=row.created_at?new Date(row.created_at).toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}):"刚刚";
        var mine=window.currentUser&&row.user_id===window.currentUser.id;
        return '<div class="note" data-yuyin-id="'+esc(row.id)+'"><p><span class="note-type">'+type+'</span> '+content+'</p><small>'+labelForUser(row.user_id)+(mine?' · 这是你的语印':'')+' · '+when+'</small></div>';
      }).join("");
    }catch(e){console.error(e);if(count)count.textContent="加载失败";}
  }
  window.qjDeviceId=deviceId();
  window.qjDeviceLabel="琴友 · "+userLabel();
  window.loadYuyin=loadAllYuyin;
  if(document.readyState!=="loading")loadAllYuyin();else document.addEventListener("DOMContentLoaded",loadAllYuyin);
})();
