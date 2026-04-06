import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'
import type { InversionRow, InversionesTableProps } from './types'

const columns: ColumnDef[] = [
    { key: 'institucion', label: 'Institución', type: 'text', width: '30%', isLabel: true, placeholder: 'Institución' },
    { key: 'tipo', label: 'Tipo Inversión', type: 'text', width: '30%', placeholder: 'Tipo' },
    { key: 'fecha', label: 'Fecha', type: 'text', width: '20%', align: 'center', placeholder: '-' },
    { key: 'monto', label: 'Monto $', type: 'currency', width: '20%' },
]

const InversionesTable = ({
    rows,
    onRowsChange,
    formatCurrency,
    colorScheme,
    headerBg,
    headerText,
    title,
    getCellOriginClass,
}: InversionesTableProps) => (
    <AssetTable<InversionRow>
        columns={columns}
        rows={rows}
        onRowsChange={onRowsChange}
        idPrefix="inv"
        addPlaceholder="Agregar inversión..."
        formatCurrency={formatCurrency}
        colorScheme={colorScheme}
        headerBg={headerBg}
        headerText={headerText}
        title={title}
        getCellOriginClass={getCellOriginClass}
    />
)

export default InversionesTable
