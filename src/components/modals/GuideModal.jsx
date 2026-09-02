import React, { useCallback } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Cloud,
  Download,
  Gamepad2,
  Import,
  LogIn,
  MessageSquare,
  PieChart,
  X,
  Zap
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDesktopPathForTab, getMobilePathForTab } from '../../constants/appRoutes';
import { useAuthStore } from '../../stores';
import { useI18n } from '../../i18n/index.js';

const NavButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-endfield-yellow border border-amber-500/30 rounded-md transition-colors cursor-pointer"
  >
    {Icon && <Icon size={13} />}
    <span>{label}</span>
    <ArrowRight size={12} className="opacity-60" />
  </button>
);

export default function GuideModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const isMobileRoute = location.pathname.startsWith('/m');
  const tt = (key, fallback, params = {}) => t(key, params, fallback);

  const goTo = useCallback((tab, scrollTo) => () => {
    onClose();
    const targetPath = isMobileRoute ? getMobilePathForTab(tab) : getDesktopPathForTab(tab);
    navigate(targetPath, scrollTo ? { state: { scrollTo, _ts: Date.now() } } : undefined);
  }, [isMobileRoute, navigate, onClose]);

  const handleLoginClick = useCallback(() => {
    onClose();
    openAuthModal();
  }, [onClose, openAuthModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* 顶部线 */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

        {/* 弹窗 Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-lg">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                {tt('home.guide.title', '使用指南')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {tt('home.guide.subtitle', '从注册到分析的完整操作流程')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 弹窗 Body (滚动区域) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-zinc-50/50 dark:bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* STEP 01 - 账号注册与数据导入 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">STEP 01</span>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                  {tt('home.guide.step1.title', '账号注册与数据导入')}
                </h4>
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed space-y-2">
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><LogIn size={13} /> {tt('home.guide.step1.authTitle', '注册 / 登录')}</strong>
                  <p>{tt('home.guide.step1.authBody', '点击右上角登录，使用邮箱注册账号。登录后数据自动同步至云端，支持多设备无缝切换。')}</p>
                </div>
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><Import size={13} /> {tt('home.guide.step1.importTitle', '导入抽卡记录')}</strong>
                  <p>{tt('home.guide.step1.importBody', '进入「卡池分析」页面，点击「导入数据」按钮，选择国服 / 国际服。')}</p>
                </div>
                <div className="bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 p-2.5 rounded-lg space-y-1">
                  <p><span className="text-zinc-500 dark:text-zinc-400 font-bold mr-1">CN</span>{tt('home.guide.step1.cnFlow', '登录鹰角通行证 → 打开')} <code className="text-[10px] bg-white dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">web-api.hypergryph.com</code></p>
                  <p><span className="text-zinc-500 dark:text-zinc-400 font-bold mr-1">EN</span>{tt('home.guide.step1.enFlow', '登录 Gryphline 充值中心 → 打开')} <code className="text-[10px] bg-white dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">web-api.gryphline.com</code></p>
                </div>
                <p>{tt('home.guide.step1.pasteBody', '将复制的内容粘贴至输入框并开始导入，系统会自动去重与解析。')}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
                {!user && (
                  <NavButton icon={LogIn} label={tt('home.guide.step1.action.login', '登录 / 注册')} onClick={handleLoginClick} />
                )}
                <NavButton icon={Import} label={tt('home.guide.step1.action.import', '前往导入')} onClick={goTo('dashboard', 'guide-import-btn')} />
              </div>
            </div>

            {/* STEP 02 - 数据分析与统计 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500/20 text-amber-800 dark:text-endfield-yellow font-mono text-[10px] px-2 py-0.5 rounded font-bold">STEP 02</span>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                  {tt('home.guide.step2.title', '数据分析与统计')}
                </h4>
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-3 leading-relaxed">
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><BarChart3 size={13} /> {tt('home.guide.step2.dashboardTitle', '卡池分析')}</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{tt('home.guide.step2.dashboardBullet1', '查看 6★/5★ 保底进度与当前垫刀数')}</li>
                    <li>{tt('home.guide.step2.dashboardBullet2', '分析平均出货、不歪率与出货分布图')}</li>
                    <li>{tt('home.guide.step2.dashboardBullet3', '追踪 120 抽硬保底、240 抽赠送机制')}</li>
                    <li>{tt('home.guide.step2.dashboardBullet4', '角色出货瀑布图与时间线视图')}</li>
                  </ul>
                </div>
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><PieChart size={13} /> {tt('home.guide.step2.summaryTitle', '统计汇总')}</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{tt('home.guide.step2.summaryBullet1', '单账号生涯总览与欧非评价')}</li>
                    <li>{tt('home.guide.step2.summaryBullet2', '全服数据对比与角色出货排名')}</li>
                  </ul>
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
                <NavButton icon={BarChart3} label={tt('home.guide.step2.action.dashboard', '卡池分析')} onClick={goTo('dashboard')} />
                <NavButton icon={PieChart} label={tt('home.guide.step2.action.summary', '统计汇总')} onClick={goTo('summary')} />
              </div>
            </div>

            {/* STEP 03 - 实用工具与服务 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold">STEP 03</span>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                  {tt('home.guide.step3.title', '实用工具与服务')}
                </h4>
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-3 leading-relaxed">
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><Gamepad2 size={13} /> {tt('home.guide.step3.simulatorTitle', '抽卡模拟器')}</strong>
                  <p>{tt('home.guide.step3.simulatorBody', '精确还原游戏概率引擎（含 65 抽软保底），支持从真实记录继承保底状态、资源追踪与无限十连。')}</p>
                </div>
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><Cloud size={13} /> {tt('home.guide.step3.cloudTitle', '云同步与导出')}</strong>
                  <p>{tt('home.guide.step3.cloudBody', '登录后数据自动云端同步，支持 JSON / CSV 导出备份，可按卡池、账号、日期筛选导出。')}</p>
                </div>
                <div>
                  <strong className="block text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1"><MessageSquare size={13} /> {tt('home.guide.step3.ticketTitle', '工单反馈')}</strong>
                  <p>{tt('home.guide.step3.ticketBody', '在应用内提交 Bug 报告、功能建议或使用问题，支持状态追踪与回复。')}</p>
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
                <NavButton icon={Gamepad2} label={tt('home.guide.step3.action.simulator', '抽卡模拟器')} onClick={goTo('simulator')} />
                <NavButton icon={Download} label={tt('home.guide.step3.action.export', '导出数据')} onClick={goTo('dashboard', 'guide-export-section')} />
                <NavButton icon={MessageSquare} label={tt('home.guide.step3.action.ticket', '工单反馈')} onClick={goTo('tickets')} />
              </div>
            </div>

          </div>
        </div>

        {/* 弹窗 Footer */}
        <div className="px-6 py-3.5 bg-zinc-100 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Zap size={14} className="text-amber-500" />
            <span>{tt('home.guide.tip', 'TIP: 游客可直接使用模拟器和查看全服统计；登录后解锁数据导入、云同步与工单功能')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            关闭指南
          </button>
        </div>
      </div>
    </div>
  );
}
