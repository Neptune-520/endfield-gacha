import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronUp,
  ExternalLink,
  Shield,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getActiveHomeCountdownPools,
  getCurrentUpPoolInfo,
  getHomeRotationPoolSchedule,
  getLimitedPoolCountdownState,
  getLimitedPoolSchedule
} from '../../utils/poolTimeUtils';
import usePoolStore from '../../stores/usePoolStore';
import useSiteConfigStore, {
  HOME_NEXT_VERSION_TARGET_CONFIG_KEY,
  HOME_VERSION_TIMELINE_CONFIG_KEY,
} from '../../stores/useSiteConfigStore';
import CountdownTimer from './CountdownTimer';
import HomecomingPreviewCard from './HomecomingPreviewCard';
import HomeAnnouncementContent from './AnnouncementContent';
import CollapsibleContent from './CollapsibleContent';
import GuideCard from './GuideCard';
import SummerLotteryBanner from './SummerLotteryBanner';
import DonationThanksCard from '../donations/DonationThanksCard.jsx';
import SecurityCommunityWidget from './SecurityCommunityWidget.jsx';
import { ACCOUNT_RECOVERY_QQ_GROUP, ENGLISH_COMMUNITY_DISCORD_URL } from '../../constants/community';
import {
  STORAGE_KEYS,
  getHomeCollapseState,
  hasNewContent,
  markAsViewed,
  setHomeCollapseState
} from '../../utils';
import { useAppStore, useAuthStore } from '../../stores';
import { useI18n } from '../../i18n/index.js';
import { localizeEntityName } from '../../utils/gameDataI18n.js';
import { getLocalizedAnnouncementContent, getLocalizedAnnouncementTitle } from '../../utils/announcementLocale.js';
import {
  buildHomeRotationVersionSections,
  buildHomeVersionCountdownTitle,
  resolveHomeVersionPlan,
} from '../../utils/homeVersionTimeline.js';
import {
  getAnnouncementSeverityMeta,
  getAnnouncementTypeLabel,
  getMostImportantAnnouncement,
  splitSiteAnnouncements
} from '../../utils/announcementMeta.js';

