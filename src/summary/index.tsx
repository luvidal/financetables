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

const SummaryTable = ({ columnHeaders, rows, extraColumn, renderLabelSuffix, columnWidth = 'w-[120px]' }: SummaryTableProps) => {
  const extraW = extraColumn?.width ?? 'w-[80px]'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map((row, idx) => {
            if (row.type === 'subheader') {
              return (
                <tr key={idx} className="border-b-2 border-gray-300">
                  <td className="py-2 px-3 text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {row.label}
                  </td>
                  {extraColumn && (
                    <td className={`py-2 px-3 text-right text-xs font-bold text-gray-600 ${extraW}`}>
                      {extraColumn.header}
                    </td>
                  )}
                  {columnHeaders.map((col, i) => (
                    <td key={i} className={`py-2 px-3 text-right text-xs font-bold text-gray-600 ${columnWidth}`}>
                      {col}
                    </td>
                  ))}
                </tr>
              )
            }

            const isTotal = row.type === 'total'
            const isFinal = row.type === 'grandtotal'
            const fmt = row.format ?? 'currency'

            return (
              <tr
                key={idx}
                className={[
                  'border-b',
                  isFinal ? 'bg-gray-100 border-gray-300 border-b-2' : '',
                  isTotal ? 'bg-gray-50/80 border-gray-200' : '',
                  !isTotal && !isFinal ? 'border-gray-100' : '',
                ].filter(Boolean).join(' ')}
              >
                <td className={[
                  'py-1.5 px-3',
                  isTotal || isFinal ? 'font-bold text-gray-800' : 'text-gray-600 pl-5',
                ].join(' ')}>
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
                      className={[
                        `py-1.5 px-3 text-right tabular-nums ${columnWidth}`,
                        isTotal || isFinal ? 'font-bold text-gray-800' : 'text-gray-700',
                        title ? 'cursor-default' : '',
                      ].join(' ')}
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
