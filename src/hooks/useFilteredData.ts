import { useMemo } from 'react'
import { useTenant } from '@/contexts/TenantContext'

/**
 * Custom hook to filter data arrays based on the current tenant's active country.
 * Supports filtering by `pais` or `pais_ativo` properties.
 *
 * @param dataArray The array of data to filter.
 * @returns Filtered array matching the current session's active country.
 */
export function useFilteredData<T extends Record<string, any>>(dataArray: T[]): T[] {
  const { session } = useTenant()

  return useMemo(() => {
    if (!session || !dataArray) return []

    return dataArray.filter((item) => {
      if (item && typeof item === 'object') {
        if ('pais' in item) {
          return item.pais === session.pais_ativo
        }
        if ('pais_ativo' in item) {
          return item.pais_ativo === session.pais_ativo
        }
      }
      return true
    })
  }, [dataArray, session?.pais_ativo])
}
