import { T } from '../common/styles'
import { displayCurrencyCompact, displayCurrency } from '../common/utils'
import type { SummaryRow, SummaryRowFormat, SummaryTableProps } from './types'

function formatCell(v: number | null, format: SummaryRowFormat): { display: string; title: string | undefined } {
  if (v == null) return { display: '—', title: undefined }

  switch (format) {
    case 'percent': {
      const pct = v * 100
      const display = pct.toFixed(2).replace('.', ',') + ' %'
      const full = pct.toFixed(4).replace('.', ',') + ' %'
      return { display, title: full !== display ? full : undefined }
    }
    case 'integer':
      return { display: String(Math.round(v)), title: undefined }
    default:
      return { display: displayCurrencyCompact(v), title: displayCurrency(v) || undefined }
  }
}

const ROW_STYLES = {
  data:       { row: T.sumDataRow,       label: T.sumDataLabel,  value: T.sumDataValue },
  total:      { row: T.sumTotalRow,      label: T.sumTotalLabel, value: T.sumTotalValue },
  grandtotal: { row: T.sumGrandtotalRow, label: T.sumTotalLabel, value: T.sumTotalValue },
} as const

const SummaryTable = ({ columnHeaders, rows, extraColumn, renderLabelSuffix, columnWidth = 'w-[120px]' }: SummaryTableProps) => {
  const extraW = extraColumn?.width ?? 'w-[80px]'

  return (
    <div className="overflow-x-auto">
      <table className={`${T.table} text-sm border-collapse`}>
        <tbody>
          {rows.map((row, idx) => {
            if (row.type === 'subheader') {
              return (
                <tr key={idx} className={T.sumSubheaderRow}>
                  <td className={T.sumSubheaderLabel}>{row.label}</td>
                  {extraColumn && (
                    <td className={`${T.sumSubheaderCol} ${extraW}`}>{extraColumn.header}</td>
                  )}
                  {columnHeaders.map((col, i) => (
                    <td key={i} className={`${T.sumSubheaderCol} ${columnWidth}`}>{col}</td>
                  ))}
                </tr>
              )
            }

            const s = ROW_STYLES[row.type] ?? ROW_STYLES.data
            const fmt = row.format ?? 'currency'

            return (
              <tr key={idx} className={s.row}>
                <td className={s.label}>
                  {row.label}
                  {renderLabelSuffix?.(row, idx)}
                </td>
                {extraColumn && (
                  <td className={`py-1.5 px-1 ${extraW}`}>
                    {extraColumn.render(row, idx)}
                  </td>
                )}
                {row.values.map((v, i) => {
                  const { display, title } = formatCell(v, fmt)
                  return (
                    <td
                      key={i}
                      title={title}
                      className={`${s.value} ${columnWidth}${title ? ' cursor-default' : ''}`}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SummaryTable
