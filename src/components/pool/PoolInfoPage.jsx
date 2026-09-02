import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layers } from 'lucide-react';
import HomeRotationScheduleCard from '../home/RotationScheduleCard';
import PoolMechanicsCard from '../home/PoolMechanicsCard';
import {
  getHomeRotationPoolSchedule,
  getCurrentUpPoolInfo,
} from '../../utils/poolTimeUtils';
import {
  buildHomeRotationVersionSections,
  resolveHomeVersionPlan,
} from '../../utils/homeVersionTimeline';
import useSiteConfigStore, {
  HOME_NEXT_VERSION_TARGET_CONFIG_KEY,
  HOME_VERSION_TIMELINE_CONFIG_KEY,
} from '../../stores/useSiteConfigStore';
import { usePoolStore } from '../../stores';
import { useI18n } from '../../i18n/index.js';
import { getHomeCollapseState, setHomeCollapseState } from '../../utils';

export default function PoolInfoPage() {
  const { locale, isEnglish } = useI18n();
  const pools = usePoolStore((state) => state.pools);
  const poolsArray = useMemo(() => (Array.isArray(pools) ? pools : []), [pools]);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const nextVersionTargetConfigValue = useSiteConfigStore(
    (state) => state.config[HOME_NEXT_VERSION_TARGET_CONFIG_KEY]
  );
  const versionTimelineConfigValue = useSiteConfigStore(
    (state) => state.config[HOME_VERSION_TIMELINE_CONFIG_KEY]
  );

  const versionPlan = useMemo(
    () =>
      resolveHomeVersionPlan({
        timelineConfig: versionTimelineConfigValue,
        legacyTargetAt: nextVersionTargetConfigValue,
        locale,
        now,
      }),
    [locale, nextVersionTargetConfigValue, now, versionTimelineConfigValue]
  );

  const poolSchedule = useMemo(() => getHomeRotationPoolSchedule(poolsArray), [poolsArray]);
  const poolScheduleVersionSections = useMemo(
    () =>
      buildHomeRotationVersionSections({
        poolSchedule,
        versionPlan,
        now,
      }),
    [now, poolSchedule, versionPlan]
  );
  const currentUpInfo = useMemo(() => getCurrentUpPoolInfo(poolsArray, now), [poolsArray, now]);

  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);
  const [showPoolMechanics, setShowPoolMechanics] = useState(!initialCollapseState.poolMechanics);

  const handleTogglePoolMechanics = useCallback(() => {
    setShowPoolMechanics((prev) => {
      const next = !prev;
      setHomeCollapseState('poolMechanics', !next);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* 头部 Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-amber-500/10 dark:from-endfield-yellow/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 dark:bg-yellow-950/40 border border-amber-200 dark:border-yellow-800/50 text-amber-700 dark:text-endfield-yellow text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Layers size={14} />
              <span>{isEnglish ? 'BANNER INFORMATION' : '卡池资讯中心'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEnglish ? 'Banner Rotation Schedule & Mechanics' : '卡池轮换计划与规则机制速览'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl">
              {isEnglish
                ? 'Check upcoming banner rotation schedules, version timelines, and banner pity rules without requiring account login.'
                : '在这里查阅终末地公测卡池的最新轮换计划、版本时间线以及保底概率规则机制，无需登录即可随时浏览。'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. 轮换计划 */}
      <HomeRotationScheduleCard
        poolSchedule={poolSchedule}
        versionSections={poolScheduleVersionSections}
        now={now}
      />

      {/* 2. 公测卡池机制速览 */}
      <PoolMechanicsCard
        isOpen={showPoolMechanics}
        onToggle={handleTogglePoolMechanics}
        currentUpInfo={currentUpInfo}
      />
    </div>
  );
}
