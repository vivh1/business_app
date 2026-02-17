const { useState, useEffect } = React;

function MainPage({ user, onLogout }) {
    console.log('User object:', user);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [showManageUsers, setShowManageUsers] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingGame, setEditingGame] = useState(null);
    const [showAddGame, setShowAddGame] = useState(false);
    const [newGameName, setNewGameName] = useState('');
    const [newGameImage, setNewGameImage] = useState('');
    
    
    // Categories data
    const [categories, setCategories] = useState([
        { id: 1, name: 'Action', image: '', games: [
            { id: 1, name: 'Game 1', image: '' },
            { id: 2, name: 'Game 2', image: '' },
            { id: 3, name: 'Game 3', image: '' }
        ]},
        { id: 2, name: 'Indie', image: '', games: [
            { id: 4, name: 'Stardew Valley', image: '' },
            { id: 5, name: 'Disco Elysium', image: '' }
        ]},
        { id: 3, name: 'RPG', image: '', games: [
            { id: 6, name: 'Undertale', image: '' },
            { id: 7, name: 'Persona 5 Royal', image: '' },
            { id: 8, name: 'Cyberpunk 2077', image: '' }
        ]},
        { id: 4, name: 'Strategy', image: '', games: [
            { id: 9, name: 'Game 9', image: '' }
        ]},
        { id: 5, name: 'Pixel Graphics', image: '', games: [
            { id: 10, name: 'Under', image: '' },
            { id: 11, name: 'Game 11', image: '' }
        ]},
        { id: 6, name: 'Horror', image: '', games: [
            { id: 12, name: 'Amnesia: the Dark Descent', image: '' },
            { id: 13, name: 'Phasmophobia', image: '' }
        ]},
        { id: 7, name: 'Metroidvania', image: '', games: [
            { id: 14, name: 'Hollow Knight', image: '' },
            { id: 15, name: 'Hollow Knight: Silksong', image: '' }
        ]}
    ]);
    
    const [sortOrder, setSortOrder] = useState('default');

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
        if (user.is_admin) {
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

    const handleSortChange = (order) => {
        setSortOrder(order);
    };


    const getFilteredAndSortedCategories = () => {
        let filtered = [...categories];
        
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            filtered.sort((a, b) => a.id - b.id);
        }
        
        return filtered;
    };

        // Category functions (Admin only)
    const handleAddCategory = () => {
        if (!user.is_admin) return;
        if (newCategoryName.trim()) {
            const newId = Math.max(...categories.map(c => c.id), 0) + 1;
            const newCategory = {
                id: newId,
                name: newCategoryName,
                image: newCategoryImage,
                visible: true,
                games: []
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setNewCategoryImage('URL_HERE');
            setShowAddCategory(false);
        }
    };

    const handleDeleteCategory = (categoryId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to delete this category and all its games?')) {
            setCategories(categories.filter(c => c.id !== categoryId));
        }
    };

    const handleRenameCategory = (categoryId, newName) => {
        if (!user.is_admin) return;
        setCategories(categories.map(c => 
            c.id === categoryId ? { ...c, name: newName } : c
        ));
        setEditingCategory(null);
    };

        // Game functions (Admin only)
    const handleAddGame = (categoryId) => {
        if (!user.is_admin) return;
        if (newGameName.trim()) {
            const category = categories.find(c => c.id === categoryId);
            const newId = Math.max(...category.games.map(g => g.id), 0) + 1;
            const newGame = {
                id: newId,
                name: newGameName,
                image: newGameImage
            };
            
            setCategories(categories.map(c => 
                c.id === categoryId 
                    ? { ...c, games: [...c.games, newGame] } 
                    : c
            ));
            setNewGameName('');
            setNewGameImage('URL_HERE');
            setShowAddGame(false);
        }
    };

    const handleDeleteGame = (categoryId, gameId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to delete this game?')) {
            setCategories(categories.map(c => 
                c.id === categoryId 
                    ? { ...c, games: c.games.filter(g => g.id !== gameId) } 
                    : c
            ));
        }
    };

    const handleRenameGame = (categoryId, gameId, newName) => {
        if (!user.is_admin) return;
        setCategories(categories.map(c => 
            c.id === categoryId 
                ? { ...c, games: c.games.map(g => 
                    g.id === gameId ? { ...g, name: newName } : g
                    )} 
                : c
        ));
        setEditingGame(null);
    };

    const handleCategoryClick = (category) => {
            setSelectedCategory(category);
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {user.is_admin && (
                                <button 
                                    className="back-btn admin-add-btn" 
                                    onClick={() => setShowAddGame(true)}
                                >
                                    + Add Game
                                </button>
                            )}
                            <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                                Back to Categories
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="main-content">
                    <div className="content-wrapper">
                        <h1 className="page-title">{selectedCategory.name} Games</h1>
                        
                        {/* ADD THIS - Add Game Form */}
                        {showAddGame && user.is_admin && (
                            <div className="add-form-container">
                                <h3 className="form-title">Add New Game</h3>
                                <input
                                    type="text"
                                    placeholder="Game Name"
                                    className="form-input"
                                    value={newGameName}
                                    onChange={(e) => setNewGameName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    className="form-input"
                                    value={newGameImage}
                                    onChange={(e) => setNewGameImage(e.target.value)}
                                />
                                <div className="form-buttons">
                                    <button className="save-btn" onClick={() => handleAddGame(selectedCategory.id)}>Save</button>
                                    <button className="cancel-btn" onClick={() => setShowAddGame(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                        
                        <div className="cards-grid">
                            {selectedCategory.games.map(game => (
                                <div key={game.id} className="game-card">
                                    <div className="game-image">
                                        [Image: {game.image}]
                                    </div>
                                    <div className="game-info">
                                        {editingGame === game.id ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                defaultValue={game.name}
                                                onBlur={(e) => handleRenameGame(selectedCategory.id, game.id, e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleRenameGame(selectedCategory.id, game.id, e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="game-name">{game.name}</h3>
                                        )}
                                        
                                        {/* ADD THIS - Admin Controls for Games */}
                                        {user.is_admin && (
                                            <div className="admin-controls">
                                                <button className="rename-btn" onClick={() => setEditingGame(game.id)}>Rename</button>
                                                <button className="delete-btn" onClick={() => handleDeleteGame(selectedCategory.id, game.id)}>Delete</button>
                                            </div>
                                        )}
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
                                    
                                    {user.is_admin && (
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

                        {user.is_admin && (
                        <button 
                            className="add-category-btn" 
                            onClick={() => setShowAddCategory(true)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            + Add Category
                        </button>
                    )}
                    </div>

                    {showAddCategory && user.is_admin && (
                    <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Add New Category</h3>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                marginRight: '1rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                width: '300px',
                                marginBottom: '1rem'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Image URL (optional)"
                            value={newCategoryImage}
                            onChange={(e) => setNewCategoryImage(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                marginRight: '1rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                width: '300px',
                                marginBottom: '1rem'
                            }}
                        />
                        <div>
                            <button onClick={handleAddCategory} style={{
                                padding: '0.75rem 1.5rem',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '0.5rem'
                            }}>Save</button>
                            <button onClick={() => setShowAddCategory(false)} style={{
                                padding: '0.75rem 1.5rem',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Cancel</button>
                        </div>
                    </div>
                )}
                    
                    <div className="cards-grid">
                        {displayedCategories.map(category => (
                            <div 
                                key={category.id} 
                                className={`category-card`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="category-image">
                                    [Image: {category.image}]
                                </div>
                                <div className="category-info">
                                    <div className="category-header">
                                        <h3 className="category-name">{category.name}</h3>
                                        <span className="game-count">
                                            {category.games.length} games
                                        </span>
                                    </div>

                                    {user.is_admin && (
                                    <div className="admin-controls" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button 
                                            className="rename-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCategory(category.id);
                                            }}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: '#ffc107',
                                                color: '#333',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Rename
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCategory(category.id);
                                            }}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}