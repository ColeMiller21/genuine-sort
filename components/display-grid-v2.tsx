'use client'
import Image from 'next/image'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useWalletInput } from './providers/wallet-input-provider'
import { OwnedNft } from 'alchemy-sdk'
import { Button } from '@/components/ui/button'
import { Icons } from './icons'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

type NFTAttribute = {
  trait_type: string
  value: string
}

type TraitFilters = {
  [category: string]: string[]
}

type SortConfig = {
  trait: string
  order: 'asc' | 'desc'
  customOrder: string[]
}

type GridSettings = {
  cardSize: number
  gap: number
  bgColor: string
  borderRadius: number
  showLabels: boolean
}

const MAIN_TRAITS = ['BACKGROUND', 'TYPES', 'EYEWEAR', 'FACE', 'HEADWEAR', 'TOPS']
const SORT_OPTIONS = ['Token ID', 'BACKGROUND', 'TYPES', 'EYEWEAR', 'FACE', 'HEADWEAR', 'TOPS']

export function DisplayGridV2({ gridRef }: { gridRef: React.RefObject<any> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<any>(null)
  
  const [expandedNft, setExpandedNft] = useState<OwnedNft | null>(null)
  const [activeFilterModal, setActiveFilterModal] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [traitFilters, setTraitFilters] = useState<TraitFilters>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({ trait: 'Token ID', order: 'asc', customOrder: [] })
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    cardSize: 100,
    gap: 8,
    bgColor: 'transparent',
    borderRadius: 12,
    showLabels: false
  })
  const [settingsBeforeEdit, setSettingsBeforeEdit] = useState<GridSettings | null>(null)

  const { ownedData } = useWalletInput()

  const processedNfts = useMemo(() => {
    let result = [...ownedData]

    if (Object.keys(traitFilters).length > 0) {
      result = result.filter((nft) => {
        const attributes = nft?.raw?.metadata?.attributes || []
        for (const [category, selectedValues] of Object.entries(traitFilters)) {
          if (selectedValues.length === 0) continue
          const nftAttr = attributes.find(
            (a: NFTAttribute) => a.trait_type?.toUpperCase() === category
          )
          if (!nftAttr || !selectedValues.includes(nftAttr.value)) return false
        }
        return true
      })
    }

    result.sort((a, b) => {
      if (sortConfig.trait === 'Token ID') {
        const aId = parseInt(a.tokenId) || 0
        const bId = parseInt(b.tokenId) || 0
        return sortConfig.order === 'asc' ? aId - bId : bId - aId
      }

      const aAttrs = a?.raw?.metadata?.attributes || []
      const bAttrs = b?.raw?.metadata?.attributes || []
      const aAttr = aAttrs.find((attr: NFTAttribute) => attr.trait_type?.toUpperCase() === sortConfig.trait)
      const bAttr = bAttrs.find((attr: NFTAttribute) => attr.trait_type?.toUpperCase() === sortConfig.trait)
      const aVal = aAttr?.value || ''
      const bVal = bAttr?.value || ''

      if (sortConfig.customOrder.length > 0) {
        const aIndex = sortConfig.customOrder.indexOf(aVal)
        const bIndex = sortConfig.customOrder.indexOf(bVal)
        const aInOrder = aIndex !== -1
        const bInOrder = bIndex !== -1
        if (aInOrder && bInOrder) return aIndex - bIndex
        if (aInOrder) return -1
        if (bInOrder) return 1
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

    return result
  }, [ownedData, traitFilters, sortConfig])

  const activeFilterCount = useMemo(() => {
    return Object.values(traitFilters).reduce((acc, vals) => acc + vals.length, 0)
  }, [traitFilters])

  useEffect(() => {
    if (!containerRef.current || processedNfts.length === 0) return
    let layout: any = null
    const init = async () => {
      try {
        if (!containerRef.current) return
        const { createLayout } = await import('animejs')
        layout = createLayout(containerRef.current as HTMLElement, { duration: 400, ease: 'outExpo' })
        layoutRef.current = layout
      } catch (err) {
        console.error('Failed to initialize anime.js layout:', err)
      }
    }
    init()
    return () => { if (layout?.revert) layout.revert() }
  }, [processedNfts.length])

  useEffect(() => {
    const animateChange = async () => {
      if (!containerRef.current) return
      try {
        const { animate, stagger } = await import('animejs')
        const cards = containerRef.current.querySelectorAll('.nft-card')
        if (cards.length === 0) return
        animate(cards, {
          opacity: [0, 1],
          scale: [0.85, 1],
          delay: stagger(20, { from: 'first' }),
          duration: 350,
          ease: 'outExpo'
        })
      } catch (err) {
        console.error('Animation failed:', err)
      }
    }
    animateChange()
  }, [traitFilters, sortConfig, ownedData])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (expandedNft) setExpandedNft(null)
        else if (activeFilterModal) setActiveFilterModal(null)
        else if (settingsOpen) setSettingsOpen(false)
        else if (sortModalOpen) setSortModalOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expandedNft, activeFilterModal, settingsOpen, sortModalOpen])

  const toggleTraitFilter = useCallback((category: string, value: string) => {
    setTraitFilters(prev => {
      const current = prev[category] || []
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      if (updated.length === 0) {
        const { [category]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [category]: updated }
    })
  }, [])

  const clearAllFilters = useCallback(() => setTraitFilters({}), [])
  const clearCategoryFilter = useCallback((category: string) => {
    setTraitFilters(prev => {
      const { [category]: _, ...rest } = prev
      return rest
    })
  }, [])

  const getAttributes = (nft: OwnedNft): NFTAttribute[] => nft?.raw?.metadata?.attributes || []

  const getAvailableTraits = useCallback((category: string) => {
    const traitsSet = new Set<string>()
    ownedData.forEach(nft => {
      const attributes = nft?.raw?.metadata?.attributes || []
      const attr = attributes.find((a: NFTAttribute) => a.trait_type?.toUpperCase() === category)
      if (attr?.value) traitsSet.add(attr.value)
    })
    return Array.from(traitsSet).sort()
  }, [ownedData])

  return (
    <div className="w-full lg:w-[90%] flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-3 md:p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">Filter:</span>
          <div className="flex flex-wrap gap-1.5">
            {MAIN_TRAITS.map(trait => {
              const count = traitFilters[trait]?.length || 0
              return (
                <button
                  key={trait}
                  className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide rounded-lg border transition-all ${
                    count > 0
                      ? 'bg-[#ff5277]/15 border-[#ff5277]/40 text-foreground'
                      : 'bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => setActiveFilterModal(trait)}
                >
                  <span>{trait}</span>
                  {count > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#ff5277] text-white rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-destructive hover:text-destructive">
              Clear ({activeFilterCount})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setSortModalOpen(true)}>
            <Icons.arrowLeft className="h-3 w-3 mr-1 -rotate-90" />
            Sort
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setSettingsBeforeEdit(gridSettings); setSettingsOpen(true) }}>
            <Icons.filter className="h-3 w-3 mr-1" />
            Grid
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-between items-center px-1 text-[13px] text-muted-foreground">
        <span>
          Showing <strong className="text-[#ff5277]">{processedNfts.length}</strong>
          {processedNfts.length !== ownedData.length && <span> of {ownedData.length}</span>} NFTs
        </span>
        <span className="text-xs">Sorted by {sortConfig.trait} ({sortConfig.order === 'asc' ? 'A→Z' : 'Z→A'})</span>
      </div>

      {/* Grid */}
      {processedNfts.length > 0 ? (
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (gridRef && 'current' in gridRef) (gridRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          className="grid gap-[var(--gap)] p-4 rounded-[var(--border-radius)] border border-border/30 min-h-[200px]"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(var(--card-size), 1fr))`,
            background: 'var(--bg-color)',
            '--card-size': `${gridSettings.cardSize}px`,
            '--gap': `${gridSettings.gap}px`,
            '--bg-color': gridSettings.bgColor,
            '--border-radius': `${gridSettings.borderRadius}px`
          } as React.CSSProperties}
          id="display-grid-v2"
        >
          {processedNfts.map((nft, i) => (
            <div
              key={nft.tokenId || i}
              className="nft-card relative aspect-square cursor-pointer rounded-lg overflow-hidden bg-muted transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(255,82,119,0.25)]"
              onClick={() => setExpandedNft(nft)}
            >
              <NFTCardContent nft={nft} showLabel={gridSettings.showLabels} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border">
          <Icons.image className="h-12 w-12 mb-3 opacity-40" />
          <p>No NFTs match your filters</p>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2">Clear Filters</Button>
        </div>
      )}

      {activeFilterModal && (
        <FilterModal
          category={activeFilterModal}
          availableTraits={getAvailableTraits(activeFilterModal)}
          selectedTraits={traitFilters[activeFilterModal] || []}
          onToggle={(value) => toggleTraitFilter(activeFilterModal, value)}
          onClear={() => clearCategoryFilter(activeFilterModal)}
          onClose={() => setActiveFilterModal(null)}
        />
      )}

      {sortModalOpen && (
        <SortModal
          sortConfig={sortConfig}
          onUpdate={setSortConfig}
          onClose={() => setSortModalOpen(false)}
          getAvailableTraits={getAvailableTraits}
        />
      )}

      {settingsOpen && (
        <SettingsModal 
          settings={gridSettings} 
          onPreview={setGridSettings}
          onConfirm={() => { setSettingsBeforeEdit(null); setSettingsOpen(false) }}
          onCancel={() => { if (settingsBeforeEdit) setGridSettings(settingsBeforeEdit); setSettingsBeforeEdit(null); setSettingsOpen(false) }}
        />
      )}

      {expandedNft && (
        <NFTModal nft={expandedNft} attributes={getAttributes(expandedNft)} onClose={() => setExpandedNft(null)} />
      )}
    </div>
  )
}

function NFTCardContent({ nft, showLabel }: { nft: OwnedNft; showLabel: boolean }) {
  const [retryKey, setRetryKey] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [errorCount, setErrorCount] = useState(0)

  const handleImageError = () => {
    if (errorCount < 3) {
      setErrorCount(prev => prev + 1)
      setRetryKey(prev => prev + 1)
    }
  }

  const imageSrc = nft.image.cachedUrl || nft.image.pngUrl || ''

  return (
    <>
      <Image
        key={retryKey}
        src={`${imageSrc}?retry=${retryKey}`}
        alt={nft?.name || `NFT #${nft.tokenId}`}
        fill
        quality={80}
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
        sizes="(max-width: 640px) 50vw, 150px"
        className="object-cover transition-opacity duration-300"
        style={{ opacity: imageLoaded ? 1 : 0 }}
      />
      {showLabel && (
        <div className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 bg-black/75 text-white rounded">
          #{nft.tokenId}
        </div>
      )}
    </>
  )
}

interface SortModalProps {
  sortConfig: SortConfig
  onUpdate: (config: SortConfig) => void
  onClose: () => void
  getAvailableTraits: (category: string) => string[]
}

function SortModal({ sortConfig, onUpdate, onClose, getAvailableTraits }: SortModalProps) {
  const [local, setLocal] = useState(sortConfig)
  const [availableSubtraits, setAvailableSubtraits] = useState<string[]>([])

  useEffect(() => {
    if (local.trait !== 'Token ID') {
      setAvailableSubtraits(getAvailableTraits(local.trait))
    } else {
      setAvailableSubtraits([])
    }
  }, [local.trait, getAvailableTraits])

  const handleTraitChange = (trait: string) => setLocal(s => ({ ...s, trait, customOrder: [] }))

  const toggleSubtraitOrder = (subtrait: string) => {
    setLocal(s => {
      const current = s.customOrder
      if (current.includes(subtrait)) return { ...s, customOrder: current.filter(t => t !== subtrait) }
      return { ...s, customOrder: [...current, subtrait] }
    })
  }

  const moveSubtrait = (index: number, direction: 'up' | 'down') => {
    setLocal(s => {
      const newOrder = [...s.customOrder]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= newOrder.length) return s
      const temp = newOrder[index]
      newOrder[index] = newOrder[newIndex]
      newOrder[newIndex] = temp
      return { ...s, customOrder: newOrder }
    })
  }

  const handleApply = () => { onUpdate(local); onClose() }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5">
        <div className="w-full max-w-[520px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-border/50">
            <h3 className="text-base font-bold">Sort NFTs</h3>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all">
              <Icons.close className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4 md:p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Sort By Trait</Label>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option}
                    className={`px-3 py-2 text-[13px] font-medium rounded-lg border transition-all ${
                      local.trait === option
                        ? 'bg-[#ff5277]/20 border-[#ff5277]/50 text-foreground'
                        : 'bg-muted/50 border-border/50 text-foreground hover:bg-muted'
                    }`}
                    onClick={() => handleTraitChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {local.trait !== 'Token ID' && availableSubtraits.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Custom Order</Label>
                  {local.customOrder.length > 0 && (
                    <button onClick={() => setLocal(s => ({ ...s, customOrder: [] }))} className="text-[11px] text-muted-foreground underline hover:text-destructive">
                      Clear
                    </button>
                  )}
                </div>
                
                {local.customOrder.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center p-2.5 bg-muted/30 rounded-lg">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1">Priority:</span>
                    {local.customOrder.map((subtrait, idx) => (
                      <div key={subtrait} className="flex items-center gap-1 px-2 py-1 bg-[#ff5277]/15 border border-[#ff5277]/30 rounded-md text-xs">
                        <span className="w-4 h-4 flex items-center justify-center bg-[#ff5277] text-white text-[10px] font-bold rounded-full">{idx + 1}</span>
                        <span className="font-medium">{subtrait}</span>
                        <div className="flex gap-0.5 ml-1">
                          <button onClick={() => moveSubtrait(idx, 'up')} disabled={idx === 0} className="w-4 h-4 flex items-center justify-center bg-muted rounded text-[10px] disabled:opacity-30 hover:bg-muted-foreground/30">↑</button>
                          <button onClick={() => moveSubtrait(idx, 'down')} disabled={idx === local.customOrder.length - 1} className="w-4 h-4 flex items-center justify-center bg-muted rounded text-[10px] disabled:opacity-30 hover:bg-muted-foreground/30">↓</button>
                          <button onClick={() => toggleSubtraitOrder(subtrait)} className="w-4 h-4 flex items-center justify-center bg-muted rounded text-[10px] hover:bg-destructive/20 hover:text-destructive">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto p-0.5">
                  {availableSubtraits.map(subtrait => {
                    const isSelected = local.customOrder.includes(subtrait)
                    const orderIndex = local.customOrder.indexOf(subtrait)
                    return (
                      <button
                        key={subtrait}
                        className={`relative px-2.5 py-2 text-xs font-medium text-left rounded-md border transition-all ${
                          isSelected
                            ? 'bg-[#ff5277]/15 border-[#ff5277]/40 pl-7'
                            : 'bg-muted/40 border-border/50 hover:bg-muted'
                        }`}
                        onClick={() => toggleSubtraitOrder(subtrait)}
                      >
                        {isSelected && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-[#ff5277] text-white text-[10px] font-bold rounded-full">
                            {orderIndex + 1}
                          </span>
                        )}
                        {subtrait}
                      </button>
                    )
                  })}
                </div>
                
                <p className="text-[11px] text-muted-foreground p-2 bg-muted/20 rounded-md">
                  {local.customOrder.length === 0 
                    ? 'Click subtraits to set priority order. Unselected items sort alphabetically.'
                    : `${local.customOrder.length} prioritized, rest sorted ${local.order === 'asc' ? 'A→Z' : 'Z→A'}`
                  }
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {local.trait === 'Token ID' ? 'Order' : 'Fallback Order'}
              </Label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-all ${
                    local.order === 'asc' ? 'bg-[#ff5277]/20 border-[#ff5277]/50' : 'bg-muted/50 border-border/50 hover:bg-muted'
                  }`}
                  onClick={() => setLocal(s => ({ ...s, order: 'asc' }))}
                >
                  {local.trait === 'Token ID' ? '1 → 9999' : 'A → Z'}
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-all ${
                    local.order === 'desc' ? 'bg-[#ff5277]/20 border-[#ff5277]/50' : 'bg-muted/50 border-border/50 hover:bg-muted'
                  }`}
                  onClick={() => setLocal(s => ({ ...s, order: 'desc' }))}
                >
                  {local.trait === 'Token ID' ? '9999 → 1' : 'Z → A'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 p-4 md:p-5 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleApply} className="bg-[#ff5277] hover:bg-[#e8486b]">Apply Sort</Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface FilterModalProps {
  category: string
  availableTraits: string[]
  selectedTraits: string[]
  onToggle: (value: string) => void
  onClear: () => void
  onClose: () => void
}

function FilterModal({ category, availableTraits, selectedTraits, onToggle, onClear, onClose }: FilterModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5">
        <div className="w-full max-w-[480px] max-h-[70vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-border/50">
            <h3 className="text-base font-bold">Filter by {category}</h3>
            <div className="flex items-center gap-2">
              {selectedTraits.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
              )}
              <button onClick={onClose} className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all">
                <Icons.close className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 p-4 md:p-5 overflow-y-auto flex-1">
            {availableTraits.map(trait => (
              <label
                key={trait}
                className={`flex items-center gap-2.5 p-2.5 md:p-3 rounded-lg border cursor-pointer text-[13px] transition-all ${
                  selectedTraits.includes(trait)
                    ? 'bg-[#ff5277]/10 border-[#ff5277]/40'
                    : 'bg-muted/30 border-border/30 hover:bg-muted/60'
                }`}
              >
                <Checkbox checked={selectedTraits.includes(trait)} onCheckedChange={() => onToggle(trait)} />
                <span>{trait}</span>
              </label>
            ))}
          </div>

          {availableTraits.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No {category} traits found</p>
          )}

          <div className="flex justify-between items-center p-4 md:p-5 border-t border-border/50">
            <span className="text-[13px] text-muted-foreground">{selectedTraits.length} selected</span>
            <Button onClick={onClose} className="bg-[#ff5277] hover:bg-[#e8486b]">Done</Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface SettingsModalProps {
  settings: GridSettings
  onPreview: (settings: GridSettings) => void
  onConfirm: () => void
  onCancel: () => void
}

function SettingsModal({ settings, onPreview, onConfirm, onCancel }: SettingsModalProps) {
  const updateSetting = <K extends keyof GridSettings>(key: K, value: GridSettings[K]) => {
    onPreview({ ...settings, [key]: value })
  }

  const bgColors = [
    { label: 'None', value: 'transparent' },
    { label: 'Dark', value: '#0a0a0a' },
    { label: 'Charcoal', value: '#1a1a1a' },
    { label: 'Navy', value: '#0f172a' },
    { label: 'Purple', value: '#1e1033' },
    { label: 'Light', value: '#f5f5f5' },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onCancel} />
      <div className="fixed bottom-4 right-4 z-[101]">
        <div className="w-[320px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="text-sm font-bold">Grid Settings</h3>
            <button onClick={onCancel} className="flex items-center justify-center w-7 h-7 bg-muted rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all">
              <Icons.close className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Card Size: {settings.cardSize}px</Label>
              <Slider value={[settings.cardSize]} min={60} max={180} step={5} onValueChange={([v]) => updateSetting('cardSize', v)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs">Gap: {settings.gap}px</Label>
              <Slider value={[settings.gap]} min={2} max={24} step={2} onValueChange={([v]) => updateSetting('gap', v)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs">Border Radius: {settings.borderRadius}px</Label>
              <Slider value={[settings.borderRadius]} min={0} max={24} step={2} onValueChange={([v]) => updateSetting('borderRadius', v)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs">Background Color</Label>
              <div className="flex gap-1.5 flex-wrap">
                {bgColors.map(({ label, value }) => (
                  <button
                    key={value}
                    className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                      settings.bgColor === value ? 'border-[#ff5277] shadow-[0_0_0_2px_rgba(255,82,119,0.3)]' : 'border-border'
                    }`}
                    style={{ backgroundColor: value === 'transparent' ? 'var(--card)' : value }}
                    onClick={() => updateSetting('bgColor', value)}
                    title={label}
                  />
                ))}
                <input
                  type="color"
                  value={settings.bgColor === 'transparent' ? '#1a1a1a' : settings.bgColor}
                  onChange={(e) => updateSetting('bgColor', e.target.value)}
                  className="w-7 h-7 p-0 border-2 border-border rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels" className="text-xs">Show Token IDs</Label>
              <Checkbox id="show-labels" checked={settings.showLabels} onCheckedChange={(checked) => updateSetting('showLabels', !!checked)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-border/50">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" onClick={onConfirm} className="bg-[#ff5277] hover:bg-[#e8486b]">Confirm</Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface NFTModalProps {
  nft: OwnedNft
  attributes: NFTAttribute[]
  onClose: () => void
}

function NFTModal({ nft, attributes, onClose }: NFTModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const imageSrc = nft.image.cachedUrl || nft.image.pngUrl || ''

  useEffect(() => {
    const animateIn = async () => {
      try {
        const { animate } = await import('animejs')
        if (backdropRef.current) animate(backdropRef.current, { opacity: [0, 1], duration: 300, ease: 'outQuad' })
        if (modalRef.current) animate(modalRef.current, { opacity: [0, 1], scale: [0.9, 1], duration: 400, ease: 'outExpo' })
        if (imageRef.current) animate(imageRef.current, { opacity: [0, 1], translateX: [-30, 0], duration: 500, delay: 150, ease: 'outExpo' })
        if (infoRef.current) {
          const children = infoRef.current.children
          animate(children, { opacity: [0, 1], translateY: [20, 0], delay: (_, i) => 200 + i * 50, duration: 400, ease: 'outExpo' })
        }
      } catch (err) {
        console.error('Animation failed:', err)
      }
    }
    animateIn()
  }, [])

  const handleClose = async () => {
    try {
      if (!modalRef.current) { onClose(); return }
      const { animate } = await import('animejs')
      const anim = animate(modalRef.current as HTMLElement, { opacity: [1, 0], scale: [1, 0.95], duration: 200, ease: 'inQuad' })
      await new Promise(resolve => setTimeout(resolve, 200))
      onClose()
    } catch {
      onClose()
    }
  }

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[100]" onClick={handleClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
        <div ref={modalRef} className="relative w-full max-w-[700px] bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto">
          <div ref={imageRef} className="relative w-full md:w-[320px] md:min-w-[320px] aspect-square flex-shrink-0 bg-muted">
            <button onClick={handleClose} className="absolute top-3 left-3 z-10 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur border border-border rounded-full text-foreground transition-all hover:bg-destructive/15 hover:border-destructive/50 hover:text-destructive hover:rotate-90">
              <Icons.close className="h-5 w-5" />
            </button>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Icons.loader className="h-8 w-8 animate-spin opacity-40" />
              </div>
            )}
            <Image
              src={imageSrc}
              alt={nft?.name || `NFT #${nft.tokenId}`}
              fill
              quality={90}
              className="object-cover transition-opacity duration-200"
              style={{ opacity: imageLoaded ? 1 : 0 }}
              sizes="(max-width: 768px) 100vw, 320px"
              priority
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div ref={infoRef} className="flex-1 p-5 md:p-6 flex flex-col justify-end overflow-y-auto md:max-h-[320px]">
            <h2 className="text-xl md:text-[1.3rem] font-bold text-white mb-4">
              {nft?.name || `Token #${nft.tokenId}`}
            </h2>

            {attributes.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="flex flex-col p-2.5 md:p-3 bg-muted/50 rounded-lg border border-border/30">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{attr.trait_type}</span>
                    <span className="text-[13px] font-semibold text-foreground">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