const HomePage = React.memo(() => {
  const { t, isEnglish, locale } = useI18n();
  const user = useAuthStore((state) => state.user);
  const announcements = useAppStore((state) => state.announcements);
  const pools = usePoolStore((state) => state.pools);
  const nextVersionTargetConfigValue = useSiteConfigStore(
    (state) => state.config[HOME_NEXT_VERSION_TARGET_CONFIG_KEY]
  );
  const versionTimelineConfigValue = useSiteConfigStore(
    (state) => state.config[HOME_VERSION_TIMELINE_CONFIG_KEY]
  );
  const communityLinkLabel = ENGLISH_COMMUNITY_DISCORD_URL.replace(/^https?:\/\//u, '');

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const poolsArray = useMemo(() => (Array.isArray(pools) ? pools : []), [pools]);
  const versionPlan = useMemo(() => resolveHomeVersionPlan({
    timelineConfig: versionTimelineConfigValue,
    legacyTargetAt: nextVersionTargetConfigValue,
    locale,
    now,
  }), [locale, nextVersionTargetConfigValue, now, versionTimelineConfigValue]);
  const nextVersionTargetDate = versionPlan.targetAt;
  const nextVersionCountdownTitle = useMemo(() => buildHomeVersionCountdownTitle(versionPlan, {
    baseTitle: t('home.nextVersionCountdown'),
  }), [t, versionPlan]);

  const limitedPoolSchedule = useMemo(() => getLimitedPoolSchedule(poolsArray), [poolsArray]);
  const poolSchedule = useMemo(() => getHomeRotationPoolSchedule(poolsArray), [poolsArray]);
  const poolScheduleVersionSections = useMemo(() => buildHomeRotationVersionSections({
    poolSchedule,
    versionPlan,
    now,
  }), [now, poolSchedule, versionPlan]);
  const currentUpInfo = useMemo(() => getCurrentUpPoolInfo(poolsArray, now), [poolsArray, now]);

  const countdowns = useMemo(() => {
    let main = getLimitedPoolCountdownState(limitedPoolSchedule, now);

    if (main) {
      const localizedBannerName = localizeEntityName(main.name, {
        locale: isEnglish ? 'en-US' : 'zh-CN',
        type: 'character'
      }) || main.name;
      main = {
        ...main,
        title: main.isActive
          ? t('home.poolEndingCountdown', { name: localizedBannerName })
          : t('home.poolStartingCountdown', { name: localizedBannerName }),
        subTitle: main.isActive
          ? t('home.poolEndingSubtitle', { name: localizedBannerName })
          : t('home.poolStartingSubtitle', { name: localizedBannerName })
      };
    }

    const activeHomeCountdownPools = getActiveHomeCountdownPools(poolsArray, now);
    const secondaryPools = activeHomeCountdownPools.filter((pool) => pool.targetDate).filter((pool) => {
      if (!main || pool.poolType !== 'limited') {
        return true;
      }

      return pool.name !== main.name && pool.id !== main.id;
    });
    const secondary = secondaryPools[0] || null;
    let secondaryCountdown = null;

    if (secondary) {
      const localizedSecondaryName = secondary.poolType === 'limited'
        ? localizeEntityName(secondary.name, {
          locale: isEnglish ? 'en-US' : 'zh-CN',
          type: 'character'
        }) || secondary.name
        : secondary.displayName || secondary.name;
      secondaryCountdown = {
        ...secondary,
        title: t('home.poolEndingCountdown', { name: localizedSecondaryName }),
        subTitle: t('home.poolEndingSubtitle', { name: localizedSecondaryName })
      };
    }

    if (!main) {
      main = {
        targetDate: nextVersionTargetDate,
        title: nextVersionCountdownTitle,
        subTitle: t('home.nextVersionWaiting')
      };
    }

    return { main, secondary: secondaryCountdown };
  }, [isEnglish, limitedPoolSchedule, nextVersionCountdownTitle, nextVersionTargetDate, now, poolsArray, t]);

  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);
  const [showGuide, setShowGuide] = useState(!initialCollapseState.guide);

  const handleToggleGuide = useCallback(() => {
    setShowGuide((prev) => {
      const next = !prev;
      setHomeCollapseState('guide', !next);
      return next;
    });
  }, []);

  const handleCelebrationClick = useCallback((event) => {
    event.preventDefault();
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { x, y }
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* 真正 100vw 屏幕满宽的大气科技风常规网站 Hero Banner */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 mb-10 overflow-hidden bg-zinc-950 dark:bg-black border-b border-amber-500/20 text-white shadow-2xl">
        {/* 背景光效层 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,204,0,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,204,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,204,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* 主内容区域 - 最大宽度对齐全站网格 */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* 左侧：主标题、核心卖点、域名、按钮区 (占据 7 列) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* 顶部的突出里程碑庆祝 Badge */}
            <div className="inline-flex items-center">
              <button
                type="button"
                onClick={handleCelebrationClick}
                className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-endfield-yellow text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(255,204,0,0.1)] hover:shadow-[0_0_20px_rgba(255,204,0,0.25)] cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>恭喜网站突破 2K+ 人贡献抽卡数据</span>
                <span className="h-1 w-1 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-300/80 uppercase tracking-widest font-mono group-hover:translate-x-0.5 transition-transform">CELEBRATE →</span>
              </button>
            </div>

            {/* 主标题与品牌 Icon */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black rounded-lg shadow-[0_0_20px_rgba(255,204,0,0.4)] shrink-0">
                  <BarChart3 size={32} />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
                  终末地抽卡分析器
                </h1>
              </div>
              <p className="text-xs font-mono tracking-[0.3em] text-amber-500/90 uppercase pl-1">
                ENDFIELD GACHA ANALYTICS PLATFORM
              </p>
            </div>

            {/* 描述语 */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-xl">
              记录您的抽卡历程，分析出货规律，为后续规划提供参考
            </p>

            {/* 双独立域名入口 Pills */}
            <div className="pt-1 flex flex-wrap items-center gap-3 font-mono">
              <span className="text-xs text-zinc-400 font-sans">{t('home.siteLinks.title', {}, '官方站点')}:</span>
              <a
                href="https://ef-gacha.mogujun.icu/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500 hover:text-black hover:border-amber-400 rounded-md shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,1)] group-hover:bg-black" />
                <span>ef-gacha.mogujun.icu</span>
                <ExternalLink size={12} className="text-amber-400/70 group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://ef.nepst.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white rounded-md"
              >
                <span className="h-2 w-2 rounded-full bg-zinc-500 group-hover:bg-zinc-300" />
                <span>ef.nepst.cn</span>
                <ExternalLink size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </a>
            </div>

            {/* 快速动作与登录提示 */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {!user && (
                <div className="inline-flex items-center gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md font-mono">
                  <ArrowRight size={14} />
                  <span>{t('home.loginHint')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：展示卡片/数据概览卡片 (占据 5 列) */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden group hover:border-amber-500/40 transition-colors">
              {/* 装饰光效 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                    <Shield size={16} />
                    <span>DATA INSIGHTS</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-endfield-yellow border border-amber-500/30 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-black/50 border border-zinc-800/80">
                    <div className="text-[11px] text-zinc-400 font-medium mb-1">贡献用户样本</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">2,000+</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-black/50 border border-zinc-800/80">
                    <div className="text-[11px] text-zinc-400 font-medium mb-1">概率统计精确度</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">99.9%</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                    <span>功能特色</span>
                    <Sparkles size={14} className="text-amber-400" />
                  </div>
                  <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                    <li>全卡池（包含限制寻访与常驻）独立概率与保底计算</li>
                    <li>多端跨平台同步，无需下载第三方日志提取器</li>
                    <li>全站脱敏大数据图表对比与概率偏差校准</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <SummerLotteryBanner />

      <DonationThanksCard />



      <div className="flex flex-col gap-4">
        <div className="relative">
          {countdowns.main && (
            <CountdownTimer
              targetDate={countdowns.main.targetDate}
              title={countdowns.main.title}
              subTitle={countdowns.main.subTitle}
              link={null}
              characterName={countdowns.main.name}
              scheduleDate={countdowns.main.scheduleDate || countdowns.main.startDate}
            />
          )}
        </div>
        {countdowns.secondary && (
          <div className="relative">
            <CountdownTimer
              targetDate={countdowns.secondary.targetDate}
              title={countdowns.secondary.title}
              subTitle={countdowns.secondary.subTitle}
              link={null}
              characterName={countdowns.secondary.poolType === 'limited' ? countdowns.secondary.name : null}
              featuredCharacterNames={countdowns.secondary.poolType === 'extra' ? countdowns.secondary.featuredNames : []}
              bgImage={countdowns.secondary.poolType === 'extra' ? null : countdowns.secondary.backgroundImage}
              scheduleDate={countdowns.secondary.scheduleDate || countdowns.secondary.startDate}
            />
          </div>
        )}

        <HomecomingPreviewCard
          targetDate={nextVersionTargetDate}
          title={nextVersionCountdownTitle}
        />
      </div>

      <GuideCard isOpen={showGuide} onToggle={handleToggleGuide} />
      <SecurityCommunityWidget />
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
