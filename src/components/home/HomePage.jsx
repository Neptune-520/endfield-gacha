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
