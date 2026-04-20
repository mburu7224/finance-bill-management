import { createContext, useContext, useReducer } from 'react'
import { 
  calculateNetAmount, 
  validatePercentages,
  generateFakeTransactionId 
} from '../utils/financialLogic.js'

const FinancialContext = createContext()

// Initial state
const initialState = {
  totalAmount: 0,
  deductions: [],  // [{name, amount}]
  members: [],     // [{id, name, percentage, debt:0, payments:[]}]
  auditLog: [],    // [{timestamp, action}]
  isLocked: false,
  taxRate: 15
}

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOTAL':
      return { ...state, totalAmount: parseFloat(action.payload) || 0 }
    
    case 'ADD_DEDUCTION':
      return { 
        ...state, 
        deductions: [...state.deductions, { id: Date.now(), ...action.payload }] 
      }
    
    case 'UPDATE_DEDUCTION':
      return {
        ...state,
        deductions: state.deductions.map(d => d.id === action.payload.id 
          ? { ...d, ...action.payload.updates }
          : d
        )
      }
    
    case 'REMOVE_DEDUCTION':
      return {
        ...state,
        deductions: state.deductions.filter(d => d.id !== action.payload)
      }
    
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, { 
          id: Date.now(), 
          ...action.payload,
          debt: 0,
          payments: []
        }]
      }
    
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(m => m.id === action.payload.id
          ? { ...m, ...action.payload.updates }
          : m
        )
      }
    
    case 'MAKE_PAYMENT':
      const member = state.members.find(m => m.id === action.payload.memberId)
      if (!member) return state
      
      const payment = {
        id: Date.now(),
        amount: action.payload.amount,
        txnId: generateFakeTransactionId(),
        timestamp: Date.now(),
        status: 'completed'
      }
      
      return {
        ...state,
        members: state.members.map(m => m.id === action.payload.memberId
          ? { ...m, payments: [...m.payments, payment] }
          : m
        )
      }
    
    case 'LOCK':
      return { ...state, isLocked: true }
    
    case 'UNLOCK':
      return { ...state, isLocked: false }
    
    case 'ADD_AUDIT':
      return {
        ...state,
        auditLog: [
          { timestamp: Date.now(), action: action.payload },
          ...state.auditLog.slice(0, 99)  // keep last 100
        ]
      }
    
    case 'SET_TAX_RATE':
      return { ...state, taxRate: action.payload }
    
    default:
      return state
  }
}

export const useFinancialStore = () => {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancialStore must be used within FinancialProvider')
  }
  return context
}

export const FinancialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  // Derived state
  const netAmount = calculateNetAmount(state.totalAmount, state.deductions)
  const percentagesValid = validatePercentages(state.members)
  
  const addToAudit = (action) => {
    dispatch({ type: 'ADD_AUDIT', payload: action })
  }
  
  const value = {
    ...state,
    netAmount,
    percentagesValid,
    dispatch,
    addToAudit
  }
  
  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  )
}

