import React, { useState, useCallback, useMemo } from 'react';
import { Gift, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import SummerLotteryBanner from './SummerLotteryBanner.jsx';
import { getHomeCollapseState, setHomeCollapseState } from '../../utils';

export default function SummerLotteryWidget() {
  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);
  const [isOpen, setIsOpen] = useState(() => !initialCollapseState.lotteryDrawer);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      setHomeCollapseState('lotteryDrawer', !next);
      return next;
    });
  }, []);

  // 1. 收起状态：紧贴屏幕右侧边缘的吸附悬浮标签按钮
  if (!isOpen) {
    return (
      <div className="fixed top-1/3 right-0 z-[85] animate-fade-in">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="group flex items-center gap-2 pl-3 pr-2.5 py-2.5 rounded-l-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xl border-l border-t border-b border-amber-300 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 cursor-pointer"
          title="展开夏日抽奖活动"
        >
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Gift size={18} className="animate-bounce text-slate-950" />
            <span className="tracking-wide">夏日抽奖</span>
          </div>
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  // 2. 展开状态：紧贴屏幕右侧边缘的侧边浮窗面板
  return (
    <div className="fixed top-1/4 right-0 z-[85] w-[calc(100vw-1.5rem)] sm:w-96 max-h-[85vh] flex flex-col rounded-l-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l-2 border-y border-amber-500/50 dark:border-amber-500/40 shadow-2xl overflow-hidden animate-slide-in-right transition-all duration-300">
      {/* 面板 Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-b border-amber-200 dark:border-amber-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0">
            <Gift size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>夏日特别抽奖福利</span>
              <Sparkles size={12} className="text-amber-500" />
            </h3>
            <p className="text-[10px] text-amber-700 dark:text-amber-400">Arknights × Persona 3 Reload 联动</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleOpen}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-amber-100 dark:hover:bg-zinc-800 transition-colors"
          title="收起浮窗"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 浮窗内容区 */}
      <div className="p-3 overflow-y-auto max-h-[calc(85vh-50px)]">
        <SummerLotteryBanner compact={true} />
      </div>
    </div>
  );
}
