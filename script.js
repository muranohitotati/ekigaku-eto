const { useState } = React;
const { Sparkles, Scroll, Moon, Sun, ArrowRight, RotateCcw, Briefcase, Zap, AlertTriangle, CheckCircle, Clock, Heart, DollarSign, Users, TrendingUp, Shield, Layers } = lucide;

// --- データ定義 ---

// 十干 (Jikkan)
const JIKKAN = ["甲 (きのえ)", "乙 (きのと)", "丙 (ひのえ)", "丁 (ひのと)", "戊 (つちのえ)", "己 (つちのと)", "庚 (かのえ)", "辛 (かのと)", "壬 (みずのえ)", "癸 (みずのと)"];
// 十二支 (Junishi)
const JUNISHI = ["子 (ね)", "丑 (うし)", "寅 (とら)", "卯 (う)", "辰 (たつ)", "巳 (み)", "午 (うま)", "未 (ひつじ)", "申 (さる)", "酉 (とり)", "戌 (いぬ)", "亥 (い)"];

// 鑑定項目を5つに絞り込み
const DIVINATION_OPTIONS = [
  { id: 1, name: "総合運", icon: Layers, detail: "全体的な運勢と、今後の流れ" },
  { id: 2, name: "恋愛運", icon: Heart, detail: "恋の行方、運命の出会い、進展の時期" },
  { id: 3, name: "仕事運", icon: Briefcase, detail: "職場での評価、転職の時期、成功への道筋" },
  { id: 4, name: "金運", icon: DollarSign, detail: "財産の増減、投資の機会、貯蓄の方法" },
  { id: 5, name: "健康運", icon: Shield, detail: "体調や生きる力、注意すべき生活習慣" },
];


