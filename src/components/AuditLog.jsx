import { useFinancialStore } from '../store/useFinancialStore.js'
import { FaHistory } from 'react-icons/fa'

const AuditLog = () => {
  const { auditLog } = useFinancialStore()

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <FaHistory />
        📜 Audit Trail ({auditLog.length} actions)
      </h2>
      
      <div className="max-h-64 overflow-y-auto space-y-3">
        {auditLog.slice(0, 25).map((log, index) => (  // show recent 25
          <div key={index} className="flex gap-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition group">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-lg font-mono text-sm font-bold text-blue-400 min-w-[3rem]">
              #{String(auditLog.length - index).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate group-hover:no-underline">{log.action}</p>
              <p className="text-sm opacity-75">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {auditLog.length === 0 && (
          <p className="text-center text-lg opacity-75 py-12">No actions yet. All changes logged automatically.</p>
        )}
      </div>
      
      {auditLog.length > 25 && (
        <p className="text-center text-sm opacity-75 mt-4 italic">
          Showing recent 25 of {auditLog.length} total actions
        </p>
      )}
    </div>
  )
}

export default AuditLog

