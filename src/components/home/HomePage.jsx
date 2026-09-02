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
      <div className="relative overflow-hidden border-l-4 transition-all duration-500 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black border-endfield-yellow p-6 text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className="flex items-center gap-3 text-2xl font-bold">
                <BarChart3 size={28} />
                <span>{t('app.brand')}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <a
                  href="https://ef-gacha.mogujun.icu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('home.siteLinks.main')}: ef-gacha.mogujun.icu`}
                  className="group inline-flex items-center gap-2 border border-endfield-yellow/50 bg-black/20 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-100 transition-colors hover:bg-endfield-yellow/15 hover:text-endfield-yellow"
                >
                  <span className="h-1.5 w-1.5 bg-endfield-yellow shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
                  <span>ef-gacha.mogujun.icu</span>
                  <ExternalLink size={10} className="text-zinc-500 transition-colors group-hover:text-endfield-yellow" />
                </a>
                <a
                  href="https://ef.nepst.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('home.siteLinks.backup')}: ef.nepst.cn`}
                  className="group inline-flex items-center gap-2 border border-zinc-600 bg-black/20 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-300 transition-colors hover:border-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 bg-zinc-400" />
                  <span>ef.nepst.cn</span>
                  <ExternalLink size={10} className="text-zinc-600 transition-colors group-hover:text-zinc-300" />
                </a>
              </div>
            </div>
            <p className="text-sm text-indigo-100">
              {t('home.heroSubtitle')}
            </p>
            {!user && (
              <p className="text-xs mt-2 flex items-center gap-1 text-indigo-200">
                <ArrowRight size={12} />
                {t('home.loginHint')}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end md:self-center animate-fade-in-up">
            <button
              onClick={handleCelebrationClick}
              className="group flex items-center gap-3 px-4 py-2 rounded-full transition-all cursor-pointer border bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/50 text-endfield-yellow"
            >
              <span className="text-sm font-bold font-mono tracking-wide">{t('home.celebration')}</span>
              <div className="p-1.5 rounded-full transition-colors bg-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black text-yellow-500">
                <Sparkles size={16} className="animate-pulse" />
              </div>
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 pointer-events-none text-white/10">
          <Star size={200} />
        </div>
      </div>

      <SummerLotteryBanner />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-none overflow-hidden shadow-sm">
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-500 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-green-800 dark:text-green-400 mb-1">
                {t('home.securityTitle')}
              </h3>
              <div className="text-xs text-green-700 dark:text-green-500/80 leading-relaxed space-y-1">
                <p>{t('home.securityCopy1')}</p>
                <p>{t('home.securityCopy2')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 dark:bg-black border border-zinc-800 rounded-none overflow-hidden shadow-sm text-white">
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="p-2 bg-endfield-yellow/15 text-endfield-yellow border border-endfield-yellow/30 shrink-0">
              <Users size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white mb-1">
                {t('home.communityTitle')}
              </h3>
              <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                <p>{t('home.communityCopy1')}</p>
                {isEnglish ? (
                  <a
                    href={ENGLISH_COMMUNITY_DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('home.communityOpenLink')}
                    className="block border border-zinc-700 bg-zinc-950/80 px-3 py-2 font-mono text-sm tracking-wide text-endfield-yellow break-all transition-colors hover:border-endfield-yellow/50 hover:text-white"
                  >
                    {communityLinkLabel}
                  </a>
                ) : (
                  <div className="border border-zinc-700 bg-zinc-950/80 px-3 py-2 font-mono text-base tracking-wider text-endfield-yellow">
                    {ACCOUNT_RECOVERY_QQ_GROUP}
                  </div>
                )}
                <p className="text-zinc-400">{t('home.communityCopy2')}</p>
              </div>
            </div>
          </div>
        </div>

        <DonationThanksCard />
      </div>



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
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