// 詳細に定義された3つの卦のデータ（テーマ別解釈を追加）
const SPECIFIC_HEXAGRAMS = {
  // 乾為天 (けんいてん) - 111111
  "111111": { 
    name: "乾為天 (けんいてん)", name_jp: "乾為天", meaning: "創造、剛健（ごうけん）、指導力。最高の運気。龍が天を舞う。", 
    work_advice: "起業、独立、リーダーシップの発揮に最適。遠慮せず大きな目標を追い、トップを目指すべし。", // 一般指針
    line_meanings: [
      { level: "初九", line_code: 1, text: "潜龍（せんりゅう）、用（もち）うる勿（なか）れ。", action: "今はまだ実力を隠し、機会を待つ時。焦って表に出ると失敗。自己投資の時期。" },
      { level: "九五", line_code: 1, text: "飛龍（ひりゅう）、天に在り。大人を見るに利し。", action: "最高潮の運気です。あなたの才能は十分に発揮され、成功を収めます。大事業を始めるのに最良の時。" },
      { level: "上九", line_code: 1, text: "亢龍（こうりゅう）、悔（く）いあり。", action: "極みに達しすぎた状態。謙虚さを忘れ、独断専行すると後悔します。引くことを知る勇気が求められます。" },
      // 省略した爻辞は、他の爻辞と合わせて6つになるように調整
      { level: "九二", line_code: 1, text: "見龍、田に在り。大人を見るに利し。", action: "実力が認められつつあります。信頼できる目上の人物に会い、指導を仰ぐと大きく伸びます。" },
      { level: "九三", line_code: 1, text: "君子、終日乾乾。夕べに惕る。厲けれど咎なし。", action: "絶え間ない努力が必要。危険な状況ですが、常に努力し続ければ、問題は回避。多忙な時。" },
      { level: "九四", line_code: 1, text: "或は躍りて淵に在り。咎なし。", action: "進むべきか退くべきか迷う局面。決断の時は近いですが、まだ準備期間。状況を深く分析し、飛び出すタイミングを見計らうべし。" },
    ],
    // テーマ別解釈
    theme_meanings: {
      1: { type: "飛躍・上昇", text: "最高の運気です。積極的に行動することで、全ての願いが叶いやすいでしょう。しかし、自信過剰にならないよう注意が必要です。" }, // 総合運
      2: { type: "積極的な展開", text: "恋愛面で主導権を握るべき時。勇気を出して告白やプロポーズをすれば成功します。理想の異性と出会う確率も非常に高いです。" }, // 恋愛運
      3: { type: "リーダーシップ", text: "独立や起業、昇進に最適な時期。遠慮せず、あなたの指導力と創造性を存分に発揮してください。大きな成果が期待できます。" }, // 仕事運
      4: { type: "絶頂の金運", text: "大きな投資や資産運用に踏み切る好機。収入は増大しますが、無駄遣いせず、次なる事業への再投資を考えるべきです。" }, // 金運
      5: { type: "活力の充実", text: "エネルギーに満ち溢れていますが、その反動で無理をしがちです。頭痛や高血圧に注意し、適度な休息を意識して取り入れてください。" }, // 健康運
    }
  },
  // 坤為地 (こんいち) - 000000
  "000000": { 
    name: "坤為地 (こんいち)", name_jp: "坤為地", meaning: "受容、柔順（にゅうじゅん）、大地。主役を支えることで成功する運気。", 
    work_advice: "サポート、育成、地道な継続作業が吉。裏方（うらかた）に徹（てっ）することで信頼と安定を得られます。", // 一般指針
    line_meanings: [
      { level: "初六", line_code: 0, text: "履霜（りそう）、堅氷（けんぴょう）至（いた）る。", action: "小さな兆しを見逃さず、将来の大きな困難に備えて、今から準備を始めるべき。自己規律を確立せよ。" },
      { level: "六二", line_code: 0, text: "直方大（ちょくほうだい）。習う無きも利し。", action: "素直で正直、かつ大きな心でいれば、特別な工夫がなくても物事がうまくいく。本質を磨くこと。" },
      { level: "六五", line_code: 0, text: "黄裳（こうしょう）。元吉（げんきつ）。", action: "内面の充実が最高の幸運を呼びます。謙虚さと内省が成功の鍵。" },
      // 省略した爻辞は、他の爻辞と合わせて6つになるように調整
      { level: "六三", line_code: 0, text: "含章すべし。或いは従事す。公事に終りあるを知る。", action: "才能を内に秘め、控えめに振る舞うことが吉。公的な任務や、誰かをサポートする仕事で着実に成果を出す時。" },
      { level: "六四", line_code: 0, text: "括嚢す。咎なし誉れなし。", action: "余計なことを言わず、自分の立場を守ることで、大きな過ちは免れます。" },
      { level: "上六", line_code: 0, text: "龍、野に戦う。その血玄黄（げんおう）。", action: "無理に強者と争い、傷つく時。争いを避け、静かに収束させる努力を。" },
    ],
    // テーマ別解釈
    theme_meanings: {
      1: { type: "堅実・安定", text: "全てを受け入れ、他者を支える姿勢が幸運を呼びます。派手な動きは避け、足元を固めることに専念すべきです。" }, // 総合運
      2: { type: "受動的な愛", text: "自分から追いかけるのではなく、相手からのアプローチを待つ方が吉。献身的にパートナーを支えることで、安定した愛を築けます。結婚は良縁です。" }, // 恋愛運
      3: { type: "サポート役の成功", text: "リーダーよりも、裏方や補佐役として力を発揮できます。地道な努力が評価され、組織内での信頼が厚くなります。育成や教育にも適しています。" }, // 仕事運
      4: { type: "貯蓄の時期", text: "大きな利益は望めませんが、堅実に貯蓄や節約に取り組むことで資産が安定します。ギャンブルや投機的な投資は避けてください。" }, // 金運
      5: { type: "養生と安定", text: "派手なダイエットや運動は避け、規則正しい生活とバランスの取れた食事が重要です。特に消化器系（胃腸）のケアを意識しましょう。" }, // 健康運
    }
  },
  // 山水蒙 (さんすいもう) - 010001
  "010001": {
    name: "山水蒙 (さんすいもう)", name_jp: "山水蒙", meaning: "未熟、無知、啓発（けいはつ）。学ぶべきことが多く、師（し）を求（もと）める時。",
    work_advice: "教育、研修、コーチングなど学ぶ分野が吉。良質な教材や師に投資すること。知識を売る（家庭教師、コンサル）のが向く。", // 一般指針
    line_meanings: [
      { level: "初六", line_code: 0, text: "蒙（もう）を発す。獄（ごく）を用いて人（ひと）を繋（つな）ぐ。桎梏（しっこく）を去るに利あり。", action: "愚かさを自覚し、学ぶ意欲が生まれた時。悪い習慣を断ち切るべき。厳しい規律を持って自己を律することが成長の鍵。" },
      { level: "九二", line_code: 1, text: "蒙（もう）を包容（ほうよう）す。吉。", action: "未熟な者（後輩や部下）を優しく受け入れ、導く包容力を持つと吉。自分が教える立場なら、寛大さが成功を呼びます。" },
      { level: "六五", line_code: 0, text: "童蒙（どうもう）、吉。", action: "童子のような素直さで、教えを求める時。変に知識をひけらかさず、謙虚に学ぶ姿勢が最高の幸運を招きます。" },
      // 省略した爻辞は、他の爻辞と合わせて6つになるように調整
      { level: "六三", line_code: 0, text: "女を取るに、金夫を見る勿れ。身を失う所無し。", action: "誘惑や甘言に惑わされないこと。華やかなものや、実力以上のものを求めると失敗。地道で誠実な道を選びなさい。" },
      { level: "六四", line_code: 0, text: "蒙を困しむ。吝。", action: "教えを請わず、自分の無知に固執すると苦労する。謙虚に、積極的に学ぶ機会を求めないと、停滞してしまいます。" },
      { level: "上九", line_code: 1, text: "撃蒙。吝なし。他を寇なうに利あらず。", action: "蒙昧を打ち破る、厳しい指導が必要な時。しかし、やりすぎると人間関係を損ないます。" },
    ],
    // テーマ別解釈
    theme_meanings: {
      1: { type: "学習・未完成", text: "今はまだ準備期間であり、運気は不安定です。自己投資や学習に時間を使うことで、将来大きな飛躍が期待できます。" }, // 総合運
      2: { type: "未熟な恋", text: "相手に対して遠慮や誤解が生じやすい時期。積極的にコミュニケーションをとり、相手の気持ちを深く理解する努力が必要です。片思いの人は、まず自分磨きを。" }, // 恋愛運
      3: { type: "研修・育成", text: "新しいスキルや知識の習得が必須です。指導者の下で学ぶこと、または部下を育成することがあなたの役割。今の会社に固執せず、視野を広げるべきです。" }, // 仕事運
      4: { type: "知識への投資", text: "お金は自己啓発や学習のために使うと吉。未熟な状態での投機や大きな買い物は損失を招きやすいです。お金の勉強を始めるべき時。" }, // 金運
      5: { type: "生活習慣の見直し", text: "健康に関する知識が不足しているかもしれません。専門家の指導を仰いだり、正しい食生活や運動習慣を基礎から学び直す必要があります。" }, // 健康運
    }
  },
};

