// ============================================================
// FamilyDashboard — 家屬端 (通知點擊修復版)
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Bell, Activity, CheckCircle, AlertTriangle,
  TrendingUp, Calendar, Clock, Heart, ChevronRight, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid, Legend
} from 'recharts';
import {
  mockPatients, mockSessionRecords, mockNotifications,
  mockAngleProgress, mockWeeklyActivity
} from '../data/mockData';

const PATIENT = mockPatients[0];
const FAMILY_NAME = '王小美';

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'alerts'>('overview');
  
  // ── 狀態管理：控制通知面板開關 ──
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const unreadAlerts = mockNotifications.filter(n => !n.read).length;

  const recentSessions = mockSessionRecords
    .filter(s => s.patientId === PATIENT.id)
    .slice(0, 5);

  const lastSession = recentSessions[0];
  const avgScore = Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#F4F7FC' }}>
      
      {/* ── 彈出層：通知訊息面板 ── */}
      <AnimatePresence>
        {isNotifyOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* 點擊背景關閉 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifyOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            
            {/* 面板主體 */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 bg-white/95 backdrop-blur-xl h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-white/50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Bell size={20} className="text-teal-600" /> 最新通知
                </h2>
                <button 
                  onClick={() => setIsNotifyOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mockNotifications.map(note => (
                  <div key={note.id} className={`p-4 rounded-2xl border transition-all ${note.read ? 'bg-gray-50 border-gray-100' : 'bg-white border-teal-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold text-sm ${note.read ? 'text-gray-500' : 'text-gray-800'}`}>
                        {note.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{note.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${note.read ? 'text-gray-400' : 'text-gray-600'}`}>
                      {note.message}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50/50">
                <button 
                  onClick={() => setIsNotifyOpen(false)}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-100 active:scale-95 transition-all"
                >
                  返回儀表板
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #26A69A 0%, #00897B 100%)', paddingBottom: 28 }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span style={{ fontSize: 15 }}>返回</span>
          </button>
          
          {/* 🔔 綁定點擊事件開啟通知面板 */}
          <button 
            onClick={() => setIsNotifyOpen(true)}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-90"
          >
            <Bell size={20} className="text-white" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center border-2 border-teal-600"
                style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>

        <div className="px-6 pt-3 pb-6">
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>歡迎，{FAMILY_NAME}</p>
          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
            {PATIENT.name} 的復健狀況
          </h1>

          {/* Status Chips */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(178,255,228,0.2)', color: '#B2FFCE' }}>
              ● 活躍中
            </span>
            <span className="px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }}>
              主治：Dr. 陳志明
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-10" style={{ marginTop: -12 }}>
        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: '完成率', value: `${PATIENT.completionRate}%`, icon: CheckCircle, color: '#00897B', bg: '#E0F2F1' },
            { label: '平均分數', value: `${avgScore}分`, icon: TrendingUp, color: '#1976D2', bg: '#E3F2FD' },
            { label: '最高角度', value: `${lastSession?.maxAngle ?? 0}°`, icon: Activity, color: '#7B1FA2', bg: '#F3E5F5' },
            { label: '連續天數', value: '7天', icon: Heart, color: '#C62828', bg: '#FFEBEE' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 shadow-sm text-center border border-gray-50"
                style={{ background: 'white' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: stat.bg }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1A2035' }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: '#90A4AE', fontWeight: 600 }}>{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl bg-gray-200/50">
          {[
            { id: 'overview', label: '概覽' },
            { id: 'history', label: '訓練記錄' },
            { id: 'alerts', label: `通知 ${unreadAlerts > 0 ? `(${unreadAlerts})` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#00897B' : '#90A4AE',
                boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5 shadow-sm bg-white border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2035' }}>膝蓋角度進展</h3>
                  <p style={{ fontSize: 12, color: '#78909C' }}>近 7 天趨勢</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={mockAngleProgress} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00897B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00897B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#90A4AE' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 130]} tick={{ fontSize: 10, fill: '#90A4AE' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="angle" stroke="#00897B" strokeWidth={3} fill="url(#tealGrad)" dot={{ fill: '#00897B', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5 shadow-sm bg-white border border-gray-50">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2035', marginBottom: 16 }}>本週訓練活動</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={mockWeeklyActivity} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#90A4AE' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#F8FAFB'}} contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Bar dataKey="sessions" name="訓練組數" fill="#00897B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3">
            {recentSessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4 shadow-sm flex items-center gap-4 bg-white border border-gray-50"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${session.score >= 85 ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                  {session.score}
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2035' }}>{session.date}</div>
                  <div style={{ fontSize: 12, color: '#78909C' }}>
                    最高 {session.maxAngle}° · 完成 {session.completedReps}次 · {session.duration}分鐘
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="flex flex-col gap-3">
            {mockNotifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 shadow-sm border-l-4 bg-white ${notif.type === 'warning' ? 'border-orange-400' : 'border-teal-400'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">{notif.title}</span>
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center pb-6">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">RehabBridge Family Care Mode</p>
      </footer>
    </div>
  );
}