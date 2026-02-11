import { useState, useEffect } from "react";
import ConfigModal from "./ConfigModal";
import { Github, FileText, Wrench } from "lucide-react";
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
            {/* Right Side Buttons: Config / Github */}
            <div className="fixed bottom-8 right-8 flex gap-3 z-[70]">
                {isSettingsOpen ? (
                    <a
                        href="https://github.com/gonzalogramagia/apex-today"
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                        aria-label={t.ariaGithub}
                        target="_blank"
                    >
                        <Github className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#6866D6] transition-colors" />
                    </a>
                ) : (
                    <button
                        onClick={() => setConfigOpen(true)}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                        aria-label="Configuration"
                    >
                        <Wrench className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#6866D6] transition-colors scale-x-[-1]" />
                    </button>
                )}
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

            {/* Left Side Button: Support Menu */}
            <div className="fixed bottom-8 left-8 z-30 transition-opacity duration-300">
                <a
                    href="https://apex-scripting.vercel.app"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group flex items-center justify-center cursor-pointer"
                    aria-label="Apex Scripting"
                    title="Apex Scripting"
                >
                    <FileText className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-[#6866D6] transition-colors" />
                </a>
            </div>
        </>
    );
}

