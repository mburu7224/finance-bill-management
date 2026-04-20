import { useFinancialStore } from '../store/useFinancialStore.js'
import { calculateNetAmount, calculateGrossShare, calculateFinalPayout } from '../utils/financialLogic.js'
import { FaTimes } from 'react-icons/fa'

const BreakdownModal = ({ isOpen, onClose }) => {
  const { totalAmount, deductions, members, taxRate, netAmount, percentagesValid } = useFinancialStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50 w-full">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-6 border-b border-gray-200 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">📊 Full Financial Breakdown</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Total & Net */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl">
              <p className="text-sm opacity-90 uppercase tracking-wide">Total Asset Value</p>
              <p className="text-4xl font-bold mt-2">KES {totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl">
              <p className="text-sm opacity-90 uppercase tracking-wide">Net Distributable</p>
              <p className="text-4xl font-bold mt-2">KES {netAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Deductions Breakdown */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
              💳 Deductions (KES {(totalAmount - netAmount).toLocaleString()})
            </h3>
            <div className="space-y-3">
              {deductions.map((deduction) => (
                <div key={deduction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{deduction.name}</p>
                    <p className="text-sm text-gray-600">{((deduction.amount / totalAmount) * 100).toFixed(1)}% of total</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">KES {deduction.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Summary */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
              👥 Distribution Summary
              <span className={percentagesValid ? 'text-green-600' : 'text-red-600'}>
                {percentagesValid ? '✅ Valid' : '⚠️ Percentages sum ≠ 100%'}
              </span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-2xl">
                <thead>
                  <tr className="bg-white border-b border-gray-200">
                    <th className="p-4 text-left font-semibold text-gray-900">Member</th>
                    <th className="p-4 text-right font-semibold text-gray-900">Share %</th>
                    <th className="p-4 text-right font-semibold text-gray-900">Gross</th>
                    <th className="p-4 text-right font-semibold text-gray-900">Debt</th>
                    <th className="p-4 text-right font-semibold text-gray-900">Final Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const gross = calculateGrossShare(netAmount, member.percentage)
                    const { final } = calculateFinalPayout(gross, member.debt)
                    return (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-100">
                        <td className="p-4 font-semibold text-gray-900">{member.name}</td>
                        <td className="p-4 text-right">{member.percentage}%</td>
                        <td className="p-4 text-right font-mono text-green-600">KES {gross.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono text-red-600">KES {member.debt.toLocaleString()}</td>
                        <td className="p-4 text-right font-bold text- font-mono text-blue-600">
                          KES {final.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 font-bold">
                    <td className="p-4 text-lg">TOTALS</td>
                    <td className="p-4 text-right">{members.reduce((s, m) => s + m.percentage, 0)}%</td>
                    <td className="p-4 text-right text-green-600">KES {netAmount.toLocaleString()}</td>
                    <td className="p-4 text-right text-red-600">KES {members.reduce((s, m) => s + m.debt, 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-blue-600">KES {members.reduce((s, m) => {
                      const gross = calculateGrossShare(netAmount, m.percentage)
                      const { final } = calculateFinalPayout(gross, m.debt)
                      return s + final
                    }, 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              Generated on {new Date().toLocaleString()} | Transparent & Auditable
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreakdownModal

