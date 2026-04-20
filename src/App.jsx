import React, { useState } from 'react'
import { FinancialProvider, useFinancialStore } from './store/useFinancialStore.js'
import { calculateDeductionsTotal } from './utils/financialLogic.js'
import DeductionsForm from './components/DeductionsForm.jsx'
import MemberForm from './components/MemberForm.jsx'
import MemberCard from './components/MemberCard.jsx'
import AuditLog from './components/AuditLog.jsx'
import BreakdownModal from './components/BreakdownModal.jsx'

function App() {
  return (
    <FinancialProvider>
      <AppContent />
    </FinancialProvider>
  )
}

function AppContent() {
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [memberCardsOpen, setMemberCardsOpen] = useState(false)
  const { totalAmount, netAmount, members, deductions, auditLog, isLocked, dispatch } = useFinancialStore()
  const { addToAudit } = useFinancialStore()

  addToAudit('System initialized')

  const filteredMembers = members.filter(m => m.percentage > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 drop-shadow-lg">
          💰 Financial Distribution & Settlement System
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/30 shadow-xl">
            <h2 className="text-xl font-semibold opacity-90 mb-2">📊 Total Asset</h2>
            <p className="text-3xl font-bold">KES {totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/30 shadow-xl">
            <h2 className="text-xl font-semibold opacity-90 mb-2">💵 Net Amount</h2>
            <p className="text-3xl font-bold text-green-300">KES {netAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/30 shadow-xl">
            <h2 className="text-xl font-semibold opacity-90 mb-2">👥 Members</h2>
            <p className="text-3xl font-bold">{filteredMembers.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold opacity-90 mb-2">🔒 Status</h3>
            <p className={`text-2xl font-bold ${isLocked ? 'text-green-400' : 'text-yellow-400'}`}>
              {isLocked ? '✅ LOCKED' : '⚠️ EDITABLE'}
            </p>
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1">
            <label className="block text-2xl font-bold mb-6 text-center drop-shadow">💵 TOTAL ASSET VALUE</label>
            <input 
              type="number" 
              value={totalAmount}
              onChange={(e) => dispatch({ type: 'SET_TOTAL', payload: e.target.value })}
              disabled={isLocked}
              className="w-full p-8 text-3xl font-bold text-right bg-white/30 border-4 border-dashed border-white/50 rounded-3xl text-white placeholder-white/70 focus:border-emerald-400 focus:outline-none shadow-2xl backdrop-blur-xl"
              placeholder="Enter total amount (KES)"
            />
          </div>
          
          <div>
            <button 
              onClick={() => setBreakdownOpen(true)}
              className="w-full p-10 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xl rounded-3xl shadow-2xl border-4 border-white/30 hover:border-white/50 transition-all duration-300 h-[116px]"
            >
              📊
              <br />
              FULL BREAKDOWN
            </button>
            <BreakdownModal isOpen={breakdownOpen} onClose={() => setBreakdownOpen(false)} />
          </div>

          <div className="grid grid-rows-2 gap-4 h-[116px]">
            <button 
              onClick={() => dispatch({ type: 'LOCK' })}
              disabled={isLocked}
              className="p-6 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-lg rounded-2xl shadow-2xl border-4 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔒 LOCK DISTRIBUTION
            </button>
            <button className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl border-4 border-white/30">
              📥 EXPORT REPORT
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="grid xl:grid-cols-2 gap-8 mb-12 [&>*]:w-full">
          <MemberForm />
          <DeductionsForm />
        </div>

        {/* Member Cards */}
        {netAmount > 0 && filteredMembers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-4">
                👥 Member Payouts ({filteredMembers.length})
              </h2>
              <button
                onClick={() => setMemberCardsOpen(!memberCardsOpen)}
                className="px-8 py-4 bg-indigo-500/80 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all"
              >
                {memberCardsOpen ? 'Hide Cards' : 'View Cards'}
              </button>
            </div>
            {memberCardsOpen && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit Log */}
        <AuditLog />

        <style jsx>{`
          @import './App.css';
        `}</style>
      </div>
    </div>
  )
}

export default App

