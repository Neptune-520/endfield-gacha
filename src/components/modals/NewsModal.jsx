import React, { useState, useMemo } from 'react';
import { X, Megaphone, ExternalLink, Calendar } from 'lucide-react';
import { useAppStore } from '../../stores';
import { useI18n, formatAppDateTime } from '../../i18n/index.js';
import AnnouncementContent from '../home/AnnouncementContent.jsx';
import { getLocalizedAnnouncementContent, getLocalizedAnnouncementTitle } from '../../utils/announcementLocale.js';
import { STORAGE_KEYS, markAsViewed } from '../../utils/storageUtils.js';

export default function NewsModal({ open, onClose, hasNewAnnouncement, setHasNewAnnouncement }) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState('official'); // 'official' | 'site'
  const [selectedOfficialId, setSelectedOfficialId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  const siteAnnouncements = useAppStore((state) => state.announcements || []);
  const gameAnnouncements = useAppStore((state) => state.gameAnnouncements || []);

  const officialList = useMemo(() => {
    return Array.isArray(gameAnnouncements) ? gameAnnouncements : [];
  }, [gameAnnouncements]);

  const siteList = useMemo(() => {
    return Array.isArray(siteAnnouncements) ? siteAnnouncements : [];
  }, [siteAnnouncements]);

  const currentOfficial = useMemo(() => {
    if (!officialList.length) return null;
    return officialList.find((item) => (item.source_id || item.id) === selectedOfficialId) || officialList[0];
  }, [officialList, selectedOfficialId]);

  const currentSite = useMemo(() => {
    if (!siteList.length) return null;
    return siteList.find((item) => item.id === selectedSiteId) || siteList[0];
  }, [siteList, selectedSiteId]);

  const currentItem = activeTab === 'official' ? currentOfficial : currentSite;
  const currentList = activeTab === 'official' ? officialList : siteList;

  if (!open) return null;

  const handleClose = () => {
    if (hasNewAnnouncement && setHasNewAnnouncement) {
      markAsViewed(STORAGE_KEYS.ANNOUNCEMENT_LAST_VIEWED);
      setHasNewAnnouncement(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-[92vw] max-w-[1100px] h-[65vh] min-h-[480px] max-h-[750px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-md flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="h-14 px-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/50 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm sm:text-base mr-2">
              <Megaphone className="w-5 h-5 text-amber-500 dark:text-endfield-yellow" />
              <span>{t('news.modalTitle', {}, '公告新闻')}</span>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center p-0.5 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-sm">
              <button
                type="button"
                onClick={() => setActiveTab('official')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                  activeTab === 'official'
                    ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-endfield-yellow shadow-sm font-black'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {t('news.tab.official', {}, '官方公告')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('site')}
                className={`relative px-3.5 py-1.5 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                  activeTab === 'site'
                    ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-endfield-yellow shadow-sm font-black'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <span>{t('news.tab.site', {}, '本站公告')}</span>
                {hasNewAnnouncement && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={t('common.close', {}, '关闭')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Title List */}
          <div className="w-64 sm:w-80 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto shrink-0 bg-zinc-50/50 dark:bg-zinc-950/40 p-2 sm:p-3 space-y-1.5 scrollbar-thin">
            {currentList.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-400">{t('news.emptyList', {}, '暂无公告')}</div>
            ) : (
              currentList.map((item) => {
                const itemId = activeTab === 'official' ? (item.source_id || item.id) : item.id;
                const isSelected = currentItem && (activeTab === 'official' ? (currentItem.source_id || currentItem.id) === itemId : currentItem.id === itemId);
                const title = getLocalizedAnnouncementTitle(item, locale) || item.title || t('news.untitled', {}, '无标题');
                const publishDate = item.published_at || item.created_at || item.updated_at;

                return (
                  <button
                    key={itemId}
                    type="button"
                    onClick={() => {
                      if (activeTab === 'official') setSelectedOfficialId(itemId);
                      else setSelectedSiteId(itemId);
                    }}
                    className={`w-full text-left p-2.5 rounded-sm transition-all cursor-pointer flex flex-col gap-1 border ${
                      isSelected
                        ? 'border-amber-400 dark:border-endfield-yellow/50 bg-amber-50/80 dark:bg-endfield-yellow/10 text-slate-900 dark:text-white shadow-sm'
                        : 'border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-amber-600 dark:text-endfield-yellow font-black' : ''}`}>
                        {title}
                      </span>
                    </div>
                    {publishDate && (
                      <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{formatAppDateTime(new Date(publishDate), locale, { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-900 flex flex-col scrollbar-thin">
            {currentItem ? (
              <div className="max-w-3xl space-y-4">
                {/* Announcement Title & Meta */}
                <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {getLocalizedAnnouncementTitle(currentItem, locale) || currentItem.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {(currentItem.published_at || currentItem.created_at) && (
                      <div className="flex items-center gap-1 text-[11px] font-mono">
                        <Calendar size={12} className="text-amber-500 dark:text-endfield-yellow" />
                        <span>{formatAppDateTime(new Date(currentItem.published_at || currentItem.created_at), locale)}</span>
                      </div>
                    )}
                    {currentItem.source_url && (
                      <a
                        href={currentItem.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-endfield-yellow hover:underline"
                      >
                        <span>{t('news.originalLink', {}, '原网页链接')}</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Announcement Content */}
                <div className="text-sm text-slate-800 dark:text-zinc-200 leading-relaxed">
                  <AnnouncementContent content={getLocalizedAnnouncementContent(currentItem, locale) || currentItem.content || ''} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-400">
                {t('news.selectPrompt', {}, '请选择一条公告查看详情')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
