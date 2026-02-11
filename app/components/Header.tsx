'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
    lang: 'es' | 'en'
    onAddNote?: () => void
    addNoteText?: string
    title?: string
    mobileAddText?: string
}

export default function Header({ lang, onAddNote, addNoteText, title, mobileAddText }: HeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [showClock, setShowClock] = useState(true)

    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const checkVisibility = () => {
            const saved = localStorage.getItem('config-show-clock')
            setShowClock(saved !== 'false')
        }

        checkVisibility()
        window.addEventListener('config-update', checkVisibility)
        return () => window.removeEventListener('config-update', checkVisibility)
    }, [])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const formatDate = (date: Date) => {
        if (lang === 'es') {
            const weekday = date.toLocaleDateString('es-AR', { weekday: 'long' })
            const day = date.getDate()
            const month = date.toLocaleDateString('es-AR', { month: 'long' })
            const year = date.getFullYear()

            // Capitalize first letter of weekday and month
            const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
            const capMonth = month.charAt(0).toUpperCase() + month.slice(1)

            return `${capWeekday} ${day} de ${capMonth} (${year})`
        }

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (!currentTime) return null

    return (
        <div className={`flex flex-col ${showClock ? 'lg:flex-row lg:mb-6 lg:gap-0' : 'lg:mb-20'} items-center justify-center gap-8 -mt-5 lg:-mt-24 -mb-4`}>
            {/* Image - Visible on all screens. On mobile it stands alone (replacing clock/calendar which is hidden) */}
            <img
                src="/logo-apex-clean.png"
                alt="Apex"
                onClick={onAddNote}
                className={`w-64 lg:w-72 h-auto object-contain select-none hover:scale-105 transition-transform duration-300 ${onAddNote ? 'cursor-pointer' : ''}`}
            />

            {/* Desktop Content */}
            {showClock ? (
                /* Clock + Add Button Container - Visible on Desktop when clock is enabled */
                <div className="hidden lg:flex flex-col items-start justify-center gap-2 -mt-4 -ml-3 animate-in fade-in slide-in-from-top-4 duration-500 transition-opacity">
                    <div className="flex flex-col items-start justify-start">
                        <span className="text-6xl font-black font-mono tracking-tighter text-zinc-900 leading-none cursor-default select-none">
                            {formatTime(currentTime)}
                        </span>
                        <span className="text-lg text-zinc-500 font-medium cursor-default select-none">
                            {formatDate(currentTime)}
                        </span>
                    </div>

                    {onAddNote && (
                        <button
                            onClick={onAddNote}
                            className="px-6 py-2 bg-[#6866D6] text-white text-sm font-medium rounded-full hover:bg-[#5856c4] transition-all hover:scale-105 shadow-md cursor-pointer min-w-[200px]"
                        >
                            {addNoteText || "Agregar otra nota +"}
                        </button>
                    )}
                </div>
            ) : (
                /* Title + Small Button - Visible on Desktop when clock is disabled (mimics mobile layout) */
                <div className="hidden lg:flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 -mt-20">
                    <h1 className="text-2xl font-bold tracking-tighter text-black dark:text-white">
                        📝
                        <span className="ml-3">{title}</span>
                    </h1>
                    {onAddNote && (
                        <button
                            onClick={onAddNote}
                            className="px-3 py-1 bg-[#6866D6] text-white text-sm rounded hover:bg-[#5856c4] transition-colors cursor-pointer"
                        >
                            {mobileAddText || "Agregar +"}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
