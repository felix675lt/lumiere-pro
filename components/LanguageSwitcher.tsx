import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'ko', label: 'KR' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JP' },
    { code: 'ru', label: 'RU' },
    { code: 'zh', label: 'CN' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg">
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <div className="flex gap-1.5">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`px-1.5 py-0.5 rounded-full transition-all duration-200 ${i18n.language.startsWith(lang.code)
                            ? 'text-gold-400 bg-gold-500/20 font-bold'
                            : 'text-white/50 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
