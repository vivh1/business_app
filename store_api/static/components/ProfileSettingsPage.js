const { useState } = React;

function ProfileSettingsPage({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage('New passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.newPassword && formData.newPassword.length < 3) {
            setMessage('New password must be at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            setTimeout(() => {
                const updatedUser = {
                    ...user,
                    username: formData.username,
                    email: formData.email
                };
                
                setMessage('Profile updated successfully!');
                setLoading(false);
                
                if (onSave) {
                    onSave(updatedUser);
                }
            }, 1500);

        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="profile-settings-page">
            <div className="profile-settings-container">
                <h1 style={{ marginBottom: '2rem', color: '#333' }}>Profile Settings</h1>
                
                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Account Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Change Password (Optional)</h3>
                            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Leave blank if you don't want to change your password
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Enter current password"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`} style={{ marginTop: '1.5rem' }}>
                            {message}
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="save-btn"
                            disabled={loading}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}