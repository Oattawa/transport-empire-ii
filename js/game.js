'use strict';

const TILE=48,COLS=38,ROWS=30;
const PCOLS=['#e8a020','#3a9fd0','#30c060','#e03040'];
const ERAS=[
  {name:'Steam Age',year:1850,color:'#e8a020',vehicles:['steam_train','horse_bus','horse_tram','sailing_ship']},
  {name:'Industrial',year:1900,color:'#d08020',vehicles:['diesel_train','motor_bus','tram','steamship']},
  {name:'Modern',year:1950,color:'#3a9fd0',vehicles:['electric_train','modern_bus','metro','freighter']},
  {name:'Future',year:2000,color:'#9060d0',vehicles:['maglev','electric_bus','hyperloop','aircraft']},
];
const VEHICLES={
  steam_train:{name:'Steam Train',icon:'🚂',cost:50000,maint:800,speed:0.6,cap:120,type:'train',era:1850,cargoTypes:['passengers','coal','ore']},
  diesel_train:{name:'Diesel Train',icon:'🚃',cost:90000,maint:1200,speed:0.9,cap:200,type:'train',era:1900,cargoTypes:['passengers','goods','coal','ore']},
  electric_train:{name:'Electric Train',icon:'🚄',cost:150000,maint:1600,speed:1.4,cap:300,type:'train',era:1950,cargoTypes:['passengers','goods']},
  maglev:{name:'Maglev',icon:'🚅',cost:300000,maint:2500,speed:2.2,cap:400,type:'train',era:2000,cargoTypes:['passengers']},
  horse_bus:{name:'Horse Bus',icon:'🚌',cost:8000,maint:150,speed:0.5,cap:30,type:'road',era:1850,cargoTypes:['passengers']},
  motor_bus:{name:'Motor Bus',icon:'🚍',cost:20000,maint:300,speed:0.9,cap:60,type:'road',era:1900,cargoTypes:['passengers']},
  modern_bus:{name:'Modern Bus',icon:'🚎',cost:40000,maint:500,speed:1.2,cap:100,type:'road',era:1950,cargoTypes:['passengers']},
  electric_bus:{name:'Electric Bus',icon:'🚐',cost:60000,maint:400,speed:1.3,cap:120,type:'road',era:2000,cargoTypes:['passengers']},
  horse_tram:{name:'Horse Tram',icon:'🚋',cost:18000,maint:250,speed:0.6,cap:50,type:'road',era:1850,cargoTypes:['passengers']},
  tram:{name:'Tram',icon:'🚊',cost:35000,maint:400,speed:1.0,cap:80,type:'road',era:1900,cargoTypes:['passengers']},
  metro:{name:'Metro',icon:'🚇',cost:120000,maint:1800,speed:1.6,cap:250,type:'rail',era:1950,cargoTypes:['passengers']},
  hyperloop:{name:'Hyperloop',icon:'🚈',cost:500000,maint:3000,speed:3.0,cap:500,type:'rail',era:2000,cargoTypes:['passengers']},
  truck:{name:'Cargo Truck',icon:'🚛',cost:15000,maint:350,speed:0.8,cap:40,type:'road',era:1900,cargoTypes:['goods','coal','ore','food','steel']},
  sailing_ship:{name:'Sailing Ship',icon:'⛵',cost:40000,maint:600,speed:0.4,cap:150,type:'water',era:1850,cargoTypes:['coal','ore','goods']},
  steamship:{name:'Steamship',icon:'🚢',cost:100000,maint:1200,speed:0.7,cap:400,type:'water',era:1900,cargoTypes:['coal','ore','goods','steel']},
  freighter:{name:'Freighter',icon:'🛳️',cost:200000,maint:2000,speed:1.0,cap:800,type:'water',era:1950,cargoTypes:['goods','steel','food']},
  aircraft:{name:'Cargo Plane',icon:'✈️',cost:500000,maint:4000,speed:3.0,cap:200,type:'air',era:2000,cargoTypes:['passengers','goods']},
};
const CARGO_CHAINS=[
  {name:'Iron & Steel',steps:[{type:'iron_mine',icon:'⛏️',produces:'ore'},{type:'steel_mill',icon:'🏭',produces:'steel'},{type:'factory',icon:'🔧',produces:'goods'}]},
  {name:'Coal Power',steps:[{type:'coal_mine',icon:'⛰️',produces:'coal'},{type:'power_plant',icon:'⚡',produces:'power'},{type:'city',icon:'🏙️',produces:null}]},
  {name:'Food Supply',steps:[{type:'farm',icon:'🌾',produces:'food'},{type:'food_plant',icon:'🏭',produces:'packaged_food'},{type:'city',icon:'🏙️',produces:null}]},
];
const INDUSTRY_TYPES={
  iron_mine:{name:'Iron Mine',icon:'⛏️',tier:1,produces:'ore',consumes:null,baseOutput:200},
  coal_mine:{name:'Coal Mine',icon:'⛰️',tier:1,produces:'coal',consumes:null,baseOutput:250},
  farm:{name:'Farm',icon:'🌾',tier:1,produces:'food',consumes:null,baseOutput:300},
  steel_mill:{name:'Steel Mill',icon:'🏭',tier:2,produces:'steel',consumes:'ore',baseOutput:150},
  food_plant:{name:'Food Plant',icon:'🥫',tier:2,produces:'packaged_food',consumes:'food',baseOutput:200},
  factory:{name:'Factory',icon:'🔧',tier:3,produces:'goods',consumes:'steel',baseOutput:100},
  power_plant:{name:'Power Plant',icon:'⚡',tier:2,produces:'power',consumes:'coal',baseOutput:180},
};
const CITY_LEVELS=[
  {name:'Hamlet',pop:0,icon:'🏚️'},
  {name:'Village',pop:500,icon:'🏠'},
  {name:'Town',pop:2000,icon:'🏘️'},
  {name:'City',pop:8000,icon:'🏙️'},
  {name:'Metropolis',pop:25000,icon:'🌆'},
  {name:'Megalopolis',pop:80000,icon:'🌇'},
];
const ACHIEVEMENTS=[
  {id:'first_route',name:'First Connection',desc:'Build your first route',icon:'🛤️',done:false},
  {id:'first_train',name:'All Aboard',desc:'Buy your first train',icon:'🚂',done:false},
  {id:'millionaire',name:'Millionaire',desc:'Reach $1,000,000',icon:'💰',done:false},
  {id:'city_grow',name:'Urban Planner',desc:'Grow a city to Town level',icon:'🏘️',done:false},
  {id:'cargo_king',name:'Cargo King',desc:'Deliver 1000 tons of cargo',icon:'📦',done:false},
  {id:'network',name:'Network Builder',desc:'Build 5 connections',icon:'🌐',done:false},
  {id:'fleet10',name:'Fleet Admiral',desc:'Own 10 vehicles',icon:'🚢',done:false},
  {id:'new_era',name:'New Era',desc:'Advance to Industrial age',icon:'⚙️',done:false},
];

let G={
  started:false,tick:0,speed:1,
  year:1850,month:1,era:0,
  activePl:0,numPl:4,
  players:[],cities:[],connections:[],vehicles:[],industries:[],
  terrain:[],
  tool:'ptr',buildStart:null,
  cam:{x:0,y:0,z:1},
  drag:false,dragS:null,
  mouseW:null,
  layer:null,
  totalCargo:0,totalPax:0,
  achievements:[...ACHIEVEMENTS],
};

const LP=[
  {name:'Iron Duke Co.',color:0,ai:false},
  {name:'Blue Rail Ltd.',color:1,ai:false},
  {name:'Green Express',color:2,ai:true},
  {name:'Red Freight',color:3,ai:true},
];

function renderLobby(){
  document.getElementById('lobby-players').innerHTML=LP.map((p,i)=>`
    <div class="lprow">
      <div class="lpdot" style="background:${PCOLS[p.color]};box-shadow:0 0 5px ${PCOLS[p.color]}"></div>
      <input value="${p.name}" oninput="LP[${i}].name=this.value" ${p.ai?'disabled':''}>
      <span class="lptag">${p.ai?'🤖 AI':'🟢 Human'}</span>
      <button class="lpaibtn" onclick="LP[${i}].ai=!LP[${i}].ai;renderLobby()">${p.ai?'→ Human':'→ AI'}</button>
    </div>`).join('');
}
renderLobby();

function startGame(){
  document.getElementById('lobby').style.display='none';
  G.started=true;
  G.year=parseInt(document.getElementById('opt-era').value);
  G.era=ERAS.findIndex(e=>e.year===G.year)||0;
  G.players=LP.map((p,i)=>({id:i,name:p.name,color:PCOLS[p.color],ai:p.ai,
    money:500000,revenue:0,expenses:0,pax:0,cargo:0,happiness:75,
    infraSpent:0,routeCount:0}));
  genTerrain();
  const sz=document.getElementById('opt-size').value;
  const cnt=sz==='s'?8:sz==='l'?20:14;
  genCities(cnt);
  genIndustries();
  renderBuildCards();
  renderVehicleCards();
  renderPlayers();
  resizeCvs();
  window.addEventListener('resize',resizeCvs);
  const cvs=document.getElementById('mapcanvas');
  G.cam.x=COLS*TILE/2-cvs.width/2;
  G.cam.y=ROWS*TILE/2-cvs.height/2;
  setupInput();
  renderCityPanel();
  renderCargoPanel();
  requestAnimationFrame(gameLoop);
  setInterval(saveGame,30000);
  setInterval(economyTick,4000);
  setInterval(aiTick,6000);
  setInterval(checkAchievements,5000);
  document.getElementById('ad-btn').style.display='';
  applyOwnedShopItems();
  setupDailyChallenge();
  const dailyBonus=claimDailyBonus();
  if(dailyBonus>0)showWelcomeBack(0,0,dailyBonus);
  else showTutorial();
  setStatus('Click any city on the map to get started');
}

