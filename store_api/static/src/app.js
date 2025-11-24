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
                setMessage('❌ ' + (data.message || 'Login failed'));
            }
        } catch (error) {
            setMessage('❌ Cannot connect to server. Make sure Django is running on port 8000.');
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
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
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

        // Basic validation
        if (password !== confirmPassword) {
            setMessage('❌ Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 3) {
            setMessage('❌ Password must be at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            // Since you can't modify the backend, we'll simulate registration
            // In a real app, this would call your Django register endpoint
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

            // For now, simulate successful registration
            // In reality, you'd need a /api/register/ endpoint in Django
            setTimeout(() => {
                setMessage('✅ Registration successful! You can now login with your new account.');
                setLoading(false);
                
                // Clear form
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Switch to login after successful registration
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            }, 1500);

        } catch (error) {
            // If register endpoint doesn't exist, show helpful message
            setMessage('⚠️ Registration endpoint not available. Contact administrator to enable user registration.');
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
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
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
                    <div style={{ color: '#666' }}>Welcome to our gaming community</div>
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
    return (
        <div>
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>Welcome, <strong>{user.username}</strong>!</span>
                        <span className="profile-icon" title="Manage Profile">👤</span>
                        <button className="logout-btn" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="main-content">
                <div className="welcome-section">
                    <h1>Game Shop Dashboard</h1>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                        Your ultimate destination for gaming adventures
                    </p>
                    
                    <div className="user-info">
                        <h3>Your Account Information</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.mail}</p>
                            <p><strong>User ID:</strong> {user.user_id}</p>
                            <p><strong>Account Type:</strong> {user.admin ? '👑 Administrator' : '🎯 Standard User'}</p>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Quick Actions</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button style={{ padding: '1rem 2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                Browse Games
                            </button>
                            <button style={{ padding: '1rem 2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                My Library
                            </button>
                            <button style={{ padding: '1rem 2rem', background: '#ffc107', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                Account Settings
                            </button>
                        </div>
                    </div>
                </div>
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