import { useState } from 'react';
import { Users, Search, Edit2, Trash2, Plus, Shield, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

const SAMPLE_USERS = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@ibm.com',
    role: 'Admin',
    team: 'Infrastructure Sales',
    region: 'US East',
    permissions: ['create_cadences', 'edit_cadences', 'delete_cadences', 'manage_users', 'view_analytics', 'export_data'],
    status: 'active',
    lastLogin: '2024-01-22T14:30:00Z',
    emailsGenerated: 145,
    cadencesCreated: 12,
    joinedDate: '2023-06-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.johnson@ibm.com',
    role: 'Manager',
    team: 'Cloud Sales',
    region: 'US West',
    permissions: ['create_cadences', 'edit_cadences', 'view_analytics', 'export_data'],
    status: 'active',
    lastLogin: '2024-01-22T09:15:00Z',
    emailsGenerated: 89,
    cadencesCreated: 8,
    joinedDate: '2023-08-20T00:00:00Z'
  },
  {
    id: 3,
    name: 'David Park',
    email: 'david.park@ibm.com',
    role: 'Seller',
    team: 'Storage Sales',
    region: 'US Central',
    permissions: ['create_cadences', 'view_analytics'],
    status: 'active',
    lastLogin: '2024-01-21T16:45:00Z',
    emailsGenerated: 234,
    cadencesCreated: 5,
    joinedDate: '2023-09-10T00:00:00Z'
  },
  {
    id: 4,
    name: 'Lisa Chen',
    email: 'lisa.chen@ibm.com',
    role: 'Seller',
    team: 'Infrastructure Sales',
    region: 'US East',
    permissions: ['create_cadences', 'view_analytics'],
    status: 'active',
    lastLogin: '2024-01-22T11:20:00Z',
    emailsGenerated: 178,
    cadencesCreated: 6,
    joinedDate: '2023-07-25T00:00:00Z'
  },
  {
    id: 5,
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@ibm.com',
    role: 'Manager',
    team: 'Data & AI Sales',
    region: 'US South',
    permissions: ['create_cadences', 'edit_cadences', 'view_analytics', 'export_data'],
    status: 'active',
    lastLogin: '2024-01-20T13:00:00Z',
    emailsGenerated: 67,
    cadencesCreated: 9,
    joinedDate: '2023-10-05T00:00:00Z'
  },
  {
    id: 6,
    name: 'Sarah Williams',
    email: 'sarah.williams@ibm.com',
    role: 'Seller',
    team: 'Automation Sales',
    region: 'US West',
    permissions: ['create_cadences', 'view_analytics'],
    status: 'inactive',
    lastLogin: '2023-12-15T10:30:00Z',
    emailsGenerated: 45,
    cadencesCreated: 3,
    joinedDate: '2023-05-12T00:00:00Z'
  }
];

const PERMISSION_OPTIONS = [
  { id: 'create_cadences', label: 'Create Cadences', description: 'Generate new sales cadences' },
  { id: 'edit_cadences', label: 'Edit Cadences', description: 'Modify existing cadences' },
  { id: 'delete_cadences', label: 'Delete Cadences', description: 'Remove cadences from library' },
  { id: 'manage_users', label: 'Manage Users', description: 'Add, edit, and remove users' },
  { id: 'view_analytics', label: 'View Analytics', description: 'Access performance metrics' },
  { id: 'export_data', label: 'Export Data', description: 'Download data and reports' }
];

const ROLE_OPTIONS = ['Admin', 'Manager', 'Seller'];
const TEAM_OPTIONS = ['Infrastructure Sales', 'Cloud Sales', 'Storage Sales', 'Data & AI Sales', 'Automation Sales'];
const REGION_OPTIONS = ['US East', 'US West', 'US Central', 'US South', 'Canada', 'EMEA', 'APAC', 'LATAM'];

