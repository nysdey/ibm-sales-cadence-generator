import { useState } from 'react';
import { User, Mail, Building2, Briefcase, Calendar, Edit2, Save, X } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Sydney Chin',
    email: 'sydney.chin@ibm.com',
    role: 'Sales Engineer',
    team: 'IBM Infrastructure Sales',
    region: 'US',
    joinedDate: '2024-01-15',
    cadencesCreated: 12,
    emailsGenerated: 156,
    avgQualityScore: 92
  });

  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-text-primary">Profile</h2>
          <p className="text-base text-text-secondary mt-1.5 font-light">
            Manage your account information and preferences
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card">
            <h3 className="text-lg font-light text-text-primary mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
                  />
                ) : (
                  <p className="text-base text-text-primary">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
                  />
                ) : (
                  <p className="text-base text-text-primary">{user.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.role}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
                    />
                  ) : (
                    <p className="text-base text-text-primary">{user.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Region
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser.region}
                      onChange={(e) => setEditedUser({ ...editedUser, region: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
                    >
                      <option value="US">US</option>
                      <option value="EMEA">EMEA</option>
                      <option value="APAC">APAC</option>
                      <option value="LATAM">LATAM</option>
                    </select>
                  ) : (
                    <p className="text-base text-text-primary">{user.region}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Team
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.team}
                    onChange={(e) => setEditedUser({ ...editedUser, team: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
                  />
                ) : (
                  <p className="text-base text-text-primary">{user.team}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="card">
            <h3 className="text-lg font-light text-text-primary mb-4">Activity Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bg-raised border border-border p-4">
                <div className="text-2xl font-light text-ibm-blue mb-1">{user.cadencesCreated}</div>
                <div className="text-sm text-text-secondary">Cadences Created</div>
              </div>
              <div className="bg-bg-raised border border-border p-4">
                <div className="text-2xl font-light text-ibm-blue mb-1">{user.emailsGenerated}</div>
                <div className="text-sm text-text-secondary">Emails Generated</div>
              </div>
              <div className="bg-bg-raised border border-border p-4">
                <div className="text-2xl font-light text-ibm-blue mb-1">{user.avgQualityScore}%</div>
                <div className="text-sm text-text-secondary">Avg Quality Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="space-y-6">
          <div className="card text-center">
            <div className="w-24 h-24 bg-ibm-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-ibm-blue" />
            </div>
            <h3 className="text-xl font-light text-text-primary mb-1">{user.name}</h3>
            <p className="text-sm text-text-secondary mb-4">{user.role}</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Building2 className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{user.team}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Briefcase className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{user.region}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-light text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors border border-border">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors border border-border">
                Notification Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors border border-border">
                Export My Data
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border border-border">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

// Made with Bob