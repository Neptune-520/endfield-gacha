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

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHomeCollapseState('lotteryDrawerOpen', false);
  }, []);

  // 2. 收起状态：紧贴屏幕右侧边缘、长比高窄、竖着的长方形悬浮标签 (最高层级 z-[200])
  if (!isOpen) {
    return (
      <div className="fixed top-1/3 right-0 z-[200] animate-fade-in">
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

  // 3. 展开状态：加宽横向长方形大面板 + 最高 z-[200] 层级 + 深色半透明 Backdrop 防背景透光
  return (
    <>
      {/* 背景遮罩层：防止背景 Banner 文字穿透 */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[190] animate-fade-in cursor-pointer"
      />

      {/* 浮窗主卡片 (最高 z-[200] 层级，宽度增加至 1060px 充裕横向延伸) */}
      <div className="fixed top-20 sm:top-24 right-3 sm:right-6 lg:right-10 z-[200] w-[calc(100vw-1.5rem)] sm:w-[840px] md:w-[960px] lg:w-[1060px] max-w-[1080px] max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border-2 border-amber-500/70 shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-in-right transition-all duration-300">
        
        {/* 顶部 Header 标题栏 */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-zinc-100 dark:to-zinc-800 border-b border-amber-300/60 dark:border-amber-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0 shadow-sm">
              <Gift size={18} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>夏日特别抽奖福利</span>
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-200 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 transition-colors cursor-pointer"
            title="收起浮窗"
          >
            <span>收起浮窗</span>
            <X size={16} />
          </button>
        </div>

        {/* 横向 Banner 充裕完整展示区 */}
        <div className="p-4 sm:p-5 overflow-x-auto overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/40">
          <SummerLotteryBanner compact={false} />
        </div>
      </div>
    </>
  );
}
