import React from 'react'
import { Eye } from 'lucide-react'
import { resolveColors } from './colors'
import { T } from './styles'

// ============================================================================
// SourceIcon — reusable eye icon for source file viewing in headers/rows
// ============================================================================

export const SourceIcon = ({
    fileIds,
    onViewSource,
    className,
}: {
    fileIds?: string[]
    onViewSource?: (ids: string[]) => void
    className?: string
}) => {
    if (!fileIds?.length || !onViewSource) return null
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onViewSource(fileIds) }}
            className="p-1 rounded hover:bg-white/50 transition-colors"
            title="Ver documento fuente"
        >
            <Eye size={14} className={className} />
        </button>
    )
}

// ============================================================================
// TableShell — single-table wrapper with colored header row
// ============================================================================

export interface TableShellProps {
    // Appearance
    colorScheme?: import('./colors').ColorScheme
    /** @deprecated Use colorScheme instead */
    headerBg?: string
    /** Extra classes on the header <tr> (e.g. border-t, text color) */
    headerClassName?: string
    /** Extra classes on the outer wrapper div */
    className?: string

    // Header content — render prop returns <td>/<th> cells for the header <tr>
    renderHeader: () => React.ReactNode

    // Table body content — <tr> elements placed inside <tbody>
    children: React.ReactNode

    // Optional <tfoot> content (e.g., totals row)
    renderFooter?: () => React.ReactNode

    // Optional content after the table (e.g., recycle bin, dialogs)
    renderAfterContent?: () => React.ReactNode
}

const TableShell = ({
    colorScheme: colorSchemeProp,
    headerBg: headerBgProp = 'bg-gray-100',
    headerClassName,
    className,
    renderHeader,
    children,
    renderFooter,
    renderAfterContent,
}: TableShellProps) => {
    const { bg: headerBg } = resolveColors(colorSchemeProp, headerBgProp)

    return (
        <div className={`border-y border-gray-200 mb-3 sm:mb-4 ${className || ''}`}>
            <table className={T.table}>
                <thead>
                    <tr className={`${headerBg} ${headerClassName || ''}`}>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
                {renderFooter && (
                    <tfoot>
                        {renderFooter()}
                    </tfoot>
                )}
            </table>
            {renderAfterContent?.()}
        </div>
    )
}

export default TableShell