// 易の六十四卦データ (全ての卦にテーマ別解釈の基本構造を持たせる)
const HEXAGRAMS = {
  ...Object.fromEntries(
    Array.from({ length: 64 }, (_, i) => {
      const key = i.toString(2).padStart(6, '0');
      const defaultLineMeanings = Array.from({ length: 6 }, (_, idx) => ({
        level: `爻${idx + 1}`, line_code: 1, text: `爻辞${idx + 1}：一般的な助言。`, action: "現状を深く見つめ、一歩ずつ進むことが大切です。",
      }));
      
      const generalMeaning = `安定と調和（ちょうわ）。無理のない範囲（はんい）で着実に前進する時期。`;
      const defaultThemeMeanings = {
        1: { type: "調和・安定", text: generalMeaning },
        2: { type: "穏やかな進展", text: "焦らず、今の関係を大切に育むべき時。結婚は家族の承認を得て進めると吉。" },
        3: { type: "協調性の重視", text: "チームワークを大切にし、縁の下の力持ちに徹することで評価が高まります。急な転職は避け、基盤固めに専念すべきです。" },
        4: { type: "現状維持・堅実", text: "大きな変動はありません。地道な節約と貯蓄が将来に繋がります。高リスクの投資は凶。" },
        5: { type: "平穏な健康", text: "大きな病気の心配はありませんが、日々の体調管理と生活リズムを整えることが重要です。食事と睡眠を大切に。" },
      };

      return [key, {
        name: `卦 (${i + 1}番)`, name_jp: `卦${i + 1}`, meaning: generalMeaning, 
        work_advice: "協調性を大切にし、細部に気を配ることで評価が高まります。急がず、計画通りに進めることが成功の鍵。",
        line_meanings: defaultLineMeanings,
        theme_meanings: defaultThemeMeanings, // デフォルトのテーマ別解釈
      }];
    })
  ),
  ...SPECIFIC_HEXAGRAMS, // 詳細な卦で上書き
};


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
  const primaryLines = [];
  const derivedLines = [];
  const changingLines = [];

  for (let i = 0; i < 6; i++) {
    const sum = castLineValue();
    let primary, derived, changing;

    if (sum === 9) { // 老陽 (Changing Yang: 9 -> 6)
      primary = 1; derived = 0; changing = true;
    } else if (sum === 7) { // 少陽 (Fixed Yang: 7)
      primary = 1; derived = 1; changing = false;
    } else if (sum === 8) { // 少陰 (Fixed Yin: 8)
      primary = 0; derived = 0; changing = false;
    } else if (sum === 6) { // 老陰 (Changing Yin: 6 -> 9)
      primary = 0; derived = 1; changing = true;
    }

    primaryLines.push(primary);
    derivedLines.push(derived);
    derivedLines.push(derived);
    changingLines.push(changing);
  }

  const primaryKey = primaryLines.join('');
  const derivedKey = derivedLines.join('');
  
  // 卦が存在しない場合は、デフォルト卦（坤為地）を使用
  const primaryHexagram = HEXAGRAMS[primaryKey] || HEXAGRAMS["000000"];
  const derivedHexagram = HEXAGRAMS[derivedKey] || HEXAGRAMS["000000"];

  return { 
    primaryLines, derivedLines, changingLines, 
    primaryHexagram, derivedHexagram,
  };
};


