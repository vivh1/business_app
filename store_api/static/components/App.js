const { useState, useEffect } = React;

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogin = (user) => {
        setCurrentUser(user);
        // Don't save to localStorage
    };

    const handleLogout = () => {
        setCurrentUser(null);
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