function genTerrain(){
  G.terrain=[];
  for(let r=0;r<ROWS;r++){
    G.terrain[r]=[];
    for(let c=0;c<COLS;c++){
      const n=fbm(c/COLS*4,r/ROWS*4);
      let type='grass';
      if(n<0.22)type='water';
      else if(n<0.30)type='shore';
      else if(n>0.78)type='mountain';
      else if(n>0.65)type='highland';
      else if(n>0.55)type='forest';
      G.terrain[r][c]={type,h:n};
    }
  }
}

function fbm(x,y){
  let v=0,amp=0.5,freq=1;
  for(let i=0;i<4;i++){v+=snoise(x*freq,y*freq)*amp;amp*=0.5;freq*=2;}
  return(v+1)/2;
}

function snoise(x,y){
  const v=Math.sin(x*127.1+y*311.7+42)*43758.5453;
  return(v-Math.floor(v))*2-1;
}

const CNAMES=['Ironborough','Coalport','Steamhaven','Goldmere','Westgate','Northcliff',
  'Redfield','Ashton','Millhaven','Coppergate','Silverholm','Eastmere',
  'Stonecliff','Riverside','Crowmoor','Duncastle','Thornwick','Brackford',
  'Highfield','Lowgate','Brackenridge','Steelwood'];

function genCities(n){
  G.cities=[];
  let tries=0;
  while(G.cities.length<n&&tries<800){
    tries++;
    const col=2+Math.floor(Math.random()*(COLS-4));
    const row=2+Math.floor(Math.random()*(ROWS-4));
    const t=G.terrain[row]?.[col];
    if(!t||t.type==='water'||t.type==='mountain')continue;
    let ok=true;
    for(const c of G.cities){
      const d=Math.hypot(c.col-col,c.row-row);
      if(d<5){ok=false;break;}
    }
    if(!ok)continue;
    const pop=500+Math.floor(Math.random()*4500);
    G.cities.push({
      id:G.cities.length,
      name:CNAMES[G.cities.length%CNAMES.length],
      col,row,x:col*TILE+TILE/2,y:row*TILE+TILE/2,
      pop,basePop:pop,
      demand:{passengers:40+Math.floor(Math.random()*50),goods:20+Math.floor(Math.random()*40),food:30+Math.floor(Math.random()*30)},
      satisfaction:70,noise:0,pollution:0,
      growth:0,connCount:0,
      supply:{goods:0,food:0},
      level:0,
      served:false,
    });
  }
}

function genIndustries(){
  G.industries=[];
  const types=Object.keys(INDUSTRY_TYPES);
  const fullChains=document.getElementById('opt-ind').value==='full';
  const needed=fullChains?types:['iron_mine','coal_mine','factory'];
  for(const type of needed){
    let tries=0;
    while(tries<200){
      tries++;
      const col=1+Math.floor(Math.random()*(COLS-2));
      const row=1+Math.floor(Math.random()*(ROWS-2));
      const t=G.terrain[row]?.[col];
      if(!t||t.type==='water')continue;
      let ok=true;
      for(const c of G.cities){if(Math.hypot(c.col-col,c.row-row)<3){ok=false;break;}}
      if(!ok)continue;
      const def=INDUSTRY_TYPES[type];
      G.industries.push({
        id:G.industries.length,type,col,row,
        x:col*TILE+TILE/2,y:row*TILE+TILE/2,
        name:def.name,icon:def.icon,tier:def.tier,
        produces:def.produces,consumes:def.consumes,
        stock:0,maxStock:400,output:def.baseOutput,
        connectedTo:[],
      });
      break;
    }
  }
}

function resizeCvs(){
  const wrap=document.getElementById('mapwrap');
  const cvs=document.getElementById('mapcanvas');
  cvs.width=wrap.clientWidth;cvs.height=wrap.clientHeight;
}

const TC={water:'#0d2a4a',shore:'#1a3a5a',grass:'#1e4a20',forest:'#14381a',highland:'#3a4a30',mountain:'#4a4a4a'};
const TC2={water:'#102f55',shore:'#204060',grass:'#245c26',forest:'#183e1c',highland:'#445538',mountain:'#555555'};
function w2s(wx,wy){return{x:(wx-G.cam.x)*G.cam.z,y:(wy-G.cam.y)*G.cam.z};}
function s2w(sx,sy){return{x:sx/G.cam.z+G.cam.x,y:sy/G.cam.z+G.cam.y};}

const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function gameLoop(){
  if(G.speed>0){
    G.tick++;
    const tpm=Math.max(1,Math.floor(200/G.speed));
    if(G.tick%tpm===0){
      G.month++;
      if(G.month>12){G.month=1;G.year++;}
      updateEra();
      document.getElementById('date-display').textContent=MN[G.month-1]+' '+G.year;
    }
    moveVehicles();
    animateIndustries();
  }
  draw();
  updateOverlay();
  requestAnimationFrame(gameLoop);
}

function updateEra(){
  const newEra=ERAS.filter(e=>e.year<=G.year).length-1;
  if(newEra>G.era){
    G.era=newEra;
    const e=ERAS[G.era];
    document.getElementById('era-badge').textContent=e.name.toUpperCase()+' · '+G.year;
    document.getElementById('era-badge').style.borderColor=e.color;
    notify('🎉 New Era: '+e.name+'! New vehicles unlocked!','#9060d0');
    renderBuildCards();renderVehicleCards();
    unlockAchievement('new_era');
  }
  const pct=((G.year-1850)/(2050-1850))*100;
  document.getElementById('era-fill').style.width=Math.min(100,pct)+'%';
  ERAS.forEach((e,i)=>{
    const seg=document.getElementById('era-'+['steam','ind','mod','future'][i]);
    seg?.classList.toggle('active',i===G.era);
  });
}

function draw(){
  const cvs=document.getElementById('mapcanvas');
  const ctx=cvs.getContext('2d');
  const W=cvs.width,H=cvs.height,z=G.cam.z;
  ctx.clearRect(0,0,W,H);
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const t=G.terrain[r][c];
      const s=w2s(c*TILE,r*TILE);
      const ts=TILE*z;
      if(s.x+ts<0||s.x>W||s.y+ts<0||s.y>H)continue;
      ctx.fillStyle=TC[t.type]||'#333';
      ctx.fillRect(s.x,s.y,ts+1,ts+1);
      if(t.h%0.2<0.1){ctx.fillStyle=TC2[t.type]||'#444';ctx.fillRect(s.x+ts*.3,s.y+ts*.3,ts*.4,ts*.4);}
      if(t.type==='water'){
        ctx.fillStyle='#ffffff0a';
        if(Math.sin(G.tick*.04+c+r)>0.6)ctx.fillRect(s.x,s.y+ts*.4,ts,ts*.08);
      }
    }
  }
  if(G.layer==='demand'){
    for(const city of G.cities){
      const s=w2s(city.x,city.y);
      const r=Math.min(60,(city.demand.passengers+city.demand.goods)*0.4)*z;
      const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r);
      const sat=city.satisfaction;
      const col=sat>70?'#30c060':sat>40?'#e8a020':'#e03040';
      g.addColorStop(0,col+'44');g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.fill();
    }
  }
  for(const cn of G.connections)drawConn(ctx,cn,z);
  for(const ind of G.industries)drawIndustry(ctx,ind,z);
  for(const city of G.cities)drawCity(ctx,city,z);
  for(const v of G.vehicles)drawVehicle(ctx,v,z);
  if(G.buildStart&&G.mouseW&&(G.tool==='rail'||G.tool==='road')){
    const s1=w2s(G.buildStart.x,G.buildStart.y),s2=w2s(G.mouseW.x,G.mouseW.y);
    ctx.save();ctx.setLineDash([6,4]);
    ctx.strokeStyle=G.tool==='rail'?'#e8a020':'#7a8a70';
    ctx.lineWidth=G.tool==='rail'?3:2;
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
    ctx.restore();
  }
  drawMinimap();
}

function drawConn(ctx,cn,z){
  const c1=G.cities[cn.from]||G.industries[cn.fromInd];
  const c2=G.cities[cn.to]||G.industries[cn.toInd];
  if(!c1||!c2)return;
  const s1=w2s(c1.x,c1.y),s2=w2s(c2.x,c2.y);
  const p=G.players[cn.owner];
  ctx.save();
  if(cn.type==='rail'){
    ctx.strokeStyle='#00000050';ctx.lineWidth=(5*z)+2;
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
    ctx.strokeStyle='#404858';ctx.lineWidth=5*z;
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
    ctx.strokeStyle=p?p.color+'cc':'#c0c8d0';ctx.lineWidth=2*z;
    ctx.setLineDash([8*z,4*z]);
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.strokeStyle='#00000040';ctx.lineWidth=(3*z)+2;
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
    ctx.strokeStyle=p?p.color+'99':'#7a8a70';ctx.lineWidth=3*z;
    ctx.beginPath();ctx.moveTo(s1.x,s1.y);ctx.lineTo(s2.x,s2.y);ctx.stroke();
  }
  ctx.restore();
}

function drawIndustry(ctx,ind,z){
  const s=w2s(ind.x,ind.y);
  if(z<0.35)return;
  const size=Math.max(10,13*z);
  ctx.font=`${size}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#000000aa';ctx.fillText(ind.icon,s.x+1,s.y+2);
  ctx.fillText(ind.icon,s.x,s.y);
  if(z>0.5&&ind.stock>0){
    const bw=22*z,bh=3*z;
    ctx.fillStyle='#00000088';ctx.fillRect(s.x-bw/2,s.y+size/2+2,bw,bh);
    ctx.fillStyle=ind.stock/ind.maxStock>0.7?'#e8a020':'#3a9fd0';
    ctx.fillRect(s.x-bw/2,s.y+size/2+2,bw*(ind.stock/ind.maxStock),bh);
  }
}

function drawCity(ctx,city,z){
  const s=w2s(city.x,city.y);
  const lv=getCityLevel(city);
  const r=Math.max(7,Math.min(22,7+(city.pop/50000)*15))*z;
  const sat=city.satisfaction;
  const glowCol=sat>70?'#30c06044':sat>40?'#e8a02044':'#e0304044';
  const grd=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r*2.5);
  grd.addColorStop(0,glowCol);grd.addColorStop(1,'transparent');
  ctx.fillStyle=grd;ctx.beginPath();ctx.arc(s.x,s.y,r*2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c8a030';ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.fill();
  if(z>0.4){
    ctx.font=`${Math.max(9,r*1.1)}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lv.icon,s.x,s.y);
  }
  if(z>0.38){
    ctx.font=`bold ${Math.max(8,10*z)}px Rajdhani,sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.strokeStyle='#00000099';ctx.lineWidth=2.5;
    ctx.strokeText(city.name,s.x,s.y+r+2);
    ctx.fillStyle='#e4f0ff';ctx.fillText(city.name,s.x,s.y+r+2);
    ctx.font=`${Math.max(7,8*z)}px Share Tech Mono,monospace`;
    ctx.fillStyle='#e8c070';ctx.strokeStyle='#000000aa';ctx.lineWidth=2;
    const popStr=fmtN(city.pop);
    ctx.strokeText(popStr,s.x,s.y+r+2+Math.max(9,11*z));
    ctx.fillText(popStr,s.x,s.y+r+2+Math.max(9,11*z));
  }
  if(z>0.5){
    const dc=sat>70?'#30c060':sat>40?'#e8a020':'#e03040';
    ctx.fillStyle=dc;ctx.beginPath();ctx.arc(s.x+r*.7,s.y-r*.7,3*z,0,Math.PI*2);ctx.fill();
  }
}

function drawVehicle(ctx,v,z){
  if(!v.wx)return;
  const s=w2s(v.wx,v.wy);
  const vd=VEHICLES[v.vtype];
  const size=Math.max(11,15*z);
  ctx.font=`${size}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.globalAlpha=0.35;ctx.fillStyle='#000';ctx.fillText(vd.icon,s.x+1,s.y+2);
  ctx.globalAlpha=1;ctx.fillText(vd.icon,s.x,s.y);
  const p=G.players[v.owner];
  if(p){ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(s.x+size*.45,s.y-size*.45,2.5*z,0,Math.PI*2);ctx.fill();}
}

function drawMinimap(){
  const mc=document.getElementById('mc');
  const mw=mc.parentElement.clientWidth,mh=mc.parentElement.clientHeight;
  mc.width=mw;mc.height=mh;
  const ctx=mc.getContext('2d');
  const sx=mw/(COLS*TILE),sy=mh/(ROWS*TILE);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const t=G.terrain[r][c];
    ctx.fillStyle=TC[t.type];
    ctx.fillRect(c*TILE*sx,r*TILE*sy,TILE*sx+1,TILE*sy+1);
  }
  for(const cn of G.connections){
    const c1=G.cities[cn.from],c2=G.cities[cn.to];
    if(!c1||!c2)continue;
    const p=G.players[cn.owner];
    ctx.strokeStyle=p?p.color:'#aaa';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(c1.x*sx,c1.y*sy);ctx.lineTo(c2.x*sx,c2.y*sy);ctx.stroke();
  }
  for(const city of G.cities){
    ctx.fillStyle='#e8c070';ctx.beginPath();ctx.arc(city.x*sx,city.y*sy,2.5,0,Math.PI*2);ctx.fill();
  }
  for(const ind of G.industries){
    ctx.fillStyle='#d06020';ctx.beginPath();ctx.arc(ind.x*sx,ind.y*sy,1.5,0,Math.PI*2);ctx.fill();
  }
  const cvs=document.getElementById('mapcanvas');
  ctx.strokeStyle='#ffffff66';ctx.lineWidth=1;
  ctx.strokeRect(G.cam.x*sx,G.cam.y*sy,(cvs.width/G.cam.z)*sx,(cvs.height/G.cam.z)*sy);
}

function moveVehicles(){
  for(const v of G.vehicles){
    if(!v.route||v.route.length<2)continue;
    v.progress+=v.spd*G.speed*0.008;
    if(v.progress>=1){
      v.progress=0;
      v.routeIdx=(v.routeIdx+1)%v.route.length;
      const income=calcIncome(v);
      G.players[v.owner].money+=income;
      G.players[v.owner].revenue+=income;
      if(v.cargoType==='passengers'){G.players[v.owner].pax+=Math.floor(income/4);G.totalPax+=Math.floor(income/4);}
      else{G.players[v.owner].cargo+=Math.floor(income/10);G.totalCargo+=Math.floor(income/10);}
    }
    const fi=v.routeIdx,ti=(v.routeIdx+1)%v.route.length;
    const rn=v.route[fi],rn2=v.route[ti];
    const c1=getRouteNode(rn),c2=getRouteNode(rn2);
    if(c1&&c2){v.wx=c1.x+(c2.x-c1.x)*v.progress;v.wy=c1.y+(c2.y-c1.y)*v.progress;}
  }
}

function getRouteNode(ref){
  if(ref.type==='city')return G.cities[ref.id];
  if(ref.type==='industry')return G.industries[ref.id];
  return null;
}

function calcIncome(v){
  const vd=VEHICLES[v.vtype];
  const fromNode=getRouteNode(v.route[v.routeIdx]);
  const toNode=getRouteNode(v.route[(v.routeIdx+1)%v.route.length]);
  if(!fromNode||!toNode)return 0;
  const dist=Math.hypot(fromNode.x-toNode.x,fromNode.y-toNode.y)/TILE;
  const demandMult=fromNode.demand?((fromNode.demand[v.cargoType]||30)/100):0.5;
  const freqMult=({low:0.7,medium:1.0,high:1.4}[v.freq]||1.0);
  return Math.round(vd.cap*dist*demandMult*freqMult*(v.cargoType==='passengers'?3:5));
}

function animateIndustries(){
  for(const ind of G.industries){
    if(ind.connectedTo.length>0){
      ind.stock=Math.min(ind.maxStock,ind.stock+(ind.output/100));
    }
  }
}

function economyTick(){
  for(const v of G.vehicles){
    const maint=VEHICLES[v.vtype]?.maint||200;
    G.players[v.owner].money-=maint;
    G.players[v.owner].expenses+=maint;
  }
  for(const cn of G.connections){
    const cost=cn.type==='rail'?120:35;
    G.players[cn.owner].money-=cost;
    G.players[cn.owner].expenses+=cost;
  }
  for(const city of G.cities){
    const conns=G.connections.filter(c=>c.from===city.id||c.to===city.id);
    city.connCount=conns.length;
    const served=G.vehicles.some(v=>v.route.some(r=>r.type==='city'&&r.id===city.id));
    city.served=served;
    let sat=city.satisfaction;
    if(served)sat=Math.min(100,sat+2);
    else sat=Math.max(20,sat-1);
    if(conns.length>3)sat=Math.min(100,sat+1);
    city.satisfaction=sat;
    if(conns.length>0&&served){
      city.growth+=Math.floor(sat/20)*5;
      if(city.growth>=100){
        city.growth=0;
        const growAmt=Math.floor(city.pop*0.03)+Math.floor(Math.random()*100);
        city.pop+=growAmt;
        const oldLv=city.level,newLv=getCityLevelIdx(city);
        city.level=newLv;
        if(newLv>oldLv){
          notify(`🏙️ ${city.name} grew to ${getCityLevel(city).name}!`,'#30c060');
          unlockAchievement('city_grow');
        }
      }
    }
    city.demand.passengers=Math.floor(30+(city.pop/1000)*2);
    city.demand.goods=Math.floor(15+(city.pop/2000));
  }
  updateOverlay();
  renderCityPanel();
  renderLeaderboard();
  renderFleetPanel();
  renderFinancePanel();
  updateDailyChallengeUI();
}

function aiTick(){
  for(const p of G.players){
    if(!p.ai||p.money<15000)continue;
    const used=new Set(G.connections.map(c=>`${Math.min(c.from,c.to)}-${Math.max(c.from,c.to)}`));
    const cities=[...G.cities].sort(()=>Math.random()-.5);
    for(let i=0;i<cities.length;i++){
      for(let j=i+1;j<cities.length;j++){
        const key=`${cities[i].id}-${cities[j].id}`;
        if(used.has(key))continue;
        const d=Math.hypot(cities[i].x-cities[j].x,cities[i].y-cities[j].y);
        if(d<TILE*9){
          const type=Math.random()>.4?'rail':'road';
          const cost=type==='rail'?2200*(d/TILE):550*(d/TILE);
          if(p.money>cost+50000){
            buildConn(cities[i].id,cities[j].id,type,p.id);
            const era=ERAS[G.era];
            const vtypes=era.vehicles.filter(vt=>VEHICLES[vt]);
            const vtype=vtypes[Math.floor(Math.random()*vtypes.length)];
            const vd=VEHICLES[vtype];
            if(vd&&p.money>vd.cost){
              buyVehicleFor(p.id,vtype,
                [{type:'city',id:cities[i].id},{type:'city',id:cities[j].id}],
                'passengers','medium');
            }
          }
          break;
        }
      }
      break;
    }
  }
}

function buildConn(fromId,toId,type,owner,fromType='city',toType='city'){
  const key=`${Math.min(fromId,toId)}-${Math.max(fromId,toId)}-${fromType}-${toType}`;
  if(G.connections.some(c=>{
    const k=`${Math.min(c.from,c.to)}-${Math.max(c.from,c.to)}-${c.fromType||'city'}-${c.toType||'city'}`;
    return k===key;
  })){notify('⚠️ Already connected!');return false;}
  const n1=fromType==='city'?G.cities[fromId]:G.industries[fromId];
  const n2=toType==='city'?G.cities[toId]:G.industries[toId];
  const d=Math.hypot(n1.x-n2.x,n1.y-n2.y)/TILE;
  const cost=type==='rail'?Math.round(2200*d):Math.round(550*d);
  const p=G.players[owner];
  if(p.money<cost){notify('❌ Insufficient funds! Need $'+fmtN(cost));return false;}
  p.money-=cost;p.expenses+=cost;p.infraSpent+=cost;p.routeCount++;
  G.connections.push({from:fromId,to:toId,fromType,toType,type,owner});
  const lbl=type==='rail'?'🛤️ Railway':'🛣️ Road';
  notify(`${lbl}: ${n1.name}↔${n2.name} (-$${fmtN(cost)})`);
  unlockAchievement('first_route');
  if(G.connections.length>=5)unlockAchievement('network');
  return true;
}

