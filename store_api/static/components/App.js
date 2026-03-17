const { useState, useEffect } = React;

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(null);

    // Save state before refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            const stateToSave = {
                user: currentUser,
                page: currentPage
            };
            sessionStorage.setItem('appState', JSON.stringify(stateToSave));
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [currentUser, currentPage]);

    // Restore state on load
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedState = sessionStorage.getItem('appState');
        
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        
        if (savedState) {
            const parsed = JSON.parse(savedState);
            setCurrentPage(parsed.page);
            sessionStorage.removeItem('appState');
        }
        
        setIsLoading(false);
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        sessionStorage.clear();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Pass handlePageChange to all pages so they can update the current page
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