'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Counters() {
    const [mounted, setMounted] = useState(false)
    const [ticketsCount, setTicketsCount] = useState(0)
    const [llamadasCount, setLlamadasCount] = useState(0)
    const [emailsCount, setEmailsCount] = useState(0)
    const [whatsappsCount, setWhatsappsCount] = useState(0)

    const pathname = usePathname()
    const isEnglish = pathname?.startsWith('/en')

    useEffect(() => {
        setMounted(true)
        const savedTickets = localStorage.getItem('counter-tickets')
        const savedLlamadas = localStorage.getItem('counter-llamadas')
        const savedEmails = localStorage.getItem('counter-emails')
        const savedWhatsapps = localStorage.getItem('counter-whatsapps')
        if (savedTickets) setTicketsCount(parseInt(savedTickets))
        if (savedLlamadas) setLlamadasCount(parseInt(savedLlamadas))
        if (savedEmails) setEmailsCount(parseInt(savedEmails))
        if (savedWhatsapps) setWhatsappsCount(parseInt(savedWhatsapps))
    }, [])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('counter-tickets', ticketsCount.toString())
    }, [ticketsCount, mounted])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('counter-llamadas', llamadasCount.toString())
    }, [llamadasCount, mounted])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('counter-emails', emailsCount.toString())
    }, [emailsCount, mounted])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('counter-whatsapps', whatsappsCount.toString())
    }, [whatsappsCount, mounted])

    if (!mounted) return null

    const counters = [
        { key: 'tickets', label: 'Tickets', emoji: '🎫', value: ticketsCount, setter: setTicketsCount },
        { key: 'llamadas', label: 'Llamadas', emoji: '📞', value: llamadasCount, setter: setLlamadasCount },
        { key: 'emails', label: 'Emails', emoji: '📧', value: emailsCount, setter: setEmailsCount },
        { key: 'whatsapps', label: 'WhatsApps', emoji: '💬', value: whatsappsCount, setter: setWhatsappsCount },
    ]

    return (
        <div className="bg-white border border-zinc-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-zinc-900 text-sm flex items-center gap-2">
                    <span className="text-base">📊</span>
                    {isEnglish ? 'Counters' : 'Contador diario'}
                </h3>
                <button
                    onClick={() => {
                        setTicketsCount(0)
                        setLlamadasCount(0)
                        setEmailsCount(0)
                        setWhatsappsCount(0)
                    }}
                    className="text-[10px] font-bold text-zinc-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-red-50 /20"
                    title={isEnglish ? 'Reset all' : 'Resetear todo'}
                >
                    Reset
                </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {counters.map(({ key, label, emoji, value, setter }) => (
                    <div key={key} className="flex flex-col items-center gap-1 bg-zinc-50 /50 border border-zinc-200 /50 rounded-lg p-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                            <span>{emoji}</span> {label}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <button
                                onClick={() => setter(v => Math.max(0, v - 1))}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-zinc-200 text-zinc-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500 /20 transition-all text-sm font-bold cursor-pointer shadow-sm"
                                aria-label={`Decrementar ${label}`}
                            >
                                −
                            </button>
                            <span className="text-xl font-bold text-zinc-900 min-w-[2ch] text-center tabular-nums">
                                {value}
                            </span>
                            <button
                                onClick={() => setter(v => v + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-zinc-200 text-zinc-600 hover:bg-green-50 hover:border-green-300 hover:text-green-600 /20 transition-all text-sm font-bold cursor-pointer shadow-sm"
                                aria-label={`Incrementar ${label}`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
