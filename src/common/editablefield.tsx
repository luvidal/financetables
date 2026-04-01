/**
 * EditableField — a compact inline-editable field for use outside table grids.
 *
 * Wraps EditableCell with a light-blue pill styling (bg-blue-50/50, rounded,
 * compact padding). Designed for percentage inputs like castigo rates.
 *
 * Unlike EditableCell used inside grids (with keyboard nav, focus ring, etc.),
 * EditableField is a standalone field — click to select, double-click to edit.
 */

import EditableCell from './editablecell'

interface EditableFieldProps {
    /** Current value (0–100 for percent) */
    value: number | null
    /** Called with the new value after edit */
    onChange: (v: number) => void
    /** Input type — defaults to 'percent' */
    type?: 'percent' | 'number'
    /** Clamp range [min, max] — defaults to [0, 100] */
    min?: number
    max?: number
    /** Extra Tailwind classes appended to the wrapper */
    className?: string
}

export default function EditableField({
    value,
    onChange,
    type = 'percent',
    min = 0,
    max = 100,
    className = '',
}: EditableFieldProps) {
    return (
        <EditableCell
            value={value}
            onChange={(v) => {
                const n = typeof v === 'number' ? v : 0
                onChange(Math.max(min, Math.min(max, Math.round(n))))
            }}
            type={type}
            asDiv
            className={`bg-blue-50/50 rounded !py-0.5 !px-1.5 [&>div]:h-4 text-[11px] ${className}`}
        />
    )
}
