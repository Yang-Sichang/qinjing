(function(){
  function $(id){return document.getElementById(id)}
  function songCount(){return typeof n==='function'?n():4}
  function progress(){try{return JSON.parse(localStorage.getItem('qjProgress:'+(window.currentSongId||'liushui'))||'{"completed":[]}')}catch(e){return {completed:[]}}}
  function puzzle(){try{return JSON.parse(localStorage.getItem('qjPuzzle:'+(window.currentSongId||'liushui'))||'{}')}catch(e){return {owned:[],placed:[],rewarded:[]}}}
  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function dailyKey(){return 'qjDailyCollections:'+(window.currentSongId||'liushui')}
  function dailyCount(){try{var p=JSON.parse(localStorage.getItem(dailyKey())||'{}');return p.date===today()&&Number.isFinite(p.count)?p.count:0}catch(e){return 0}}
  function renderDaily(){var el=$("dailyCollectionCount");if(el)el.textContent='本日已经完成'+dailyCount()+'次画卷收集'}
  function recordCollection(){var p={date:today(),count:dailyCount()+1};localStorage.setItem(dailyKey(),JSON.stringify(p));renderDaily()}
  function allDone(){var p=progress();return Array.isArray(p.completed)&&p.completed.length>=songCount()}
  function renderRepeatButton(){var b=$("repeatPracticeBtn");if(b)b.disabled=!allDone()}
  function resetForRepeat(){
    if(!allDone()){renderRepeatButton();return}
    var sid=window.currentSongId||'liushui';
    localStorage.setItem('qjProgress:'+sid,JSON.stringify({completed:[]}));
    localStorage.setItem('qjPuzzle:'+sid,JSON.stringify({owned:[],placed:[],rewarded:[]}));
    if(typeof window.currentPart!=='undefined')window.currentPart=0;
    if(typeof resetAudioUI==='function')resetAudioUI();
    if(typeof renderAll==='function')renderAll();
    if(typeof loadYuyin==='function')loadYuyin();
    renderRepeatButton();
    if(typeof toast==='function')toast('已重新开启练习，开始新一卷山水。');
    if(typeof scrollToRecording==='function')scrollToRecording();
    window.__qjRepeatLastPlaced=0;
  }
  var lastSong=window.currentSongId||'liushui';
  var lastPlaced=0;
  function tick(){
    var sid=window.currentSongId||'liushui';
    if(sid!==lastSong){lastSong=sid;lastPlaced=0}
    var p=puzzle(),placed=Array.isArray(p.placed)?p.placed.length:0,size=songCount()*songCount();
    if(placed===size&&size>0&&lastPlaced<size)recordCollection();
    lastPlaced=placed;
    renderDaily();
    renderRepeatButton();
  }
  function init(){
    var b=$("repeatPracticeBtn");
    if(b)b.addEventListener('click',resetForRepeat);
    tick();
    setInterval(tick,400);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