function buyVehicleFor(owner,vtype,route,cargoType,freq){
  const vd=VEHICLES[vtype];
  if(!vd)return false;
  if(G.players[owner].money<vd.cost){notify('❌ Not enough money!');return false;}
  if(G.year<vd.era){notify(`⏳ ${vd.name} not available until ${vd.era}`);return false;}
  G.players[owner].money-=vd.cost;G.players[owner].expenses+=vd.cost;
  const n1=getRouteNode(route[0]);
  G.vehicles.push({
    id:G.vehicles.length,vtype,owner,route,
    routeIdx:0,progress:0,
    spd:vd.speed,
    wx:n1?.x||0,wy:n1?.y||0,
    cargoType:cargoType||'passengers',
    freq:freq||'medium',
    name:`${vd.name} #${G.vehicles.filter(v=>v.vtype===vtype).length+1}`,
  });
  unlockAchievement('first_train');
  if(G.vehicles.length>=10)unlockAchievement('fleet10');
  return true;
}

function setupInput(){
  const cvs=document.getElementById('mapcanvas');
  let _downPos=null;
  cvs.addEventListener('mousedown',e=>{
    if(e.button===1||(e.button===0&&G.tool==='ptr')){
      G.drag=false;G.dragS={x:e.clientX,y:e.clientY,cx:G.cam.x,cy:G.cam.y};
      _downPos={x:e.clientX,y:e.clientY};
    }
    if(e.button===0&&G.tool!=='ptr'){
      const w=s2w(e.offsetX,e.offsetY);
      const city=nearCity(w.x,w.y,TILE*2.2);
      const ind=nearInd(w.x,w.y,TILE*2);
      const node=city?{type:'city',id:city.id,x:city.x,y:city.y,name:city.name}:
        ind?{type:'industry',id:ind.id,x:ind.x,y:ind.y,name:ind.name}:null;
      if(G.tool==='rail'||G.tool==='road'){
        if(!G.buildStart){
          if(node){G.buildStart=node;notify(`📍 Start: ${node.name} — now click the destination city`);}
          else notify('ℹ️ Click on a city or industry to start');
        } else {
          if(node&&node.id!==G.buildStart.id){
            buildConn(G.buildStart.id,node.id,G.tool,G.activePl,G.buildStart.type,node.type);
            G.buildStart=null;
          } else if(!node) G.buildStart=null;
        }
      } else if(G.tool==='sta'||G.tool==='depot'){
        if(city){
          const cost=G.tool==='sta'?20000:10000;
          const p=G.players[G.activePl];
          if(p.money>=cost){
            p.money-=cost;city.demand.passengers=Math.min(100,city.demand.passengers+15);
            notify(`✅ ${G.tool==='sta'?'Station':'Depot'} built at ${city.name}! +15% demand`);
          } else notify(`❌ Need $${fmtN(cost)} — you have $${fmtN(p.money)}`);
        } else notify('ℹ️ Click on a city to build here');
      }
    }
  });
  cvs.addEventListener('mousemove',e=>{
    const w=s2w(e.offsetX,e.offsetY);
    G.mouseW=w;
    const bc=document.getElementById('build-ghost');
    bc.style.left=e.clientX+'px';bc.style.top=e.clientY+'px';
    if(_downPos&&Math.hypot(e.clientX-_downPos.x,e.clientY-_downPos.y)>5)G.drag=true;
    if(G.drag&&G.dragS){
      G.cam.x=G.dragS.cx+(G.dragS.x-e.clientX)/G.cam.z;
      G.cam.y=G.dragS.cy+(G.dragS.y-e.clientY)/G.cam.z;
    }
    const col=Math.floor(w.x/TILE),row=Math.floor(w.y/TILE);
    const t=G.terrain[row]?.[col];
    document.getElementById('bb-coord').textContent=t?`${t.type} (${col},${row})`:'—';
    const city=nearCity(w.x,w.y,TILE*1.8);
    const tb=document.getElementById('tooltip-box');
    if(city&&G.cam.z>0.35){
      const lv=getCityLevel(city);
      const sat=city.satisfaction;
      const satColor=sat>70?'var(--green)':sat>40?'var(--gold)':'var(--red)';
      const satIcon=sat>70?'😊':sat>40?'😐':'😠';
      tb.style.display='block';
      tb.style.left=(e.clientX+16)+'px';tb.style.top=(e.clientY-16)+'px';
      tb.innerHTML=`
        <div style="font-size:13px;font-weight:700;font-family:'Rajdhani',sans-serif;margin-bottom:4px;">
          ${lv.icon} ${city.name} <span style="font-size:10px;color:var(--gold);font-weight:400">${lv.name}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px 12px;font-size:10px;margin-bottom:5px;">
          <span style="color:var(--muted)">Population</span><span style="font-weight:700">${fmtN(city.pop)}</span>
          <span style="color:var(--muted)">Satisfaction</span><span style="color:${satColor}">${satIcon} ${sat}%</span>
          <span style="color:var(--muted)">Pax demand</span><span style="color:var(--blue2)">${city.demand.passengers}</span>
          <span style="color:var(--muted)">Connections</span><span>${G.connections.filter(c=>c.from===city.id||c.to===city.id).length}</span>
        </div>
        <div style="font-size:9px;color:var(--muted);border-top:1px solid var(--border);padding-top:4px;">
          ${G.tool==='ptr'?'🖱️ Click to open city details':'📍 Click to select as '+G.tool+' endpoint'}
        </div>`;
    } else tb.style.display='none';
  });
  cvs.addEventListener('mouseup',e=>{
    if(e.button===0&&G.tool==='ptr'&&!G.drag&&_downPos){
      const w=s2w(e.offsetX,e.offsetY);
      const city=nearCity(w.x,w.y,TILE*2.5);
      if(city)showCityQuick(city.id);
    }
    G.drag=false;G.dragS=null;_downPos=null;
  });
  cvs.addEventListener('mouseleave',()=>{G.drag=false;G.dragS=null;_downPos=null;G.mouseW=null;document.getElementById('tooltip-box').style.display='none';});
  cvs.addEventListener('wheel',e=>{
    e.preventDefault();
    G.cam.z=Math.max(0.25,Math.min(2.8,G.cam.z*(e.deltaY>0?.88:1.12)));
  },{passive:false});

  // Touch support for mobile
  function getTouchOffset(touch,el){const r=el.getBoundingClientRect();return{offsetX:touch.clientX-r.left,offsetY:touch.clientY-r.top};}
  let lastPinchDist=0;
  cvs.addEventListener('touchstart',e=>{
    e.preventDefault();
    if(e.touches.length===2){
      lastPinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      G.drag=false;return;
    }
    const t=e.touches[0];
    const{offsetX,offsetY}=getTouchOffset(t,cvs);
    if(G.tool==='ptr'){
      G.drag=true;G.dragS={x:t.clientX,y:t.clientY,cx:G.cam.x,cy:G.cam.y};
    } else {
      const w=s2w(offsetX,offsetY);
      const city=nearCity(w.x,w.y,TILE*2.2);
      const ind=nearInd(w.x,w.y,TILE*2);
      const node=city?{type:'city',id:city.id,x:city.x,y:city.y,name:city.name}:
        ind?{type:'industry',id:ind.id,x:ind.x,y:ind.y,name:ind.name}:null;
      if(G.tool==='rail'||G.tool==='road'){
        if(!G.buildStart){
          if(node){G.buildStart=node;notify(`📍 From: ${node.name} — tap destination`);}
          else notify('ℹ️ Tap on a city or industry');
        } else {
          if(node&&node.id!==G.buildStart.id){
            buildConn(G.buildStart.id,node.id,G.tool,G.activePl,G.buildStart.type,node.type);
            G.buildStart=null;
          } else if(!node) G.buildStart=null;
        }
      } else if(G.tool==='sta'||G.tool==='depot'){
        if(city){
          const cost=G.tool==='sta'?20000:10000;
          const p=G.players[G.activePl];
          if(p.money>=cost){
            p.money-=cost;city.demand.passengers=Math.min(100,city.demand.passengers+15);
            notify(`✅ ${G.tool==='sta'?'Station':'Depot'} at ${city.name}! Demand+15%`);
          } else notify('❌ Not enough money!');
        }
      }
    }
  },{passive:false});
  cvs.addEventListener('touchmove',e=>{
    e.preventDefault();
    if(e.touches.length===2){
      const dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      if(lastPinchDist){G.cam.z=Math.max(0.25,Math.min(2.8,G.cam.z*(dist/lastPinchDist)));}
      lastPinchDist=dist;return;
    }
    if(!G.drag)return;
    const t=e.touches[0];
    G.cam.x=G.dragS.cx+(G.dragS.x-t.clientX)/G.cam.z;
    G.cam.y=G.dragS.cy+(G.dragS.y-t.clientY)/G.cam.z;
  },{passive:false});
  cvs.addEventListener('touchend',e=>{
    e.preventDefault();
    if(e.changedTouches.length===1&&!G.drag&&G.tool==='ptr'){
      const t=e.changedTouches[0];
      const{offsetX,offsetY}=getTouchOffset(t,cvs);
      const w=s2w(offsetX,offsetY);
      const city=nearCity(w.x,w.y,TILE*2.8);
      if(city)showCityQuick(city.id);
    }
    lastPinchDist=0;G.drag=false;
  },{passive:false});

  window.addEventListener('keydown',e=>{
    if(e.key==='Escape'){G.buildStart=null;setTool('ptr');}
    if(e.key==='1')setTool('rail');if(e.key==='2')setTool('road');
    if(e.key==='3')setTool('sta');if(e.key==='4')setTool('depot');
    if(e.key===' '){e.preventDefault();setSpd(G.speed>0?0:1);}
  });
}

