import { useState, useEffect } from 'react'
import { useFinancialStore } from '../store/useFinancialStore.js'
import { getDefaultTax } from '../utils/financialLogic.js'
import { FaPlus, FaTrash } from 'react-icons/fa'

const DeductionsForm = () => {
  const { totalAmount, deductions, taxRate, dispatch, addToAudit, isLocked } = useFinancialStore()
  const [newDeduction, setNewDeduction] = useState({ name: '', amount: 0 })
  const [showTax, setShowTax] = useState(false)

  useEffect(() => {
    if (totalAmount > 0 && !deductions.some(d => d.name.includes('Tax'))) {
      const taxDeduction = getDefaultTax(totalAmount, taxRate)
      dispatch({ type: 'ADD_DEDUCTION', payload: taxDeduction })
      addToAudit(`Auto-added default tax ${taxRate}%: KES ${taxDeduction.amount.toLocaleString()}`)
    }
  }, [totalAmount, taxRate])

  const handleAddDeduction = () => {
    if (newDeduction.name && newDeduction.amount > 0) {
      dispatch({ type: 'ADD_DEDUCTION', payload: newDeduction })
      addToAudit(`Added deduction: ${newDeduction.name} KES ${newDeduction.amount.toLocaleString()}`)
      setNewDeduction({ name: '', amount: 0 })
    }
  }

  const handleTaxChange = (e) => {
    const newRate = parseFloat(e.target.value)
    dispatch({ type: 'SET_TAX_RATE', payload: newRate })
    addToAudit(`Tax rate updated to ${newRate}%`)
    
    // Update existing tax
    const taxDed = deductions.find(d => d.name.includes('Tax'))
    if (taxDed) {
      const newTax = getDefaultTax(totalAmount, newRate)
      dispatch({ type: 'UPDATE_DEDUCTION', payload: { id: taxDed.id, updates: { amount: newTax.amount } } })
    }
  }

  const removeDeduction = (id) => {
    const ded = deductions.find(d => d.id === id)
    dispatch({ type: 'REMOVE_DEDUCTION', payload: id })
    addToAudit(`Removed deduction: ${ded.name}`)
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        💳 Deductions
        <button 
          onClick={() => setShowTax(!showTax)}
          className="ml-4 px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold"
        >
          Tax ({taxRate}%)
        </button>
      </h2>
      
      {showTax && (
        <div className="mb-6 p-4 bg-yellow-500/20 rounded-xl">
          <label className="block text-sm font-medium mb-2">Tax Rate</label>
          <input 
            type="range" 
            min="0" max="30" step="0.5"
            value={taxRate}
            onChange={handleTaxChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            disabled={isLocked}
          />
          <span className="text-xl font-bold">{taxRate}%</span>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {deductions.map((d) => (
          <div key={d.id} className="flex items-center justify-between p-4 bg-white/20 rounded-xl">
            <div>
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm opacity-75">KES {d.amount.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => removeDeduction(d.id)}
              disabled={isLocked}
              className="p-2 text-red-300 hover:text-red-100 disabled:opacity-50"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {!isLocked && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Deduction name"
            value={newDeduction.name}
            onChange={(e) => setNewDeduction({...newDeduction, name: e.target.value})}
            className="flex-1 p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newDeduction.amount}
            onChange={(e) => setNewDeduction({...newDeduction, amount: parseFloat(e.target.value) || 0})}
            className="w-32 p-3 bg-white/20 border border-white/30 rounded-xl text-white"
          />
          <button
            onClick={handleAddDeduction}
            disabled={!newDeduction.name || newDeduction.amount <= 0}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <FaPlus />
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export default DeductionsForm

