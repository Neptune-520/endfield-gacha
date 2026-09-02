import React, { useCallback } from 'react';
import { ArrowRight, BarChart3, ChevronDown, ExternalLink, Shield, Sparkles, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../../i18n/index.js';

export default function HomeHeroBanner({ user }) {
  const { t } = useI18n();

  const handleCelebrationClick = useCallback((event) => {
    event.preventDefault();
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { x, y }
    });
  }, []);

  const handleScrollDown = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gradient-to-b from-white via-slate-50 to-amber-50/30 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm transition-colors duration-300 relative flex flex-col justify-between overflow-hidden">
      {/* 顶部优雅金色线与背景微光网格 */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none opacity-40" />

      {/* 顶部留白 */}
      <div />

      {/* 主内容区域（居中满屏全屏 Hero 展示区） */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* 左侧：标语、标题、域名与登录引导 */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* 里程碑庆祝 Badge */}
          <div className="inline-flex items-center">
            <button
              type="button"
              onClick={handleCelebrationClick}
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-endfield-yellow text-xs sm:text-sm font-bold transition-all hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:border-amber-400 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              <span>恭喜网站突破 2K+ 人贡献抽卡数据</span>
              <span className="text-xs bg-amber-500 text-black px-2 py-0.5 font-black rounded-full group-hover:scale-105 transition-transform">🎉 点击庆祝</span>
            </button>
          </div>

          {/* 品牌标题 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-400 text-slate-950 font-black rounded-xl shadow-md shrink-0">
                <BarChart3 size={36} className="sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                终末地抽卡分析器
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase pl-1">
              AR KNIGHTS: ENDFIELD GACHA ANALYTICS PLATFORM
            </p>
          </div>

          {/* 功能介绍副标题 */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-300 leading-relaxed font-normal max-w-2xl">
            记录您的抽卡历程，分析出货规律，为后续规划提供参考
          </p>

          {/* 官方站点双域名 Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-sans font-medium">官方站点:</span>
            <a
              href="https://ef-gacha.mogujun.icu/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-amber-400/80 bg-amber-100/60 dark:bg-amber-950/50 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 transition-all hover:bg-amber-400 hover:text-slate-950 rounded-lg shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500 group-hover:bg-slate-950" />
              <span>ef-gacha.mogujun.icu</span>
              <ExternalLink size={14} className="text-amber-600 dark:text-amber-400 group-hover:text-slate-950 transition-colors" />
            </a>
            <a
              href="https://ef.nepst.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-slate-200 dark:border-zinc-700 bg-slate-100/90 dark:bg-zinc-800/90 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white rounded-lg shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-zinc-500" />
              <span>ef.nepst.cn</span>
              <ExternalLink size={14} className="text-slate-400 dark:text-zinc-500 transition-colors" />
            </a>
          </div>

          {!user && (
            <div className="pt-3 flex items-center gap-2 text-xs sm:text-sm text-amber-700 dark:text-amber-400/90 font-medium">
              <ArrowRight size={16} />
              <span>{t('home.loginHint')}</span>
            </div>
          )}
        </div>

        {/* 右侧：大气的数据概览卡片 */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                <Award size={18} className="text-amber-500" />
                <span>分析平台特点</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400 rounded-full flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                数据已同步
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80">
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">贡献数据样本</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">2,000+</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80">
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">概率计算模型</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">脱敏校准</div>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 space-y-2.5 pt-1">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span>支持常规寻访与限定寻访独立保底追踪</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span>无需安装第三方客户端，全端浏览器原生支持</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span>数据全面云端保存，支持多设备随时同步</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* 底部向下滚动箭头指示 */}
      <div className="py-6 flex flex-col items-center justify-center relative z-10">
        <button
          type="button"
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-1 text-slate-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-endfield-yellow transition-colors cursor-pointer"
        >
          <span className="text-xs font-mono tracking-wider">Scroll Down</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </div>
    </div>
  );
}
