/* 魂の定着 — 共通 */
var NUMK = ["一","二","三","四","五","六","七","八","九","十"];
var KANA = ["壱","弐","参","肆","伍","陸"];

function el(tag,attrs){
  var n=document.createElement(tag), kids=[].slice.call(arguments,2);
  if(attrs) for(var k in attrs){
    if(k==="class") n.className=attrs[k];
    else if(k==="style") n.setAttribute("style",attrs[k]);
    else if(k.indexOf("on")===0) n.addEventListener(k.slice(2),attrs[k]);
    else if(attrs[k]!==false&&attrs[k]!=null) n.setAttribute(k,attrs[k]===true?"":attrs[k]);
  }
  kids.flat(Infinity).forEach(function(c){ if(c==null||c===false) return; n.append(c.nodeType?c:document.createTextNode(String(c))); });
  return n;
}
function shuffle(n){ var a=[]; for(var i=0;i<n;i++) a.push(i); for(i=n-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function copyText(text,btn){
  var old=btn.textContent;
  var done=function(ok){ btn.textContent=ok?"写しました":"写せません。文字を選んでコピーしてください"; setTimeout(function(){btn.textContent=old;},2200); };
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){done(true);},function(){done(fallbackCopy(text));});
  else done(fallbackCopy(text));
}
function fallbackCopy(text){
  try{ var t=document.createElement("textarea"); t.value=text; t.style.position="fixed"; t.style.opacity="0"; document.body.append(t); t.select(); var ok=document.execCommand("copy"); t.remove(); return ok; }catch(e){ return false; }
}
function fmtTime(iso){ if(!iso) return ""; try{ return new Date(iso).toLocaleString("ja-JP",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}); }catch(e){ return ""; } }
function lsGet(k,fb){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?fb:v; }catch(e){ return fb; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } }

/* 合言葉 */
var ABC="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function pwCheck(s){ var h=17; for(var i=0;i<s.length;i++) h=(h*37+ABC.indexOf(s[i])+11)%1021; return ABC[h%32]+ABC[Math.floor(h/32)%32]; }
function genPw(){ var s=""; for(var i=0;i<4;i++) s+=ABC[Math.floor(Math.random()*32)]; return s+"-"+pwCheck(s); }
function normPw(raw){
  var t=String(raw).normalize("NFKC").replace(/\s+/g,"").toUpperCase();
  if(!t||Array.from(t).length>20) return null;
  var m=t.match(/^([A-Z0-9]{4})-?([A-Z0-9]{2})$/);
  return m?m[1]+"-"+m[2]:t;
}

/* 星の刻印 */
function sealCheck(d){ var s=7; for(var i=0;i<d.length;i++) s=(s*31+(+d[i]+1)*(i+5))%1021; return ABC[s%32]+ABC[Math.floor(s/32)%32]; }
function sealCode(ans){ var d=ans.join(""); return d.slice(0,4)+"-"+d.slice(4,8)+"-"+d.slice(8)+"-"+sealCheck(d); }
function sealText(r){
  return "【星の刻印】\n合言葉："+r.pw+"\n名前："+r.pcName+(r.ho?"\n宿命："+r.ho:"")+"\n刻印："+sealCode(r.answers)+(r.words?"\n星への言葉："+r.words:"");
}

function mast(sub){
  return el("header",{class:"mast"},el("h1",null,"魂の定着"),sub?el("p",{class:"lede"},sub):null);
}

/* 夜空 */
function drawSky(){
  var c=document.getElementById("sky"),dpr=Math.min(2,window.devicePixelRatio||1);
  var w=window.innerWidth,h=window.innerHeight; c.width=w*dpr; c.height=h*dpr;
  var x=c.getContext("2d"); x.scale(dpr,dpr);
  var g=x.createRadialGradient(w*.5,-h*.2,0,w*.5,-h*.2,h*1.2); g.addColorStop(0,"#1a2238"); g.addColorStop(1,"#0b0e17");
  x.fillStyle=g; x.fillRect(0,0,w,h);
  var s=7, rnd=function(){ s=(s*16807)%2147483647; return s/2147483647; };
  var n=Math.round(w*h/2600);
  for(var i=0;i<n;i++){ var r=rnd()*1.1+.2; x.globalAlpha=.25+rnd()*.6; x.fillStyle="#dfe6f2"; x.beginPath(); x.arc(rnd()*w,rnd()*h,r,0,Math.PI*2); x.fill(); }
  for(i=0;i<5;i++){ var ex=rnd()*w,ey=rnd()*h*.55,er=1.6+rnd()*1.4; x.globalAlpha=.9;
    var eg=x.createRadialGradient(ex,ey,0,ex,ey,er*7); eg.addColorStop(0,"rgba(220,232,255,.55)"); eg.addColorStop(1,"rgba(220,232,255,0)");
    x.fillStyle=eg; x.beginPath(); x.arc(ex,ey,er*7,0,Math.PI*2); x.fill(); x.fillStyle="#f4f8ff"; x.beginPath(); x.arc(ex,ey,er,0,Math.PI*2); x.fill(); }
  x.globalAlpha=1;
}
(function(){ var rt; drawSky(); window.addEventListener("resize",function(){ clearTimeout(rt); rt=setTimeout(drawSky,150); }); })();