function nearCity(wx,wy,maxD){
  let best=null,bd=maxD;
  for(const c of G.cities){const d=Math.hypot(c.x-wx,c.y-wy);if(d<bd){bd=d;best=c;}}
  return best;
}

function nearInd(wx,wy,maxD){
  let best=null,bd=maxD;
  for(const i of G.industries){const d=Math.hypot(i.x-wx,i.y-wy);if(d<bd){bd=d;best=i;}}
  return best;
}

function setTool(t){
  G.tool=t;G.buildStart=null;
  document.querySelectorAll('.tbtn').forEach(b=>b.classList.remove('on'));
  document.getElementById('t-'+t)?.classList.add('on');
  const names={ptr:'Select',rail:'Build Railway',road:'Build Road',sta:'Build Station',depot:'Build Depot'};
  document.getElementById('bb-tool').textContent=names[t]||t;
  const bc=document.getElementById('build-ghost');
  if(t!=='ptr'){
    bc.style.display='block';
    bc.textContent={rail:'🛤️',road:'🛣️',sta:'🏭',depot:'🏗️'}[t]||'🔨';
    document.getElementById('mapcanvas').style.cursor='none';
  } else {
    bc.style.display='none';
    document.getElementById('mapcanvas').style.cursor='grab';
  }
}

function setSpd(s){
  G.speed=s;
  document.querySelectorAll('.spd').forEach((b,i)=>b.classList.toggle('on',[0,1,3,8][i]===s));
}

function showPanel(name){
  document.querySelectorAll('.pcontent').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on'));
  document.getElementById('panel-'+name)?.classList.add('on');
  const tabs=document.querySelectorAll('.ptab');
  const names=['overview','vehicles','cities','cargo','finance','rank'];
  const idx=names.indexOf(name);
  if(idx>=0&&tabs[idx])tabs[idx].classList.add('on');
  // On mobile, opening a panel also opens the sheet
  if(window.innerWidth<=640){
    document.getElementById('rpanel').classList.add('mob-open');
    document.getElementById('panel-toggle-btn').textContent='✕';
  }
}

function toggleMobilePanel(){
  if(window.innerWidth>640)return;
  const rp=document.getElementById('rpanel');
  const btn=document.getElementById('panel-toggle-btn');
  const open=rp.classList.toggle('mob-open');
  btn.textContent=open?'✕':'📋';
}

// Swipe-down to dismiss panel on mobile
(function setupPanelSwipe(){
  let startY=0,startOpen=false;
  function onTouchStart(e){startY=e.touches[0].clientY;startOpen=document.getElementById('rpanel').classList.contains('mob-open');}
  function onTouchEnd(e){
    if(window.innerWidth>640)return;
    const dy=e.changedTouches[0].clientY-startY;
    if(startOpen&&dy>60){
      document.getElementById('rpanel').classList.remove('mob-open');
      document.getElementById('panel-toggle-btn').textContent='📋';
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const h=document.getElementById('rpanel-handle');
    const rp=document.getElementById('rpanel');
    h.addEventListener('touchstart',onTouchStart,{passive:true});
    rp.addEventListener('touchstart',onTouchStart,{passive:true});
    rp.addEventListener('touchend',onTouchEnd,{passive:true});
  });
})();

function renderPlayers(){
  const bar=document.getElementById('players-hdr');
  bar.innerHTML=G.players.map((p,i)=>`
    <div class="pbadge ${i===G.activePl?'cur':''}" style="--pc:${p.color}" onclick="switchPl(${i})">
      <div class="pdot"></div>
      <div><div style="font-size:11px;font-weight:700;">${p.name}</div>
      <div class="pmoney">$${fmtN(p.money)}</div></div>
      <span style="font-size:9px;color:${p.color}">${p.ai?'🤖':'🟢'}</span>
    </div>`).join('');
}

function switchPl(i){
  G.activePl=i;renderPlayers();
  document.getElementById('bb-player').textContent=G.players[i].name;
  notify(`👤 → ${G.players[i].name}`);updateOverlay();
}

function renderBuildCards(){
  const el=document.getElementById('build-cards');
  const cards=[
    {icon:'🛤️',label:'Railway',cost:'$2,200/tile',tool:'rail',era:1850},
    {icon:'🛣️',label:'Road',cost:'$550/tile',tool:'road',era:1850},
    {icon:'🏭',label:'Station',cost:'$20,000',tool:'sta',era:1850},
    {icon:'🏗️',label:'Depot',cost:'$10,000',tool:'depot',era:1850},
  ];
  el.innerHTML=cards.map(c=>`
    <div class="bcard ${G.year<c.era?'locked':''}" onclick="setTool('${c.tool}')">
      <div class="bi">${c.icon}</div>
      <div class="bl">${c.label}</div>
      <div class="bc">${c.cost}</div>
      ${G.year<c.era?`<div class="lock-icon">🔒</div><div class="bera">From ${c.era}</div>`:''}
    </div>`).join('');
}

function renderVehicleCards(){
  const el=document.getElementById('vehicle-cards');
  const show=[
    {vtype:'steam_train',era:1850},{vtype:'diesel_train',era:1900},
    {vtype:'horse_bus',era:1850},{vtype:'motor_bus',era:1900},
    {vtype:'horse_tram',era:1850},{vtype:'truck',era:1900},
    {vtype:'sailing_ship',era:1850},{vtype:'aircraft',era:2000},
  ];
  el.innerHTML=show.map(s=>{
    const vd=VEHICLES[s.vtype];
    const locked=G.year<s.era;
    return `<div class="bcard ${locked?'locked':''}" onclick="openBuyV('${s.vtype}')">
      <div class="bi">${vd.icon}</div>
      <div class="bl">${vd.name}</div>
      <div class="bc">$${fmtN(vd.cost)}</div>
      ${locked?`<div class="lock-icon">🔒</div><div class="bera">From ${s.era}</div>`:''}
    </div>`;
  }).join('');
}

function updateOverlay(){
  if(!G.started)return;
  const p=G.players[G.activePl];
  if(!p)return;
  const myV=G.vehicles.filter(v=>v.owner===p.id);
  const myC=G.connections.filter(c=>c.owner===p.id);
  const monthRev=myV.reduce((s,v)=>s+calcIncome(v)*4,0);
  const monthCost=myV.reduce((s,v)=>s+(VEHICLES[v.vtype]?.maint||0),0)+myC.length*80;
  document.getElementById('ov-money').textContent='$'+fmtN(p.money);
  document.getElementById('ov-rev').textContent='+$'+fmtN(monthRev);
  document.getElementById('ov-cost').textContent='-$'+fmtN(monthCost);
  const net=monthRev-monthCost;
  const nel=document.getElementById('ov-net');
  nel.textContent=(net>=0?'+':'')+' $'+fmtN(net);
  nel.className='sv '+(net>=0?'g':'r');
  document.getElementById('ov-fleet').textContent=myV.length;
  document.getElementById('ov-routes').textContent=myC.length;
  document.getElementById('ov-pax').textContent=fmtN(p.pax);
  document.getElementById('ov-cargo').textContent=fmtN(p.cargo)+'t';
  if(p.money>=1000000)unlockAchievement('millionaire');
  renderPlayers();
}

function renderFleetPanel(){
  const p=G.players[G.activePl];
  const myV=G.vehicles.filter(v=>v.owner===p.id);
  const el=document.getElementById('fleet-list');
  if(myV.length===0){el.innerHTML='<div style="color:var(--muted);font-size:11px;text-align:center;padding:20px 0;">No vehicles. Buy from Overview.</div>';return;}
  el.innerHTML=myV.map(v=>{
    const vd=VEHICLES[v.vtype];
    const r0=getRouteNode(v.route[0]),r1=getRouteNode(v.route[v.route.length-1]);
    const income=calcIncome(v)*4;
    const freqCols={low:'var(--muted)',medium:'var(--blue2)',high:'var(--green)'};
    return `<div class="vitem">
      <div class="vico">${vd.icon}</div>
      <div class="vinfo">
        <div class="vname">${v.name}</div>
        <div class="vroute">${r0?.name||'?'} ↔ ${r1?.name||'?'}</div>
        <div class="vfreq">📦 ${v.cargoType} · <span style="color:${freqCols[v.freq]}">${v.freq} freq</span></div>
        <div class="vbar"><div class="vfill" style="width:${v.progress*100}%;background:var(--blue)"></div></div>
      </div>
      <div class="vinc">+$${fmtN(income)}</div>
    </div>`;
  }).join('');
}

function renderCityPanel(){
  const el=document.getElementById('city-list');
  const sorted=[...G.cities].sort((a,b)=>b.pop-a.pop);
  el.innerHTML=sorted.map(city=>{
    const lv=getCityLevel(city);
    const sat=city.satisfaction;
    const satCol=sat>70?'var(--green)':sat>40?'var(--gold)':'var(--red)';
    const segs=5;
    const filledSegs=Math.round((sat/100)*segs);
    const happySegs=Array.from({length:segs},(_,i)=>{
      const cls=i<filledSegs?(sat>70?'on':sat>40?'warn':'bad'):'';
      return `<div class="happy-seg ${cls}"></div>`;
    }).join('');
    return `<div class="cityitem" onclick="showCityDetail(${city.id})">
      <div class="cname">${lv.icon} ${city.name}
        <span class="clevel">${lv.name}</span>
        ${city.served?'<span style="font-size:9px;color:var(--green)">✅ served</span>':'<span style="font-size:9px;color:var(--red)">⚠️ not served</span>'}
      </div>
      <div class="cstats">
        <div class="cstat">Pop <span>${fmtN(city.pop)}</span></div>
        <div class="cstat">Pax <span>${city.demand.passengers}</span></div>
        <div class="cstat">Goods <span>${city.demand.goods}</span></div>
        <div class="cstat">Routes <span>${city.connCount}</span></div>
      </div>
      <div class="chappy">😊 <span style="color:${satCol};font-size:9px;font-family:'Share Tech Mono',monospace">${sat}%</span>
        <div class="happy-bar" style="flex:1">${happySegs}</div>
      </div>
      <div class="cprogbar"><div class="cprogfill" style="width:${city.growth}%"></div></div>
    </div>`;
  }).join('');
}

function renderCargoPanel(){
  const cl=document.getElementById('chain-list');
  cl.innerHTML=CARGO_CHAINS.map(ch=>`
    <div class="chain-display">
      ${ch.steps.map((s,i)=>`
        <div class="chain-node">
          <span>${s.icon}</span>
          <span style="font-size:9px">${s.produces||'consume'}</span>
        </div>
        ${i<ch.steps.length-1?'<span class="chain-arrow">→</span>':''}
      `).join('')}
      <span style="font-size:9px;color:var(--muted);margin-left:auto">${ch.name}</span>
    </div>`).join('');
  const il=document.getElementById('industry-list');
  il.innerHTML=G.industries.map(ind=>`
    <div class="inditem">
      <div class="indname">${ind.icon} ${ind.name}
        <span style="font-size:9px;color:var(--muted);font-family:'Share Tech Mono',monospace">Tier ${ind.tier}</span>
      </div>
      <div class="indchain">
        ${ind.consumes?`<span class="cargo-chip">${ind.consumes}</span><span class="indarrow">→</span>`:''}
        <span class="cargo-chip" style="border-color:var(--gold);color:var(--gold)">${ind.produces}</span>
        <span style="font-size:9px;margin-left:auto">Stock: ${Math.floor(ind.stock)}/${ind.maxStock}</span>
      </div>
      <div class="indstock"><div class="indfill" style="width:${(ind.stock/ind.maxStock)*100}%"></div></div>
    </div>`).join('');
}

function renderFinancePanel(){
  const p=G.players[G.activePl];
  document.getElementById('fi-cash').textContent='$'+fmtN(p.money);
  document.getElementById('fi-rev').textContent='$'+fmtN(p.revenue);
  document.getElementById('fi-exp').textContent='$'+fmtN(p.expenses);
  const net=p.revenue-p.expenses;
  const nel=document.getElementById('fi-net');
  nel.textContent=(net>=0?'+':'')+' $'+fmtN(net);nel.className='sv '+(net>=0?'g':'r');
  document.getElementById('fi-infra').textContent='$'+fmtN(p.infraSpent||0);
  const vval=G.vehicles.filter(v=>v.owner===p.id).reduce((s,v)=>s+(VEHICLES[v.vtype]?.cost||0),0);
  document.getElementById('fi-vval').textContent='$'+fmtN(vval);
  const myV=G.vehicles.filter(v=>v.owner===p.id);
  const fbd=document.getElementById('fi-breakdown');
  if(myV.length===0){fbd.innerHTML='<div style="text-align:center;color:var(--muted)">No active routes.</div>';return;}
  fbd.innerHTML=myV.map(v=>{
    const vd=VEHICLES[v.vtype];
    const r0=getRouteNode(v.route[0]),r1=getRouteNode(v.route[v.route.length-1]);
    const inc=calcIncome(v)*4;
    return `<div class="srow"><span class="sl" style="font-size:10px">${vd.icon} ${r0?.name||'?'}↔${r1?.name||'?'}</span>
      <span class="sv g" style="font-size:11px">+$${fmtN(inc)}</span></div>`;
  }).join('');
}

function renderLeaderboard(){
  const sorted=[...G.players].sort((a,b)=>b.money-a.money);
  document.getElementById('lb-list').innerHTML=sorted.map((p,i)=>`
    <div class="lbrow">
      <div class="lbrank">#${i+1}</div>
      <div class="lbdot" style="background:${p.color};box-shadow:0 0 4px ${p.color}"></div>
      <div class="lbname">${p.name} ${p.ai?'🤖':''}</div>
      <div class="lbval">$${fmtN(p.money)}</div>
    </div>`).join('');
}

function renderAchievements(){
  const html=G.achievements.map(a=>`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)55;opacity:${a.done?1:.4}">
      <span style="font-size:18px">${a.icon}</span>
      <div style="flex:1"><div style="font-size:11px;font-weight:700;">${a.name}</div>
      <div style="font-size:9px;color:var(--muted)">${a.desc}</div></div>
      ${a.done?'<span style="color:var(--green);font-size:12px">✅</span>':''}
    </div>`).join('');
  document.getElementById('achieve-list').innerHTML=html;
  document.getElementById('achieve-list2').innerHTML=html;
}

function unlockAchievement(id){
  const a=G.achievements.find(x=>x.id===id);
  if(!a||a.done)return;
  a.done=true;
  const n=document.createElement('div');
  n.className='notif achievement';
  n.textContent=`🏆 Achievement: ${a.name} — ${a.desc}`;
  document.getElementById('notifs').appendChild(n);
  setTimeout(()=>n.remove(),3200);
  renderAchievements();
}

function checkAchievements(){
  if(G.vehicles.length>0)unlockAchievement('first_train');
  if(G.connections.length>0)unlockAchievement('first_route');
  if(G.players[G.activePl]?.money>=1000000)unlockAchievement('millionaire');
  if(G.connections.length>=5)unlockAchievement('network');
  if(G.vehicles.length>=10)unlockAchievement('fleet10');
  if(G.totalCargo>=1000)unlockAchievement('cargo_king');
  if(G.era>=1)unlockAchievement('new_era');
}

function toggleLayer(layer){
  G.layer=G.layer===layer?null:layer;
  document.getElementById('bb-layer').textContent=G.layer||'None';
  notify(G.layer?`📊 Layer: ${G.layer}`:'📊 Layer off');
}

// Quick city popup — shown when clicking a city in ptr mode
function showCityQuick(id){
  const city=G.cities[id];if(!city)return;
  const lv=getCityLevel(city);
  const sat=city.satisfaction;
  const conns=G.connections.filter(c=>c.from===id||c.to===id).length;
  const hasConn=G.connections.some(c=>(c.from===id||c.to===id)&&c.owner===G.activePl);
  openModal(`${lv.icon} ${city.name}`,`
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <div style="flex:1;background:var(--surf2);border:1px solid var(--border);border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);">POPULATION</div>
        <div style="font-size:20px;font-weight:800;color:var(--gold2)">${fmtN(city.pop)}</div>
        <div style="font-size:9px;color:var(--muted)">${lv.name}</div>
      </div>
      <div style="flex:1;background:var(--surf2);border:1px solid var(--border);border-radius:6px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted);">SATISFACTION</div>
        <div style="font-size:20px;font-weight:800;color:${sat>70?'var(--green)':sat>40?'var(--gold)':'var(--red)'}">${sat>70?'😊':sat>40?'😐':'😠'} ${sat}%</div>
        <div style="font-size:9px;color:var(--muted)">${conns} connection${conns!==1?'s':''}</div>
      </div>
    </div>
    <div style="font-size:11px;color:var(--muted);line-height:1.8;">
      ${!hasConn?'<div style="background:var(--surf3);border-radius:5px;padding:8px;margin-bottom:8px;">💡 <strong>Tip:</strong> Connect this city to another to start earning income.</div>':''}
      👥 Passenger demand: <strong>${city.demand.passengers}</strong> &nbsp; 📦 Goods demand: <strong>${city.demand.goods}</strong>
    </div>`,
    [
      {label:'🛤️ Connect (Railway)',primary:true,action:()=>{
        closeModal();G.buildStart={type:'city',id,x:city.x,y:city.y,name:city.name};
        setTool('rail');notify(`📍 From: ${city.name} — click destination city`);
      }},
      {label:'🛣️ Connect (Road)',primary:false,action:()=>{
        closeModal();G.buildStart={type:'city',id,x:city.x,y:city.y,name:city.name};
        setTool('road');notify(`📍 From: ${city.name} — click destination city`);
      }},
      {label:'Close',primary:false,action:closeModal},
    ]);
}

function showCityDetail(id){
  const city=G.cities[id];
  const lv=getCityLevel(city);
  const myConns=G.connections.filter(c=>(c.from===id||c.to===id));
  const myV=G.vehicles.filter(v=>v.route.some(r=>r.type==='city'&&r.id===id));
  openModal(`${lv.icon} ${city.name}`,`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
      <div style="background:var(--surf2);border:1px solid var(--border);border-radius:5px;padding:10px;">
        <div style="font-size:10px;color:var(--muted);margin-bottom:6px;">POPULATION</div>
        <div style="font-size:22px;font-weight:800;font-family:'Share Tech Mono',monospace;color:var(--gold2)">${fmtN(city.pop)}</div>
        <div style="font-size:9px;color:var(--muted);margin-top:2px">Level: ${lv.name}</div>
      </div>
      <div style="background:var(--surf2);border:1px solid var(--border);border-radius:5px;padding:10px;">
        <div style="font-size:10px;color:var(--muted);margin-bottom:6px;">SATISFACTION</div>
        <div style="font-size:22px;font-weight:800;font-family:'Share Tech Mono',monospace;color:${city.satisfaction>70?'var(--green)':city.satisfaction>40?'var(--gold)':'var(--red)'}">${city.satisfaction}%</div>
        <div style="font-size:9px;color:var(--muted);margin-top:2px">${city.satisfaction>70?'😊 Happy':city.satisfaction>40?'😐 Neutral':'😠 Unhappy'}</div>
      </div>
    </div>
    <div style="margin-bottom:10px;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:5px;font-family:'Rajdhani',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;">DEMAND</div>
      <div style="display:flex;gap:6px;">
        <div class="cargo-chip">👥 Pax: ${city.demand.passengers}</div>
        <div class="cargo-chip">📦 Goods: ${city.demand.goods}</div>
        <div class="cargo-chip">🍎 Food: ${city.demand.food}</div>
      </div>
    </div>
    <div style="margin-bottom:10px;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:5px;font-family:'Rajdhani',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;">CONNECTIONS (${myConns.length})</div>
      ${myConns.length===0?'<div style="color:var(--muted);font-size:11px;">No connections yet. Build rail or road!</div>':
        myConns.map(cn=>{
          const other=G.cities[cn.from===id?cn.to:cn.from];
          const p=G.players[cn.owner];
          return `<div style="font-size:11px;padding:3px 0;">${cn.type==='rail'?'🛤️':'🛣️'} ${other?.name||'Industry'} <span style="color:${p?.color}">(${p?.name})</span></div>`;
        }).join('')}
    </div>
    <div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:5px;font-family:'Rajdhani',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;">SERVING VEHICLES (${myV.length})</div>
      ${myV.map(v=>`<div style="font-size:11px;padding:3px 0;">${VEHICLES[v.vtype]?.icon} ${v.name} · ${v.cargoType} · ${v.freq} freq</div>`).join('')||'<div style="color:var(--muted);font-size:11px;">No vehicles serving this city.</div>'}
    </div>`,
    [{label:'🛤️ Build Here',primary:true,action:()=>{closeModal();G.buildStart={type:'city',id,x:city.x,y:city.y,name:city.name};setTool('rail');notify(`📍 From ${city.name}. Click destination.`);}},
     {label:'Close',primary:false,action:closeModal}]);
}

function openBuyV(vtype){
  const vd=VEHICLES[vtype];if(!vd)return;
  const p=G.players[G.activePl];
  if(G.year<vd.era){notify(`⏳ ${vd.name} available from ${vd.era}. Current year: ${G.year}.`);return;}
  const myConns=G.connections.filter(c=>c.owner===G.activePl);
  const canAfford=p.money>=vd.cost;
  const routeOpts=myConns.map((cn,i)=>{
    const n1=cn.fromType==='city'?G.cities[cn.from]:G.industries[cn.from];
    const n2=cn.toType==='city'?G.cities[cn.to]:G.industries[cn.to];
    return `<option value="${i}">${n1?.name||'?'} → ${n2?.name||'?'} (${cn.type})</option>`;
  }).join('');
  openModal(`${vd.icon} Buy ${vd.name}`,`
    <div style="display:flex;gap:10px;align-items:center;background:var(--surf2);border-radius:7px;padding:10px;margin-bottom:12px;">
      <div style="font-size:40px;">${vd.icon}</div>
      <div style="font-size:12px;line-height:2;">
        <div>💰 Cost: <strong style="color:${canAfford?'var(--green)':'var(--red)'}">$${fmtN(vd.cost)}</strong>
          ${canAfford?'':`<span style="color:var(--red);font-size:10px;"> (need $${fmtN(vd.cost-p.money)} more)</span>`}</div>
        <div>⚡ Speed: <strong>${vd.speed}x</strong> &nbsp;·&nbsp; 👥 Capacity: <strong>${vd.cap}</strong></div>
        <div>🔧 Upkeep: <strong style="color:var(--muted)">$${fmtN(vd.maint)}/mo</strong></div>
      </div>
    </div>
    ${myConns.length===0
      ?'<div style="background:var(--surf3);border:1px solid var(--red)44;border-radius:6px;padding:10px;font-size:11px;">⚠️ You need to <strong>build a connection first</strong> (use 🛤️ Railway or 🛣️ Road in the toolbar, then click two cities).</div>'
      :`<div>
          <div style="font-size:10px;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;font-family:'Rajdhani',sans-serif;">Assign to Route</div>
          <select id="buy-route" style="width:100%;background:var(--surf2);border:1px solid var(--border);color:var(--text);padding:8px;border-radius:5px;font-size:12px;">${routeOpts}</select>
        </div>`}`,
    [{label:`✅ Buy for $${fmtN(vd.cost)}`,primary:true,action:()=>{
      if(!canAfford){notify(`❌ Need $${fmtN(vd.cost-p.money)} more`);return;}
      if(myConns.length===0){notify('⚠️ Build a connection first (🛤️ or 🛣️)');return;}
      const ci=parseInt(document.getElementById('buy-route').value||0);
      const cn=myConns[ci];
      const cargoType=vd.cargoTypes[0];
      const route=[{type:cn.fromType||'city',id:cn.from},{type:cn.toType||'city',id:cn.to}];
      if(buyVehicleFor(G.activePl,vtype,route,cargoType,'medium')){
        notify(`✅ ${vd.name} bought & running!`);showPanel('vehicles');closeModal();
      }
    }},{label:'Cancel',primary:false,action:closeModal}]);
}

