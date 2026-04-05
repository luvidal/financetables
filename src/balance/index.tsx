/**
 * BalanceTable — Horizontal layout (one row per company)
 *
 * Columns: Empresa | Activos | Pasivos | Patrimonio | Part. % | Patr. Prop. | Ingresos | Gastos | Resultado
 * Participación is an editable blue pill (EditableField).
 * Patr. Proporcional is computed (patrimonio × participación / 100), read-only.
 */

import { Eye } from 'lucide-react'
import { T } from '../common/styles'
import { resolveColors } from '../common/colors'
import { displayCurrencyCompact } from '../common/utils'
import TableShell from '../common/tableshell'
import EditableCell from '../common/editablecell'
import EditableField from '../common/editablefield'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { useRowHover } from '../common/userowhover'
import type { BalanceRow, BalanceTableProps } from './types'

/** Editable currency column keys in display order */
const CURRENCY_KEYS: (keyof BalanceRow)[] = [
    'total_activos', 'total_pasivos', 'patrimonio',
    'total_ingresos', 'total_gastos', 'resultado',
]

const COL_HEADERS = [
    { label: 'Empresa', align: 'left' as const },
    { label: 'Activos', align: 'right' as const },
    { label: 'Pasivos', align: 'right' as const },
    { label: 'Patrimonio', align: 'right' as const },
    { label: 'Part.', align: 'center' as const },
    { label: 'Patr. Prop.', align: 'right' as const },
    { label: 'Ingresos', align: 'right' as const },
    { label: 'Gastos', align: 'right' as const },
    { label: 'Resultado', align: 'right' as const },
]

const BalanceTable = ({
    rows,
    onRowsChange,
    colorScheme: colorSchemeProp,
    onViewSource,
}: BalanceTableProps) => {
    const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp)
    const { getHoverProps } = useRowHover()

    const rowIds = rows.map(r => r.id)
    // 6 currency cols + 1 participación = 7 editable columns
    const keyboard = useGridKeyboard({ visibleRowIds: rowIds, colCount: 7 })

    const handleChange = (rowIdx: number, key: keyof BalanceRow, value: number | string | null) => {
        const updated = [...rows]
        updated[rowIdx] = { ...updated[rowIdx], [key]: value }
        onRowsChange(updated)
    }

    if (rows.length === 0) return null

    // Map currency key to its keyboard column index (skip participación at index 3)
    const currencyColIndex = (key: keyof BalanceRow): number => {
        switch (key) {
            case 'total_activos': return 0
            case 'total_pasivos': return 1
            case 'patrimonio': return 2
            // 3 = participación
            case 'total_ingresos': return 4
            case 'total_gastos': return 5
            case 'resultado': return 6
            default: return -1
        }
    }

    return (
        <div onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0} className="outline-none">
            <TableShell
                headerBg={headerBg}
                headerClassName={`border-b ${borderColor} ${headerText}`}
                rowCount={rows.length}
                renderHeader={() => (
                    <>
                        {COL_HEADERS.map((col, i) => (
                            <th
                                key={col.label}
                                className={`${T.headerCell} ${T.th} ${i < COL_HEADERS.length - 1 ? T.vline : ''} ${col.align === 'left' ? 'text-left' : col.align === 'center' ? 'text-center' : 'text-right'} ${headerText} ${i === 0 ? 'min-w-[160px]' : ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </>
                )}
            >
                {rows.map((row, rowIdx) => {
                    const patrimonio = row.patrimonio ?? 0
                    const participacion = row.participacion ?? 0
                    const patrimonioProportional = Math.round(patrimonio * participacion / 100)

                    return (
                        <tr
                            key={row.id}
                            className={`${T.rowBorder} ${T.rowHover} group/row`}
                            {...getHoverProps(row.id)}
                        >
                            {/* Empresa */}
                            <td className={`${T.cellEdit} ${T.vline}`}>
                                <div className="flex items-start gap-1">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-medium text-gray-700 truncate">
                                            {row.empresa || '—'}
                                        </div>
                                        {(row.rut || row.periodo) && (
                                            <div className="text-[11px] text-gray-400 truncate">
                                                {[row.rut, row.periodo].filter(Boolean).join(' · ')}
                                            </div>
                                        )}
                                    </div>
                                    {row.sourceFileId && onViewSource && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewSource([row.sourceFileId!]) }}
                                            className="p-0.5 rounded hover:bg-gray-100 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer flex-shrink-0 mt-0.5"
                                            title="Ver documento fuente"
                                        >
                                            <Eye size={13} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </td>

                            {/* Activos, Pasivos, Patrimonio */}
                            {CURRENCY_KEYS.slice(0, 3).map(key => {
                                const val = row[key] as number | null
                                const colIdx = currencyColIndex(key)
                                const isNeg = typeof val === 'number' && val < 0
                                const isBold = key === 'patrimonio'
                                return (
                                    <EditableCell
                                        key={key}
                                        value={val}
                                        onChange={(v) => handleChange(rowIdx, key, v)}
                                        type="currency"
                                        hasData={val != null}
                                        className={`${T.vline} ${isNeg ? 'text-red-600' : ''} ${isBold ? 'font-semibold' : ''}`}
                                        focused={keyboard.isFocused(row.id, colIdx)}
                                        onCellFocus={() => keyboard.focus(row.id, colIdx)}
                                        onNavigate={keyboard.navigate}
                                        requestEdit={keyboard.isFocused(row.id, colIdx) ? keyboard.editTrigger : 0}
                                        requestClear={keyboard.isFocused(row.id, colIdx) ? keyboard.clearTrigger : 0}
                                        editInitialValue={keyboard.isFocused(row.id, colIdx) ? keyboard.editInitialValue : undefined}
                                    />
                                )
                            })}

                            {/* Participación — blue pill */}
                            <td className={`${T.cellEdit} ${T.vline} text-center`}>
                                <EditableField
                                    value={participacion}
                                    onChange={(v) => handleChange(rowIdx, 'participacion', v)}
                                />
                            </td>

                            {/* Patr. Proporcional — computed, read-only */}
                            <td className={`${T.cellValue} ${T.vline} font-semibold`}>
                                {participacion > 0 ? displayCurrencyCompact(patrimonioProportional) : '—'}
                            </td>

                            {/* Ingresos, Gastos, Resultado */}
                            {CURRENCY_KEYS.slice(3).map(key => {
                                const val = row[key] as number | null
                                const colIdx = currencyColIndex(key)
                                const isNeg = typeof val === 'number' && val < 0
                                const isBold = key === 'resultado'
                                const isLast = key === 'resultado'
                                return (
                                    <EditableCell
                                        key={key}
                                        value={val}
                                        onChange={(v) => handleChange(rowIdx, key, v)}
                                        type="currency"
                                        hasData={val != null}
                                        className={`${!isLast ? T.vline : ''} ${isNeg ? 'text-red-600' : ''} ${isBold ? 'font-semibold' : ''}`}
                                        focused={keyboard.isFocused(row.id, colIdx)}
                                        onCellFocus={() => keyboard.focus(row.id, colIdx)}
                                        onNavigate={keyboard.navigate}
                                        requestEdit={keyboard.isFocused(row.id, colIdx) ? keyboard.editTrigger : 0}
                                        requestClear={keyboard.isFocused(row.id, colIdx) ? keyboard.clearTrigger : 0}
                                        editInitialValue={keyboard.isFocused(row.id, colIdx) ? keyboard.editInitialValue : undefined}
                                    />
                                )
                            })}
                        </tr>
                    )
                })}
            </TableShell>
        </div>
    )
}

export default BalanceTable
