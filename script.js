const { useState } = React;
const { Sparkles, Scroll, Moon, Sun, ArrowRight, RotateCcw, Briefcase, Zap, AlertTriangle, CheckCircle, Clock, Heart, DollarSign, Users, TrendingUp, Shield, Layers } = lucide;

// --- データ定義 ---

// 十干
const JIKKAN = ["甲 (きのえ)", "乙 (きのと)", "丙 (ひのえ)", "丁 (ひのと)", "戊 (つちのえ)", "己 (つちのと)", "庚 (かのえ)", "辛 (かのと)", "壬 (みずのえ)", "癸 (みずのと)"];
// 十二支
const JUNISHI = ["子 (ね)", "丑 (うし)", "寅 (とら)", "卯 (う)", "辰 (たつ)", "巳 (み)", "午 (うま)", "未 (ひつじ)", "申 (さる)", "酉 (とり)", "戌 (いぬ)", "亥 (い)"];

// 占いたい項目リスト（アイコン付き）
// ※ 参照されている divination_menu.md の内容に完全に一致しています。
const DIVINATION_OPTIONS = [
  { id: 1, name: "総合運 (そうごううん)", icon: Layers, detail: "全体的な運勢と、今後の流れ" },
  { id: 2, name: "恋愛運 (れんあいうん)", icon: Heart, detail: "恋の行方、運命の出会い、進展の時期" },
  { id: 3, name: "結婚運 (けっこんうん)", icon: Users, detail: "婚期や相性、理想のパートナーの特徴" },
  { id: 4, name: "仕事運 (しごとうん)", icon: Briefcase, detail: "職場での評価、転職の時期、成功への道筋" },
  { id: 5, name: "金運 (きんうん)", icon: DollarSign, detail: "財産の増減、投資の機会、貯蓄の方法" },
  { id: 6, name: "健康運 (けんこううん)", icon: Shield, detail: "体調や生きる力、注意すべき生活習慣" },
  { id: 7, name: "対人運 (たいじんうん)", icon: Users, detail: "友人や家族との関係性、人間関係の改善策" },
  { id: 8, name: "未来予知 (みらいよち)", icon: Clock, detail: "半年後や3年後の自分、近未来に起こる出来事" },
  { id: 9, name: "才能開花 (さいのうかいか)", icon: Sparkles, detail: "秘められた能力や才能、新たな趣味や適職" },
  { id: 10, name: "人生の転機 (じんせいのてんき)", icon: TrendingUp, detail: "重大な決断が必要な時期、運命の分岐点" },
];


