/* 语印类型 + 曲目隔离：界面显示带 emoji，数据库保存标准中文类型。 */
(function(){
  var typeMap={"🔴 难点":"难点","🟡 易错":"易错","🔵 节奏":"节奏","🟢 指法":"指法","🟣 意境":"意境","💬 我的点评":"我的点评"};
  function canonicalType(value){var s=String(value||"").trim();return typeMap[s]||s.replace(/^[🔴🟡🔵🟢🟣💬📝]\s*/,"").trim()}
  function songId(){return window.currentSongId||"liushui"}
  function notify(message){if(typeof toast==="function")toast(message)}
  document.addEventListener("click",async function(event){
    var btn=event.target.closest&&event.target.closest('[data-action="save-seal"]');if(!btn)return;
    event.preventDefault();event.stopImmediatePropagation();
    var textEl=document.getElementById("sealText"),text=textEl?textEl.value.trim():"";
    if(!text){notify("先写下一点你的琴心得吧。");return}
    if(!window.sb||!window.currentUser){notify("匿名身份还未建立，请稍后再试。");return}
    var type=canonicalType(window.selectedSealType||"🔴 难点"),valid=["难点","易错","节奏","指法","意境","我的点评"];
    if(valid.indexOf(type)<0){notify("无效的语印类型，请重新选择。\");return}
    btn.disabled=true;
    try{
      var result=await window.sb.rpc("submit_yuyin",{p_song_id:songId(),p_device_id:window.qjDeviceId||"legacy",p_section:window.currentPart+1,p_type:type,p_content:text});
      if(result.error){var msg=result.error.message||"语印提交失败";if(msg.indexOf("RATE_LIMIT")>=0)msg="每个用户每小时最多落3印";notify(msg);return}
      var data=result.data;if(data&&data.success===false){notify(data.message||"语印提交失败");return}
      textEl.value="";if(typeof closeSealComposer==="function")closeSealComposer();notify("语印已落下，后来琴友会看见它。");if(typeof loadYuyin==="function")await loadYuyin();
    }catch(error){console.error(error);notify("语印暂时没有盖上，请稍后再试。\")}finally{btn.disabled=false}
  },true);
})();