let _selFreq='medium';
function selFreq(el,f){
  _selFreq=f;
  document.querySelectorAll('.freq-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
}

const SHOP_ITEMS=[
  {id:'planes',icon:'✈️',name:'Airplane Routes',desc:'Unlock aircraft & airports',price:'$1.99',owned:false},
  {id:'maps',icon:'🗺️',name:'3 Extra Maps',desc:'Alps · Amazon · Siberia',price:'$0.99',owned:false},
  {id:'colors',icon:'🎨',name:'Custom Colors',desc:'12 unique player color sets',price:'$0.49',owned:false},
  {id:'bundle',icon:'👑',name:'Full Bundle',desc:'All above + future updates',price:'$4.99',owned:false},
];

function openShop(){
  openModal('👑 Premium Shop',`
    <div style="font-size:11px;color:var(--muted);margin-bottom:12px;">One-time purchases — no subscription. Support indie development!</div>
    <div class="shopgrid">
      ${SHOP_ITEMS.map(it=>`
        <div class="shopitem ${it.owned?'owned':''}" onclick="purchaseItem('${it.id}')">
          <div class="si-icon">${it.icon}</div>
          <div class="si-name">${it.name}</div>
          <div class="si-desc">${it.desc}</div>
          <div class="si-price">${it.owned?'✅ Owned':it.price}</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:10px;padding:8px;background:var(--surf2);border-radius:5px;font-size:10px;color:var(--muted);text-align:center;">
      🔒 Payments via Stripe · Secure · Instant unlock
    </div>`,
    [{label:'☕ Donate Instead',primary:false,action:()=>{closeModal();showDonate();}},
     {label:'Close',primary:false,action:closeModal}]);
}

function purchaseItem(id){
  const it=SHOP_ITEMS.find(x=>x.id===id);if(!it||it.owned)return;
  openModal(`💳 ${it.name}`,`<div style="text-align:center;padding:10px 0;">
    <div style="font-size:40px;margin-bottom:8px">${it.icon}</div>
    <div style="font-size:18px;font-weight:700;font-family:'Rajdhani',sans-serif;color:var(--gold);margin-bottom:12px">${it.price}</div>
    <div style="font-size:11px;color:var(--muted);line-height:1.6;margin-bottom:12px;">In a live deployment, this redirects to <strong>Stripe Checkout</strong>.<br>After payment, content unlocks instantly via webhook.</div>
  </div>`,
  [{label:'✅ Simulate Purchase (Demo)',primary:true,action:()=>{
    it.owned=true;if(id==='bundle')SHOP_ITEMS.forEach(x=>x.owned=true);
    applyPurchase(id);if(id==='bundle')SHOP_ITEMS.forEach(s=>applyPurchase(s.id));
    saveGame();notify(`🎉 ${it.name} unlocked!`,'#e8a020');closeModal();
  }},{label:'Cancel',primary:false,action:closeModal}]);
}

function showDonate(){
  openModal('☕ Support Development',`<div style="text-align:center;padding:8px 0;">
    <div style="font-size:36px;margin-bottom:8px">☕</div>
    <div style="font-size:13px;margin-bottom:12px;">Enjoying Transport Empire II? Help fund development!</div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px;">
      ${['$1','$3','$5','$10'].map(a=>`<div onclick="this.parentElement.querySelectorAll('div').forEach(x=>x.style.background='var(--surf2)');this.style.background='var(--gold)';this.style.color='#000';window._donateAmt='${a}'" style="background:var(--surf2);border:1px solid var(--border);border-radius:5px;padding:8px 14px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;transition:all .15s">${a}</div>`).join('')}
    </div></div>`,
  [{label:'☕ Donate via Ko-fi',primary:true,action:()=>{
    G.players[G.activePl].money+=100000;
    notify('☕ Thank you! +$100,000 bonus added!','#e8a020');closeModal();
  }},{label:'Cancel',primary:false,action:closeModal}]);
}

function openModal(title,body,actions){
  window._mActs=actions;
  document.getElementById('mtitle').textContent=title;
  document.getElementById('mbody').innerHTML=body;
  document.getElementById('macts').innerHTML=actions.map((a,i)=>
    `<button class="mbtn ${a.primary?'pri':'sec'}" onclick="window._mActs[${i}].action()">${a.label}</button>`
  ).join('');
  document.getElementById('moverlay').classList.add('open');
}

function closeModal(){document.getElementById('moverlay').classList.remove('open');}
document.getElementById('moverlay').addEventListener('click',e=>{if(e.target===document.getElementById('moverlay'))closeModal();});

function getCityLevelIdx(city){
  let lv=0;
  for(let i=CITY_LEVELS.length-1;i>=0;i--){if(city.pop>=CITY_LEVELS[i].pop){lv=i;break;}}
  return lv;
}
function getCityLevel(city){return CITY_LEVELS[getCityLevelIdx(city)];}

function fmtN(n){
  if(n===undefined||n===null)return'0';
  const abs=Math.abs(n);
  if(abs>=1e9)return(n/1e9).toFixed(1)+'B';
  if(abs>=1e6)return(n/1e6).toFixed(1)+'M';
  if(abs>=1e3)return(n/1e3).toFixed(0)+'K';
  return Math.round(n).toString();
}

function notify(msg,color=null){
  const el=document.createElement('div');
  el.className='notif';
  if(color)el.style.borderLeftColor=color;
  el.textContent=msg;
  document.getElementById('notifs').appendChild(el);
  setTimeout(()=>el.remove(),3200);
}

function setStatus(msg){document.getElementById('status').textContent=msg;}

// ══ TUTORIAL ══════════════════════════════════════════════════════════════════
function showTutorial(){
  const steps=[
    {delay:800,  msg:'👋 Welcome! Your goal: build the richest transport empire.'},
    {delay:3500, msg:'🗺️ Step 1 — Click any city on the map to open it and connect it to another.'},
    {delay:7000, msg:'🛤️ Step 2 — Choose Railway (faster income) or Road (cheaper) to connect two cities.'},
    {delay:11000,msg:'🚂 Step 3 — Once connected, buy a vehicle (Fleet tab) and assign it to that route.'},
    {delay:15500,msg:'💰 Step 4 — Sit back! Vehicles earn money every trip. Use profits to expand. Good luck!'},
  ];
  steps.forEach(s=>setTimeout(()=>notify(s.msg),s.delay));
}

// ══ PERSISTENCE ═══════════════════════════════════════════════════════════════
const SAVE_KEY='te2_save_v3',DAILY_KEY='te2_daily',STREAK_KEY='te2_streak';

function saveGame(){
  if(!G.started)return;
  try{
    const payload={v:3,ts:Date.now(),
      G:{started:G.started,tick:G.tick,speed:G.speed,year:G.year,month:G.month,era:G.era,
        activePl:G.activePl,numPl:G.numPl,players:G.players,cities:G.cities,
        connections:G.connections,vehicles:G.vehicles,industries:G.industries,
        terrain:G.terrain.map(row=>row.map(t=>t.type)),
        layer:G.layer,totalCargo:G.totalCargo,totalPax:G.totalPax,
        achievements:G.achievements},
      shop:SHOP_ITEMS.map(s=>({id:s.id,owned:s.owned}))};
    localStorage.setItem(SAVE_KEY,JSON.stringify(payload));
  }catch(e){}
}

function hasSave(){
  try{const s=localStorage.getItem(SAVE_KEY);if(!s)return false;const d=JSON.parse(s);return d&&d.v===3&&d.G&&d.G.started;}catch(e){return false;}
}

function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
    const data=JSON.parse(raw);if(!data||data.v!==3||!data.G)return false;
    // Restore shop
    if(data.shop)data.shop.forEach(s=>{const it=SHOP_ITEMS.find(x=>x.id===s.id);if(it)it.owned=s.owned;});
    // Restore terrain (compact form)
    const savedT=data.G.terrain;
    data.G.terrain=savedT.map(row=>row.map(type=>({type,h:0.5})));
    Object.assign(G,data.G);
    G.tool='ptr';G.drag=false;G.dragS=null;G.buildStart=null;G.mouseW=null;
    // Offline earnings (capped at 8h, ~$600/vehicle/min)
    const mins=Math.floor((Date.now()-data.ts)/60000);
    let offIncome=0;
    if(mins>=3&&G.vehicles.length>0){
      offIncome=Math.floor(G.vehicles.length*600*Math.min(mins,480));
      G.players[G.activePl].money+=offIncome;
    }
    // Boot UI
    document.getElementById('lobby').style.display='none';
    renderBuildCards();renderVehicleCards();renderPlayers();resizeCvs();
    window.addEventListener('resize',resizeCvs);
    const cvs=document.getElementById('mapcanvas');
    G.cam={x:COLS*TILE/2-cvs.width/2,y:ROWS*TILE/2-cvs.height/2,z:1};
    setupInput();renderCityPanel();renderCargoPanel();
    requestAnimationFrame(gameLoop);
    setInterval(saveGame,30000);
    setInterval(economyTick,4000);
    setInterval(aiTick,6000);
    setInterval(checkAchievements,5000);
    document.getElementById('ad-btn').style.display='';
    applyOwnedShopItems();
    setupDailyChallenge();
    const bonus=claimDailyBonus();
    if(offIncome>0||bonus>0)showWelcomeBack(mins,offIncome,bonus);
    else notify('🚂 Welcome back to Transport Empire II!');
    return true;
  }catch(e){localStorage.removeItem(SAVE_KEY);return false;}
}

// ══ DAILY BONUS + OFFLINE ══════════════════════════════════════════════════════
function claimDailyBonus(){
  const today=new Date().toDateString();
  if(localStorage.getItem(DAILY_KEY)===today)return 0;
  const streak=Math.min(7,parseInt(localStorage.getItem(STREAK_KEY)||'0')+1);
  localStorage.setItem(DAILY_KEY,today);
  localStorage.setItem(STREAK_KEY,String(streak));
  const bonus=25000*streak;
  G.players[G.activePl].money+=bonus;
  return bonus;
}

function showWelcomeBack(mins,offIncome,dailyBonus){
  const streak=parseInt(localStorage.getItem(STREAK_KEY)||'1');
  const parts=[];
  if(offIncome>0)parts.push(`⏰ Away for ${mins<60?mins+'m':Math.floor(mins/60)+'h '+mins%60+'m'}<br><span style="color:var(--green);font-size:16px;font-weight:800;">+$${fmtN(offIncome)}</span> earned while you were gone`);
  if(dailyBonus>0)parts.push(`🎁 Day ${streak} login bonus${streak>1?' 🔥 x'+streak+' streak':''}<br><span style="color:var(--gold);font-size:16px;font-weight:800;">+$${fmtN(dailyBonus)}</span>`);
  openModal('👋 Welcome Back!',
    `<div style="text-align:center;padding:4px 0;">${parts.join('<hr style="border-color:var(--border);margin:10px 0;">')}</div>`,
    [{label:'Collect & Play 🚂',primary:true,action:closeModal}]);
}

// ══ DAILY CHALLENGE ════════════════════════════════════════════════════════════
const DAILY_CHALLENGES=[
  {id:'earn',label:'Earn $200,000 today',target:200000,metric:'revenue'},
  {id:'connect',label:'Build 3 new connections',target:3,metric:'connections'},
  {id:'pax',label:'Carry 2,000 passengers',target:2000,metric:'pax'},
  {id:'cargo',label:'Deliver 500 tons of cargo',target:500,metric:'cargo'},
  {id:'fleet',label:'Buy 2 new vehicles',target:2,metric:'fleet'},
];
let DC={challenge:null,progress:0,claimed:false};

function setupDailyChallenge(){
  const dayIdx=Math.floor(Date.now()/86400000)%DAILY_CHALLENGES.length;
  DC.challenge=DAILY_CHALLENGES[dayIdx];
  DC.progress=0;DC.claimed=false;
  const box=document.getElementById('daily-challenge-box');
  if(box)box.style.display='';
  updateDailyChallengeUI();
}

function updateDailyChallengeUI(){
  if(!DC.challenge)return;
  const desc=document.getElementById('dc-desc'),bar=document.getElementById('dc-bar'),st=document.getElementById('dc-status');
  if(!desc)return;
  const p=G.players[G.activePl];
  let curr=0;
  if(DC.challenge.metric==='revenue')curr=p.revenue;
  else if(DC.challenge.metric==='connections')curr=G.connections.filter(c=>c.owner===G.activePl).length;
  else if(DC.challenge.metric==='pax')curr=p.pax;
  else if(DC.challenge.metric==='cargo')curr=p.cargo;
  else if(DC.challenge.metric==='fleet')curr=G.vehicles.filter(v=>v.owner===G.activePl).length;
  const pct=Math.min(100,Math.floor(curr/DC.challenge.target*100));
  desc.textContent=DC.challenge.label;
  bar.style.width=pct+'%';
  if(DC.claimed){st.innerHTML='<span style="color:var(--green)">✅ Completed! +$75,000</span>';}
  else if(pct>=100&&!DC.claimed){
    DC.claimed=true;
    G.players[G.activePl].money+=75000;
    notify('🎯 Daily challenge complete! +$75,000','#e8a020');
    st.innerHTML='<span style="color:var(--green)">✅ Completed! +$75,000</span>';
    saveGame();
  } else {
    st.textContent=`${pct}% — Reward: $75,000`;
  }
}

// ══ WATCH AD ══════════════════════════════════════════════════════════════════
let _adCooldown=false;
function watchAd(){
  if(_adCooldown){notify('⏳ Ad available again in a few minutes');return;}
  openModal('📺 Watch a Short Ad',
    `<div style="text-align:center;padding:12px 0;">
      <div style="font-size:36px;margin-bottom:8px">📺</div>
      <div style="font-size:15px;font-weight:700;color:var(--gold);margin-bottom:6px;">Earn FREE $50,000!</div>
      <div style="font-size:11px;color:var(--muted);">Watch a short ad to support development<br>and get an instant cash boost.</div>
    </div>`,
    [{label:'▶ Watch Ad (Simulated)',primary:true,action:()=>{
      closeModal();
      let t=3;
      const iv=setInterval(()=>{
        notify(`📺 Ad playing… ${t}s`);
        t--;
        if(t<0){clearInterval(iv);G.players[G.activePl].money+=50000;notify('✅ Ad complete! +$50,000 added','#30c060');
          _adCooldown=true;setTimeout(()=>{_adCooldown=false;},300000); // 5 min cooldown
          saveGame();}
      },1000);
    }},{label:'No thanks',primary:false,action:closeModal}]);
}

// ══ SHOP EFFECTS ══════════════════════════════════════════════════════════════
function applyPurchase(id){
  if(id==='planes'||id==='bundle'){
    VEHICLES.aircraft.era=1950;
    if(G.started){renderVehicleCards();notify('✈️ Aircraft routes unlocked from 1950!','#9060d0');}
  }
  if(id==='maps'||id==='bundle'){
    const sel=document.getElementById('opt-size');
    if(sel&&!document.getElementById('opt-alps')){
      [['alps','Alps · Snow — 12 cities'],['amazon','Amazon · Jungle — 16 cities'],['siberia','Siberia · Tundra — 10 cities']]
        .forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.id='opt-'+v;o.textContent=l;sel.appendChild(o);});
    }
  }
  if(id==='colors'||id==='bundle'){G._extraColors=true;notify('🎨 Custom colors unlocked! Edit player rows in the lobby.','#3a9fd0');}
}

function applyOwnedShopItems(){
  SHOP_ITEMS.filter(s=>s.owned).forEach(s=>applyPurchase(s.id));
}

// ══ INIT: show continue button if save exists ══════════════════════════════════
(function initSaveCheck(){
  if(hasSave())document.getElementById('continue-btn').style.display='';
})();
