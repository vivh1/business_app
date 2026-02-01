const { useState } = React;

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
                    <div style={{ color: '#666' }}>Welcome to our store</div>
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