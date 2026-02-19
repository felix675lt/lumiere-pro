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
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Globe className="w-4 h-4" />
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`hover:text-white transition-colors ${i18n.language.startsWith(lang.code) ? 'text-white font-bold' : ''
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