// --- コンポーネント ---

/**
 * @function ExternalLinkButton
 * @description 無料ツールへのリンクボタンコンポーネント。
 */
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

// 陰陽の線を描画するコンポーネント
const HexagramVisual = ({ lines, changingLines, title }) => {
  // 易は下から上へ読むため、配列を逆転させる
  const displayLines = [...lines].reverse();
  const displayChangingLines = [...changingLines].reverse();

  // 線のスタイルと値を取得する関数 (簡略化)
  const getLineStyles = (line) => {
    if (line === 1) { // 陽
      return { type: "solid" };
    } else { // 陰
      return { type: "broken" };
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm font-bold text-amber-200/80 mb-2">{title}</p>
      <div className="flex flex-col gap-2 my-4 w-40 mx-auto bg-black/30 p-4 rounded-xl border border-white/10 shadow-inner">
        {displayLines.map((line, idx) => {
          const { type } = getLineStyles(line);
          const isChanging = displayChangingLines[idx];
          
          let lineBg = 'bg-slate-600/30';
          let lineInner = 'bg-slate-500';
          let changingSymbol = null;

          if (isChanging) {
            lineBg = line === 1 ? 'bg-red-800/50' : 'bg-blue-800/50';
            lineInner = line === 1 ? 'bg-red-500' : 'bg-blue-500';
            changingSymbol = line === 1 ? 
              <span className="text-red-500 font-bold text-xl leading-none">✕</span> : // 老陽 (9)
              <span className="text-blue-500 font-bold text-xl leading-none">○</span>; // 老陰 (6)
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

function App() {
  const [screen, setScreen] = useState('start');
  const [birthDate, setBirthDate] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [eto, setEto] = useState({ stem: '', branch: '' });
  const [hexagramData, setHexagramData] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  // 干支計算
  const calculateEto = (dateStr) => {
    if (!dateStr) return null;
    const year = new Date(dateStr).getFullYear();
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

    const calculatedEto = calculateEto(birthDate);
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

  // 爻辞の抽出ロジック（爻変の数と位置を特定）
  const getLineCommentary = (data) => {
    if (!data) return null;
    const { primaryHexagram, changingLines } = data;
    const changingCount = changingLines.filter(isChanging => isChanging).length;
    
    // 0爻変の場合
    if (changingCount === 0) {
      return { 
        title: "爻変なし", 
        advice: `卦全体（${primaryHexagram.name}）のエネルギーが安定しています。今は大きな変化を起こすより、現状の基盤を活かし、慎重に計画を実行する時です。爻変がないため、具体的な行動指針は卦全体の教えに集中すべきです。`,
        line_data: null
      };
    } 
    // 1爻変の場合
    else if (changingCount === 1) {
      const index = changingLines.findIndex(isChanging => isChanging);
      // 易は下から上へ数えるため、index + 1が爻のレベル
      const lineData = primaryHexagram.line_meanings[index];
      return {
        title: `変爻あり：初爻から${index + 1}番目の爻`,
        advice: "この爻辞が、今あなたに最も求められている行動を示しています。この教えをテーマに落とし込むべきです。",
        line_data: lineData
      };
    } 
    // 2爻変以上の場合
    else {
      return { 
        title: "多爻変", 
        advice: `3つ以上の爻が変化しています。運命が激しく転換している状態を示します。個別の爻辞よりも、本卦（現状）から之卦（未来）への移行そのものがメッセージです。大胆な変革を恐れないでください。`,
        line_data: null
      };
    }
  }

  // テーマに応じて結果をパーソナライズする関数
  const getPersonalizedFortune = (hexagramData, selectedOption) => {
    if (!hexagramData || !selectedOption) return null;

    const { primaryHexagram, derivedHexagram } = hexagramData;
    const lineCommentary = getLineCommentary(hexagramData);
    
    const themeId = selectedOption.id;
    const themeKey = themeId; // theme_meanings のキーとして ID を使用
    
    // 1. 本卦（現状）と之卦（未来）のテーマ別解釈を取得
    const primaryThemeMeaning = primaryHexagram.theme_meanings?.[themeKey];
    const derivedThemeMeaning = derivedHexagram.theme_meanings?.[themeKey];

    let result = {
      primary_advice: primaryThemeMeaning.text,
      derived_advice: derivedThemeMeaning.text,
      action_advice: lineCommentary?.advice, // 初期値として爻変の一般指針
      theme_focus: selectedOption.name,
    };

    // 2. 爻辞（具体的なアクション）のテーマ別解釈
    if (lineCommentary?.line_data) {
       const lineAction = lineCommentary.line_data.action;
       
       // 爻辞のアクションをテーマに合わせて調整する具体的なロジック
       let action_title = `【${selectedOption.name}への具体的なアクション】`;
       let action_text = lineAction;

       switch (themeId) {
          case 1: // 総合運
             action_text = lineAction; // そのまま使用
             break;
          case 2: // 恋愛運
             action_text = lineAction.includes('待つ') 
                ? `焦らず、相手の出方を静かに待ちましょう。動くべき時ではありません。` 
                : lineAction.includes('努力') 
                ? `この時期は、自分磨きや自己改善に集中することで、魅力が向上し、結果的に良い出会いを引き寄せます。`
                : lineAction.includes('行動')
                ? `勇気を出して一歩踏み込みましょう。告白や関係の進展を促す行動が吉と出ます。`
                : lineAction;
             break;
          case 3: // 仕事運
             action_text = lineAction.includes('隠し') 
                ? `能力をひけらかさず、今は水面下でスキルアップや資格取得に努めるべき時です。` 
                : lineAction.includes('リーダー')
                ? `決断を躊躇せず、自信を持ってプロジェクトの責任者やチームリーダーとして振る舞いましょう。`
                : lineAction.includes('準備')
                ? `転職や独立の準備期間です。情報収集と計画を綿密に行ってください。`
                : lineAction;
             break;
          case 4: // 金運
             action_text = lineAction.includes('投資') 
                ? `学習や経験といった自己投資は吉ですが、投機的な資金の動きは控えるべき。` 
                : lineAction.includes('貯蓄')
                ? `無駄遣いを止め、地道な節約と貯蓄に励むことで、将来の大きな財産につながります。`
                : lineAction.includes('事業')
                ? `リスクを慎重に見極めた上で、事業拡大のための投資は成功する可能性が高いです。`
                : lineAction;
             break;
          case 5: // 健康運
             action_text = lineAction.includes('休息') 
                ? `無理せず、十分な休養と睡眠を確保してください。特に精神的なストレスに注意が必要です。` 
                : lineAction.includes('規律')
                ? `食生活や運動習慣を見直し、専門家の指導に従うなど、厳しい規律を持って健康改善に取り組みましょう。`
                : lineAction;
             break;
       }
       result.action_advice = action_text;
    }
    
    return result;
  };


  // 選択された項目オブジェクトを取得
  const selectedOption = DIVINATION_OPTIONS.find(opt => opt.id === selectedItem);
  const lineCommentary = getLineCommentary(hexagramData);
  const personalizedFortune = getPersonalizedFortune(hexagramData, selectedOption);


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
                占いたい項目と生年月日を入力してください。（全5項目）
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              
              {/* 項目選択エリア */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-amber-200/80">占いたいテーマを選んでください (必須)</label>
                <div className="grid grid-cols-3 gap-3">
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
                        {option.name}
                      </button>
                    );
                  })}
                </div>
                {selectedOption && (
                  <p className="text-xs text-slate-400 mt-2 p-2 border-l-2 border-amber-500 bg-black/20">
                    <span className="font-bold text-amber-300">{selectedOption.name}</span>: {selectedOption.detail}
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
            
            {/* 修正箇所: 無料ツールボタン - 先頭画面の最後尾 */}
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
        {screen === 'result' && hexagramData && selectedOption && personalizedFortune && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-10 w-full">
            
            {/* 鑑定テーマ表示 */}
            <div className="bg-gradient-to-br from-red-900/50 to-amber-900/50 p-4 rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-medium text-red-300 uppercase tracking-widest mb-1">鑑定テーマ</p>
              <h3 className="text-3xl font-bold text-white tracking-widest">
                {selectedOption.name}
              </h3>
              <p className="text-sm text-slate-300 mt-2">（現在のテーマフォーカス: {personalizedFortune.theme_focus}）</p>
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

              {/* 1. 本卦 (Primary) - 現状の運勢 【テーマ連動】 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-amber-500/20 shadow-xl relative overflow-hidden">
                <h2 className="text-2xl font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  本卦 (現状)：{hexagramData.primaryHexagram.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4 font-mono">{hexagramData.primaryHexagram.name_jp} ({hexagramData.primaryHexagram.theme_meanings[selectedItem].type})</p>

                <HexagramVisual 
                  lines={hexagramData.primaryLines} 
                  changingLines={hexagramData.changingLines} 
                  title="本卦の構造"
                />

                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-lg text-amber-200">【{selectedOption.name}運勢の傾向】</h4>
                  <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">
                    {personalizedFortune.primary_advice}
                  </p>
                  
                </div>
              </div>

              {/* 2. 爻辞 (Line Commentary) - 行動の指針 【テーマ連動】 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-red-500/20 shadow-xl">
                <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  行動の指針・警告
                </h2>
                
                {lineCommentary?.line_data ? (
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-red-100">{lineCommentary.line_data.level} のメッセージ</p>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
                      <p className="text-sm font-bold text-red-400 mb-2">【爻辞の原文】</p>
                      <p className="text-red-100 italic leading-relaxed text-base">{lineCommentary.line_data.text}</p>
                    </div>

                    <p className="text-sm font-bold text-amber-400 pt-2">【テーマ特化アクション】</p>
                    <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">
                      {personalizedFortune.action_advice}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-red-100">爻変なし</p>
                    <p className="text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-slate-500">
                      {personalizedFortune.action_advice}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. 之卦 (Derived) - 未来の運勢 【テーマ連動】 */}
              <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20 shadow-xl">
                <h2 className="text-2xl font-bold text-blue-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  之卦 (未来)：{hexagramData.derivedHexagram.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4 font-mono">{hexagramData.derivedHexagram.name_jp} ({hexagramData.derivedHexagram.theme_meanings[selectedItem].type})</p>

                <div className="flex justify-center">
                  <HexagramVisual 
                    lines={hexagramData.derivedLines} 
                    changingLines={[]} 
                    title="未来の構造"
                  />
                </div>
                
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-lg text-blue-200">【変化後の最終的な結果】</h4>
                  <p className="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-blue-500">
                    {personalizedFortune.derived_advice}
                  </p>
                </div>
              </div>
            </div>


            <div className="space-y-6 pt-8">
              {/* 修正箇所: 無料ツールボタン - 結果画面の最後尾 */}
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