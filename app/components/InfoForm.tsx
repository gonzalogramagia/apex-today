'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil, Check, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function InfoForm() {
    const [clientName, setClientName] = useState('')
    const [productId, setProductId] = useState('')
    const [mac, setMac] = useState('')
    const [name, setName] = useState('')
    const [cuit, setCuit] = useState('')
    const [address, setAddress] = useState('')
    const [parts, setParts] = useState(['', '', '', '', '', ''])

    // Ticket State
    const [ticketId, setTicketId] = useState('')
    const [ticketingSystem, setTicketingSystem] = useState('')

    const [mounted, setMounted] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const pathname = usePathname()
    const isEnglish = pathname?.startsWith('/en')

    const partInputs = useRef<(HTMLInputElement | null)[]>([])
    const clientNameInputRef = useRef<HTMLInputElement>(null)
    const productIdInputRef = useRef<HTMLInputElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)
    const cuitInputRef = useRef<HTMLInputElement>(null)
    const addressInputRef = useRef<HTMLInputElement>(null)
    const fullMacInputRef = useRef<HTMLInputElement>(null)

    // Ticket Refs
    const ticketIdInputRef = useRef<HTMLInputElement>(null)
    const ticketingSystemInputRef = useRef<HTMLInputElement>(null)

    // Editing states
    const [editingField, setEditingField] = useState<'clientName' | 'productId' | 'name' | 'full' | 'cuit' | 'address' | 'ticketId' | 'ticketingSystem' | number | null>(null)

    // Handle focus when editing starts
    useEffect(() => {
        if (editingField === 'clientName') {
            clientNameInputRef.current?.focus()
            clientNameInputRef.current?.select()
        } else if (editingField === 'productId') {
            productIdInputRef.current?.focus()
            productIdInputRef.current?.select()
        } else if (editingField === 'name') {
            nameInputRef.current?.focus()
            nameInputRef.current?.select()
        } else if (editingField === 'full') {
            fullMacInputRef.current?.focus()
            fullMacInputRef.current?.select()
        } else if (editingField === 'cuit') {
            cuitInputRef.current?.focus()
            cuitInputRef.current?.select()
        } else if (editingField === 'address') {
            addressInputRef.current?.focus()
            addressInputRef.current?.select()
        } else if (typeof editingField === 'number') {
            partInputs.current[editingField]?.focus()
            partInputs.current[editingField]?.select()
        } else if (editingField === 'ticketId') {
            ticketIdInputRef.current?.focus()
            ticketIdInputRef.current?.select()
        } else if (editingField === 'ticketingSystem') {
            ticketingSystemInputRef.current?.focus()
            ticketingSystemInputRef.current?.select()
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
        const savedClientName = localStorage.getItem('info-client-name')
        const savedProductId = localStorage.getItem('info-product-id')
        const savedMac = localStorage.getItem('mac-address-viewer')
        const savedName = localStorage.getItem('mac-address-name')
        const savedCuit = localStorage.getItem('info-cuit')
        const savedAddress = localStorage.getItem('info-address')
        const savedTicketId = localStorage.getItem('info-ticket-id')
        const savedTicketingSystem = localStorage.getItem('info-ticketing-system')

        if (savedClientName) setClientName(savedClientName)
        if (savedProductId) setProductId(savedProductId)
        if (savedTicketId) setTicketId(savedTicketId)
        if (savedTicketingSystem) setTicketingSystem(savedTicketingSystem)
        if (savedName) setName(savedName)
        if (savedCuit) setCuit(savedCuit)
        if (savedAddress) setAddress(savedAddress)

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
        localStorage.setItem('info-client-name', clientName)
        localStorage.setItem('info-product-id', productId)
        localStorage.setItem('mac-address-viewer', mac)
        localStorage.setItem('mac-address-name', name)
        localStorage.setItem('info-cuit', cuit)
        localStorage.setItem('info-address', address)
        localStorage.setItem('info-ticket-id', ticketId)
        localStorage.setItem('info-ticketing-system', ticketingSystem)
    }, [clientName, productId, mac, name, cuit, address, ticketId, ticketingSystem, mounted])

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
        handleCopyText(macWithColons, 'header')
    }

    const handleCopyText = (text: string, field: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const handleClear = () => {
        setClientName('')
        setProductId('')
        setMac('')
        setName('')
        setCuit('')
        setAddress('')
        setParts(['', '', '', '', '', ''])
        setTicketId('')
        setTicketingSystem('')
    }

    const CopiedMessage = () => (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
            {isEnglish ? 'Copied!' : 'Copiado!'}
            <Check size={12} className="text-green-500" />
        </span>
    )

    if (!mounted) return null

    return (
        <div className={`fixed right-9 top-24 z-40 hidden lg:flex flex-col gap-4 w-72 transition-all duration-500 animate-in fade-in slide-in-from-right-4 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'}`}>
            {/* Info Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-5 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 hover:shadow-indigo-500/10 transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        {isEnglish ? 'Useful Info' : 'Información Útil'}
                    </h3>
                    <div className="flex gap-1">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer group relative"
                            title={isEnglish ? 'Copy with colons' : 'Copiar con :'}
                        >
                            {copiedField === 'header' ? <Check size={14} className="text-green-500" /> : <Pencil size={14} />}
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

                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Client Name Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                {isEnglish ? 'CLIENT NAME:' : 'NOMBRE DEL CLIENTE:'}
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                ref={clientNameInputRef}
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                onClick={(e) => {
                                    if (editingField !== 'clientName') {
                                        if (!clientName) {
                                            setEditingField('clientName')
                                            return
                                        }
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopyText(clientName, 'clientName')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('clientName')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'clientName'}
                                placeholder={isEnglish ? 'Client name...' : 'Nombre del cliente...'}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'clientName'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'clientName' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'clientName' && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {isEnglish ? 'Copied!' : 'Copiado!'}
                                    <Check size={12} className="text-green-500" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ticket ID Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 overflow-hidden w-full relative">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                    {isEnglish ? 'TICKET:' : 'TICKET:'}
                                </label>
                                <input
                                    ref={ticketingSystemInputRef}
                                    type="text"
                                    value={ticketingSystem}
                                    onChange={(e) => setTicketingSystem(e.target.value)}
                                    onClick={() => {
                                        if (editingField !== 'ticketingSystem') {
                                            if (!ticketingSystem) {
                                                setEditingField('ticketingSystem')
                                                return
                                            }
                                            handleCopyText(ticketingSystem, 'ticketingSystem')
                                        }
                                    }}
                                    onDoubleClick={() => setEditingField('ticketingSystem')}
                                    onBlur={() => setEditingField(null)}
                                    readOnly={editingField !== 'ticketingSystem'}
                                    placeholder={isEnglish ? 'System...' : 'Sistema...'}
                                    className={`bg-transparent border border-transparent p-0 text-[10px] font-bold text-indigo-500 uppercase tracking-wider outline-none w-full placeholder:text-zinc-300 dark:placeholder:text-zinc-700 cursor-pointer transition-all rounded px-1
                                        ${editingField === 'ticketingSystem'
                                            ? 'bg-white dark:bg-zinc-800 ring-2 ring-indigo-500/20 shadow-sm border-transparent'
                                            : `hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${copiedField === 'ticketingSystem' ? 'border-green-500 text-green-600 dark:text-green-500' : ''}`}`
                                    }
                                />
                                {copiedField === 'ticketingSystem' && (
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold text-green-600 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded shadow-sm border border-green-100 dark:border-green-900/50">
                                        {isEnglish ? 'Copied!' : 'Copiado!'}
                                        <Check size={10} className="text-green-500" />
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                ref={ticketIdInputRef}
                                type="text"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                onClick={(e) => {
                                    if (editingField !== 'ticketId') {
                                        if (!ticketId) {
                                            setEditingField('ticketId')
                                            return
                                        }
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopyText(ticketId, 'ticketId')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('ticketId')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'ticketId'}
                                placeholder={isEnglish ? 'Ticket ID...' : 'ID de ticket...'}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'ticketId'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'ticketId' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'ticketId' && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {isEnglish ? 'Copied!' : 'Copiado!'}
                                    <Check size={12} className="text-green-500" />
                                </span>
                            )}
                        </div>
                    </div>



                    {/* CUIT Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                CUIT:
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                ref={cuitInputRef}
                                type="text"
                                value={cuit}
                                onChange={(e) => setCuit(e.target.value)}
                                onClick={(e) => {
                                    if (editingField !== 'cuit') {
                                        if (!cuit) {
                                            setEditingField('cuit')
                                            return
                                        }
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopyText(cuit, 'cuit')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('cuit')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'cuit'}
                                placeholder="20-12345678-9"
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'cuit'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'cuit' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'cuit' && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {isEnglish ? 'Copied!' : 'Copiado!'}
                                    <Check size={12} className="text-green-500" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Address Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                {isEnglish ? 'ADDRESS:' : 'DOMICILIO:'}
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                ref={addressInputRef}
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onClick={(e) => {
                                    if (editingField !== 'address') {
                                        if (!address) {
                                            setEditingField('address')
                                            return
                                        }
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopyText(address, 'address')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('address')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'address'}
                                placeholder={isEnglish ? 'Street 123...' : 'Calle 123...'}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'address'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'address' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'address' && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {isEnglish ? 'Copied!' : 'Copiado!'}
                                    <Check size={12} className="text-green-500" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product ID Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex-shrink-0">
                                {isEnglish ? 'PRODUCT ID:' : 'ID DE PRODUCTO:'}
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                ref={productIdInputRef}
                                type="text"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                onClick={(e) => {
                                    if (editingField !== 'productId') {
                                        if (!productId) {
                                            setEditingField('productId')
                                            return
                                        }
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopyText(productId, 'productId')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('productId')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'productId'}
                                placeholder={isEnglish ? 'Product ID...' : 'ID de producto...'}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'productId'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'productId' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'productId' && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-900 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {isEnglish ? 'Copied!' : 'Copiado!'}
                                    <Check size={12} className="text-green-500" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Full MAC Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 overflow-hidden w-full relative">
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
                                            if (!name) {
                                                setEditingField('name')
                                                return
                                            }
                                            handleCopyText(name, 'name')
                                        }
                                    }}
                                    onDoubleClick={() => setEditingField('name')}
                                    onBlur={() => setEditingField(null)}
                                    readOnly={editingField !== 'name'}
                                    placeholder={isEnglish ? 'Device...' : 'Dispositivo...'}
                                    className={`bg-transparent border border-transparent p-0 text-[10px] font-bold text-indigo-500 uppercase tracking-wider outline-none w-full placeholder:text-zinc-300 dark:placeholder:text-zinc-700 cursor-pointer transition-all rounded px-1
                                        ${editingField === 'name'
                                            ? 'bg-white dark:bg-zinc-800 ring-2 ring-indigo-500/20 shadow-sm border-transparent'
                                            : `hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${copiedField === 'name' ? 'border-green-500 text-green-600 dark:text-green-500' : ''}`}`
                                    }
                                />
                                {copiedField === 'name' && (
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold text-green-600 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded shadow-sm border border-green-100 dark:border-green-900/50">
                                        {isEnglish ? 'Copied!' : 'Copiado!'}
                                        <Check size={10} className="text-green-500" />
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                ref={fullMacInputRef}
                                type="text"
                                value={mac}
                                onChange={(e) => handleFullMacChange(e.target.value)}
                                onClick={() => {
                                    if (editingField !== 'full') {
                                        if (!mac) {
                                            setEditingField('full')
                                            return
                                        }
                                        handleCopyText(mac, 'full')
                                    }
                                }}
                                onDoubleClick={() => setEditingField('full')}
                                onBlur={() => setEditingField(null)}
                                readOnly={editingField !== 'full'}
                                placeholder="001A2B3C4D5E"
                                maxLength={12}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 cursor-pointer 
                                    ${editingField === 'full'
                                        ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]'
                                        : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'full' ? 'border-green-500 text-green-600 dark:text-green-400' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                    }`}
                            />
                            {copiedField === 'full' && <CopiedMessage />}
                        </div>
                    </div>

                    {/* Individual Parts */}
                    <div className="flex items-center justify-between">
                        {parts.map((part, i) => (
                            <div key={i} className="flex items-center gap-0.5">
                                <div className="relative">
                                    <input
                                        ref={el => { partInputs.current[i] = el }}
                                        type="text"
                                        value={part}
                                        maxLength={2}
                                        onChange={(e) => handlePartChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        onClick={(e) => {
                                            if (editingField !== i) {
                                                if (!part) {
                                                    setEditingField(i)
                                                    return
                                                }
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleCopyText(parts.join(':'), 'parts')
                                            }
                                        }}
                                        onDoubleClick={() => setEditingField(i)}
                                        onBlur={() => setEditingField(null)}
                                        readOnly={editingField !== i}
                                        className={`w-8 h-8 rounded-md text-center text-xs font-mono outline-none transition-all text-zinc-800 dark:text-zinc-200 p-0 cursor-pointer 
                                            ${editingField === i
                                                ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-110 z-10'
                                                : `bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 ${copiedField === 'parts' ? 'border-green-500 text-green-600 dark:text-green-400 scale-105' : 'hover:border-indigo-300 dark:hover:border-indigo-700/50'}`
                                            }`}
                                    />
                                    {copiedField === 'parts' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-zinc-800 border border-green-300 dark:border-green-700 rounded-md text-green-600 font-bold z-20 pointer-events-none animate-in zoom-in-50 duration-200 scale-105 shadow-sm">
                                            {['C', 'O', 'P', 'I', 'E', 'D'][i]}
                                        </div>
                                    )}
                                </div>
                                {i < 5 && <span className="text-zinc-400 dark:text-zinc-600 font-medium">:</span>}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

