import { useContext } from 'react'
import { ShopContext } from './ShopContextInstance'

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