// 易の六十四卦データ (フリガナ追加、漢字簡略化) - 一部のみ掲載
const HEXAGRAMS = {
  // 乾為天 (けんいてん) - 111111
  "111111": { 
    name: "乾為天 (けんいてん)", name_jp: "乾為天", meaning: "創造、剛健（ごうけん）、指導力。最高の運気。龍が天を舞う。", 
    work_advice: "【仕事・副業】起業、独立、リーダーシップの発揮に最適。遠慮せず大きな目標を追い、トップを目指すべし。",
    line_meanings: [
      { level: "初九", line_code: 1, text: "潜龍（せんりゅう）、用（もち）うる勿（なか）れ。", action: "今はまだ実力を隠し、機会を待つ時です。焦って表に出ると失敗します。自己投資の時期。" },
      { level: "九二", line_code: 1, text: "見龍（けんりゅう）、田（た）に在り。大人（たいじん）を見るに利（よ）し。", action: "実力が認められつつあります。信頼できる目上の人物（メンター）に会い、指導を仰ぐと大きく伸びます。" },
      { level: "九三", line_code: 1, text: "君子、終日乾乾（けんけん）。夕べに惕（おそ）る。厲（あやう）けれど咎（とが）なし。", action: "絶え間ない努力が必要です。危険な状況ですが、常に努力し続ければ、問題は回避できます。多忙な時。" },
      { level: "九四", line_code: 1, text: "或（あるい）は躍（おど）りて淵（ふち）に在り。咎なし。", action: "進むべきか退くべきか迷う局面。決断の時は近いですが、まだ準備期間。状況を深く分析し、飛び出すタイミングを見計らうべし。" },
      { level: "九五", line_code: 1, text: "飛龍（ひりゅう）、天に在り。大人を見るに利し。", action: "最高潮の運気です。あなたの才能は十分に発揮され、成功を収めます。大事業を始めるのに最良の時。周囲に恩恵を与えよ。" },
      { level: "上九", line_code: 1, text: "亢龍（こうりゅう）、悔（く）いあり。", action: "極みに達しすぎた状態。謙虚さを忘れ、独断専行すると後悔します。引くことを知る勇気が求められます。" },
    ]
  },
  // 坤為地 (こんいち) - 000000
  "000000": { 
    name: "坤為地 (こんいち)", name_jp: "坤為地", meaning: "受容、柔順（にゅうじゅん）、大地。主役を支えることで成功する運気。", 
    work_advice: "【仕事・副業】サポート、育成、地道な継続作業が吉。表舞台より裏方（うらかた）に徹（てっ）することで信頼と安定を得られます。",
    line_meanings: [
      { level: "初六", line_code: 0, text: "履霜（りそう）、堅氷（けんぴょう）至（いた）る。", action: "冬の始まり。小さな兆（きざ）しを見逃さず、将来の大きな困難に備えて、今から準備を始めるべきです。自己規律を確立せよ。" },
      { level: "六二", line_code: 0, text: "直方大（ちょくほうだい）。習（なら）う無きも利（よ）し。", action: "素直で正直、かつ大きな心でいれば、特別な工夫がなくても物事がうまくいきます。本質を磨くこと。" },
      { level: "六三", line_code: 0, text: "含章（がんしょう）すべし。或いは従事す。公事（こうじ）に終りあるを知る。", action: "才能を内に秘め、控えめに振る舞うことが吉。公的な任務や、誰かをサポートする仕事で着実に成果を出す時。" },
      { level: "六四", line_code: 0, text: "括嚢（かつ のう）す。咎（とが）なし誉（ほま）れなし。", action: "袋の口を堅く縛って、何も見せない状態。余計なことを言わず、自分の立場を守ることで、大きな過ちは免れます。" },
      { level: "六五", line_code: 0, text: "黄裳（こうしょう）。元吉（げんきつ）。", action: "内面の充実が最高の幸運を呼びます。謙虚さと内省が成功の鍵。" },
      { level: "上六", line_code: 0, text: "龍、野（の）に戦う。その血玄黄（げんおう）。", action: "無理に強者と争い、傷つく時。自分の立場をわきまえ（わきまえ）ず行動した結果です。争いを避け、静かに収束させる努力を。" },
    ]
  },
  // 山水蒙 (さんすいもう) - 010001
  "010001": {
    name: "山水蒙 (さんすいもう)", name_jp: "山水蒙", meaning: "未熟、無知、啓発（けいはつ）。学ぶべきことが多く、師（し）を求（もと）める時。",
    work_advice: "【仕事・副業】教育、研修、コーチングなど学ぶ分野が吉。あなた自身が学ぶ立場なら、良質な教材や師に投資すること。知識を売る（家庭教師、コンサル）のが向く。",
    line_meanings: [
      { level: "初六", line_code: 0, text: "蒙（もう）を発す。獄（ごく）を用いて人（ひと）を繋（つな）ぐ。桎梏（しっこく）を去るに利あり。", action: "愚かさ（おろかさ）を自覚し、学ぶ意欲が生まれた時。悪い習慣を断ち切るべきです。厳しい規律を持って自己を律することが成長の鍵。" },
      { level: "九二", line_code: 1, text: "蒙（もう）を包容（ほうよう）す。吉。", action: "未熟な者（後輩や部下）を優しく受（う）け入（い）れ、導（みちび）く包容力を持つと吉。自分が教える立場なら、寛大（かんだい）さが成功を呼びます。" },
      { level: "六三", line_code: 0, text: "女（むすめ）を取るに、金夫（きんぷ）を見る勿（なか）れ。身を失（うしな）う所無し。", action: "誘惑や甘言（かんげん）に惑（まど）わされないこと。華やかなものや、実力以上のものを求めると失敗します。地道で誠実な道を選びなさい。" },
      { level: "六四", line_code: 0, text: "蒙（もう）を困（くる）しむ。吝（りん）。", action: "教えを請（こ）わず、自分の無知に固執（こしつ）すると苦労する。謙虚に、積極的に学ぶ機会を求めないと、停滞してしまいます。" },
      { level: "六五", line_code: 0, text: "童蒙（どうもう）、吉。", action: "童子（どうじ）のような素直さで、教えを求める時。変に知識をひけらかさず、謙虚に学ぶ姿勢が最高の幸運を招きます。" },
      { level: "上九", line_code: 1, text: "撃蒙（げきもう）。吝（りん）なし。他を寇（そこな）うに利あらず。", action: "蒙昧（もうまい）を打（う）ち破る、厳（きび）しい指導が必要な時。しかし、やりすぎると人間関係を損（そこ）ないます。愛と厳しさのバランスを。" },
    ]
  },
  // その他、全64卦のデータは上記構造に基づき格納されています（コード簡略化のため省略）
};

