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
      {/* 顶部全屏全宽 Hero Banner */}
      <div className="-mx-4 sm:-mx-6 -mt-8 mb-6 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-b border-amber-500/30 text-white shadow-xl">
        {/* 背景科技感网格与光效装饰 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,204,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,204,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10 relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-sm text-endfield-yellow shrink-0">
                  <BarChart3 size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  终末地抽卡分析器
                </h1>
              </div>

              {/* 域名标签 */}
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <a
                  href="https://ef-gacha.mogujun.icu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('home.siteLinks.main')}: ef-gacha.mogujun.icu`}
                  className="group inline-flex items-center gap-1.5 border border-amber-500/50 bg-black/40 px-2.5 py-1 text-xs font-bold text-zinc-100 transition-all hover:bg-amber-500/20 hover:text-endfield-yellow hover:border-amber-400 rounded-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                  <span>ef-gacha.mogujun.icu</span>
                  <ExternalLink size={12} className="text-zinc-500 transition-colors group-hover:text-endfield-yellow" />
                </a>
                <a
                  href="https://ef.nepst.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('home.siteLinks.backup')}: ef.nepst.cn`}
                  className="group inline-flex items-center gap-1.5 border border-zinc-700 bg-black/40 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-white/10 hover:text-white rounded-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span>ef.nepst.cn</span>
                  <ExternalLink size={12} className="text-zinc-500 transition-colors group-hover:text-zinc-300" />
                </a>
              </div>
            </div>

            {/* 主描述 */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
              记录您的抽卡历程，分析出货规律，为后续规划提供参考
            </p>

            {!user && (
              <p className="text-xs text-amber-400/90 flex items-center gap-1.5 font-mono pt-1">
                <ArrowRight size={14} />
                <span>{t('home.loginHint')}</span>
              </p>
            )}
          </div>

          {/* 右侧庆祝 Badge / 按钮 */}
          <div className="flex shrink-0 items-center animate-fade-in-up">
            <button
              type="button"
              onClick={handleCelebrationClick}
              className="group relative flex items-center gap-3 px-5 py-3 rounded-full border bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/50 text-endfield-yellow font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(255,204,0,0.15)] hover:shadow-[0_0_30px_rgba(255,204,0,0.3)] cursor-pointer"
            >
              <span>恭喜网站突破 2K+ 人贡献抽卡数据</span>
              <div className="p-1.5 rounded-full transition-all bg-amber-500/20 group-hover:bg-amber-500 group-hover:text-black text-amber-400">
                <Sparkles size={18} className="animate-pulse" />
              </div>
            </button>
          </div>
        </div>

        {/* 背景巨型图形饰品 */}
        <div className="absolute -right-10 -bottom-10 pointer-events-none text-white/5">
          <Star size={240} />
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
