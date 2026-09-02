import React, { useState, useCallback, useMemo } from 'react';
import { Shield, Users, X, ChevronDown, Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { ACCOUNT_RECOVERY_QQ_GROUP, ENGLISH_COMMUNITY_DISCORD_URL } from '../../constants/community.js';
import { useI18n } from '../../i18n/index.js';
import { getHomeCollapseState, setHomeCollapseState } from '../../utils';

export default function SecurityCommunityWidget() {
  const { t, isEnglish } = useI18n();
  const [copied, setCopied] = useState(false);

  const initialCollapseState = useMemo(() => getHomeCollapseState(), []);
  const [isOpen, setIsOpen] = useState(() => !initialCollapseState.securityWidget);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      setHomeCollapseState('securityWidget', !next);
      return next;
    });
  }, []);

  const handleCopyQQGroup = useCallback(async () => {
    if (isEnglish) {
      window.open(ENGLISH_COMMUNITY_DISCORD_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      await navigator.clipboard.writeText(ACCOUNT_RECOVERY_QQ_GROUP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [isEnglish]);

  const communityLinkLabel = ENGLISH_COMMUNITY_DISCORD_URL.replace(/^https?:\/\//u, '');

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[80] animate-fade-in">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl hover:border-amber-500/50 dark:hover:border-endfield-yellow/50 transition-all duration-300 cursor-pointer"
          title={isEnglish ? 'Security & Community' : '安全声明与交流群'}
        >
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Shield size={16} />
          </div>
          <div className="flex items-center gap-1 text-amber-600 dark:text-endfield-yellow">
            <Users size={16} />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 tracking-tight">
            {isEnglish ? 'Safety & Community' : '安全声明 & QQ群'}
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[80] w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] flex flex-col rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl overflow-hidden animate-fade-in-up transition-all duration-300">
      {/* 头部标题区 */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Shield size={16} className="text-emerald-500" />
            <Users size={16} className="text-amber-500" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
            {isEnglish ? 'Safety & Community' : '安全声明与交流群'}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleToggleOpen}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors"
          title={isEnglish ? 'Minimize' : '最小化'}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* 内容滚动区 */}
      <div className="p-4 space-y-3.5 overflow-y-auto max-h-[calc(80vh-48px)]">
        {/* 1. 安全与隐私声明 */}
        <div className="p-3 rounded-lg bg-green-50/80 dark:bg-green-950/30 border border-green-200/80 dark:border-green-800/40">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-md shrink-0 mt-0.5">
              <Shield size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-green-800 dark:text-green-400 mb-1">
                {t('home.securityTitle')}
              </h4>
              <div className="text-[11px] text-green-700 dark:text-green-500/90 leading-relaxed space-y-1">
                <p>{t('home.securityCopy1')}</p>
                <p>{t('home.securityCopy2')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 欢迎加入 QQ 群 / 社区 */}
        <div className="p-3 rounded-lg bg-zinc-900 dark:bg-black border border-zinc-800 text-white shadow-inner">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-endfield-yellow/15 text-endfield-yellow border border-endfield-yellow/30 rounded-md shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white mb-1">
                {t('home.communityTitle')}
              </h4>
              <p className="text-[11px] text-zinc-300 leading-relaxed mb-2">
                {t('home.communityCopy1')}
              </p>

              {isEnglish ? (
                <a
                  href={ENGLISH_COMMUNITY_DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('home.communityOpenLink')}
                  className="flex items-center justify-between border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-endfield-yellow rounded hover:border-endfield-yellow/50 transition-colors"
                >
                  <span className="truncate">{communityLinkLabel}</span>
                  <ExternalLink size={12} className="shrink-0 ml-1 text-zinc-400" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyQQGroup}
                  className="w-full flex items-center justify-between border border-amber-500/40 bg-black/60 px-3 py-1.5 font-mono text-xs text-endfield-yellow rounded hover:bg-amber-500/10 transition-all cursor-pointer group"
                >
                  <span className="font-bold tracking-wider">{ACCOUNT_RECOVERY_QQ_GROUP}</span>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 group-hover:text-endfield-yellow transition-colors">
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-sans font-bold">已复制!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span className="font-sans">点击复制</span>
                      </>
                    )}
                  </div>
                </button>
              )}

              <p className="text-[10px] text-zinc-400 mt-1.5">
                {t('home.communityCopy2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
