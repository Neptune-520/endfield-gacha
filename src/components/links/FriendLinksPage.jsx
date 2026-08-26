import React from 'react';
import FriendlyLinksCard from '../home/FriendlyLinksCard';
import { useI18n } from '../../i18n/index.js';

export default function FriendLinksPage() {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t('home.friendlyLinks.title', {}, '友情链接')}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono tracking-wider">
          FRIENDLY LINKS & COMMUNITY RESOURCES
        </p>
      </div>

      <div className="min-h-[400px]">
        <FriendlyLinksCard />
      </div>
    </div>
  );
}
