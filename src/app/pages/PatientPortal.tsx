// ============================================================
// PatientPortal — 長者端 (滿版 UI 升級版)
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity, CheckCircle, Award, ChevronRight,
  ArrowLeft, Bell, Calendar, Flame, Target, Play, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  mockPatients, mockPrescriptions, mockExercises,
  mockSessionRecords, mockAngleProgress
} from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const PATIENT = mockPatients[0]; // 王大明

export default function PatientPortal() {
  const navigate = useNavigate();
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return '早安';
    if (h < 18) return '午安';
    return '晚安';
  });

  const prescriptions = mockPrescriptions.filter(p => p.patientId === PATIENT.id);
  const exercises = prescriptions.map(rx => ({
    ...rx,
    exercise: mockExercises.find(e => e.id === rx.exerciseId)!,
  }));

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = mockSessionRecords.filter(
    s => s.patientId === PATIENT.id && s.date === today
  );

  const completedToday = todaySessions.length;
  const totalToday = exercises.length;
  const streakDays = 7;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── 頂部通知面板 (鈴鐺專用) ── */}
      <AnimatePresence>
        {isNotifyOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNotifyOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="relative w-80 bg-white h-full shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
                  <Bell size={20} /> 系統通知
                </h2>
                <button onClick={() => setIsNotifyOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="font-bold text-blue-800 text-sm">新訓練通知</p>
                  <p className="text-xs text-blue-600 mt-1">陳醫師為您新增了膝蓋伸展練習。</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 頂部橫幅 (藍色背景) ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-8 pb-16 px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={18} /> <span>切換角色</span>
            </button>
            <p className="text-blue-100 text-lg">{greeting}，</p>
            <h1 className="text-white text-4xl font-bold mt-1">{PATIENT.name}</h1>
          </motion.div>
          
          <button onClick={() => setIsNotifyOpen(true)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative">
            <Bell size={24} className="text-white" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full border-2 border-blue-700" />
          </button>
        </div>
      </div>

      {/* ── 主內容區 (滿版設計) ── */}
      <div className="max-w-5xl mx-auto px-8 -mt-10 pb-12 space-y-6">
        
        {/* 1. 今日進度條 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">今日復健進度</h3>
              <p className="text-gray-400 text-sm">再努力一下，今天就達標了！</p>
            </div>
            <span className="text-3xl font-black text-blue-600">{Math.round((completedToday / totalToday) * 100)}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(completedToday / totalToday) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
            />
          </div>
        </div>

        {/* 2. 數據小卡列 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '今日完成', value: `${completedToday}/${totalToday}`, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: '連續天數', value: `${streakDays}天`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: '平均達成', value: `${PATIENT.completionRate}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center`}>
              <s.icon className={s.color} size={28} />
              <span className="text-2xl font-bold text-gray-800 mt-2">{s.value}</span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* 3. 訓練計畫清單 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 ml-2">我的訓練計畫</h3>
          {exercises.map((item, index) => {
            const ex = item.exercise;
            const isDone = todaySessions.some(s => s.exerciseId === ex.id);
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/patient/rehab/${ex.id}`)}
                className={`w-full p-6 rounded-[2.5rem] flex items-center gap-6 transition-all shadow-sm ${isDone ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'} border-2`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDone ? 'bg-white text-green-500' : 'bg-blue-50 text-blue-600'}`}>
                  {isDone ? <CheckCircle size={32} /> : <Play size={32} fill="currentColor" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800 text-xl">{ex.name}</p>
                  <p className="text-gray-400">{item.sets}組 x {item.reps}次 · 目標 {item.targetAngle}°</p>
                </div>
                <ChevronRight className="text-gray-300" size={28} />
              </motion.button>
            );
          })}
        </div>

        {/* 4. 進展圖表 */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-blue-600" size={22} />
            <h3 className="font-bold text-gray-800">本週復健趨勢</h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAngleProgress}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Area type="monotone" dataKey="angle" stroke="#2563eb" strokeWidth={4} fill="#eff6ff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. 激勵小卡 */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-8 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold flex items-center gap-2"><Award /> 做得太棒了！</h4>
            <p className="text-orange-50 mt-2 opacity-90">您已經超過 80% 的學員，繼續保持運動習慣喔！</p>
          </div>
        </div>
      </div>
    </div>
  );
}