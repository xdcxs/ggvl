/* GG GOD VAULT LOUDER - made by fazil */
(function(){if(window.GV)return;
var P=[['LOUD','gain','Mic gain dB',0,100,12],['LOUD','drive','Drive',0,100,30],['LOUD','out','Output dB',-24,24,0],['LOUD','ceil','Limiter ceiling dB',-30,0,-1],['LOUD','cT','Comp threshold',-60,0,-24],['LOUD','cR','Comp ratio',1,20,6],['LOUD','cA','Comp attack ms',0,200,3],['LOUD','cRel','Comp release ms',10,1000,120],['LOUD','cK','Comp knee',0,40,6],
['SCREAM','scr','Scream',0,100,0],['SCREAM','fold','Wavefold',0,100,0],['SCREAM','crush','Bit-crush',0,100,0],['SCREAM','ring','Ring-mod depth',0,100,0],['SCREAM','ringF','Ring-mod Hz',20,2000,150],
['FILTER','hp','High-pass Hz',20,2000,80],['FILTER','hpQ','High-pass Q',.1,10,.7],['FILTER','lp','Low-pass Hz',1000,20000,20000],['FILTER','lpQ','Low-pass Q',.1,10,.7],['FILTER','nf','Notch Hz',50,10000,1000],['FILTER','nQ','Notch Q',.1,30,5],['FILTER','gT','Noise gate dB',-90,-10,-60],
['SPACE','wideMs','Wider ms',0,40,12],['SPACE','rMix','Reverb mix',0,100,0],['SPACE','rDec','Reverb decay s',.2,8,2.5],['SPACE','dT','Echo time ms',20,1000,250],['SPACE','dFb','Echo feedback',0,90,35],['SPACE','dMix','Echo mix',0,100,0],['SPACE','trR','Tremolo Hz',.5,20,5],['SPACE','trD','Tremolo depth',0,100,0],['SPACE','vbR','Vibrato Hz',.5,12,5],['SPACE','vbD','Vibrato ms',0,10,0]];
var EF=[60,120,250,500,1000,2000,4000,8000,12000,16000];EF.forEach(function(f,i){P.push(['EQ','e'+i,(f>=1000?f/1000+'k':f)+' Hz',-20,20,0])});
P.push(['PLAYER','mp','MP3 volume',0,200,100],['PLAYER','mpm','Mic level during MP3',0,100,100]);
var T=[['wide','Wider',0],['notch','Notch filter',0],['gate','Noise gate',0],['mon','Hear myself',0],['loop','Loop MP3',0]];
var PR={'Loud':'gain:30,drive:50,cT:-30,cR:10,ceil:-1','Loud + clear':'gain:24,drive:25,cT:-28,cR:8,e5:3,e6:4,hp:100','Scream':'gain:55,drive:80,scr:70,fold:30,cT:-35,cR:12','God mode':'gain:70,drive:90,scr:60,fold:40,cT:-40,cR:16,e1:6,e6:5','Max 100 dB':'gain:100,drive:100,scr:100,cT:-50,cR:20,ceil:-1','Bass boost':'gain:28,e0:10,e1:8,e2:4,drive:35','Radio':'gain:30,hp:300,lp:3500,e5:6,drive:40,cR:12','Robot':'ring:70,ringF:120,gain:24','Wide stage':'wideMs:20,rMix:20,rDec:2,gain:24','Cave':'rMix:55,rDec:5,dMix:25,dT:380,gain:22','Telephone':'hp:500,lp:2800,drive:45,gain:28','Clean':'gain:12,drive:0,scr:0,fold:0,crush:0,ring:0,rMix:0,dMix:0,wideMs:0,trD:0,vbD:0'};
var G=window.GV={cfg:{},on:{},ctx:null,n:{}};P.forEach(function(p){G.cfg[p[1]]=p[5]});T.forEach(function(t){G.on[t[0]]=t[2]});
function db(x){return Math.pow(10,x/20)}
function curve(){var c=G.cfg,n=2048,a=new Float32Array(n),g=1+c.drive/10+c.scr/5,st=2+(1-c.crush/100)*62;for(var i=0;i<n;i++){var x=i/(n-1)*2-1,y=Math.tanh(x*g);if(c.fold>0)y=Math.sin(y*(1+c.fold/20)*Math.PI/2);if(c.crush>0)y=Math.round(y*st)/st;a[i]=y}return a}
function ir(C,s){var l=Math.max(1,C.sampleRate*s|0),b=C.createBuffer(2,l,C.sampleRate);for(var ch=0;ch<2;ch++){var d=b.getChannelData(ch);for(var i=0;i<l;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/l,2.5)}return b}
var lastDec=0;
function ap(){var n=G.n,c=G.cfg,o=G.on,C=G.ctx;if(!C||!n.pre)return;var t=C.currentTime,S=function(p,v){p.setTargetAtTime(v,t,.02)};
S(n.pre.gain,db(c.gain));S(n.hp.frequency,c.hp);S(n.hp.Q,c.hpQ);S(n.lp.frequency,c.lp);S(n.lp.Q,c.lpQ);S(n.nt.frequency,c.nf);S(n.nt.Q,o.notch?c.nQ:.0001);
n.eq.forEach(function(e,i){S(e.gain,c['e'+i])});n.sh.curve=curve();
n.cp.threshold.value=c.cT;n.cp.ratio.value=c.cR;n.cp.attack.value=c.cA/1000;n.cp.release.value=c.cRel/1000;n.cp.knee.value=c.cK;
n.lim.threshold.value=c.ceil;S(n.out.gain,db(c.out));S(n.rw.gain,c.rMix/100);S(n.dw.gain,c.dMix/100);S(n.dl.delayTime,c.dT/1000);S(n.fb.gain,c.dFb/100);
S(n.wd.delayTime,o.wide?c.wideMs/1000:0);S(n.rg.gain,1-c.ring/200);S(n.rgd.gain,c.ring/200);n.ro.frequency.value=c.ringF;
S(n.tm.gain,1-c.trD/200);S(n.tmd.gain,c.trD/200);n.to.frequency.value=c.trR;n.vo.frequency.value=c.vbR;S(n.vd.gain,c.vbD/1000);
S(n.mpg.gain,c.mp/100);S(n.mic.gain,G.playing?c.mpm/100:1);S(n.mon.gain,o.mon?1:0);
if(Math.abs(c.rDec-lastDec)>.05){n.cv.buffer=ir(C,c.rDec);lastDec=c.rDec}}
function build(stream){if(G.ctx)try{G.ctx.close()}catch(e){}
var C=G.ctx=new(window.AudioContext||window.webkitAudioContext)(),n=G.n={},N=function(k,t,f){n[k]=C['create'+t]();if(f)f(n[k]);return n[k]},B=function(k,ty){return N(k,'BiquadFilter',function(b){b.type=ty})};
var src=C.createMediaStreamSource(stream);N('mic','Gain');N('pre','Gain');B('hp','highpass');B('lp','lowpass');B('nt','notch');
n.eq=EF.map(function(f){var b=C.createBiquadFilter();b.type='peaking';b.frequency.value=f;b.Q.value=1.1;return b});
N('sh','WaveShaper',function(s){s.oversample='4x'});N('cp','DynamicsCompressor');N('rg','Gain');N('ro','Oscillator');N('rgd','Gain');N('tm','Gain');N('to','Oscillator');N('tmd','Gain');
N('vdl','Delay',function(d){d.delayTime.value=.01});N('vo','Oscillator');N('vd','Gain');N('wd','Delay');N('mix','Gain');N('cv','Convolver');N('rw','Gain');N('dl','Delay',function(d){});N('fb','Gain');N('dw','Gain');
N('lim','DynamicsCompressor',function(l){l.ratio.value=20;l.knee.value=0;l.attack.value=.001;l.release.value=.08});N('hard','WaveShaper',function(s){s.curve=new Float32Array([-1,1])});N('out','Gain');N('gate','Gain');N('mpg','Gain');N('mon','Gain');
var d=n.dest=C.createMediaStreamDestination();d.channelCount=2;
var ch=[src,n.mic,n.pre,n.hp,n.nt,n.lp].concat(n.eq,[n.sh,n.cp,n.rg,n.tm,n.vdl,n.mix]);for(var i=0;i<ch.length-1;i++)ch[i].connect(ch[i+1]);
n.ro.connect(n.rgd);n.rgd.connect(n.rg.gain);n.to.connect(n.tmd);n.tmd.connect(n.tm.gain);n.vo.connect(n.vd);n.vd.connect(n.vdl.delayTime);
n.mix.connect(n.cv);n.cv.connect(n.rw);n.mix.connect(n.dl);n.dl.connect(n.fb);n.fb.connect(n.dl);n.dl.connect(n.dw);
var m=C.createChannelMerger(2);n.mix.connect(m,0,0);n.rw.connect(m,0,0);n.dw.connect(m,0,0);n.mix.connect(n.wd);n.wd.connect(m,0,1);n.rw.connect(m,0,1);n.dw.connect(m,0,1);
m.connect(n.lim);n.mpg.connect(n.lim);n.lim.connect(n.hard);n.hard.connect(n.gate);n.gate.connect(n.out);n.out.connect(d);n.out.connect(n.mon);n.mon.connect(C.destination);
['ro','to','vo'].forEach(function(k){n[k].start()});
var an=C.createAnalyser();an.fftSize=512;n.pre.connect(an);var buf=new Float32Array(512);
clearInterval(G.gt);G.gt=setInterval(function(){if(!G.on.gate){n.gate.gain.value=1;return}an.getFloatTimeDomainData(buf);var s=0;for(var i=0;i<512;i++)s+=buf[i]*buf[i];var lv=20*Math.log10(Math.sqrt(s/512)/db(G.cfg.gain)+1e-9);n.gate.gain.setTargetAtTime(lv>G.cfg.gT?1:0,C.currentTime,.03)},20);
lastDec=0;ap();return d.stream}
var md=navigator.mediaDevices;if(md&&md.getUserMedia){var og=md.getUserMedia.bind(md);md.getUserMedia=function(c){return og(c).then(function(s){if(!s.getAudioTracks().length)return s;var o=build(s);setStat();return new MediaStream(o.getAudioTracks().concat(s.getVideoTracks()))})}}
G.set=function(k,v){G.cfg[k]=+v;ap()};G.tog=function(k,v){G.on[k]=v;ap()};G.apply=function(s){s.split(',').forEach(function(p){var a=p.split(':');G.cfg[a[0]]=+a[1]});ap();if(G.sync)G.sync()};
var cur=null;G.play=function(f){if(!G.ctx){alert('Join a voice channel first so the mic is active.');return}G.stop();var r=new FileReader();r.onload=function(){G.ctx.decodeAudioData(r.result,function(b){var s=G.ctx.createBufferSource();s.buffer=b;s.loop=!!G.on.loop;s.connect(G.n.mpg);s.onended=function(){G.playing=false;ap()};s.start();cur=s;G.playing=true;ap()})};r.readAsArrayBuffer(f)};
G.stop=function(){if(cur){try{cur.onended=null;cur.stop()}catch(e){}}G.playing=false;ap()};
var rec=null,chunks=[];G.rec=function(on,cb){if(on){if(!G.n.dest){alert('Join a voice channel first.');return false}chunks=[];rec=new MediaRecorder(G.n.dest.stream);rec.ondataavailable=function(e){chunks.push(e.data)};rec.onstop=function(){cb(URL.createObjectURL(new Blob(chunks,{type:rec.mimeType})))};rec.start();return true}else if(rec){rec.stop()}};
var stat;function setStat(){if(stat)stat.textContent=G.ctx?'LIVE: mic is going through the vault':'Join a voice channel to start'}
function ui(){if(document.getElementById('ggvl')||!document.body)return;var h=document.createElement('div');h.id='ggvl';
h.innerHTML='<style>#ggvl *{box-sizing:border-box;font-family:system-ui,sans-serif}#gvb{position:fixed;z-index:99999;right:14px;bottom:90px;width:58px;height:58px;border-radius:50%;background:#07060b;border:3px solid #f2b632;color:#f2b632;font:900 20px Arial Black,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px #f2b632aa;touch-action:none;animation:gvp 2s infinite}@keyframes gvp{50%{box-shadow:0 0 30px #ff4d2e}}#gvp{position:fixed;z-index:99998;inset:4% 3%;background:#0d0b14f2;border:1px solid #f2b632;border-radius:10px;color:#efe6d2;display:none;flex-direction:column;overflow:hidden}#gvh{padding:10px 14px;border-bottom:1px solid #2a2436}#gvh b{color:#f2b632;font-size:17px}#gvh small{display:block;color:#8f869e}#gvs{overflow:auto;padding:8px 12px}#gvp details{margin:6px 0;border:1px solid #2a2436;border-radius:6px;padding:6px 10px}#gvp summary{color:#f2b632;font-weight:700;padding:6px 0}#gvp label{display:grid;grid-template-columns:42% 1fr 46px;gap:6px;align-items:center;font-size:13px;margin:6px 0}#gvp label i{font-style:normal;color:#f2b632;text-align:right}#gvp button{background:#1a1626;color:#efe6d2;border:1px solid #f2b632;border-radius:5px;padding:9px 11px;margin:3px;font-size:13px}#gvp button.on{background:#f2b632;color:#1a1200}#gvp input[type=range]{width:100%;accent-color:#f2b632}</style><div id="gvb">GG</div><div id="gvp"><div id="gvh"><b>𝙂𝙂 𝙂𝙊𝘿 𝙑𝘼𝙐𝙇𝙏 𝙇𝙊𝙐𝘿𝙀𝙍</b><small id="gvst"></small><small>made by fazil</small></div><div id="gvs"></div></div>';
document.body.appendChild(h);stat=document.getElementById('gvst');setStat();var b=document.getElementById('gvb'),p=document.getElementById('gvp'),s=document.getElementById('gvs');
var mv=0,sx,sy;b.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;mv=0});b.addEventListener('touchmove',function(e){var t=e.touches[0];if(Math.abs(t.clientX-sx)+Math.abs(t.clientY-sy)>8)mv=1;b.style.left=t.clientX-29+'px';b.style.top=t.clientY-29+'px';b.style.right='auto';b.style.bottom='auto';e.preventDefault()},{passive:false});
b.addEventListener('click',function(){if(!mv)p.style.display=p.style.display=='flex'?'none':'flex'});
function sec(n){var d=document.createElement('details');d.innerHTML='<summary>'+n+'</summary>';s.appendChild(d);return d}
var pd=sec('PRESETS');Object.keys(PR).forEach(function(k){var x=document.createElement('button');x.textContent=k;x.onclick=function(){G.apply(PR[k])};pd.appendChild(x)});
var ins=[],gr={};P.forEach(function(q){var d=gr[q[0]]||(gr[q[0]]=sec(q[0]));var l=document.createElement('label'),r=document.createElement('input');r.type='range';r.min=q[3];r.max=q[4];r.step=q[4]-q[3]>50?1:.1;r.value=q[5];var v=document.createElement('i');v.textContent=q[5];r.oninput=function(){v.textContent=r.value;G.set(q[1],r.value)};l.innerHTML='<span>'+q[2]+'</span>';l.appendChild(r);l.appendChild(v);d.appendChild(l);ins.push([q[1],r,v])});
G.sync=function(){ins.forEach(function(a){a[1].value=G.cfg[a[0]];a[2].textContent=G.cfg[a[0]]})};
var td=sec('SWITCHES');T.forEach(function(t){var x=document.createElement('button');x.textContent=t[1];x.onclick=function(){x.classList.toggle('on');G.tog(t[0],x.classList.contains('on'))};td.appendChild(x)});
var pl=sec('MP3 PLAYER + RECORDER');pl.insertAdjacentHTML('beforeend','<input type=file id=gvf accept="audio/*"><br><button id=gvplay>Play MP3 into mic</button><button id=gvstop>Stop MP3</button><br><button id=gvrec>Record</button><div id=gvr></div>');
document.getElementById('gvplay').onclick=function(){var f=document.getElementById('gvf').files[0];if(f)G.play(f);else alert('Pick an MP3 first')};document.getElementById('gvstop').onclick=G.stop;
var rb=document.getElementById('gvrec'),ro=false;rb.onclick=function(){if(!ro){if(G.rec(true)){ro=true;rb.textContent='Stop recording';rb.classList.add('on')}}else{G.rec(false,function(u){document.getElementById('gvr').innerHTML='<audio controls src="'+u+'"></audio>'});ro=false;rb.textContent='Record';rb.classList.remove('on')}}}
ui();document.addEventListener('DOMContentLoaded',ui);new MutationObserver(ui).observe(document.documentElement,{childList:true,subtree:true});
})();
