import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Gift, ChevronLeft, ChevronRight, Sparkles, Sliders, X, RefreshCw } from 'lucide-react';
import SummerLotteryBanner from './SummerLotteryBanner.jsx';
import { getHomeCollapseState, setHomeCollapseState } from '../../utils';

export default function SummerLotteryWidget() {
  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);

  // 1. 进入网站默认收缩 (isOpen 默认初始值为 false)
  const [isOpen, setIsOpen] = useState(() => Boolean(initialCollapseState.lotteryDrawerOpen));

  // 🎛️ 实时尺寸调试调优控制参数 (实时拉条调试)
  const [debugWidth, setDebugWidth] = useState(1400); // 弹窗总宽度 (默认 1400px)
  const [debugLeftRatio, setDebugLeftRatio] = useState(48); // 左侧文字占比 (默认 48%)
  const [debugMinHeight, setDebugMinHeight] = useState(360); // Banner 最小高度 (默认 360px)

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

  const handleResetDebug = useCallback(() => {
    setDebugWidth(1400);
    setDebugLeftRatio(48);
    setDebugMinHeight(360);
  }, []);

  // 2. 收起状态：紧贴屏幕右侧边缘、长比高窄、竖着的长方形悬浮标签 (使用 createPortal 挂载至 document.body 确保 z-[99999] 绝对顶层)
  if (!isOpen) {
    return createPortal(
      <div className="fixed top-1/3 right-0 z-[99999] animate-fade-in pointer-events-auto">
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
      </div>,
      document.body
    );
  }

  // 3. 展开状态：带实时尺寸调试工具栏的横向弹窗 (最高 z-[99999] 层级)
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6 pointer-events-none">
      {/* 全屏背景遮罩层：完全隔离底层 Hero Banner 等一切元素 */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998] animate-fade-in pointer-events-auto cursor-pointer"
      />

      {/* 浮窗主卡片 (最高 z-[99999] 层级，支持通过调试拉条实时控制宽度) */}
      <div
        className="relative z-[99999] max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border-2 border-amber-500/80 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden animate-scale-up pointer-events-auto transition-all duration-150"
        style={{
          width: `min(${debugWidth}px, calc(100vw - 1rem))`
        }}
      >
        
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-200 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 transition-colors cursor-pointer"
            title="收起浮窗"
          >
            <span>收起浮窗</span>
            <X size={16} />
          </button>
        </div>

        {/* 🎛️ 实时尺寸调试工具栏 (拖动拉条实时预览效果) */}
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-300/50 dark:border-amber-900/50 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-800 dark:text-zinc-200 shrink-0">
          <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 shrink-0">
            <Sliders size={16} />
            <span>实时尺寸调试拉条</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* 1. 弹窗总宽度拉条 */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">总宽度:</span>
              <input
                type="range"
                min="700"
                max="1900"
                step="10"
                value={debugWidth}
                onChange={(e) => setDebugWidth(Number(e.target.value))}
                className="w-24 sm:w-36 accent-amber-500 cursor-pointer"
              />
              <span className="font-bold text-amber-600 dark:text-amber-400 w-16 text-right">{debugWidth}px</span>
            </div>

            {/* 2. 左侧文字栏占比拉条 */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">文字栏占比:</span>
              <input
                type="range"
                min="30"
                max="75"
                step="1"
                value={debugLeftRatio}
                onChange={(e) => setDebugLeftRatio(Number(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
              />
              <span className="font-bold text-amber-600 dark:text-amber-400 w-10 text-right">{debugLeftRatio}%</span>
            </div>

            {/* 3. Banner 最小高度拉条 */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">Banner高度:</span>
              <input
                type="range"
                min="240"
                max="500"
                step="10"
                value={debugMinHeight}
                onChange={(e) => setDebugMinHeight(Number(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
              />
              <span className="font-bold text-amber-600 dark:text-amber-400 w-12 text-right">{debugMinHeight}px</span>
            </div>

            <button
              type="button"
              onClick={handleResetDebug}
              className="p-1 rounded text-zinc-400 hover:text-amber-500 transition-colors"
              title="重置调试参数"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* 横向 Banner 充裕完整展示区 */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/40 flex-1">
          <style>{`
            .summer-lottery-banner-debug-override {
              grid-template-columns: minmax(0, ${debugLeftRatio}%) minmax(0, ${100 - debugLeftRatio}%) !important;
              min-height: ${debugMinHeight}px !important;
            }
            .summer-lottery-banner-debug-override .summer-lottery-banner__info {
              min-height: ${debugMinHeight}px !important;
            }
            .summer-lottery-banner-debug-override .summer-lottery-banner__visual {
              min-height: ${debugMinHeight}px !important;
            }
          `}</style>
          <SummerLotteryBanner compact={false} className="summer-lottery-banner-debug-override" />
        </div>
      </div>
    </div>,
    document.body
  );
}
