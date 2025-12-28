// src/components/pages/LivePage.jsx
// (Requires Icon component)

const { useState, useEffect, useCallback } = React;

// MOCK DATA ကို ဒီဖိုင်ထဲမှာ ထည့်ပါ
const MOCK_DATA_LIVE = {
    "server_time": "2025-12-25 12:45:00",
    "live": { "set": "1,266.59", "value": "7,588.04", "time": "12:44:59", "twod": "98", "date": "2025-12-25" },
    "result": [
        { "set": "1,267.63", "value": "6,183.90", "open_time": "11:00:00", "twod": "33" },
        { "set": "1,266.59", "value": "7,585.40", "open_time": "12:01:00", "twod": "95" },
        { "set": "1,265.12", "value": "5,421.20", "open_time": "15:00:00", "twod": "20" },
        { "set": "1,266.00", "value": "8,112.44", "open_time": "16:30:00", "twod": "44" }
    ]
};

const LiveLoadingScreen = ({ status }) => (
    <div className="absolute inset-0 z-[40] bg-[#020617] flex flex-col items-center justify-center px-6 rounded-t-3xl h-full pb-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative z-10 flex flex-col items-center w-full max-w-xs text-center">
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-pulse">
                <Icon name="activity" size={40} className="text-cyan-400" />
            </div>
            <h1 className="text-xl font-black text-white mb-3 tracking-tighter uppercase">Myanmar 2D Live</h1>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-cyan-500 animate-loading-bar w-1/2"></div>
            </div>
            <p className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                <Icon name="loader-2" size={14} className="animate-spin" /> {status}
            </p>
        </div>
    </div>
);

const LivePage = () => {
    const [data, setData] = useState(null);
    const [displayTwod, setDisplayTwod] = useState('--');
    const [isReady, setIsReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [usingMock, setUsingMock] = useState(false);
    const [loadStatus, setLoadStatus] = useState("စနစ်ကို စတင်နေပါသည်...");

    const animateNumber = (targetValue) => {
        if (!targetValue || targetValue === '--') return;
        setIsAnimating(true);
        let count = 0;
        const interval = setInterval(() => {
            setDisplayTwod(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
            count++;
            if (count > 15) {
                clearInterval(interval);
                setDisplayTwod(targetValue);
                setIsAnimating(false);
            }
        }, 50);
    };

    const fetchData = useCallback(async (isInitial = false) => {
        if (isInitial) setLoadStatus("ဒေတာများကို ချိတ်ဆက်နေပါသည်...");
        else setRefreshing(true);

        try {
            const response = await fetch('https://api.thaistock2d.com/live');
            const result = await response.json();
            
            if (result.live.twod !== data?.live?.twod) animateNumber(result.live.twod);
            else if (!data) setDisplayTwod(result.live.twod);
            
            setData(result);
            setUsingMock(false);
            if (isInitial) setTimeout(() => setIsReady(true), 1800);
        } catch (err) {
            setData(MOCK_DATA_LIVE);
            setDisplayTwod(MOCK_DATA_LIVE.live.twod);
            setUsingMock(true);
            if (isInitial) setTimeout(() => setIsReady(true), 2500);
        } finally {
            if (!isInitial) setTimeout(() => setRefreshing(false), 800);
        }
    }, [data]);

    useEffect(() => {
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleShare = () => {
        const text = `Myanmar 2D: ${displayTwod}\nTime: ${data?.live?.time}\nSET: ${data?.live?.set}\nSource: ARKARSOE.SYS`;
        if (navigator.share) {
            navigator.share({ title: '2D Result', text });
        } else {
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert("Copied to clipboard!");
        }
    };

    const ConnectionStatus = () => (
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase absolute top-4 right-4 z-30">
            <span className={`w-1.5 h-1.5 rounded-full ${usingMock ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span className={usingMock ? 'text-amber-500' : 'text-green-500'}>{usingMock ? 'Offline' : 'Live'}</span>
            {refreshing && <Icon name="loader-2" size={10} className="animate-spin text-cyan-500 ml-1" />}
        </div>
    );

    if (!isReady) return <LiveLoadingScreen status={loadStatus} />;

    return (
        <div className="pb-24 pt-4 px-4 space-y-8 overflow-y-auto h-full bg-[#020617] text-slate-200 relative">
            <ConnectionStatus />

            {/* Big Live Card */}
            <section className="relative rounded-[3rem] border p-10 text-center overflow-hidden transition-all duration-500 bg-slate-900/40 border-white/5 shadow-2xl mt-4">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                
                <div className={`text-[9rem] font-black leading-none tracking-tighter mb-10 transition-all duration-300 ${isAnimating ? 'number-blur' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600'}`}>
                    {displayTwod}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border transition-colors bg-slate-800/50 border-white/5">
                        <span className="text-[10px] text-slate-500 block font-black uppercase mb-1 tracking-wider">SET Index</span>
                        <span className="text-lg font-black text-white">{data?.live?.set || '--'}</span>
                    </div>
                    <div className="p-4 rounded-2xl border transition-colors bg-slate-800/50 border-white/5">
                        <span className="text-[10px] text-slate-500 block font-black uppercase mb-1 tracking-wider">Value</span>
                        <span className="text-lg font-black text-white">{data?.live?.value || '--'}</span>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-500 bg-slate-500/5 py-2 px-4 rounded-full w-fit mx-auto">
                    <Icon name="clock" size={14} className="text-cyan-500" />
                    <span>Update: {data?.live?.time} ({data?.live?.date})</span>
                </div>
            </section>

            {/* History Table */}
            <section className="space-y-5">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <Icon name="bar-chart-3" size={16} className="text-cyan-500" /> History Results
                    </h3>
                    <button onClick={handleShare} className="text-[10px] font-bold text-cyan-500 flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <Icon name="share-2" size={14} /> SHARE
                    </button>
                </div>

                <div className="overflow-hidden rounded-[2rem] border bg-slate-900/20 border-white/5">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Time</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">SET</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Value</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase text-cyan-500 text-right tracking-wider">2D</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data?.result?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-cyan-500/5 transition-colors group">
                                        <td className="px-5 py-5 text-[12px] font-bold opacity-80">{item.open_time}</td>
                                        <td className="px-5 py-5 text-[12px] opacity-60 font-medium">{item.set}</td>
                                        <td className="px-5 py-5 text-[12px] opacity-60 font-medium">{item.value}</td>
                                        <td className="px-5 py-5 text-right">
                                            <span className="text-xl font-black text-cyan-500 transition-transform group-hover:scale-110 inline-block">{item.twod}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
