/* 안내형 질문 흐름. 답변은 현재 탭의 sessionStorage에만 보관합니다. */
(() => {
  const mode = document.body.dataset.mode;
  const isGeosa = mode === 'geosa';
  const key = `mindacu-${mode}-draft`;
  const previous = read('mindacu-geosa-draft');
  const belief = sessionStorage.getItem('topBeliefName');
  const flows = {
    geosa: [
      {id:'event',label:'최근 유발사건',question:'최근 마음이 불편해진 구체적인 장면은 무엇인가요?',hint:'누가, 언제, 어디서, 무슨 일이 있었는지 한 장면만 적어 보세요.',example:'예: 회의 중 내 의견에 답이 없었다.',follow:'그 장면의 어느 부분이 특히 마음에 남나요?'},
      {id:'emotion',label:'감정과 감각',question:'그 장면에서 어떤 감정이 올라왔나요?',choices:['불안','서운함','분노','수치심','슬픔','잘 모르겠어요'],hint:'가장 강한 감정을 하나 골라도 좋고, 여러 감정을 자유롭게 적어도 좋아요. 몸의 감각은 떠오를 때만 기록하세요.',follow:'그 감정은 몸의 어디에서, 어떤 느낌으로 느껴지나요? 색·모양·이미지가 떠오르면 적어도 좋습니다.'},
      {id:'memory',label:'비슷한 기억',question:'예전에도 비슷한 감정을 느꼈던 장면이 떠오르나요?',choices:['떠오르는 장면이 있어요','지금은 떠오르지 않아요','떠올리고 싶지 않아요'],hint:'기억이 없거나 다루고 싶지 않다면 그대로 지나가도 괜찮습니다.',follow:'떠오르는 장면이 있다면 당시 무엇이 일어났고 어떤 감정이었나요? 그 장면을 떠올릴 때 지금의 느낌도 살펴보세요.',optional:true},
      {id:'interpretation',label:'당시와 지금의 해석',question:'그때의 나는 그 일을 어떻게 받아들였나요?',hint:'떠오르는 과거 장면이 없다면 최근 사건을 기준으로 답해 주세요.',example:'예: “내가 부족해서 사람들이 무시하는구나.”',follow:'지금의 나는 그 장면을 어떻게 바라보나요? 두 해석이 달라도 괜찮습니다.'},
      {id:'future',label:'예상했던 미래',question:'그 생각이 계속된다면 앞으로 어떤 일이 생길 것 같았나요?',hint:'삶, 행동, 관계에서 걱정했던 변화를 떠올려 보세요.',follow:'그런 일이 벌어질 것 같을 때 어떤 감정이 드나요?',optional:true},
      {id:'attitude',label:'반응과 태도',question:'그 걱정 속에서 나는 어떻게 반응하거나 행동했나요?',example:'예: 더 완벽하게 준비했다 / 연락을 피했다.',follow:'그 태도가 당장은 무엇을 막거나 얻도록 도왔나요?',optional:true},
      {id:'belief',label:'신념과 자아상',question:'그 경험에서 만들어진 “반드시 …해야 한다” 또는 “나는 …한 사람이다” 같은 문장이 있나요?',hint:'검사 결과는 탐색의 출발점일 뿐, 실제 문장은 본인의 경험에서 고르세요.',follow:'그 문장을 품은 나를 모습·색·무게·질감으로 표현한다면 어떨까요?',optional:true},
      {id:'intention',label:'선의적 의도',question:'그 반응이나 신념이 나를 지키려고 했다면, 무엇으로부터 보호하려 했을까요?',example:'예: 거절당하는 아픔을 피하고 싶었다.',follow:'그렇게 애써서 얻고 싶었던 것, 또는 잠시 얻을 수 있었던 것은 무엇인가요?',optional:true},
      {id:'block',label:'심리적 역전',question:'바꾸고 싶은 마음과 동시에 변화가 망설여지는 부분도 있나요?',hint:'없다면 없다고 적어도 좋습니다. 억지로 이유를 찾지 않아도 됩니다.',follow:'그 망설임이 나에게 알려 주는 필요나 걱정이 있다면 무엇인가요?',optional:true},
      {id:'closing',label:'지금 상태 확인',question:'여기까지 살펴본 뒤 지금 몸과 마음은 어떤가요?',hint:'불편하다면 멈추고 주변을 둘러보며 바닥에 닿은 발의 감각을 확인하세요. 특정 지압이나 호흡은 진행자 안내에 따를 수 있습니다.',follow:'다음 단계에서 어떤 느낌을 더 경험하고 싶나요?',optional:true}
    ],
    yangjeong: [
      {id:'route',label:'긍정 감정 찾기',question:'지금 긍정적인 감정에 접근할 수 있는 출발점을 골라 주세요.',choices:['없다 치고','됐다 치고','뒤집기','즐거웠던 기억','지금은 잘 모르겠어요'],hint:'어느 길이든 괜찮습니다. 긍정적인 감정을 억지로 만들 필요는 없습니다.',follow:'그렇게 상상하거나 기억했을 때 아주 조금이라도 달라지는 느낌이 있나요?',optional:true},
      {id:'emotion',label:'긍정 감정 구체화',question:'그 출발점에서 느껴지는 감정을 말로 표현하면 무엇인가요?',hint:'없다면 “아직 모르겠다”라고 적어도 괜찮습니다.',example:'예: 편안함, 안도감, 자유로움.',follow:'그 감정이 몸에서 느껴진다면 어디에서 어떻게 느껴지나요? 색·온도·무게·이미지로 표현해도 좋습니다.',optional:true},
      {id:'memory',label:'연결되는 기억',question:'그 감정과 연결되는 실제 기억이나 상상할 수 있는 장면이 있나요?',hint:'실제 기억이 떠오르지 않으면 이 질문을 건너뛰세요.',follow:'그 장면에서 특히 마음에 남는 사람, 소리, 표정 또는 감각은 무엇인가요?',optional:true},
      {id:'meaning',label:'해석과 가능성',question:'이런 감정을 경험하는 나를 보면 어떤 생각이 드나요?',hint:'이 감정이 이어진다면 삶이나 관계에서 어떤 가능성이 열릴지 살펴보세요.',follow:'작게라도 다르게 행동할 수 있는 상황이 있을까요?',optional:true},
      {id:'belief',label:'새로운 신념',question:'이 경험에서 나 자신이나 타인에 관해 어떤 믿음을 선택하고 싶나요?',example:'예: “완벽하지 않아도 관계를 맺을 수 있다.”',follow:'그 믿음이 내게 실제로 와닿으려면 어떤 표현으로 바꾸면 좋을까요?',optional:true},
      {id:'image',label:'긍정 취상과 자아상',question:'그 감정과 믿음을 장면으로 그린다면 어떤 모습인가요?',hint:'떠오른 장면을 글로 적고, 아래에서 배경과 색을 골라 미리 보세요. 마음에 맞는 그림이 없으면 글만 남겨도 됩니다.',follow:'그 장면 속 나에게서 지금 가져올 수 있는 작은 부분은 무엇인가요?',optional:true},
      {id:'affirmation',label:'나의 문장',question:'내 말투로 지금 믿을 수 있는 짧은 문장을 만들어 볼까요?',hint:'단정적인 말이 어색하면 “나는 조금씩 …할 수 있다”처럼 시작하세요.',example:'예: “나는 나의 속도로 관계를 만들어 갈 수 있다.”',follow:'이 문장을 일상에서 떠올리기 쉬운 순간은 언제일까요?',optional:true},
      {id:'practice',label:'일상에 연결하기',question:'오늘이나 이번 주에 시도할 수 있는 아주 작은 행동 하나는 무엇인가요?',hint:'실천을 약속하기 부담스럽다면 떠오르는 아이디어만 적어도 됩니다.',follow:'그때 나의 문장이나 이미지를 어떻게 떠올릴 수 있을까요?',optional:true}
    ]
  };
  const steps = flows[mode];
  if (!steps) return;
  const state = read(key);
  let index = Math.min(state.index || 0, steps.length);
  const answers = state.answers || {};
  const root = document.getElementById('content');
  const svgNS = 'http://www.w3.org/2000/svg';
  const scenes = {sun:'햇살',sea:'바다',tree:'나무',mountain:'산',abstract:'빛과 색'};
  const palettes = {warm:['#fff1dd','#f8c987','#ec906d','#8d675f'],green:['#edf5e9','#c6dcba','#779f8a','#436f65'],blue:['#e9f5f6','#b9d9e7','#7baac6','#486e9f'],violet:['#f4edf8','#dac6ea','#ab9acf','#776aa5']};
  const progress = document.getElementById('progress-fill');
  document.getElementById('context').textContent = isGeosa
    ? (belief ? `검사에서 가장 높았던 영역: ${belief}. 실제 탐색 주제는 자유롭게 바꿀 수 있습니다.` : '검사를 하지 않아도 자신의 경험으로 시작할 수 있습니다.')
    : (previous.answers?.belief?.main ? `앞서 기록한 신념: ${previous.answers.belief.main}` : '앞선 기록이 없어도 이 단계부터 시작할 수 있습니다.');

  function read(name) { try { return JSON.parse(sessionStorage.getItem(name) || '{}'); } catch { return {}; } }
  function save() { sessionStorage.setItem(key, JSON.stringify({index,answers})); }
  function el(tag, cls, value) { const node = document.createElement(tag); if(cls) node.className=cls; if(value !== undefined) node.textContent=value; return node; }
  function button(label, cls, handler) { const b=el('button',cls,label); b.type='button'; b.addEventListener('click',handler); return b; }
  function guessScene(text) {
    if(/바다|파도|해변|호수/.test(text)) return 'sea';
    if(/나무|숲|잎|꽃/.test(text)) return 'tree';
    if(/산|봉우리|언덕/.test(text)) return 'mountain';
    if(/햇살|태양|노을|해/.test(text)) return 'sun';
    return 'abstract';
  }
  function svgEl(tag, attrs={}) { const node=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));return node; }
  function paintScene(svg, scene, tone) {
    const [bg,light,mid,dark]=palettes[tone] || palettes.warm;
    svg.replaceChildren(); svg.setAttribute('viewBox','0 0 640 360');svg.setAttribute('role','img');svg.setAttribute('aria-label',`${scenes[scene]} 장면의 상징적 시각화`);
    svg.append(svgEl('rect',{width:640,height:360,fill:bg}));
    const orb=svgEl('circle',{cx:465,cy:118,r:71,fill:light,opacity:.75});svg.append(orb);
    if(scene==='sea') {
      svg.append(svgEl('path',{d:'M0 205 Q90 181 175 202 T350 200 T640 202 V360 H0Z',fill:mid}),svgEl('path',{d:'M0 258 Q80 222 165 260 T335 255 T505 265 T640 252 V360 H0Z',fill:dark,opacity:.72}));
      for(let x=55;x<630;x+=115)svg.append(svgEl('path',{d:`M${x} 225 q25 -9 50 0`,fill:'none',stroke:bg,'stroke-width':4,'stroke-linecap':'round',opacity:.85}));
    } else if(scene==='mountain') {
      svg.append(svgEl('path',{d:'M0 320 L152 130 L300 320Z',fill:mid}),svgEl('path',{d:'M170 340 L410 112 L640 340Z',fill:dark,opacity:.8}),svgEl('path',{d:'M370 151 L410 112 L454 156 L414 144Z',fill:bg,opacity:.9}));
    } else if(scene==='tree') {
      svg.append(svgEl('path',{d:'M0 311 Q320 266 640 308 V360 H0Z',fill:light}),svgEl('path',{d:'M299 332 V170 M300 243 L250 200 M300 225 L358 183',stroke:dark,'stroke-width':17,'stroke-linecap':'round',fill:'none'}));
      [[263,174,62],[340,169,65],[302,123,76]].forEach(([cx,cy,r])=>svg.append(svgEl('circle',{cx,cy,r,fill:mid,opacity:.88})));
    } else if(scene==='sun') {
      svg.append(svgEl('circle',{cx:325,cy:150,r:83,fill:light}),svgEl('path',{d:'M0 285 Q155 235 315 289 T640 281 V360 H0Z',fill:mid}),svgEl('path',{d:'M0 330 Q240 296 440 325 T640 314 V360 H0Z',fill:dark,opacity:.55}));
    } else {
      [[218,162,104,mid],[371,169,117,light],[310,215,73,dark]].forEach(([cx,cy,r,fill])=>svg.append(svgEl('circle',{cx,cy,r,fill,opacity:.53})));
      svg.append(svgEl('path',{d:'M122 273 Q260 70 498 275',fill:'none',stroke:dark,'stroke-width':8,'stroke-linecap':'round',opacity:.5}));
    }
  }
  function artControls(prior, input) {
    const wrap=el('div','art-panel');const heading=el('h3','','나의 취상 카드');wrap.append(heading);
    const sceneLabel=el('label','','장면');const sceneSelect=el('select','art-select');Object.entries(scenes).forEach(([value,label])=>{const opt=el('option','',label);opt.value=value;sceneSelect.append(opt)});sceneSelect.value=prior.scene || guessScene(input.value);
    const toneLabel=el('label','','색감');const toneSelect=el('select','art-select');[['warm','따뜻한 빛'],['green','푸른 숲'],['blue','맑은 하늘'],['violet','부드러운 보랏빛']].forEach(([value,label])=>{const opt=el('option','',label);opt.value=value;toneSelect.append(opt)});toneSelect.value=prior.tone || 'warm';
    const row=el('div','art-settings');sceneLabel.append(sceneSelect);toneLabel.append(toneSelect);row.append(sceneLabel,toneLabel);wrap.append(row);
    const svg=svgEl('svg');svg.classList.add('art-preview');wrap.append(svg);
    const caption=el('p','art-caption');wrap.append(caption);
    const repaint=()=>{paintScene(svg,sceneSelect.value,toneSelect.value);caption.textContent=input.value.trim() || '내가 느낀 긍정 취상을 이곳에 적어 주세요.'};
    sceneSelect.addEventListener('change',repaint);toneSelect.addEventListener('change',repaint);input.addEventListener('input',()=>{if(!prior.scene)sceneSelect.value=guessScene(input.value);repaint()});repaint();
    return {wrap,values:()=>({scene:sceneSelect.value,tone:toneSelect.value})};
  }
  function contextual(step, answer) {
    if (step.id === 'memory' && /떠오르지|싶지|모르/.test(answer)) return '기억을 찾지 않아도 됩니다. 최근의 장면에서 느낀 감정만으로 이어가세요.';
    if (step.id === 'route') {
      if (/없다/.test(answer)) return '그 불편함이 지금 없다고 가정하면 어떤 느낌이 조금 생길까요?';
      if (/됐다/.test(answer)) return '바라던 방향으로 일이 잘 되었다고 상상하면 어떤 기분인가요?';
      if (/뒤집/.test(answer)) return '기존의 불편한 감정과 반대되는, 지금 필요한 감정은 무엇일까요?';
      if (/기억/.test(answer)) return '최근 또는 과거의 편안했던 순간 하나를 떠올리면 어떤 감정인가요?';
      return '감정 대신 조금 덜 불편한 순간이나 몸의 작은 변화를 찾아도 됩니다.';
    }
    if (step.id === 'emotion' && /모르/.test(answer)) return '이름을 붙이기 어렵다면 몸의 느낌이나 “그냥 불편하다”라는 말부터 시작해도 좋아요.';
    return step.follow;
  }
  function render() {
    root.replaceChildren();
    progress.style.width = `${Math.round(index / steps.length * 100)}%`;
    document.getElementById('counter').textContent = index < steps.length ? `${index+1} / ${steps.length}` : '완료';
    if (index === steps.length) return complete();
    const s=steps[index], prior=answers[s.id] || {};
    root.append(el('span','pill',s.label),el('h2','prompt',s.question));
    if(s.hint)root.append(el('p','hint',s.hint));
    if(s.example)root.append(el('p','example',s.example));
    let selected=prior.choice || '';
    if(s.choices){
      const group=el('div','choices'); group.setAttribute('role','group'); group.setAttribute('aria-label','답변 출발점');
      s.choices.forEach(c=>{const b=button(c,`choice ${selected===c?'selected':''}`,()=>{selected=c;group.querySelectorAll('button').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false')});b.classList.add('selected');b.setAttribute('aria-pressed','true');followLabel.textContent=contextual(s, selected);followBox.hidden=false;}); b.setAttribute('aria-pressed',selected===c?'true':'false');group.append(b)});
      root.append(group);
    }
    const input=el('textarea','answer');input.setAttribute('aria-label',s.label+' 답변');input.placeholder='떠오르는 만큼만 적어 주세요.';input.value=prior.main || '';root.append(input);
    const art=(!isGeosa && s.id==='image') ? artControls(prior,input) : null; if(art)root.append(art.wrap);
    const capture=()=>({main:input.value.trim(),follow:followInput.value.trim(),choice:selected,...(art?art.values():{})});
    const followBox=el('div','follow'); const followLabel=el('label','',contextual(s,selected || input.value)); const followInput=el('textarea','answer');followInput.placeholder='선택 질문입니다. 비워 두어도 됩니다.';followInput.value=prior.follow || '';followLabel.append(followInput);followBox.append(followLabel);root.append(followBox);
    const updateFollow=()=>{followLabel.firstChild.textContent=contextual(s,selected || input.value);};input.addEventListener('input',updateFollow);
    const error=el('p','error');error.setAttribute('role','alert');root.append(error);
    const actions=el('div','actions');
    if(index) actions.append(button('이전 질문','secondary',()=>{answers[s.id]=capture();index--;save();render()}));
    actions.append(button(index===steps.length-1?'정리 보기':'다음 질문','primary',()=>{
      const main=input.value.trim() || selected;
      if(!main && !s.optional){error.textContent='한 문장으로 적거나 선택지를 골라 주세요.';input.focus();return;}
      answers[s.id]={...capture(),main}; index++;save();render();window.scrollTo(0,0);
    }));
    if(s.optional)actions.append(button('지금은 건너뛰기','secondary',()=>{answers[s.id]={main:'',follow:'',choice:''};index++;save();render();window.scrollTo(0,0)}));
    root.append(actions);
  }
  function complete(){
    root.append(el('span','pill','돌아보기'),el('h2','prompt',isGeosa?'거사 과정 기록':'양정 과정 기록'),el('p','muted','답변은 자동 해석되지 않습니다. 지금의 경험에 맞는 부분만 살펴보세요.'));
    const review=el('div','review'); steps.forEach(s=>{const a=answers[s.id];if(!a?.main&&!a?.follow)return;const d=el('details');d.append(el('summary','',s.label));if(a.main)d.append(el('p','',a.main));if(a.follow)d.append(el('p','',a.follow));review.append(d)});root.append(review);
    if(!isGeosa && answers.image?.main) {
      const art=el('div','art-panel');art.append(el('h3','','나의 긍정 취상'));
      const svg=svgEl('svg');svg.classList.add('art-preview');paintScene(svg,answers.image.scene || guessScene(answers.image.main),answers.image.tone || 'warm');art.append(svg,el('p','art-caption',answers.image.main));
      art.append(button('취상 카드 저장 (SVG)','secondary',()=>{
        const copy=svg.cloneNode(true);const title=svgEl('title');title.textContent='나의 긍정 취상';copy.prepend(title);
        copy.setAttribute('xmlns',svgNS);copy.setAttribute('width','1280');copy.setAttribute('height','720');
        const file=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml;charset=utf-8'});
        const url=URL.createObjectURL(file);const a=el('a');a.href=url;a.download='나의-긍정-취상.svg';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }));root.append(art);
    }
    const actions=el('div','actions');actions.append(button('마지막 질문 수정','secondary',()=>{index=steps.length-1;save();render()}));
    if(isGeosa) actions.append(button('양정 과정으로','primary',()=>{location.href='yangjeong.html'}));
    else actions.append(button('처음으로','primary',()=>{location.href='index.html'}));
    root.append(actions);
  }
  document.getElementById('reset').addEventListener('click',()=>{if(confirm('이 단계의 기록을 지우고 다시 시작할까요?')){sessionStorage.removeItem(key);index=0;Object.keys(answers).forEach(k=>delete answers[k]);render()}});
  render();
})();
