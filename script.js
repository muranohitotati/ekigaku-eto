document.addEventListener('DOMContentLoaded', () => {

    // --- データ定義 (元コードから流用) ---
    const JIKKAN = ["甲 (きのえ)", "乙 (きのと)", "丙 (ひのえ)", "丁 (ひのと)", "戊 (つちのえ)", "己 (つちのと)", "庚 (かのえ)", "辛 (かのと)", "壬 (みずのえ)", "癸 (みずのと)"];
    const JUNISHI = ["子 (ね)", "丑 (うし)", "寅 (とら)", "卯 (う)", "辰 (たつ)", "巳 (み)", "午 (うま)", "未 (ひつじ)", "申 (さる)", "酉 (とり)", "戌 (いぬ)", "亥 (い)"];
    const DIVINATION_OPTIONS = [
        { id: 1, name: "総合運 (そうごううん)", icon: "Layers", detail: "全体的な運勢と、今後の流れ" },
        { id: 2, name: "恋愛運 (れんあいうん)", icon: "Heart", detail: "恋の行方、運命の出会い、進展の時期" },
        { id: 3, name: "結婚運 (けっこんうん)", icon: "Users", detail: "婚期や相性、理想のパートナーの特徴" },
        { id: 4, name: "仕事運 (しごとうん)", icon: "Briefcase", detail: "職場での評価、転職の時期、成功への道筋" },
        { id: 5, name: "金運 (きんうん)", icon: "DollarSign", detail: "財産の増減、投資の機会、貯蓄の方法" },
        { id: 6, name: "健康運 (けんこううん)", icon: "Shield", detail: "体調や生きる力、注意すべき生活習慣" },
        { id: 7, name: "対人運 (たいじんうん)", icon: "Users", detail: "友人や家族との関係性、人間関係の改善策" },
        { id: 8, name: "未来予知 (みらいよち)", icon: "Clock", detail: "半年後や3年後の自分、近未来に起こる出来事" },
        { id: 9, name: "才能開花 (さいのうかいか)", icon: "Sparkles", detail: "秘められた能力や才能、新たな趣味や適職" },
        { id: 10, name: "人生の転機 (じんせいのてんき)", icon: "TrendingUp", detail: "重大な決断が必要な時期、運命の分岐点" },
    ];
    const HEXAGRAMS = {
        "111111": { name: "乾為天 (けんいてん)", name_jp: "乾為天", meaning: "創造、剛健（ごうけん）、指導力。最高の運気。龍が天を舞う。", work_advice: "【仕事・副業】起業、独立、リーダーシップの発揮に最適。遠慮せず大きな目標を追い、トップを目指すべし。", line_meanings: [{ level: "初九", text: "潜龍（せんりゅう）、用（もち）うる勿（なか）れ。", action: "今はまだ実力を隠し、機会を待つ時です。焦って表に出ると失敗します。自己投資の時期。" }, { level: "九二", text: "見龍（けんりゅう）、田（た）に在り。大人（たいじん）を見るに利（よ）し。", action: "実力が認められつつあります。信頼できる目上の人物（メンター）に会い、指導を仰ぐと大きく伸びます。" }, { level: "九三", text: "君子、終日乾乾（けんけん）。夕べに惕（おそ）る。厲（あやう）けれど咎（とが）なし。", action: "絶え間ない努力が必要です。危険な状況ですが、常に努力し続ければ、問題は回避できます。多忙な時。" }, { level: "九四", text: "或（あるい）は躍（おど）りて淵（ふち）に在り。咎なし。", action: "進むべきか退くべきか迷う局面。決断の時は近いですが、まだ準備期間。状況を深く分析し、飛び出すタイミングを見計らうべし。" }, { level: "九五", text: "飛龍（ひりゅう）、天に在り。大人を見るに利し。", action: "最高潮の運気です。あなたの才能は十分に発揮され、成功を収めます。大事業を始めるのに最良の時。周囲に恩恵を与えよ。" }, { level: "上九", text: "亢龍（こうりゅう）、悔（く）いあり。", action: "極みに達しすぎた状態。謙虚さを忘れ、独断専行すると後悔します。引くことを知る勇気が求められます。" },] },
        "000000": { name: "坤為地 (こんいち)", name_jp: "坤為地", meaning: "受容、柔順（にゅうじゅん）、大地。主役を支えることで成功する運気。", work_advice: "【仕事・副業】サポート、育成、地道な継続作業が吉。表舞台より裏方（うらかた）に徹（てっ）することで信頼と安定を得られます。", line_meanings: [{ level: "初六", text: "履霜（りそう）、堅氷（けんぴょう）至（いた）る。", action: "冬の始まり。小さな兆（きざ）しを見逃さず、将来の大きな困難に備えて、今から準備を始めるべきです。自己規律を確立せよ。" }, { level: "六二", text: "直方大（ちょくほうだい）。習（なら）う無きも利（よ）し。", action: "素直で正直、かつ大きな心でいれば、特別な工夫がなくても物事がうまくいきます。本質を磨くこと。" }, { level: "六三", text: "含章（がんしょう）すべし。或いは従事す。公事（こうじ）に終りあるを知る。", action: "才能を内に秘め、控えめに振る舞うことが吉。公的な任務や、誰かをサポートする仕事で着実に成果を出す時。" }, { level: "六四", text: "括嚢（かつ のう）す。咎（とが）なし誉（ほま）れなし。", action: "袋の口を堅く縛って、何も見せない状態。余計なことを言わず、自分の立場を守ることで、大きな過ちは免れます。" }, { level: "六五", text: "黄裳（こうしょう）。元吉（げんきつ）。", action: "内面の充実が最高の幸運を呼びます。謙虚さと内省が成功の鍵。" }, { level: "上六", text: "龍、野（の）に戦う。その血玄黄（げんおう）。", action: "無理に強者と争い、傷つく時。自分の立場をわきまえ（わきまえ）ず行動した結果です。争いを避け、静かに収束させる努力を。" },] },
        "010001": { name: "山水蒙 (さんすいもう)", name_jp: "山水蒙", meaning: "未熟、無知、啓発（けいはつ）。学ぶべきことが多く、師（し）を求（もと）める時。", work_advice: "【仕事・副業】教育、研修、コーチングなど学ぶ分野が吉。あなた自身が学ぶ立場なら、良質な教材や師に投資すること。知識を売る（家庭教師、コンサル）のが向く。", line_meanings: [{ level: "初六", text: "蒙（もう）を発す。獄（ごく）を用いて人（ひと）を繋（つな）ぐ。桎梏（しっこく）を去るに利あり。", action: "愚かさ（おろかさ）を自覚し、学ぶ意欲が生まれた時。悪い習慣を断ち切るべきです。厳しい規律を持って自己を律することが成長の鍵。" }, { level: "九二", text: "蒙（もう）を包容（ほうよう）す。吉。", action: "未熟な者（後輩や部下）を優しく受（う）け入（い）れ、導（みちび）く包容力を持つと吉。自分が教える立場なら、寛大（かんだい）さが成功を呼びます。" }, { level: "六三", text: "女（むすめ）を取るに、金夫（きんぷ）を見る勿（なか）れ。身を失（うしな）う所無し。", action: "誘惑や甘言（かんげん）に惑（まど）わされないこと。華やかなものや、実力以上のものを求めると失敗します。地道で誠実な道を選びなさい。" }, { level: "六四", text: "蒙（もう）を困（くる）しむ。吝（りん）。", action: "教えを請（こ）わず、自分の無知に固執（こしつ）すると苦労する。謙虚に、積極的に学ぶ機会を求めないと、停滞してしまいます。" }, { level: "六五", text: "童蒙（どうもう）、吉。", action: "童子（どうじ）のような素直さで、教えを求める時。変に知識をひけらかさず、謙虚に学ぶ姿勢が最高の幸運を招きます。" }, { level: "上九", text: "撃蒙（げきもう）。吝（りん）なし。他を寇（そこな）うに利あらず。", action: "蒙昧（もうまい）を打（う）ち破る、厳（きび）しい指導が必要な時。しかし、やりすぎると人間関係を損（そこ）ないます。愛と厳しさのバランスを。" },] },
    };
    for (let i = 0; i < 64; i++) {
        const key = i.toString(2).padStart(6, '0');
        if (!HEXAGRAMS[key]) {
            HEXAGRAMS[key] = { name: `**未定義の卦** ${key}`, name_jp: `みていぎのか ${i}`, meaning: "基本的な運勢：変化と成長の時期。", work_advice: "【仕事・副業】新しい挑戦と地道な努力を組み合わせることが吉。特に専門分野の学習に時間を割くべきです。", line_meanings: Array.from({ length: 6 }, (_, idx) => ({ level: `爻${idx + 1}`, text: `爻辞${idx + 1}：${key}の一般的な助言。`, action: "現状を深く見つめ、一歩ずつ進むことが大切です。", })), };
        }
    }

    // --- 状態管理 ---
    let state = {
        screen: 'start', // 'start', 'processing', 'result'
        birthDate: '',
        selectedItem: null,
        eto: { stem: '', branch: '' },
        hexagramData: null,
    };

    // --- DOM要素 ---
    const mainContent = document.getElementById('main-content');

    // --- ロジック (元コードから流用・調整) ---
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

    const castLineValue = () => (Math.floor(Math.random() * 4) + 6); // 6, 7, 8, 9
    
    const castHexagramData = () => {
        const lineValues = [];
        const primaryLines = [];
        const derivedLines = [];
        const changingLines = [];

        for (let i = 0; i < 6; i++) {
            const sum = castLineValue();
            lineValues.push(sum);
            let primary, derived, changing;
            if (sum === 9) { primary = 1; derived = 0; changing = true; }
            else if (sum === 7) { primary = 1; derived = 1; changing = false; }
            else if (sum === 8) { primary = 0; derived = 0; changing = false; }
            else if (sum === 6) { primary = 0; derived = 1; changing = true; }
            primaryLines.push(primary);
            derivedLines.push(derived);
            changingLines.push(changing);
        }

        const primaryKey = primaryLines.join('');
        const derivedKey = derivedLines.join('');
        const primaryHexagram = HEXAGRAMS[primaryKey] || HEXAGRAMS["111111"];
        const derivedHexagram = HEXAGRAMS[derivedKey] || HEXAGRAMS["000000"];

        return { primaryLines, derivedLines, changingLines, primaryHexagram, derivedHexagram, lineValues };
    };

    const getLineCommentary = (data) => {
        if (!data) return null;
        const { primaryHexagram, changingLines } = data;
        const changingCount = changingLines.filter(isChanging => isChanging).length;
        
        if (changingCount === 0) {
            return { title: "爻変なし：現状維持の時", advice: `卦全体（${primaryHexagram.name}）のエネルギーが安定しています。今は大きな変化を起こすより、現状の基盤を活かし、慎重に計画を実行する時です。焦らず、本卦のアドバイスを長期的な指針としてください。`, line_data: null };
        } else if (changingCount === 1) {
            const index = changingLines.findIndex(isChanging => isChanging);
            const lineData = primaryHexagram.line_meanings[index];
            return { title: `変爻あり：初爻から${index + 1}番目の爻辞`, advice: "この爻辞が、今あなたに最も求められている行動を示しています。", line_data: lineData };
        } else {
            return { title: "多爻変：激しい変化の時", advice: `3つ以上の爻が変化しています。これは運命が激しく転換している状態を示します。個別の爻辞よりも、本卦（現状）から之卦（未来）への移行そのものがメッセージです。之卦のアドバイスに集中し、大胆な変革を恐れないでください。`, line_data: null };
        }
    };

    // --- レンダリング関数 ---
    const render = () => {
        if (state.screen === 'start') {
            mainContent.innerHTML = getStartScreenHTML();
            addStartScreenListeners();
        } else if (state.screen === 'processing') {
            mainContent.innerHTML = getProcessingScreenHTML();
        } else if (state.screen === 'result') {
            mainContent.innerHTML = getResultScreenHTML();
            addResultScreenListeners();
        }
    };

    // --- HTMLテンプレート生成 ---
    const getStartScreenHTML = () => {
        const selectedOption = DIVINATION_OPTIONS.find(opt => opt.id === state.selectedItem);
        return `
            <div class="animate-in space-y-8 w-full">
                <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold text-amber-300">易の三層鑑定で、運命を読み解く</h2>
                    <p class="text-lg text-slate-300 leading-relaxed">占いたい**項目**と**生年月日**を**入力**してください。</p>
                </div>
                <form id="start-form" class="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div class="space-y-4">
                        <label class="block text-sm font-medium text-amber-200/80">占いたいテーマを選んでください (必須)</label>
                        <div class="grid grid-cols-2 gap-3">
                            ${DIVINATION_OPTIONS.map(option => `
                                <button type="button" data-id="${option.id}" class="divination-option p-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center text-center leading-tight shadow-md ${state.selectedItem === option.id ? 'bg-amber-600/70 border border-amber-400/50 text-white shadow-amber-500/30' : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50'}">
                                    <span>${option.name.split(' ')[0]}</span>
                                </button>
                            `).join('')}
                        </div>
                        <p id="option-detail" class="text-xs text-slate-400 mt-2 p-2 border-l-2 border-amber-500 bg-black/20 ${selectedOption ? '' : 'hidden'}">
                            ${selectedOption ? `<span class="font-bold text-amber-300">${selectedOption.name.split(' ')[0]}</span>: ${selectedOption.detail}` : ''}
                        </p>
                    </div>
                    <div class="space-y-2 pt-4 border-t border-white/10">
                        <label class="block text-sm font-medium text-amber-200/80">生年月日 (必須)</label>
                        <input type="date" id="birthdate-input" required value="${state.birthDate}" class="w-full bg-[#0f0518] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all">
                    </div>
                    <button type="submit" id="start-button" class="w-full font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all transform flex items-center justify-center gap-2 bg-slate-700 text-slate-500 cursor-not-allowed opacity-60">
                        <span>運命の三層鑑定を開始する</span>
                    </button>
                </form>
                <div class="pt-8 border-t border-white/10">
                    <a href="https://lin.ee/1oD9WgQ" target="_blank" rel="noopener noreferrer" class="w-full max-w-md mx-auto group relative flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b64c] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <span>無料ツールはこちら</span>
                    </a>
                </div>
            </div>
        `;
    };
    
    const getProcessingScreenHTML = () => `
        <div class="text-center space-y-8 animate-in zoom-in duration-500">
            <h2 class="text-2xl font-light text-amber-100">卦を立てています...</h2>
            <div class="relative w-48 h-48 mx-auto">
               <div class="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
               <div class="absolute inset-4 border-4 border-purple-500/30 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
            </div>
            <p class="text-slate-400 text-sm">3枚のコインが6つの運命の線を生み出します...</p>
        </div>
    `;

    const getResultScreenHTML = () => {
        const { eto, hexagramData, selectedItem } = state;
        const selectedOption = DIVINATION_OPTIONS.find(opt => opt.id === selectedItem);
        const lineCommentary = getLineCommentary(hexagramData);

        const getHexagramVisual = (lines, changingLines, title) => {
            const displayLines = [...lines].reverse();
            const displayChangingLines = [...changingLines].reverse();
            let html = `<div class="text-center"><p class="text-sm font-bold text-amber-200/80 mb-2">${title}</p><div class="flex flex-col gap-2 my-4 w-40 mx-auto bg-black/30 p-4 rounded-xl border border-white/10 shadow-inner">`;
            displayLines.forEach((line, idx) => {
                const isChanging = displayChangingLines[idx];
                const lineBg = isChanging ? (line === 1 ? 'bg-red-800/50' : 'bg-blue-800/50') : (line === 1 ? 'bg-amber-600/30' : 'bg-slate-600/30');
                const lineInner = isChanging ? (line === 1 ? 'bg-red-500' : 'bg-blue-500') : (line === 1 ? 'bg-amber-500' : 'bg-slate-500');
                const changingSymbol = isChanging ? (line === 1 ? `<span class="text-red-500 font-bold text-xl leading-none">✕</span>` : `<span class="text-blue-500 font-bold text-xl leading-none">○</span>`) : '';

                html += `<div class="w-full h-5 flex items-center justify-center transition-all duration-500 relative">`;
                if (line === 1) {
                    html += `<div class="w-full h-full flex items-center justify-center rounded-sm transition-all duration-500 ${lineBg}"><div class="w-full h-3 ${lineInner} rounded-sm shadow-md"></div></div>`;
                } else {
                    html += `<div class="w-full h-full flex items-center justify-center rounded-sm transition-all duration-500 ${lineBg}"><div class="w-[45%] h-3 ${lineInner} rounded-sm shadow-md"></div><div class="w-[10%] h-3"></div><div class="w-[45%] h-3 ${lineInner} rounded-sm shadow-md"></div></div>`;
                }
                if (isChanging) {
                    html += `<div class="absolute transform translate-x-28">${changingSymbol}</div>`;
                }
                html += `</div>`;
            });
            html += `</div><p class="text-xs text-slate-400"><span class="text-red-400">✕</span>: 老陽 | <span class="text-blue-400">○</span>: 老陰</p></div>`;
            return html;
        };

        return `
            <div class="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-10 w-full">
                <div class="bg-gradient-to-br from-red-900/50 to-amber-900/50 p-4 rounded-2xl border border-white/10 text-center">
                    <p class="text-xs font-medium text-red-300 uppercase tracking-widest mb-1">鑑定テーマ</p>
                    <h3 class="text-3xl font-bold text-white tracking-widest">${selectedOption.name.split(' ')[0]}</h3>
                </div>
                <div class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-2xl border border-white/10 text-center">
                    <p class="text-xs font-medium text-purple-300 uppercase tracking-widest mb-1">あなたの干支</p>
                    <h3 class="text-3xl font-bold text-white tracking-widest">${eto.stem}${eto.branch}</h3>
                </div>
                <div class="space-y-8">
                    <div class="bg-white/5 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
                        <h2 class="text-2xl font-bold text-amber-300 mb-2">本卦 (現状)：${hexagramData.primaryHexagram.name}</h2>
                        ${getHexagramVisual(hexagramData.primaryLines, hexagramData.changingLines, "本卦の構造")}
                        <div class="mt-6 space-y-4">
                            <h4 class="font-bold text-lg text-amber-200">【運勢の傾向】</h4>
                            <p class="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">${hexagramData.primaryHexagram.meaning}</p>
                            <h4 class="font-bold text-lg text-emerald-200">仕事・副業の指針</h4>
                            <p class="text-slate-200 leading-relaxed bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg text-sm border-l-4 border-emerald-500">${hexagramData.primaryHexagram.work_advice}</p>
                        </div>
                    </div>
                    <div class="bg-white/5 p-6 rounded-2xl border border-red-500/20 shadow-xl">
                        <h2 class="text-2xl font-bold text-red-300 mb-4">変爻・爻辞 (具体的な行動)</h2>
                        ${lineCommentary.line_data ? `
                            <div class="space-y-4">
                                <p class="text-lg font-bold text-red-100">${lineCommentary.line_data.level} のメッセージ</p>
                                <div class="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
                                    <p class="text-sm font-bold text-red-400 mb-2">【原文の忠告】</p>
                                    <p class="text-red-100 italic leading-relaxed text-base">${lineCommentary.line_data.text}</p>
                                </div>
                                <p class="text-sm font-bold text-amber-400 pt-2">【今すぐ取るべきアクション】</p>
                                <p class="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-amber-500">${lineCommentary.line_data.action}</p>
                            </div>
                        ` : `<p class="text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-slate-500">${lineCommentary.advice}</p>`}
                    </div>
                    <div class="bg-white/5 p-6 rounded-2xl border border-blue-500/20 shadow-xl">
                        <h2 class="text-2xl font-bold text-blue-300 mb-2">之卦 (未来)：${hexagramData.derivedHexagram.name}</h2>
                        ${getHexagramVisual(hexagramData.derivedLines, [], "未来の構造")}
                        <div class="mt-6 space-y-4">
                            <h4 class="font-bold text-lg text-blue-200">【変化後の最終的な結果】</h4>
                            <p class="text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg text-sm border-l-4 border-blue-500">${hexagramData.derivedHexagram.meaning}</p>
                             <h4 class="font-bold text-lg text-emerald-200">仕事・副業の未来指針</h4>
                            <p class="text-slate-200 leading-relaxed bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg text-sm border-l-4 border-emerald-500">${hexagramData.derivedHexagram.work_advice}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-6 pt-8">
                    <a href="https://lin.ee/1oD9WgQ" target="_blank" rel="noopener noreferrer" class="w-full max-w-md mx-auto group relative flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b64c] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <span>無料ツールはこちら</span>
                    </a>
                    <button id="reset-button" class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-4">
                        <span>新しい質問を占う</span>
                    </button>
                </div>
            </div>
        `;
    };

    // --- イベントリスナー設定 ---
    const addStartScreenListeners = () => {
        const form = document.getElementById('start-form');
        const birthdateInput = document.getElementById('birthdate-input');
        const startButton = document.getElementById('start-button');
        const optionButtons = document.querySelectorAll('.divination-option');
        const optionDetail = document.getElementById('option-detail');

        const updateButtonState = () => {
            if (state.birthDate && state.selectedItem) {
                startButton.classList.remove('bg-slate-700', 'text-slate-500', 'cursor-not-allowed', 'opacity-60');
                startButton.classList.add('bg-gradient-to-r', 'from-amber-600', 'to-yellow-600', 'hover:from-amber-500', 'hover:to-yellow-500', 'text-white');
                startButton.disabled = false;
            } else {
                startButton.classList.add('bg-slate-700', 'text-slate-500', 'cursor-not-allowed', 'opacity-60');
                startButton.classList.remove('bg-gradient-to-r', 'from-amber-600', 'to-yellow-600', 'hover:from-amber-500', 'hover:to-yellow-500', 'text-white');
                startButton.disabled = true;
            }
        };

        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                state.selectedItem = parseInt(button.dataset.id);
                const selectedOption = DIVINATION_OPTIONS.find(opt => opt.id === state.selectedItem);
                optionDetail.innerHTML = `<span class="font-bold text-amber-300">${selectedOption.name.split(' ')[0]}</span>: ${selectedOption.detail}`;
                optionDetail.classList.remove('hidden');
                render(); // Re-render to update button styles
                updateButtonState();
            });
        });

        birthdateInput.addEventListener('change', (e) => {
            state.birthDate = e.target.value;
            updateButtonState();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!state.birthDate || !state.selectedItem) return;
            
            state.eto = calculateEto(state.birthDate);
            state.screen = 'processing';
            render();

            setTimeout(() => {
                state.hexagramData = castHexagramData();
                state.screen = 'result';
                render();
            }, 2500); // Simulate processing time
        });
        
        updateButtonState();
    };

    const addResultScreenListeners = () => {
        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', () => {
            state = {
                screen: 'start',
                birthDate: '',
                selectedItem: null,
                eto: { stem: '', branch: '' },
                hexagramData: null,
            };
            render();
        });
    };

    // --- 初期化 ---
    render();
});