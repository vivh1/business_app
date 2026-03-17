const { useState, useEffect } = React;

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');
                const savedToken = localStorage.getItem('accessToken');
                const loginTime = localStorage.getItem('loginTime');
                
                // Check if this is a fresh server start (no appInitialized in session)
                const isFreshStart = !sessionStorage.getItem('appInitialized');
                
                if (isFreshStart) {
                    // Fresh server start - mark as initialized
                    sessionStorage.setItem('appInitialized', 'true');
                    
                    // Only clear if there's no valid login from this session
                    if (!savedUser || !savedToken || !loginTime) {
                        localStorage.clear();
                        setCurrentUser(null);
                    } else {
                        // Check if login is from this browser session (within last 24h)
                        const timeSinceLogin = Date.now() - parseInt(loginTime);
                        if (timeSinceLogin < 24 * 60 * 60 * 1000) { // 24 hours
                            setCurrentUser(JSON.parse(savedUser));
                        } else {
                            localStorage.clear();
                            setCurrentUser(null);
                        }
                    }
                } else {
                    // Normal refresh - restore user if valid
                    if (savedUser && savedToken) {
                        setCurrentUser(JSON.parse(savedUser));
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.clear();
            } finally {
                setIsLoading(false);
            }
        };
        
        loadUser();
    }, []);

    // Save state before refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentUser) {
                const stateToSave = {
                    page: currentPage
                };
                sessionStorage.setItem('appState', JSON.stringify(stateToSave));
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [currentUser, currentPage]);

    // Restore page state after load
    useEffect(() => {
        if (!isLoading && currentUser) {
            const savedState = sessionStorage.getItem('appState');
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);
                    setCurrentPage(parsed.page);
                    sessionStorage.removeItem('appState');
                } catch (e) {
                    console.error('Error parsing saved state:', e);
                }
            }
        }
    }, [isLoading, currentUser]);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loginTime', Date.now().toString());
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('loginTime');
        sessionStorage.clear();
        setCurrentPage(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div>
            {!currentUser ? (
                <AuthPage onLogin={handleLogin} />
            ) : (
                <MainPage 
                    user={currentUser} 
                    onLogout={handleLogout}
                    onPageChange={handlePageChange}
                    initialPage={currentPage}
                />
            )}
        </div>
    );
}

console.log("App loaded, mounting React...");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);