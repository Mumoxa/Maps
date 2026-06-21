import React, { createContext, useContext, useEffect, useState } from 'react'
import type { DataBundle } from '../data'
import { loadData, validateData, buildCompanyAliasMap, buildSegmentNormalizationMap, createSearchIndex, setFuseProfiles } from '../data'

interface DataContextValue {
  data: DataBundle
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<DataContextValue>({
    data: null as unknown as DataBundle,
    loading: true,
    error: null,
  })

  useEffect(() => {
    try {
      const data = loadData()
      buildCompanyAliasMap(data)
      buildSegmentNormalizationMap(data)
      const warnings = validateData(data)
      const fuse = createSearchIndex(data.profiles)
      ;(fuse as any).__profiles = data.profiles
      setFuseProfiles(data.profiles)
      setValue({ data, loading: false, error: null })
    } catch (e) {
      setValue({ data: null as unknown as DataBundle, loading: false, error: String(e) })
    }
  }, [])

  return React.createElement(DataContext.Provider, { value: value }, children)
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
