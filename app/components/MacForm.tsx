'use client'

import { useState, useEffect, useRef } from 'react'
import { Info, Pencil, Check, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function MacForm() {
    const [mac, setMac] = useState('')
    const [name, setName] = useState('')
    const [parts, setParts] = useState(['', '', '', '', '', ''])
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const pathname = usePathname()
    const isEnglish = pathname?.startsWith('/en')
    const partInputs = useRef<(HTMLInputElement | null)[]>([])
    const nameInputRef = useRef<HTMLInputElement>(null)
    const fullMacInputRef = useRef<HTMLInputElement>(null)

    // Editing states
    const [editingField, setEditingField] = useState<'name' | 'full' | number | null>(null)

    // Handle focus when editing starts
    useEffect(() => {
        if (editingField === 'name') {
            nameInputRef.current?.focus()
            nameInputRef.current?.select()
        } else if (editingField === 'full') {
            fullMacInputRef.current?.focus()
            fullMacInputRef.current?.select()
        } else if (typeof editingField === 'number') {
            partInputs.current[editingField]?.focus()
            partInputs.current[editingField]?.select()
        }
    }, [editingField])

    useEffect(() => {
        const checkVisibility = () => {
            const saved = localStorage.getItem('config-show-countdown')
            setIsVisible(saved !== 'false')
        }
        checkVisibility()
        window.addEventListener('config-update', checkVisibility)
        return () => window.removeEventListener('config-update', checkVisibility)
    }, [])

    useEffect(() => {
        setMounted(true)
        const savedMac = localStorage.getItem('mac-address-viewer')
        const savedName = localStorage.getItem('mac-address-name')
        if (savedName) setName(savedName)
        if (savedMac) {
            setMac(savedMac)
            const cleanSaved = savedMac.replace(/[^0-9A-F]/gi, '')
            setMac(cleanSaved)
            const newParts = ['', '', '', '', '', '']
            for (let i = 0; i < 6; i++) {
                newParts[i] = cleanSaved.slice(i * 2, (i * 2) + 2)
            }
            setParts(newParts)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('mac-address-viewer', mac)
        localStorage.setItem('mac-address-name', name)
    }, [mac, name, mounted])

    const handleFullMacChange = (val: string) => {
        const clean = val.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 12)
        setMac(clean)

        const newParts = ['', '', '', '', '', '']
        for (let i = 0; i < 6; i++) {
            newParts[i] = clean.slice(i * 2, (i * 2) + 2)
        }
        setParts(newParts)
    }

    const handlePartChange = (index: number, val: string) => {
        const clean = val.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 2)
        const newParts = [...parts]
        newParts[index] = clean
        setParts(newParts)

        const newFullMac = newParts.join('')
        setMac(newFullMac)

        if (clean.length === 2 && index < 5) {
            partInputs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !parts[index] && index > 0) {
            partInputs.current[index - 1]?.focus()
        }
    }

    const handleCopy = () => {
        const macWithColons = parts.join(':')
        handleCopyText(macWithColons)
    }

    const handleCopyText = (text: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClear = () => {
        setMac('')
        setName('')
        setParts(['', '', '', '', '', ''])
    }

    if (!mounted) return null

    return (
        <div className={`fixed right-9 top-48 z-40 hidden lg:flex flex-col gap-4 w-72 transition-all duration-500 animate-in fade-in slide-in-from-right-4 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'}`}>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-5 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 hover:shadow-indigo-500/10 transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Info size={18} />
                        </div>
                        {isEnglish ? 'Useful Info' : 'Información Útil'}
                    </h3>
                    <div className="flex gap-1">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer group relative"
                            title={isEnglish ? 'Copy with colons' : 'Copiar con :'}
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Pencil size={14} />}
                        </button>
                        <button
                            onClick={handleClear}
                            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title={isEnglish ? 'Clear' : 'Limpiar'}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Full MAC Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 overflow-hidden w-full">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                    {isEnglish ? 'NAME:' : 'NOMBRE:'}
                                </label>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onClick={() => {
                                        if (editingField !== 'name') {
                                            handleCopyText(name)
                                        }
                                    }}
                                    onDoubleClick={() => setEditingField('name')}
                                    onBlur={() => setEditingField(null)}
                                    readOnly={editingField !== 'name'}
                                    placeholder={isEnglish ? 'Device...' : 'Dispositivo...'}
                                    className={`bg-transparent border-none p-0 text-[10px] font-bold text-indigo-500 uppercase tracking-wider outline-none w-full placeholder:text-zinc-300 dark:placeholder:text-zinc-700 cursor-pointer ${editingField === 'name' ? 'ring-1 ring-indigo-500/30 rounded px-1' : ''}`}
                                />
                            </div>
                        </div>
                        <input
                            ref={fullMacInputRef}
                            type="text"
                            value={mac}
                            onChange={(e) => handleFullMacChange(e.target.value)}
                            onClick={() => {
                                if (editingField !== 'full') {
                                    handleCopyText(mac)
                                }
                            }}
                            onDoubleClick={() => setEditingField('full')}
                            onBlur={() => setEditingField(null)}
                            readOnly={editingField !== 'full'}
                            placeholder="001A2B3C4D5E"
                            maxLength={12}
                            className={`w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer ${editingField === 'full' ? 'bg-white dark:bg-zinc-800 border-indigo-500' : ''}`}
                        />
                    </div>

                    {/* Individual Parts */}
                    <div className="flex items-center justify-between">
                        {parts.map((part, i) => (
                            <div key={i} className="flex items-center gap-0.5">
                                <input
                                    ref={el => { partInputs.current[i] = el }}
                                    type="text"
                                    value={part}
                                    maxLength={2}
                                    onChange={(e) => handlePartChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onClick={() => {
                                        if (editingField !== i) {
                                            handleCopyText(part)
                                        }
                                    }}
                                    onDoubleClick={() => setEditingField(i)}
                                    onBlur={() => setEditingField(null)}
                                    readOnly={editingField !== i}
                                    className={`w-8 h-8 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-md text-center text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-zinc-800 dark:text-zinc-200 p-0 cursor-pointer ${editingField === i ? 'bg-white dark:bg-zinc-800 border-indigo-500' : ''}`}
                                />
                                {i < 5 && <span className="text-zinc-400 dark:text-zinc-600 font-medium">:</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
