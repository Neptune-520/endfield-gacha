import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS, useI18n } from '../../i18n/index.js';

function LocaleSwitcher({ className = '', compact = false, variant = 'default' }) {
  const { locale, localeMode, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (variant === 'floating') {
    const activeOption = LANGUAGE_OPTIONS.find(
      (opt) => localeMode === opt.value || (!localeMode && locale === opt.value)
    ) || LANGUAGE_OPTIONS[0];

    const currentBadge = activeOption.value === 'zh-CN'
      ? 'ZH'
      : activeOption.value === 'en-US'
        ? 'EN'
        : 'AUTO';

    return (
      <div ref={containerRef} className={`relative inline-block ${className}`.trim()}>
        {open && (
          <div className="absolute bottom-14 right-0 z-[100] min-w-[140px] overflow-hidden border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 p-1 rounded-sm">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
              {t('language.switcher')}
            </div>
            {LANGUAGE_OPTIONS.map((option) => {
              const active = localeMode === option.value || (!localeMode && locale === option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLocale(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-bold transition-colors rounded-sm ${
                    active
                      ? 'bg-endfield-yellow text-black'
                      : 'text-slate-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{t(`language.option.${option.key}`)}</span>
                  {active && <span className="text-[10px] font-black">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="relative inline-flex h-12 w-12 items-center justify-center border border-zinc-300 bg-white text-slate-700 shadow-xl transition-colors hover:border-endfield-yellow hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          aria-label={t('language.switcher')}
          title={t('language.switcher')}
        >
          <Globe size={19} />
          <span className="absolute -bottom-1 -right-1 border border-zinc-300 bg-endfield-yellow px-1 text-[9px] font-black leading-3 text-black dark:border-zinc-800">
            {currentBadge}
          </span>
        </button>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`inline-flex items-center rounded-full border border-zinc-200/80 bg-white/80 p-0.5 backdrop-blur-md dark:border-white/10 dark:bg-black/30 ${className}`.trim()}>
        {LANGUAGE_OPTIONS.map((option) => {
          const active = localeMode === option.value || (!localeMode && locale === option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocale(option.value)}
              className={`min-w-[42px] rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
                active
                  ? 'bg-endfield-yellow text-black shadow-[0_6px_18px_rgba(255,250,0,0.2)]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title={t(`language.option.${option.key}`)}
              aria-label={t(`language.option.${option.key}`)}
            >
              {t(`language.option.${option.key}`)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className={`flex items-center gap-1 ${compact ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400`}>
        <Globe size={compact ? 12 : 14} />
        {!compact && <span>{t('language.switcher')}</span>}
      </div>

      <div className="inline-flex items-center rounded-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
        {LANGUAGE_OPTIONS.map((option) => {
          const active = localeMode === option.value || (!localeMode && locale === option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocale(option.value)}
              className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                active
                  ? 'bg-endfield-yellow text-black'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={t(`language.option.${option.key}`)}
            >
              {t(`language.option.${option.key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(LocaleSwitcher);
