const { useState, useEffect } = React;

function MainPage({ user, onLogout }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [showManageUsers, setShowManageUsers] = useState(false);

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

    const handleManageUsersClick = () => {
        if (user.admin) {
            setShowManageUsers(true);
            setShowDropdown(false);
        }
    };

    const handleBackFromSettings = () => {
        setShowProfileSettings(false);
    };

    const handleBackFromManageUsers = () => {
        setShowManageUsers(false);
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

    if (showManageUsers) {
        return (
            <div>
                <div className="navbar">
                    <div className="nav-content">
                        <div className="logo">Game Shop</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button className="logout-btn" onClick={handleBackFromManageUsers}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
                <ManageUsersPage 
                    onDeleteUser={() => {}}
                    currentUser={user}
                />
            </div>
        );
    }

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
                                    
                                    {user.admin && (
                                        <>
                                            <div style={{ borderTop: '1px solid #e0e0e0', margin: '0' }}></div>
                                            <div 
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                    fontSize: '0.9rem',
                                                    color: '#667eea',
                                                    fontWeight: '600'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                onClick={handleManageUsersClick}
                                            >
                                                Manage Users
                                            </div>
                                        </>
                                    )}
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
                <div className="blank-page">
                    <h1>Game Shop Dashboard</h1>
                    <p>
                        ~Main Page lol~
                        Only Access to Settings rn
                    </p>
                    <p style={{ marginTop: '2rem', opacity: 0.8 }}>
                        TBA
                    </p>
                </div>
            </div>
        </div>
    );
}