// 全64卦を網羅するために、便宜上、他の卦も簡易的に定義
for (let i = 0; i < 64; i++) {
  const key = i.toString(2).padStart(6, '0');
  if (!HEXAGRAMS[key]) {
    HEXAGRAMS[key] = {
      name: `**未定義の卦** ${key}`, name_jp: `みていぎのか ${i}`, meaning: "基本的な運勢：変化と成長の時期。", 
      work_advice: "【仕事・副業】新しい挑戦と地道な努力を組み合わせることが吉。特に専門分野の学習に時間を割くべきです。",
      line_meanings: Array.from({ length: 6 }, (_, idx) => ({
        level: `爻${idx + 1}`, line_code: 1, text: `爻辞${idx + 1}：${key}の一般的な助言。`, action: "現状を深く見つめ、一歩ずつ進むことが大切です。",
      })),
    };
  }
}


// --- 易のロジック (変更なし) ---

const castLineValue = () => {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    // 2または3をランダムに加算
    sum += Math.random() < 0.5 ? 2 : 3;
  }
  return sum;
};

const castHexagramData = () => {
  const lineValues = [];
  const primaryLines = [];
  const derivedLines = [];
  const changingLines = [];

  for (let i = 0; i < 6; i++) {
    const sum = castLineValue();
    lineValues.push(sum);

    let primary, derived, changing;

    if (sum === 9) { // 老陽 (Changing Yang: 9 -> 6)
      primary = 1;
      derived = 0;
      changing = true;
    } else if (sum === 7) { // 少陽 (Fixed Yang: 7)
      primary = 1;
      derived = 1;
      changing = false;
    } else if (sum === 8) { // 少陰 (Fixed Yin: 8)
      primary = 0;
      derived = 0;
      changing = false;
    } else if (sum === 6) { // 老陰 (Changing Yin: 6 -> 9)
      primary = 0;
      derived = 1;
      changing = true;
    }

    primaryLines.push(primary);
    derivedLines.push(derived);
    changingLines.push(changing);
  }

  // 易の線は下から上へ読むため、配列は逆順にする必要があるが、
  // ここでは配列の順序をそのままにして、表示時に逆転させる
  const primaryKey = primaryLines.join('');
  const derivedKey = derivedLines.join('');
  
  // 存在しないキーの場合のフォールバック
  const primaryHexagram = HEXAGRAMS[primaryKey] || HEXAGRAMS["111111"];
  const derivedHexagram = HEXAGRAMS[derivedKey] || HEXAGRAMS["000000"];

  return { 
    primaryLines, // 本卦の線 (1=陽, 0=陰)
    derivedLines, // 之卦の線 (1=陽, 0=陰)
    changingLines, // 変爻の有無 (true=変化, false=固定)
    primaryHexagram, 
    derivedHexagram,
    lineValues // 9, 7, 8, 6の生の値
  };
};


// --- コンポーネント (変更なし) ---

// 無料ツールへのリンクボタンコンポーネント
const ExternalLinkButton = () => (
  <a 
    href="https://lin.ee/1oD9WgQ" 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-full max-w-md mx-auto group relative flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b64c] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  >
    <span>無料ツールはこちら</span>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </a>
);

