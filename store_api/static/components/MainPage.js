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
    const [showAddGamePage, setShowAddGamePage] = useState(false);
    const [newGameName, setNewGameName] = useState('');
    const [newGameImage, setNewGameImage] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [selectedGame, setSelectedGame] = useState(null);

    const [showCart, setShowCart] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [categories, setCategories] = useState([]);
    
    // Categories data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                const response = await fetch('http://localhost:8000/api/products/', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                
                const data = await response.json();
                
                // Group games by genre/category
                const grouped = {};
                data.forEach(game => {
                    const categoryName = game.genre || 'Uncategorized';
                    
                    if (!grouped[categoryName]) {
                        grouped[categoryName] = [];
                    }
                    
                    grouped[categoryName].push({
                        id: game.id,
                        title: game.title,
                        name: game.title,
                        image: game.image,
                        description: game.description,
                        price: game.price,
                        release_date: game.release_date,
                        developer: game.developer,
                        genre: game.genre,
                        quantity: game.quantity
                    });
                });

                // Convert to array
                const formatted = Object.entries(grouped).map(([genre, games], index) => ({
                    id: index + 1,
                    name: genre,
                    image: games[0]?.image || '',
                    games: games
                }));

                setCategories(formatted);
            } catch (err) {
                console.error('Error fetching products:', err);
                setCategories([]);
            }
        };

        fetchProducts();
    }, []);
    
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

    const handleCartClick = () => {
        setShowCart(true);
        setShowDropdown(false);
    };

    const handleBackFromCart = () => {
        setShowCart(false);
    };

    const handleSaveProfile = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setTimeout(() => {
            onLogout();
        }, 1500);
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

    const getSortedGames = (games) => {
        let sorted = [...games];
        if (sortOrder === 'asc') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === 'desc') {
            sorted.sort((a, b) => b.title.localeCompare(a.title));
        }
        return sorted;
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        
        // Search through all games in all categories
        const results = [];
        categories.forEach(category => {
            category.games.forEach(game => {
                if (game.title.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        ...game,
                        categoryName: category.name,
                        categoryId: category.id
                    });
                }
            });
        });
        
        setSearchResults(results);
        setShowSearchResults(true);
    };

    const handleSearchResultClick = (game, categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            setSelectedCategory(category);
            handleGameClick(game, category);
            setShowSearchResults(false);
            setSearchQuery('');
        }
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
            setNewCategoryImage('');
            setShowAddCategory(false);
        }
    };

    const handleDeleteCategory = (categoryId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to delete this category and all its games?')) {
            setCategories(categories.filter(c => c.id !== categoryId));
            if (selectedCategory && selectedCategory.id === categoryId) {
                setSelectedCategory(null);
            }
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
    const handleAddGameClick = () => {
        setShowAddGamePage(true);
    };

    const handleBackFromAddGame = () => {
        setShowAddGamePage(false);
    };

    const handleGameAdded = (newGame) => {
        // Refresh current category games
        if (selectedCategory) {
            setSelectedCategory({
                ...selectedCategory,
                games: [...selectedCategory.games, newGame]
            });
        }
        setShowAddGamePage(false);
    };

    const handleDeleteGame = async (categoryId, gameId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to delete this game?')) {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                const response = await fetch('http://localhost:8000/api/delete_product/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ id: gameId })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    setCategories(categories.map(c => 
                        c.id === categoryId 
                            ? { ...c, games: c.games.filter(g => g.id !== gameId) } 
                            : c
                    ));
                    
                    if (selectedCategory && selectedCategory.id === categoryId) {
                        setSelectedCategory({
                            ...selectedCategory,
                            games: selectedCategory.games.filter(g => g.id !== gameId)
                        });
                    }
                }
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }
    };

    const handleRenameGame = (categoryId, gameId, newName) => {
        if (!user.is_admin) return;
        if (newName.trim()) {
            handleUpdateGame(categoryId, gameId, { title: newName });
        }
        setEditingGame(null);
    };

    const handleUpdateGame = async (categoryId, gameId, updatedFields) => {
        if (!user.admin) return;
        
        console.log('Updating game:', { categoryId, gameId, updatedFields });
        
        // Immediate upload for responsiveness
        setCategories(categories.map(c => 
            c.id === categoryId 
                ? { ...c, games: c.games.map(g => 
                    g.id === gameId ? { ...g, ...updatedFields } : g
                )} 
                : c
        ));
        
        // Also update selectedGame if it's current one
        if (selectedGame && selectedGame.id === gameId) {
            setSelectedGame({ ...selectedGame, ...updatedFields });
        }
        
        // Send update to backend
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            console.log('Token:', token ? 'Exists' : 'Missing');
            
            const response = await fetch('http://localhost:8000/api/update_product/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: gameId,
                    ...updatedFields
                })
            });
            
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (!response.ok) {
                console.error('Failed to update game:', data.message);
            } else {
                console.log('Game updated successfully');
            }
        } catch (error) {
            console.error('Error updating game:', error);
        }
    };

    const handleGameClick = (game, category) => {
        console.log('Game clicked:', game);
        console.log('Category:', category);
        setSelectedGame({ ...game, categoryName: category.name, categoryId: category.id });
    };

    const handleBackFromGame = () => {
        setSelectedGame(null);
    };

    const handleAddToCart = (gameWithDetails) => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItemIndex = existingCart.findIndex(item => 
            item.id === gameWithDetails.id
        );
        
        if (existingItemIndex >= 0) {
            existingCart[existingItemIndex].quantity += gameWithDetails.quantity;
        } else {
            existingCart.push(gameWithDetails);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        
        const total = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
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

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    }, []);

    if (showAddGamePage && selectedCategory) {
        return (
            <AddGamePage
                categoryId={selectedCategory.id}
                categoryName={selectedCategory.name}
                user={user}
                onBack={handleBackFromAddGame}
                onGameAdded={handleGameAdded}
            />
        );
    }

    if (showCart) {
        return (
            <CartPage
                user={user}
                onBack={handleBackFromCart}
                onUpdateCart={(cart) => {
                    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
                    setCartCount(total);
                }}
            />
        );
    }

    if (selectedGame) {
        return (
            <GamePage
                game={selectedGame}
                categoryName={selectedGame.categoryName}
                user={user}
                onBack={handleBackFromGame}
                onAddToCart={handleAddToCart}
                onUpdateGame={handleUpdateGame}
            />
        );
    }

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
        const filteredGames = selectedCategory.games.filter(game => 
            game.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div>
                <div className="navbar">
                    <div className="nav-content">
                        <div className="logo">Game Shop</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                                Back to Categories
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="main-content">
                    <div className="content-wrapper">
                        <h1 className="page-title">{selectedCategory.name} Games</h1>
                        
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

                            <div className="search-container">
                                <div className="search-wrapper">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search for games..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => setShowSearchResults(true)}
                                        onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                                    />
                                
                                    {searchQuery && (
                                        <button
                                            className="search-clear-btn"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setShowSearchResults(false);
                                            }}
                                            aria-label="Clear search"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {showSearchResults && searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((game, index) => (
                                            <div
                                                key={index}
                                                className="search-result-item"
                                                onClick={() => handleSearchResultClick(game, game.categoryId)}
                                            >
                                                <div className="search-result-name">{game.title}</div>
                                                <div className="search-result-category">
                                                    {game.categoryName}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {showSearchResults && searchQuery && searchResults.length === 0 && (
                                    <div className="no-results">
                                        No games found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        
                            {user.is_admin && (
                                <button 
                                    className="btn-add" 
                                    onClick={handleAddGameClick}
                                >
                                    + Add Game
                                </button>
                            )}
                        </div>
                        
                        {/* Games Grid */}
                        <div className="cards-grid">
                            {getSortedGames(filteredGames).map(game => (
                                <div key={game.id} className="game-card" onClick={() => handleGameClick(game, selectedCategory)}>
                                    <div className="game-image">
                                        [Image: {game.image}]
                                    </div>
                                    <div className="game-info" onClick={(e) => e.stopPropagation()}>
                                        {editingGame === game.id ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                defaultValue={game.title}
                                                onBlur={(e) => {
                                                    handleRenameGame(selectedCategory.id, game.id, e.target.value);
                                                    setEditingGame(null);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleRenameGame(selectedCategory.id, game.id, e.target.value);
                                                        setEditingGame(null);
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="game-name">{game.title}</h3>
                                        )}
                                        
                                        {user.is_admin && (
                                            <div className="game-actions">
                                                <button 
                                                    className="btn-rename" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingGame(game.id);
                                                    }}
                                                >
                                                    Rename
                                                </button>
                                                <button 
                                                    className="btn-delete" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteGame(selectedCategory.id, game.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredGames.length === 0 && searchQuery && (
                                <div className="no-search-results">
                                    No games found matching "{searchQuery}" in {selectedCategory.name}
                                </div>
                            )}
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
                        
                        <button className="cart-icon" onClick={handleCartClick} title="View Cart">
                            🛒
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>

                        <div className="profile-container">
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
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-item logout-dropdown-item" onClick={onLogout}>
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
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

                        <div className="search-container">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search for games..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setShowSearchResults(true)}
                                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                                />
                            
                                {searchQuery && (
                                    <button
                                        className="search-clear-btn"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSearchResults(false);
                                        }}
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {showSearchResults && searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map((game, index) => (
                                        <div
                                            key={index}
                                            className="search-result-item"
                                            onClick={() => {
                                                handleSearchResultClick(game, game.categoryId);
                                                setShowSearchResults(false);
                                            }}
                                        >
                                            <div className="search-result-name">{game.title}</div>
                                            <div className="search-result-category">
                                                {game.categoryName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {showSearchResults && searchQuery && searchResults.length === 0 && (
                                <div className="no-results">
                                    No games found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                        
                        {user.is_admin && (
                            <button 
                                className="btn-add" 
                                onClick={() => setShowAddCategory(true)}
                            >
                                + Add Category
                            </button>
                        )}
                    </div>

                    {showAddCategory && user.is_admin && (
                        <div className="add-form-container">
                            <h3 className="form-title">Add New Category</h3>
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="form-input"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Image URL (optional)"
                                className="form-input"
                                value={newCategoryImage}
                                onChange={(e) => setNewCategoryImage(e.target.value)}
                            />
                            <div className="form-buttons">
                                <button className="btn-save" onClick={handleAddCategory}>Save</button>
                                <button className="btn-cancel" onClick={() => setShowAddCategory(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="cards-grid">
                        {displayedCategories
                            .map(category => ({
                                ...category,
                                filteredGames: category.games.filter(game => 
                                    game.title.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                            }))
                            .filter(category => 
                                searchQuery === '' || category.filteredGames.length > 0
                            )
                            .map(category => (
                                <div 
                                    key={category.id} 
                                    className="category-card"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="category-image">
                                        [Image: {category.image}]
                                    </div>
                                    <div className="category-info" onClick={(e) => e.stopPropagation()}>
                                        {editingCategory === category.id ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                defaultValue={category.name}
                                                onBlur={(e) => {
                                                    handleRenameCategory(category.id, e.target.value);
                                                    setEditingCategory(null);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleRenameCategory(category.id, e.target.value);
                                                        setEditingCategory(null);
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="category-header">
                                                <h3 className="category-name">{category.name}</h3>
                                                <span className="game-count">
                                                    {searchQuery ? category.filteredGames.length : category.games.length} games
                                                </span>
                                            </div>
                                        )}
                                        
                                        {user.is_admin && (
                                            <div className="category-actions">
                                                <button 
                                                    className="btn-rename" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingCategory(category.id);
                                                    }}
                                                >
                                                    Rename
                                                </button>
                                                <button 
                                                    className="btn-delete" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCategory(category.id);
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