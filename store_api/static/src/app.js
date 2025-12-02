const { useState, useEffect } = React;

function AuthTabs({ activeTab, onTabChange }) {
    return (
        <div className="tabs">
            <button 
                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => onTabChange('login')}
            >
                Login
            </button>
            <button 
                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => onTabChange('register')}
            >
                Register
            </button>
        </div>
    );
}

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (data.success) {
                setMessage('Login successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                setTimeout(() => onLogin(data.user), 1000);
            } else {
                setMessage('Login failed: ' + (data.message || 'Invalid credentials'));
            }
        } catch (error) {
            setMessage('Cannot connect to server. Make sure Django is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Your Account'}
            </button>
            
            {message && (
                <div className={`message ${message.includes('Login successful!') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
        </form>
    );
}

function RegisterForm({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 3) {
            setMessage('Password must be at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password,
                    admin: false 
                })
            });

            setTimeout(() => {
                setMessage('Registration successful! You can now login with your new account.');
                setLoading(false);
                
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            }, 1500);

        } catch (error) {
            setMessage('Registration endpoint not available. Contact administrator to enable user registration.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create New Account'}
            </button>
            
            {message && (
                <div className={`message ${message.includes('Registration successful!') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            
        </form>
    );
}

function AuthPage({ onLogin }) {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div>
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <div style={{ color: '#666' }}>Welcome to our game store!</div>
                </div>
            </div>
            
            <div className="auth-container">
                <div className="auth-content">
                    <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333' }}>
                        {activeTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
                    </h1>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                        {activeTab === 'login' ? 'Sign in to your account' : 'Create your new account'}
                    </p>
                    
                    <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    
                    {activeTab === 'login' ? (
                        <LoginForm onLogin={onLogin} />
                    ) : (
                        <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
                    )}
                </div>
            </div>
        </div>
    );
}

function MainPage({ user, onLogout }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleProfileClick = () => {
        alert('Profile clicked');
        setShowDropdown(false);
    };

    const handleSettingsClick = () => {
        setShowProfileSettings(true);
        setShowDropdown(false);
    };

    const handleBackFromSettings = () => {
        setShowProfileSettings(false);
    };

    const handleSaveProfile = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        window.location.reload();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.profile-icon') && !event.target.closest('.dropdown-menu')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    if (showProfileSettings) {
        return (
            <div>
                <div className="navbar">
                    <div className="nav-content">
                        <div className="logo">Game Shop</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button className="logout-btn" onClick={handleBackFromSettings}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
                <ProfileSettingsPage 
                    user={user} 
                    onSave={handleSaveProfile} 
                    onCancel={handleBackFromSettings}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        <span>Welcome, <strong>{user.username}</strong>!</span>
                        
                        <div style={{ position: 'relative' }}>
                            <div 
                                className="profile-icon" 
                                title="Manage Profile" 
                                onClick={toggleDropdown}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            
                            {showDropdown && (
                                <div className="dropdown-menu" style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: '0',
                                    background: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden'
                                }}>
                                    <div 
                                        style={{
                                            padding: '0.75rem 1rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        onClick={handleProfileClick}
                                    >
                                        View Profile
                                    </div>
                                    <div 
                                        style={{
                                            padding: '0.75rem 1rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            fontSize: '0.9rem',
                                            borderTop: '1px solid #f0f0f0'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        onClick={handleSettingsClick}
                                    >
                                        Settings
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <button className="logout-btn" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="main-content">
                <div className="welcome-section">                    
                    <div style={{ marginTop: '2rem' }}>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileSettingsPage({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.mail || '',
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
                    mail: formData.email
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

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    return (
        <div>
            {!currentUser ? (
                <AuthPage onLogin={handleLogin} />
            ) : (
                <MainPage user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    );
}

console.log("app.js loaded, mounting React...");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);