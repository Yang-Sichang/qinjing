(function(){
  function $(id){return document.getElementById(id)}
  function songCount(){return typeof n==='function'?n():4}
  function sid(){return window.currentSongId||'liushui'}
  function progress(){try{return JSON.parse(localStorage.getItem('qjProgress:'+sid())||'{"completed":[]}')}catch(e){return {completed:[]}}}
  function puzzle(){try{return JSON.parse(localStorage.getItem('qjPuzzle:'+sid())||'{}')}catch(e){return {owned:[],placed:[],rewarded:[]}}}
  function deviceId(){if(window.qjDeviceId)return window.qjDeviceId;var k='qjDeviceId',id=localStorage.getItem(k);if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():'dev-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);localStorage.setItem(k,id)}window.qjDeviceId=id;return id}
  function utc8Date(){var d=new Date(Date.now()+8*60*60*1000);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')}
  function statsKey(){return 'qjCollectionStats:'+deviceId()}
  function stats(){try{var p=JSON.parse(localStorage.getItem(statsKey())||'{}');return {date:p.date||'',daily:Number.isFinite(Number(p.daily))?Number(p.daily):0,total:Number.isFinite(Number(p.total))?Number(p.total):0}}catch(e){return {date:'',daily:0,total:0}}}
  function currentStats(){var p=stats(),d=utc8Date();if(p.date!==d){p.date=d;p.daily=0;localStorage.setItem(statsKey(),JSON.stringify(p))}return p}
  function level(total){if(total<=5)return '小试牛刀';if(total<=20)return '熟能生巧';if(total<=100)return '日益精通';return '琴曲大师'}
  function renderStats(){var p=currentStats(),daily=$("dailyCollectionCount"),tag=$("masteryLevel");if(daily)daily.textContent='本日已经完成 '+p.daily+' 次画卷收集';if(tag){tag.textContent=level(p.total);tag.title='历史画卷收集 '+p.total+' 次'}}
  function recordCollection(){var p=currentStats();p.daily+=1;p.total+=1;localStorage.setItem(statsKey(),JSON.stringify(p));renderStats()}
  function allDone(){var p=progress();return Array.isArray(p.completed)&&p.completed.length>=songCount()}
  function renderRepeatButton(){var b=$("repeatPracticeBtn");if(b)b.disabled=!allDone()}
  function resetForRepeat(){
    if(!allDone()){renderRepeatButton();return}
    localStorage.setItem('qjProgress:'+sid(),JSON.stringify({completed:[]}));
    localStorage.setItem('qjPuzzle:'+sid(),JSON.stringify({owned:[],placed:[],rewarded:[]}));
    if(typeof window.currentPart!=='undefined')window.currentPart=0;
    if(typeof resetAudioUI==='function')resetAudioUI();
    if(typeof renderAll==='function')renderAll();
    if(typeof loadYuyin==='function')loadYuyin();
    renderRepeatButton();
    if(typeof toast==='function')toast('已重新开启练习，开始新一卷山水。');
    if(typeof scrollToRecording==='function')scrollToRecording();
    window.__qjRepeatLastPlaced=0;
  }
  var lastSong=sid(),initialPuzzle=puzzle(),lastPlaced=Array.isArray(initialPuzzle.placed)?initialPuzzle.placed.length:0;
  function tick(){
    var currentSong=sid(),p=puzzle(),placed=Array.isArray(p.placed)?p.placed.length:0,size=songCount()*songCount();
    if(currentSong!==lastSong){lastSong=currentSong;lastPlaced=placed}
    else if(placed===size&&size>0&&lastPlaced<size)recordCollection();
    lastPlaced=placed;
    renderStats();
    renderRepeatButton();
  }
  function init(){
    var b=$("repeatPracticeBtn");if(b)b.addEventListener('click',resetForRepeat);tick();setInterval(tick,400)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
