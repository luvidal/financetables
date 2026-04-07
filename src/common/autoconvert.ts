// Auto-conversion, auto-computation, and side-effect engine for UF↔CLP tables

export type AutoConvertRule = {
  source: string          // field being edited
  target: string          // field to auto-update
  formula: (value: number, params: Record<string, number>) => number
  precision?: number      // decimal places for result (default: 0 for CLP, 2 for UF)
}

export type AutoComputeRule = {
  target: string          // field to compute
  depends: string[]       // fields that trigger recomputation
  condition?: (row: Record<string, any>) => boolean
  formula: (row: Record<string, any>, params: Record<string, number>) => number | null
}

export type SideEffect = {
  trigger: string         // field that was edited
  apply: (row: Record<string, any>, newValue: unknown) => Record<string, any>  // partial update
}

/**
 * Generate a bidirectional UF↔CLP conversion rule pair.
 * Usage: ...buildUfPair('valor_uf', 'valor_pesos', ufValue)
 */
export function buildUfPair(
  ufKey: string,
  pesosKey: string,
  ufValue: number,
  ufPrecision = 2,
  pesosPrecision = 0,
): AutoConvertRule[] {
  return [
    { source: ufKey, target: pesosKey, formula: (v) => v * ufValue, precision: pesosPrecision },
    { source: pesosKey, target: ufKey, formula: (v) => v / ufValue, precision: ufPrecision },
  ]
}

/**
 * Apply auto-conversions after a field edit.
 * Given the edited field and its new value, applies matching conversion rules
 * (e.g. UF→CLP or CLP→UF) and returns the updated row.
 */
export function applyAutoConversions<T extends Record<string, any>>(
  row: T,
  editedField: string,
  editedValue: any,
  rules: AutoConvertRule[],
  params: Record<string, number>,
): T {
  let result = { ...row, [editedField]: editedValue }
  for (const rule of rules) {
    if (rule.source === editedField && typeof editedValue === 'number') {
      const precision = rule.precision ?? 0
      const converted = rule.formula(editedValue, params)
      result[rule.target as keyof T] = (precision === 0
        ? Math.round(converted)
        : Math.round(converted * Math.pow(10, precision)) / Math.pow(10, precision)
      ) as any
    }
  }
  return result
}

/**
 * Apply auto-compute rules after a field edit.
 * Checks which compute rules depend on the edited field, evaluates conditions,
 * and applies formulas to compute derived values.
 */
export function applyAutoCompute<T extends Record<string, any>>(
  row: T,
  editedField: string,
  rules: AutoComputeRule[],
  params: Record<string, number>,
): T {
  let result = { ...row }
  for (const rule of rules) {
    if (rule.depends.includes(editedField)) {
      if (!rule.condition || rule.condition(result)) {
        result[rule.target as keyof T] = rule.formula(result, params) as any
      }
    }
  }
  return result
}
