import { useState } from 'react'
import { useFinancialStore } from '../store/useFinancialStore.js'
import { calculateGrossShare, calculateFinalPayout, generateFakeTransactionId } from '../utils/financialLogic.js'
import { FaCreditCard, FaCheckCircle, FaClock } from 'react-icons/fa'

const MemberCard = ({ member }) => {
  const { netAmount, dispatch, addToAudit, isLocked } = useFinancialStore()
  const [paymentAmount, setPaymentAmount] = useState(0)
  const grossShare = calculateGrossShare(netAmount, member.percentage)
  const { final: finalPayout, outstanding } = calculateFinalPayout(grossShare, member.debt)
  
  const totalPaid = member.payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = Math.max(0, finalPayout - totalPaid)
  const status = remaining === 0 ? 'completed' : totalPaid > 0 ? 'partial' : 'pending'

  const handlePay = () => {
    if (paymentAmount > 0 && paymentAmount <= remaining) {
      dispatch({
        type: 'MAKE_PAYMENT',
        payload: {
          memberId: member.id,
          amount: paymentAmount
        }
      })
      addToAudit(`Payment KES ${paymentAmount.toLocaleString()} to ${member.name} (${member.payments.length + 1}th)`)
      setPaymentAmount(0)
    }
  }

  const statusIcon = status === 'completed' ? FaCheckCircle : status === 'partial' ? FaClock : FaCreditCard

  return (
    <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold">{member.name}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
          status === 'completed' ? 'bg-green-500 text-white' :
          status === 'partial' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          <statusIcon />
          {status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-200">Share</p>
            <p className="text-2xl font-bold text-indigo-100">{member.percentage}%</p>
          </div>
          <div>
            <p className="text-gray-200">Gross Entitlement</p>
            <p className="text-2xl font-bold text-green-300">
              KES {grossShare.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/30">
          <p className="text-gray-200 mb-1">Debt Deduction</p>
          <p className="text-xl font-bold text-red-200">KES {member.debt.toLocaleString()}</p>
          {outstanding > 0 && (
            <p className="text-sm text-red-300 mt-1">Outstanding: KES {outstanding.toLocaleString()}</p>
          )}
        </div>

        <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30">
          <p className="text-gray-200 mb-1">Final Payout</p>
          <p className="text-3xl font-bold text-green-300">KES {finalPayout.toLocaleString()}</p>
          
          <div className="mt-2 text-sm space-y-1">
            <p>Paid: KES {totalPaid.toLocaleString()}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalPaid / finalPayout) * 100)}%` }}
              />
            </div>
            <p>Remaining: KES {remaining.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {!isLocked && remaining > 0 && (
        <div className="border-t border-white/20 pt-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Pay amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:border-blue-300"
              min="0"
              max={remaining}
            />
            <button
              onClick={handlePay}
              disabled={paymentAmount <= 0 || paymentAmount > remaining}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <FaCreditCard />
              Pay Now
            </button>
          </div>
        </div>
      )}

      {member.payments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-gray-300 mb-2 uppercase tracking-wide">Recent Payments</p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {member.payments.slice(-3).reverse().map((payment) => (
              <div key={payment.id} className="flex justify-between text-xs bg-white/10 p-2 rounded">
                <span>{new Date(payment.timestamp).toLocaleDateString()}</span>
                <span> TXN: {payment.txnId.slice(0,12)}... KES {payment.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberCard

