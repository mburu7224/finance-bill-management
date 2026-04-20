import { useState } from 'react'
import { useFinancialStore } from '../store/useFinancialStore.js'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const MemberForm = () => {
  const { members, dispatch, addToAudit, isLocked, percentagesValid } = useFinancialStore()
  const [editingId, setEditingId] = useState(null)
  const [editMember, setEditMember] = useState({ name: '', percentage: 0, debt: 0 })
  const [newMember, setNewMember] = useState({ name: '', percentage: 0, debt: 0 })

  const handleAddMember = () => {
    if (newMember.name && newMember.percentage > 0) {
      dispatch({ type: 'ADD_MEMBER', payload: newMember })
      addToAudit(`Added member: ${newMember.name} ${newMember.percentage}%`)
      setNewMember({ name: '', percentage: 0, debt: 0 })
    }
  }

  const startEdit = (member) => {
    setEditingId(member.id)
    setEditMember({ ...member })
  }

  const saveEdit = () => {
    dispatch({ type: 'UPDATE_MEMBER', payload: { id: editingId, updates: editMember } })
    addToAudit(`Updated member: ${editMember.name}`)
    setEditingId(null)
    setEditMember({ name: '', percentage: 0, debt: 0 })
  }

  const deleteMember = (id) => {
    const member = members.find(m => m.id === id)
    dispatch({ type: 'UPDATE_MEMBER', payload: { id, updates: { percentage: 0 } } }) // soft delete
    addToAudit(`Removed member: ${member.name}`)
  }

  const memberSum = members.reduce((sum, m) => sum + (m.percentage || 0), 0)

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        👥 Members ({memberSum}%)
        <span className={percentagesValid ? 'text-green-400' : 'text-red-400 text-sm font-bold'}>
          {percentagesValid ? '✅' : '⚠️ Adjust'}
        </span>
      </h2>

      {/* Add new member */}
      {!isLocked && (
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/20 rounded-xl">
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="p-3 bg-white/30 border border-white/30 rounded-xl text-white placeholder-white/70"
          />
          <input
            type="number"
            placeholder="Share %"
            value={newMember.percentage}
            onChange={(e) => setNewMember({ ...newMember, percentage: parseFloat(e.target.value) || 0 })}
            className="p-3 bg-white/30 border border-white/30 rounded-xl text-white"
            min="0" max="100"
          />
          <input
            type="number"
            placeholder="Debt"
            value={newMember.debt}
            onChange={(e) => setNewMember({ ...newMember, debt: parseFloat(e.target.value) || 0 })}
            className="p-3 bg-white/30 border border-white/30 rounded-xl text-white"
          />
          <button
            onClick={handleAddMember}
            disabled={!newMember.name || newMember.percentage <= 0}
            className="col-span-3 p-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaPlus />
            Add Member
          </button>
        </div>
      )}

      {/* Members list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {members.filter(m => m.percentage > 0).map((member) => (
          <div key={member.id} className="p-4 bg-white/20 rounded-xl group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                {!isLocked && (
                  <>
                    <button
                      onClick={() => startEdit(member)}
                      className="p-2 hover:bg-white/30 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="p-2 hover:bg-red-500/50 rounded-lg text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
            {editingId === member.id ? (
              <div className="grid grid-cols-3 gap-2 p-3 bg-white/10 rounded-lg">
                <input
                  value={editMember.name}
                  onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                  className="p-2 bg-white/20 rounded text-black text-sm"
                />
                <input
                  type="number"
                  value={editMember.percentage}
                  onChange={(e) => setEditMember({ ...editMember, percentage: parseFloat(e.target.value) || 0 })}
                  className="p-2 bg-white/20 rounded text-black text-sm"
                  min="0"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={editMember.debt}
                    onChange={(e) => setEditMember({ ...editMember, debt: parseFloat(e.target.value) || 0 })}
                    className="flex-1 p-2 bg-white/20 rounded text-black text-sm"
                  />
                  <button
                    onClick={saveEdit}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>Share: <span className="font-bold">{member.percentage}%</span></div>
                <div>Debt: KES <span className="font-bold">{member.debt.toLocaleString()}</span></div>
                <div className="md:col-span-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    member.debt === 0 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    Final: Pending
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!members.length && !isLocked && (
        <p className="text-center text-lg opacity-75 mt-8">Add your first member to start distribution</p>
      )}
    </div>
  )
}

export default MemberForm

