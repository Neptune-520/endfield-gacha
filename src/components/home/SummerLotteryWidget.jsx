import React, { useState, useCallback, useMemo } from 'react';
import { Gift, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import SummerLotteryBanner from './SummerLotteryBanner.jsx';
import { getHomeCollapseState, setHomeCollapseState } from '../../utils';

export default function SummerLotteryWidget() {
  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);

  // 1. 进入网站默认收缩 (isOpen 默认初始值为 false)
  const [isOpen, setIsOpen] = useState(() => Boolean(initialCollapseState.lotteryDrawerOpen));

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      setHomeCollapseState('lotteryDrawerOpen', next);
      return next;
    });
  }, []);

  // 2. 收起状态：紧贴屏幕右侧边缘、长比高窄、竖着的长方形悬浮标签
  if (!isOpen) {
    return (
      <div className="fixed top-1/3 right-0 z-[85] animate-fade-in">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="group flex flex-col items-center justify-center gap-3 py-4 px-2 sm:px-2.5 rounded-l-xl bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-2xl border-l-2 border-y border-amber-200 hover:brightness-110 transition-all duration-300 cursor-pointer select-none"
          title="展开夏日抽奖活动"
        >
          <Gift size={18} className="animate-bounce text-slate-950 shrink-0" />
          <span className="[writing-mode:vertical-rl] text-xs font-black tracking-widest text-slate-950">
            夏日抽奖
          </span>
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-slate-900 shrink-0" />
        </button>
      </div>
    );
  }

  // 3. 展开状态：横着的长方形面板，保留原始完整 Banner 样式，不切割不扭曲
  return (
    <div className="fixed top-24 sm:top-28 right-3 sm:right-6 z-[85] w-[calc(100vw-1.5rem)] sm:w-[680px] lg:w-[820px] max-h-[85vh] flex flex-col rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-amber-500/50 dark:border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-in-right transition-all duration-300">
      {/* 顶部 Header 标题与收起关按钮 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-b border-amber-200/80 dark:border-amber-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0">
            <Gift size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>夏日特别抽奖福利</span>
              <Sparkles size={13} className="text-amber-500" />
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleOpen}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-amber-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="收起浮窗"
        >
          <span>收起</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 横向 Banner 完整展示区 (使用 compact={false} 保留原始横向布局) */}
      <div className="p-4 overflow-x-auto overflow-y-auto">
        <SummerLotteryBanner compact={false} />
      </div>
    </div>
  );
}
