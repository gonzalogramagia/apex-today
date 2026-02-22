import { useState, useEffect } from "react";
import ConfigModal from "./ConfigModal";
import { Github, FileText, Wrench, Smile, BookCheck, Shovel, ClipboardClock, Zap } from "lucide-react";
import { dictionary, Language } from "../data/i18n";
import { usePathname, useRouter } from 'next/navigation';

interface FloatingLinksProps {
    lang: Language;
}

export default function FloatingLinks({ lang }: FloatingLinksProps) {
    const t = dictionary[lang];
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Persist modal state across language changes
    useEffect(() => {
        const saved = sessionStorage.getItem('config-modal-open');
        if (saved === 'true') setIsSettingsOpen(true);
    }, []);

    const setConfigOpen = (open: boolean) => {
        setIsSettingsOpen(open);
        sessionStorage.setItem('config-modal-open', String(open));
    };

    const router = useRouter();
    const pathname = usePathname();



    const exportPath = lang === 'en' ? '/export' : '/exportar';
    const importPath = lang === 'en' ? '/import' : '/importar';


    const toggleLanguage = () => {
        if (lang === 'en') {
            const newPath = pathname.replace('/en', '') || '/';
            router.push(newPath);
        } else {
            const newPath = `/en${pathname === '/' ? '' : pathname}`;
            router.push(newPath);
        }
    };

    return (
        <>
            {/* Right Side Buttons: Moovimiento */}
            <div className="fixed bottom-8 right-8 flex gap-3 z-[70]">

                <a
                    href="https://moovimiento.com"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label="Moovimiento"
                >
                    <Zap className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <ConfigModal
                    lang={lang}
                    onClose={() => setConfigOpen(false)}
                    toggleLanguage={toggleLanguage}
                    exportPath={exportPath}
                    importPath={importPath}
                />
            )}

            {/* Left Side Buttons */}
            <div className="fixed bottom-8 left-8 flex gap-3 z-50">
                {/* 1 - Botón Simple (Ej. Hoy) */}
                <div
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm opacity-50 cursor-not-allowed group"
                    aria-label="Hoy"
                >
                    <ClipboardClock className="w-6 h-6 text-zinc-900 dark:text-white" />
                </div>
                {/* 2 - Botón Emojis (Habilitado) */}
                <a
                    href="https://apex.milemojis.com"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label="Emojis"
                >
                    <Smile className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
                {/* 3 - Botón Expansible (Ej. Scripting) - Fíjate en la clase 'peer' */}
                <a
                    href="https://apex-private.onrender.com"
                    className="peer group flex items-center p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer"
                    aria-label="Scripting"
                >
                    <BookCheck className="w-6 h-6 shrink-0 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />

                    {/* Texto que aparece en hover */}
                    <span className="text-sm font-semibold max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 group-hover:text-yellow-500">
                        Ir al Scripting
                    </span>
                </a>
                {/* 4 - Botón que se contrae (Ej. Antipala) - Fíjate en los 'peer-hover:...' */}
                <a
                    href="https://apex.antipala.pro"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 peer-hover:w-0 peer-hover:p-0 peer-hover:border-0 peer-hover:opacity-0 peer-hover:ml-[-12px] group cursor-pointer flex items-center justify-center shrink-0"
                    aria-label="Antipala"
                >
                    <Shovel className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
            </div>
        </>
    );
}

