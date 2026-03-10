const { useState, useEffect } = React;

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogin = (user) => {
        setCurrentUser(user);
        // Don't save to localStorage
    };

    const handleLogout = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('accessToken')).access;
            await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('logout error:', error);
        } finally {
            setCurrentUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
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

console.log("App loaded, mounting React...");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);