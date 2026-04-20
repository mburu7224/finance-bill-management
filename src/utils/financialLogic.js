// Pure calculation functions

/**
 * Calculate deductions total
 * @param {Array} deductions - [{name: 'Tax', amount: number}, ...]
 * @returns {number} total deductions
 */
export const calculateDeductionsTotal = (deductions = []) => {
  return deductions.reduce((sum, d) => sum + (d.amount || 0), 0)
}

/**
 * Calculate net amount
 * @param {number} totalAmount 
 * @param {Array} deductions 
 * @returns {number}
 */
export const calculateNetAmount = (totalAmount = 0, deductions = []) => {
  const totalDeductions = calculateDeductionsTotal(deductions)
  return Math.max(0, totalAmount - totalDeductions)
}

/**
 * Calculate gross share for member
 * @param {number} netAmount 
 * @param {number} percentage 
 * @returns {number}
 */
export const calculateGrossShare = (netAmount, percentage) => {
  return Math.round(netAmount * (percentage / 100) * 100) / 100
}

/**
 * Calculate final payout
 * @param {number} grossShare 
 * @param {number} debt 
 * @returns {{final: number, outstanding: number}}
 */
export const calculateFinalPayout = (grossShare, debt) => {
  const final = Math.max(0, grossShare - debt)
  const outstanding = Math.max(0, debt - grossShare)
  return { final: Math.round(final * 100) / 100, outstanding: Math.round(outstanding * 100) / 100 }
}

/**
 * Validate percentages sum ~100%
 * @param {Array} members 
 * @returns {boolean}
 */
export const validatePercentages = (members = []) => {
  const sum = members.reduce((s, m) => s + (m.percentage || 0), 0)
  return Math.abs(sum - 100) < 1  // allow 1% tolerance
}

/**
 * Default tax deduction
 * @param {number} totalAmount 
 * @param {number} taxRate 
 * @returns {Object}
 */
export const getDefaultTax = (totalAmount, taxRate = 15) => ({
  name: `Tax (${taxRate}%)`,
  amount: Math.round(totalAmount * (taxRate / 100) * 100) / 100
})

export const generateFakeTransactionId = () => {
  return 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()
}

