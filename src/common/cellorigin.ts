export type CellOrigin = 'ai' | 'user' | 'calculated'

export const ORIGIN_CLASSES: Record<CellOrigin, string> = {
  ai: 'text-gray-500',
  user: 'text-gray-900',
  calculated: 'text-blue-800',
}