const UserManager = () => {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.team.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (userId) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const togglePermission = (permissionId) => {
    if (!editingUser) return;
    
    const hasPermission = editingUser.permissions.includes(permissionId);
    const newPermissions = hasPermission
      ? editingUser.permissions.filter(p => p !== permissionId)
      : [...editingUser.permissions, permissionId];
    
    setEditingUser({ ...editingUser, permissions: newPermissions });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-ibm-purple/10 text-ibm-purple border-ibm-purple/30';
      case 'Manager':
        return 'bg-ibm-blue/10 text-ibm-blue border-ibm-blue/30';
      default:
        return 'bg-gray-70 text-gray-30 border-gray-60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-text-primary">User Management</h2>
          <p className="text-sm text-text-secondary mt-1 font-light">
            Manage sellers and managers with platform access and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-ibm-blue hover:bg-ibm-blue/90 text-white font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-ibm-blue"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 text-sm bg-bg-surface text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
          />
        </div>
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
        >
          <option value="all">All Roles</option>
          {ROLE_OPTIONS.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border p-4">
          <div className="text-2xl font-light text-text-primary">{users.length}</div>
          <div className="text-xs text-text-tertiary mt-1 font-light">Total Users</div>
        </div>
        <div className="bg-bg-surface border border-border p-4">
          <div className="text-2xl font-light text-text-primary">{users.filter(u => u.status === 'active').length}</div>
          <div className="text-xs text-text-tertiary mt-1 font-light">Active Users</div>
        </div>
        <div className="bg-bg-surface border border-border p-4">
          <div className="text-2xl font-light text-text-primary">{users.filter(u => u.role === 'Admin').length}</div>
          <div className="text-xs text-text-tertiary mt-1 font-light">Admins</div>
        </div>
        <div className="bg-bg-surface border border-border p-4">
          <div className="text-2xl font-light text-text-primary">{users.reduce((sum, u) => sum + u.emailsGenerated, 0)}</div>
          <div className="text-xs text-text-tertiary mt-1 font-light">Total Emails Generated</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-bg-surface border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal text-text-tertiary tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-bg-raised transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-normal text-text-primary">{user.name}</div>
                      <div className="text-xs text-text-tertiary font-light">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-normal border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary font-light">{user.team}</div>
                    <div className="text-xs text-text-tertiary font-light">{user.region}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary font-light">{user.emailsGenerated} emails</div>
                    <div className="text-xs text-text-tertiary font-light">Last login: {formatDate(user.lastLogin)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-ibm-blue">
                        <CheckCircle className="w-3 h-3" />
                        <span className="font-light">Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs text-text-tertiary">
                        <XCircle className="w-3 h-3" />
                        <span className="font-light">Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 hover:bg-bg-base transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4 text-text-tertiary" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 hover:bg-bg-base transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-text-tertiary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-light text-text-primary mb-6">Edit User Permissions</h3>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-tertiary mb-2 font-normal">Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-tertiary mb-2 font-normal">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-text-tertiary mb-2 font-normal">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                    >
                      {ROLE_OPTIONS.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-tertiary mb-2 font-normal">Team</label>
                    <select
                      value={editingUser.team}
                      onChange={(e) => setEditingUser({ ...editingUser, team: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                    >
                      {TEAM_OPTIONS.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-tertiary mb-2 font-normal">Region</label>
                    <select
                      value={editingUser.region}
                      onChange={(e) => setEditingUser({ ...editingUser, region: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                    >
                      {REGION_OPTIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm text-text-tertiary mb-3 font-normal">Permissions</label>
                  <div className="space-y-2">
                    {PERMISSION_OPTIONS.map(permission => (
                      <label
                        key={permission.id}
                        className="flex items-start space-x-3 p-3 bg-bg-surface border border-border hover:bg-bg-raised cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={editingUser.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-text-primary font-normal">{permission.label}</div>
                          <div className="text-xs text-text-tertiary font-light">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-text-tertiary mb-2 font-normal">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-surface text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm font-normal text-text-primary bg-bg-surface border border-border hover:bg-bg-raised transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-normal text-white bg-ibm-blue hover:bg-ibm-blue/90 border border-ibm-blue transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-bg-surface border border-border">
          <Users className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary font-light">No users found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManager;

// Made with Bob