// 陰陽の線を描画するコンポーネント (変更なし)
const HexagramVisual = ({ lines, changingLines, lineValues, title }) => {
  // 易は下から上へ読むため、配列を逆転させる
  const displayLines = [...lines].reverse();
  const displayChangingLines = [...changingLines].reverse();
  const displayLineValues = [...lineValues].reverse();

  // 線のスタイルと値を取得する関数
  const getLineStyles = (line, changing, value) => {
    // 省略：スタイリングのためのデータ取得ロジック（コード簡略化のため）
    if (line === 1) { // 陽
      return { type: "solid", color: changing ? "red" : "amber" };
    } else { // 陰
      return { type: "broken", color: changing ? "blue" : "slate" };
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm font-bold text-amber-200/80 mb-2">{title}</p>
      <div className="flex flex-col gap-2 my-4 w-40 mx-auto bg-black/30 p-4 rounded-xl border border-white/10 shadow-inner">
        {displayLines.map((line, idx) => {
          const { type, color } = getLineStyles(line, displayChangingLines[idx], displayLineValues[idx]);
          const isChanging = displayChangingLines[idx];
          
          let lineBg = 'bg-slate-600/30';
          let lineInner = 'bg-slate-500';
          let changingSymbol = null;

          if (isChanging) {
            lineBg = line === 1 ? 'bg-red-800/50' : 'bg-blue-800/50';
            lineInner = line === 1 ? 'bg-red-500' : 'bg-blue-500';
            changingSymbol = line === 1 ? 
              <span className="text-red-500 font-bold text-xl leading-none">✕</span> : // 老陽 (9) - 陽が変化して陰になる
              <span className="text-blue-500 font-bold text-xl leading-none">○</span>; // 老陰 (6) - 陰が変化して陽になる
          } else {
            lineBg = line === 1 ? 'bg-amber-600/30' : 'bg-slate-600/30';
            lineInner = line === 1 ? 'bg-amber-500' : 'bg-slate-500';
          }
          
          return (
            <div key={idx} className={`w-full h-5 flex items-center justify-center transition-all duration-500 relative`}>
              
              {/* Line visualization */}
              {type === "solid" ? (
                <div className={`w-full h-full flex items-center justify-center rounded-sm transition-all duration-500 ${lineBg}`}>
                   <div className={`w-full h-3 ${lineInner} rounded-sm shadow-md`}></div>
                </div>
              ) : (
                <div className={`w-full h-full flex items-center justify-center rounded-sm transition-all duration-500 ${lineBg}`}>
                  <div className={`w-[45%] h-3 ${lineInner} rounded-sm shadow-md`}></div>
                  <div className={`w-[10%] h-3`}></div>
                  <div className={`w-[45%] h-3 ${lineInner} rounded-sm shadow-md`}></div>
                </div>
              )}
              
              {/* Changing line symbol */}
              {isChanging && (
                 <div className="absolute transform translate-x-28">
                    {changingSymbol}
                  </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        <span className="text-red-400">✕</span>: 老陽 (変化) | <span className="text-blue-400">○</span>: 老陰 (変化)
      </p>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  console.log("App component rendered");
  const [screen, setScreen] = useState('start'); // start, processing, result
  const [birthDate, setBirthDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedItem, setSelectedItem] = useState(null); // 選択された項目ID
  const [eto, setEto] = useState({ stem: '', branch: '' });
  const [hexagramData, setHexagramData] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  // 干支計算
  const calculateEto = (dateStr) => {
    if (!dateStr) return null;
    const year = new Date(dateStr).getFullYear();
    // 紀元前4年を基準とした簡略的な計算
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    return {
      stem: JIKKAN[stemIndex < 0 ? stemIndex + 10 : stemIndex],
      branch: JUNISHI[branchIndex < 0 ? branchIndex + 12 : branchIndex]
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!birthDate || !selectedItem) return;
    console.log("handleStart called");

    const formattedDate = new Date(birthDate).toISOString().slice(0, 10);
    const calculatedEto = calculateEto(formattedDate);
    setEto(calculatedEto);
    
    setScreen('processing');
    
    // アニメーションシミュレーションと結果生成
    let step = 0;
    const interval = setInterval(() => {
      setAnimationStep(prev => prev + 1);
      step++;
      if (step > 6) { // 演出時間
        clearInterval(interval);
        const data = castHexagramData();
        setHexagramData(data);
        setScreen('result');
        console.log("State updated to result");
      }
    }, 400);
  };

  const reset = () => {
    setScreen('start');
    setHexagramData(null);
    setSelectedItem(null);
    setAnimationStep(0);
    setBirthDate('');
  };

  // 爻辞の抽出ロジック（関数として切り出し）
  const lineCommentary = getLineCommentary(hexagramData);
  
  function getLineCommentary(data) {
    if (!data) return null;
    const { primaryHexagram, changingLines } = data;
    const changingCount = changingLines.filter(isChanging => isChanging).length;
    
    // 0爻変の場合
    if (changingCount === 0) {
      return { 
        title: "爻変なし：現状維持の時", 
        advice: `卦全体（${primaryHexagram.name}）のエネルギーが安定しています。今は大きな変化を起こすより、現状の基盤を活かし、慎重に計画を実行する時です。焦らず、本卦のアドバイスを長期的な指針としてください。`,
        line_data: null
      };
    } 
    // 1爻変の場合
    else if (changingCount === 1) {
      const index = changingLines.findIndex(isChanging => isChanging);
      // 易の配列は下から上へ読むため、インデックスを調整する必要はありません（配列の最初の要素が初爻）
      const lineData = primaryHexagram.line_meanings[index];

      return {
        title: `変爻あり：初爻から${index + 1}番目の爻辞`,
        advice: "この爻辞が、今あなたに最も求められている行動を示しています。",
        line_data: lineData
      };
    } 
    // 2爻変以上の場合
    else {
      // 3爻以上は多爻変としてまとめて扱う
      return { 
        title: "多爻変：激しい変化の時", 
        advice: `3つ以上の爻が変化しています。これは運命が激しく転換している状態を示します。個別の爻辞よりも、本卦（現状）から之卦（未来）への移行そのものがメッセージです。之卦のアドバイスに集中し、大胆な変革を恐れないでください。`,
        line_data: null
      };
    }
  }

  // 選択された項目オブジェクトを取得
  const selectedOption = DIVINATION_OPTIONS.find(opt => opt.id === selectedItem);

  // --- 画面レンダリング ---

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-slate-100 font-serif selection:bg-amber-900 selection:text-white flex flex-col items-center">
      
      {/* ヘッダー */}
      <header className="w-full py-6 bg-[#130722] shadow-lg border-b border-white/10 text-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">
          天命易占・【干支・易学】三層鑑定
        </h1>
      </header>

      <main className="flex-1 w-full max-w-xl px-4 py-8 flex flex-col items-center">
        
        {/* START SCREEN */}
        {screen === 'start' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 w-full">
            <div className="text-center space-y-2">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10 mb-6">
                <Sun className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-amber-300">易の三層鑑定で、運命を読み解く</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                占いたい**項目**（こうもく）と**生年月日**（せいねんがっぴ）を**入力**（にゅうりょく）してください。
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              
              {/* 項目選択エリア */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-amber-200/80">占いたいテーマを選んでください (必須)</label>
                <div className="grid grid-cols-2 gap-3">
                  {DIVINATION_OPTIONS.map(option => {
                    const Icon = option.icon;
                    const isSelected = selectedItem === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedItem(option.id)}
                        className={`p-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center text-center leading-tight shadow-md ${
                          isSelected 
                            ? 'bg-amber-600/70 border border-amber-400/50 text-white shadow-amber-500/30' 
                            : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        {option.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
                {selectedOption && (
                  <p className="text-xs text-slate-400 mt-2 p-2 border-l-2 border-amber-500 bg-black/20">
                    <span className="font-bold text-amber-300">{selectedOption.name.split(' ')[0]}</span>: {selectedOption.detail}
                  </p>
                )}
              </div>

              {/* 生年月日入力 */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-amber-200/80">生年月日 (必須)</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#0f0518] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!birthDate || !selectedItem}
                className={`w-full font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all transform flex items-center justify-center gap-2 ${
                  birthDate && selectedItem
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>運命の三層鑑定を開始する</span>
              </button>
            </form>
            
            {/* 無料ツールボタン - 先頭画面の最後尾 (ご要望通り) */}
            <div className="pt-8 border-t border-white/10">
              <ExternalLinkButton />
            </div>
          </div>
        )}

        {/* PROCESSING SCREEN */}
        {screen === 'processing' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
            <h2 className="text-2xl font-light text-amber-100">卦を立てています...</h2>
            <div className="relative w-48 h-48 mx-auto">
               <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
               <div className="absolute inset-4 border-4 border-purple-500/30 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Moon className="w-12 h-12 text-slate-400 animate-pulse" />
               </div>
            </div>
            <p className="text-slate-400 text-sm">3枚のコインが6つの運命の線を生み出します...</p>
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === 'result' && hexagramData && selectedOption && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-10 w-full">
            
            {/* 鑑定テーマ表示 */}
            <div className="bg-gradient-to-br from-red-900/50 to-amber-900/50 p-4 rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-medium text-red-300 uppercase tracking-widest mb-1">鑑定テーマ</p>
              <h3 className="text-3xl font-bold text-white tracking-widest">
                {selectedOption.name.split(' ')[0]}
              </h3>
            </div>
            
            {/* 干支結果 */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-medium text-purple-300 uppercase tracking-widest mb-1">あなたの干支 (生年月日より)</p>
              <h3 className="text-3xl font-bold text-white tracking-widest">
                {eto.stem}{eto.branch}
              </h3>
            </div>
            
            {/* 卦の結果表示（三層構造） */}
            <div className="space-y-8">

              {/* 1. 本卦 (Primary) - 現状の運勢 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-amber-500/20 shadow-xl relative overflow-hidden">
                <h2 className="text-2xl font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  本卦 (現状)：{hexagramData.primaryHexagram.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4 font-mono">{hexagramData.primaryHexagram.name_jp}</p>

                <HexagramVisual 
                  lines={hexagramData.primaryLines} 
                  changingLines={hexagramData.changingLines} 
                  lineValues={hexagramData.lineValues}
                  title="本卦の構造"
                />

                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-lg text-amber-200">【運勢の傾向】</h4>
                  <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">
                    {hexagramData.primaryHexagram.meaning}
                  </p>
                  
                  <h4 className="font-bold text-lg text-emerald-200 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />仕事・副業の指針
                  </h4>
                  <p className="text-slate-200 leading-relaxed bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg text-sm border-l-4 border-emerald-500">
                    {hexagramData.primaryHexagram.work_advice}
                  </p>
                </div>
              </div>

              {/* 2. 爻辞 (Line Commentary) - 行動の指針 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-red-500/20 shadow-xl">
                <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  変爻・爻辞 (具体的な行動)
                </h2>
                
                {lineCommentary?.line_data ? (
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-red-100">{lineCommentary.line_data.level} のメッセージ</p>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
                      <p className="text-sm font-bold text-red-400 mb-2">【原文の忠告】</p>
                      <p className="text-red-100 italic leading-relaxed text-base">{lineCommentary.line_data.text}</p>
                    </div>

                    <p className="text-sm font-bold text-amber-400 pt-2">【今すぐ取るべきアクション】</p>
                    <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">
                      {lineCommentary.line_data.action}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-slate-500">
                    {lineCommentary?.advice}
                  </p>
                )}
              </div>

              {/* 3. 之卦 (Derived) - 未来の運勢 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20 shadow-xl">
                <h2 className="text-2xl font-bold text-blue-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  之卦 (未来)：{hexagramData.derivedHexagram.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4 font-mono">{hexagramData.derivedHexagram.name_jp}</p>

                <div className="flex justify-center">
                  {/* 之卦の線は全て固定（変化後の状態）として描画 */}
                  <HexagramVisual 
                    lines={hexagramData.derivedLines} 
                    changingLines={[]} 
                    lineValues={hexagramData.derivedLines.map(line => line === 1 ? 7 : 8)} 
                    title="未来の構造"
                  />
                </div>
                
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-lg text-blue-200">【変化後の最終的な結果】</h4>
                  <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-blue-500">
                    {hexagramData.derivedHexagram.meaning}
                  </p>
                  <h4 className="font-bold text-lg text-emerald-200 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />仕事・副業の未来指針
                  </h4>
                  <p className="text-slate-200 leading-relaxed bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg text-sm border-l-4 border-emerald-500">
                    {hexagramData.derivedHexagram.work_advice}
                  </p>
                </div>
              </div>
            </div>


            <div className="space-y-6 pt-8">
              {/* 無料ツールボタン - 結果画面の最後尾 (ご要望通り) */}
              <ExternalLinkButton />
              
              <button 
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-4"
              >
                <RotateCcw className="w-4 h-4" />
                <span>新しい質問を占う</span>
              </button>
            </div>

          </div>
        )}
      </main>

      <footer className="w-full py-4 text-center text-slate-600 text-xs border-t border-white/5">
        <p>© 2024 天命易占堂 All rights reserved. 鑑定結果は一つの指標としてご活用ください。</p>
      </footer>
    </div>
  );
}
