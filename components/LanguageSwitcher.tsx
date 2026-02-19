import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => i18n.language.startsWith(l.code)) || languages[0];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/20 hover:border-gold-500/50 hover:bg-white/5 transition-all duration-200 group"
                aria-label="Language"
            >
                <Globe className="w-4 h-4 text-gold-400 group-hover:text-gold-300 transition-colors" />
                <span className="text-[11px] text-white/70 uppercase tracking-wider font-medium group-hover:text-white transition-colors">
                    {currentLang.flag}
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/60 rounded-lg shadow-2xl shadow-black/50 overflow-hidden animate-fade-in min-w-[160px]">
                    <div className="px-3 py-2 border-b border-neutral-800">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Language</p>
                    </div>
                    {languages.map((lang) => {
                        const isActive = i18n.language.startsWith(lang.code);
                        return (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all duration-150 text-sm
                                    ${isActive
                                        ? 'bg-gold-500/15 text-gold-400'
                                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span className="font-medium">{lang.label}</span>
                                {isActive && (
                                    <span className="ml-auto text-[10px] text-gold-500 uppercase tracking-wider">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
