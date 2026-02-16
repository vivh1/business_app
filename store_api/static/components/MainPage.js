const { useState, useEffect } = React;

function MainPage({ user, onLogout }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [showManageUsers, setShowManageUsers] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Categories data
    const [categories, setCategories] = useState([
        { id: 1, name: 'Action', image: '', visible: true, games: [
            { id: 1, name: 'Game 1', image: '' },
            { id: 2, name: 'Game 2', image: '' },
            { id: 3, name: 'Game 3', image: '' }
        ]},
        { id: 2, name: 'Adventure', image: '', visible: true, games: [
            { id: 4, name: 'Game 4', image: '' },
            { id: 5, name: 'Game 5', image: '' }
        ]},
        { id: 3, name: 'RPG', image: '', visible: true, games: [
            { id: 6, name: 'Game 6', image: '' },
            { id: 7, name: 'Game 7', image: '' },
            { id: 8, name: 'Game 8', image: '' }
        ]},
        { id: 4, name: 'Strategy', image: '', visible: true, games: [
            { id: 9, name: 'Game 9', image: '' }
        ]},
        { id: 5, name: 'Sports', image: '', visible: true, games: [
            { id: 10, name: 'Game 10', image: '' },
            { id: 11, name: 'Game 11', image: '' }
        ]}
    ]);
    
    const [sortOrder, setSortOrder] = useState('default');
    const [filterVisible, setFilterVisible] = useState('all');

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

    const toggleCategoryVisibility = (categoryId) => {
        setCategories(categories.map(cat => 
            cat.id === categoryId ? { ...cat, visible: !cat.visible } : cat
        ));
    };

    const toggleAllVisibility = () => {
        const allVisible = categories.every(cat => cat.visible);
        setCategories(categories.map(cat => ({ ...cat, visible: !allVisible })));
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const handleFilterChange = (filter) => {
        setFilterVisible(filter);
    };

    const getFilteredAndSortedCategories = () => {
        let filtered = [...categories];
        
        if (filterVisible === 'visible') {
            filtered = filtered.filter(cat => cat.visible);
        } else if (filterVisible === 'hidden') {
            filtered = filtered.filter(cat => !cat.visible);
        }
        
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            filtered.sort((a, b) => a.id - b.id);
        }
        
        return filtered;
    };

    const handleCategoryClick = (category) => {
        if (category.visible) {
            setSelectedCategory(category);
        }
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
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
                        <div>
                            <button className="back-btn" onClick={handleBackFromManageUsers}>
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
                        <div>
                            <button className="back-btn" onClick={handleBackFromSettings}>
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

    if (selectedCategory) {
        return (
            <div>
                <div className="navbar">
                    <div className="nav-content">
                        <div className="logo">Game Shop</div>
                        <div>
                            <button className="back-btn" onClick={handleBackToCategories}>
                                Back to Categories
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="main-content">
                    <div className="content-wrapper">
                        <h1 className="page-title">{selectedCategory.name} Games</h1>
                        
                        <div className="cards-grid">
                            {selectedCategory.games.map(game => (
                                <div key={game.id} className="game-card">
                                    <div className="game-image">
                                        [Image: {game.image}]
                                    </div>
                                    <div className="game-info">
                                        <h3 className="game-name">{game.name}</h3>
                                        <p className="game-id">Game #{game.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const displayedCategories = getFilteredAndSortedCategories();

    return (
        <div>
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        <span className="welcome-text">Welcome, <strong>{user.username}</strong>!</span>
                        
                        <div style={{ position: 'relative' }}>
                            <div className="profile-icon" onClick={toggleDropdown}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={handleProfileClick}>
                                        View Profile
                                    </div>
                                    <div className="dropdown-item" onClick={handleSettingsClick}>
                                        Settings
                                    </div>
                                    
                                    {user.admin && (
                                        <>
                                            <div className="dropdown-divider"></div>
                                            <div className="admin-item" onClick={handleManageUsersClick}>
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
                <div className="content-wrapper">
                    <h1 className="page-title">Game Categories</h1>
                    
                    <div className="filters-container">
                        <div className="filter-group">
                            <span className="filter-label">Sort:</span>
                            <select 
                                className="filter-select"
                                value={sortOrder}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="default">Default</option>
                                <option value="asc">Alphabetical (A-Z)</option>
                                <option value="desc">Alphabetical (Z-A)</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <span className="filter-label">Show:</span>
                            <select 
                                className="filter-select"
                                value={filterVisible}
                                onChange={(e) => handleFilterChange(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="visible">Visible Only</option>
                                <option value="hidden">Hidden Only</option>
                            </select>
                            
                            <button className="toggle-all-btn" onClick={toggleAllVisibility}>
                                Toggle All
                            </button>
                        </div>
                    </div>
                    
                    <div className="cards-grid">
                        {displayedCategories.map(category => (
                            <div 
                                key={category.id} 
                                className={`category-card ${!category.visible ? 'hidden' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="category-image">
                                    [Image: {category.image}]
                                    
                                    <button
                                        className="visibility-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCategoryVisibility(category.id);
                                        }}
                                    >
                                        {category.visible ? 'Visible' : 'Invisible'}
                                    </button>
                                </div>
                                <div className="category-info">
                                    <div className="category-header">
                                        <h3 className="category-name">{category.name}</h3>
                                        <span className="game-count">
                                            {category.games.length} games
                                        </span>
                                    </div>
                                    <p className="category-status">
                                        {category.visible ? 'Click to view games' : 'Hidden'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}