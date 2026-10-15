/* 魂の定着 — PL */
(function(){
"use strict";
var app=document.getElementById("app");
var st={step:"intro",pw:"",pc:"",ho:"",answers:[],orders:[],i:0,words:"",code:"",err:""};

function usedHere(){ return lsGet("aster.used",[]); }
function top(){ window.scrollTo({top:0}); }

function render(){
  app.replaceChildren();
  if(st.step==="intro") return intro();
  if(st.step==="q") return question();
  if(st.step==="final") return final();
  if(st.step==="done") return done();
}

function intro(){
  app.append(mast("ブローチに手を当て、己を晒せ。"));
  var ready=function(){ return !!(st.pw.trim()&&st.pc.trim()&&st.ho); };
  var btn=el("button",{class:"btn",disabled:!ready(),onclick:begin},"問いを受ける");
  var pw=el("input",{type:"text",id:"pw",class:"pw",maxlength:"24",autocomplete:"off",autocapitalize:"characters",spellcheck:"false",value:st.pw,
    oninput:function(e){ st.pw=e.target.value; btn.disabled=!ready(); }});
  var pc=el("input",{type:"text",id:"pc",maxlength:"40",autocomplete:"off",value:st.pc,
    oninput:function(e){ st.pc=e.target.value; btn.disabled=!ready(); }});
  app.append(el("section",{class:"card fade"},
    el("label",{for:"pw"},"合言葉（観測者から授かった言葉）",pw),
    el("label",{for:"pc"},"貴方の名を、ここに記しなさい",pc),
    el("div",{class:"fate",role:"radiogroup","aria-labelledby":"fate-h"},
      el("span",{id:"fate-h",class:"fate-h"},"貴方が背負う宿命の札を、一枚選びなさい"),
      el("div",{class:"fate-grid"},HOS.map(function(h){
        return el("button",{type:"button",class:"fate-card",role:"radio","aria-checked":String(st.ho===h.id),onclick:function(){ st.ho=h.id; render(); }},
          el("span",{class:"fate-no"},h.no),el("span",{class:"fate-name"},"『"+h.name+"』"),el("span",{class:"fate-line"},h.line));
      }))),
    st.err?el("p",{class:"err"},st.err):null,
    el("p",{class:"note"},"問いは全部で十。一つの合言葉で、魂を晒せるのは一度きり。審判は、星から告げられる。"),
    btn));
  var hist=lsGet("aster.seals",[]).filter(function(r){ return r&&Array.isArray(r.answers)&&r.answers.length===Q.length; });
  if(hist.length) app.append(history(hist));
}

function question(){
  var q=Q[st.i];
  app.append(mast(null));
  app.append(el("section",{class:"card fade"},
    el("div",{class:"qhead"},el("span",{class:"qnum"},q.last?"最後の問い":"第"+NUMK[st.i]+"の問い"),el("span",{class:"qcount"},(st.i+1)+" / "+Q.length)),
    el("div",{class:"meter","aria-hidden":"true"},Q.map(function(_,k){ return el("i",{class:k<=st.i?"on":""}); })),
    el("p",{class:"qtext"},q.q),
    el("div",{class:"opts",role:"group","aria-label":"選択肢"},st.orders[st.i].map(function(orig,pos){
      return el("button",{class:"opt","aria-pressed":String(st.answers[st.i]===orig),onclick:function(){
        st.answers[st.i]=orig; if(st.i<Q.length-1) st.i++; else st.step="final"; render(); top(); }},
        el("span",{class:"k"},KANA[pos]),el("span",null,q.o[orig]));
    })),
    el("div",{class:"navrow"},
      st.i>0?el("button",{class:"btn ghost small",onclick:function(){ st.i--; render(); }},"ひとつ前の問いへ"):el("span"),
      el("span",{class:"note"},"選んだ時点で、次の問いへ進みます"))));
}

function final(){
  app.append(mast(null));
  var ta=el("textarea",{id:"words",maxlength:"200",oninput:function(e){ st.words=e.target.value; }});
  ta.value=st.words;
  app.append(el("section",{class:"card fade"},
    el("h2",null,"すべての問いに、魂が答えた。"),
    el("p",{class:"lede"},"最後に、星へ伝えたい言葉があれば書き添えなさい。答えを委ねれば、もう問いには戻れない。"),
    el("label",{for:"words"},"星への言葉（任意・200字まで）",ta),
    el("div",{class:"navrow"},
      el("button",{class:"btn ghost small",onclick:function(){ st.step="q"; st.i=Q.length-1; render(); }},"問いに戻る"),
      el("button",{class:"btn",onclick:finish},"星に答えを委ねる"))));
}

function done(){
  app.append(mast(null));
  app.append(el("section",{class:"card done fade"},
    el("div",{class:"brooch","aria-hidden":"true"}),
    el("h2",null,"定着は、終わった。"),
    el("p",{class:"lede"},"胸元のブローチが、急速に冷えていく。",el("br"),"貴方の魂は、どの座に属するのか。",el("br"),"その審判は、まもなく星から告げられる。"),
    el("p",{class:"lede",style:"color:var(--star)"},"この刻印を写し取り、観測者（KP）のもとへ届けなさい。"),
    el("div",{class:"seal"},st.code),
    el("button",{class:"btn",style:"align-self:center",onclick:function(e){ copyText(st.code,e.currentTarget); }},"星の刻印を写す"),
    el("p",{class:"note"},"ボタンを押すと刻印が写されます。KPとのチャットに、そのまま貼り付けてください。")));
  app.append(el("button",{class:"switch",onclick:function(){ st={step:"intro",pw:"",pc:"",ho:"",answers:[],orders:[],i:0,words:"",code:"",err:""}; render(); }},"はじめの画面に戻る"));
}

function begin(){
  var pw=normPw(st.pw);
  if(!pwValid(pw)){ st.err="その言葉に、星は応えない。観測者から授かった合言葉を、末尾の印まで正しく記しなさい。"; render(); return; }
  if(usedHere().indexOf(pw)>=0){ st.err="その合言葉による定着は、すでに終わっている。"; render(); return; }
  st.pw=pw; st.err=""; st.step="q"; st.i=0; st.answers=[]; st.words="";
  st.orders=Q.map(function(q){ return q.last?q.o.map(function(_,k){ return k; }):shuffle(q.o.length); });
  render(); top();
}
function finish(){
  var rec={pw:st.pw,pcName:st.pc.trim().slice(0,40),ho:st.ho,answers:st.answers.slice(),words:st.words.trim().slice(0,200),at:new Date().toISOString()};
  st.code=sealText(rec);
  var used=usedHere(); used.push(rec.pw); lsSet("aster.used",used.slice(-50));
  var h=lsGet("aster.seals",[]); h.unshift(rec); lsSet("aster.seals",h.slice(0,10));
  st.step="done"; render(); top();
}
function history(h){
  return el("section",{class:"card fade"},
    el("h3",null,"これまでの星の刻印"),
    el("p",{class:"note"},"この端末のこのブラウザにだけ残っています。KPに届け損ねたときは、ここから写し直してください。"),
    el("div",{class:"results"},h.slice(0,10).map(function(r){
      return el("div",{class:"res",style:"--c:var(--line)"},
        el("div",{class:"res-top"},
          el("div",{class:"who"},el("strong",{style:"font-size:17px"},r.pcName||"名前なし"),el("small",null,[r.ho,"合言葉 "+r.pw,fmtTime(r.at)].filter(Boolean).join(" · "))),
          el("button",{class:"btn small",onclick:function(e){ copyText(sealText(r),e.currentTarget); }},"刻印を写す")));
    })));
}

render();
})();
