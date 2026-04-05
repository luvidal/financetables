import type { ColorScheme } from '../common/colors'

export interface BalanceRow {
  id: string
  empresa: string
  rut: string
  periodo: string
  total_activos: number | null
  total_pasivos: number | null
  patrimonio: number | null
  total_ingresos: number | null
  total_gastos: number | null
  resultado: number | null
  participacion?: number | null
  sourceFileId?: string
}

export interface BalanceFieldDef {
  key: keyof BalanceRow
  label: string
  type: 'text' | 'currency' | 'percent'
}

export interface BalanceTableProps {
  rows: BalanceRow[]
  onRowsChange: (rows: BalanceRow[]) => void
  colorScheme?: ColorScheme
  onViewSource?: (fileIds: string[]) => void
}
