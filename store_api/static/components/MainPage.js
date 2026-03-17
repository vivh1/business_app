const { useState, useEffect } = React;

function MainPage({ user, onLogout }) {
    console.log('User object:', user);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [showManageUsers, setShowManageUsers] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
    const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingGame, setEditingGame] = useState(null);
    const [showAddGamePage, setShowAddGamePage] = useState(false);
    const [newGameName, setNewGameName] = useState('');
    const [newGameImage, setNewGameImage] = useState('');

    const [editingCategoryImage, setEditingCategoryImage] = useState(null);
    const [editingCategoryImagePreview, setEditingCategoryImagePreview] = useState(null);
    const [categoryImageFile, setCategoryImageFile] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [selectedGame, setSelectedGame] = useState(null);

    const [showCart, setShowCart] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [categories, setCategories] = useState([]);

    const [showProfile, setShowProfile] = useState(false);

    const [showAdminOrders, setShowAdminOrders] = useState(false);
    

    const fetchCartCount = async () => {
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch('http://localhost:8000/api/cart/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const total = data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(total);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    useEffect(() => {
        fetchCartCount();
        
        const handleStorageChange = () => {
            fetchCartCount();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Categories data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                const response = await fetch('http://localhost:8000/api/categories/', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                
                const categoriesData = await response.json();
                
                // Also fetch products to get games for each category
                const productsResponse = await fetch('http://localhost:8000/api/products/', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const productsData = await productsResponse.json();
                
                // Group products by category
                const productsByCategory = {};
                productsData.forEach(product => {
                    const categoryName = product.genre;
                    if (!productsByCategory[categoryName]) {
                        productsByCategory[categoryName] = [];
                    }
                    productsByCategory[categoryName].push({
                        id: product.id,
                        title: product.title,
                        name: product.title,
                        image: product.image,
                        description: product.description,
                        price: product.price,
                        release_date: product.release_date,
                        developer: product.developer,
                        genre: product.genre,
                        quantity: product.quantity
                    });
                });
                
                // Format categories with their games
                const formatted = categoriesData.map((category, index) => ({
                    id: category.id || index + 1,
                    name: category.name,
                    image: category.image || '',
                    games: productsByCategory[category.name] || []
                }));
                
                setCategories(formatted);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        };

        // Listen for storage events (when cart is cleared)
        window.addEventListener('storage', handleStorageChange);
        
        // Initial load
        handleStorageChange();
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const [sortOrder, setSortOrder] = useState('default');

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleProfileClick = () => {
        setShowProfile(true);
        setShowDropdown(false);
    };

    const handleBackFromProfile = () => {
        setShowProfile(false);
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
    const handleAddCategory = async () => {
        if (!user.is_admin) return;
        if (newCategoryName.trim()) {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                console.log('Sending category data:', {
                    name: newCategoryName,
                    hasImage: !!newCategoryImagePreview
                });
                
                const response = await fetch('http://localhost:8000/api/categories/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: newCategoryName,
                        image: newCategoryImagePreview || ''
                    })
                });
                
                console.log('Response status:', response.status);
                
                // Check content type
                const contentType = response.headers.get('content-type');
                console.log('Content-Type:', contentType);
                
                // Get the response text first
                const text = await response.text();
                console.log('Response text (first 200 chars):', text.substring(0, 200));
                
                // Try to parse as JSON
                try {
                    const data = JSON.parse(text);
                    console.log('Parsed JSON:', data);
                    
                    if (response.ok) {
                        await refetchCategories();
                        setNewCategoryName('');
                        setNewCategoryImagePreview(null);
                        setNewCategoryImageFile(null);
                        setShowAddCategory(false);
                    } else {
                        alert(data.message || `Failed to add category: ${response.status}`);
                    }
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    alert('Server returned invalid JSON. Check console for details.');
                }
            } catch (error) {
                console.error('Error adding category:', error);
                alert('Failed to add category: ' + error.message);
            }
        }
    };

    const handleCategoryImageChange = async (e) => {
        console.log('File selected:', e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            setNewCategoryImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {

                setNewCategoryImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        await refetchCategories();
    };

    const handleSaveCategoryImage = async (categoryId) => {
        if (!user.is_admin) return;
        
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch('http://localhost:8000/api/categories/update/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: categoryId,
                    image: editingCategoryImagePreview || ''
                }),
            });
            
            if (response.ok) {
                await refetchCategories();
                setEditingCategoryImage(null);
                setEditingCategoryImagePreview(null);
                setCategoryImageFile(null);
            }
        } catch (error) {
            console.error('Error updating category image:', error);
        }
    };

    const handleRemoveCategoryImage = async (categoryId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to remove this category image?')) {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                const response = await fetch('http://localhost:8000/api/categories/update/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: categoryId,
                        image: "" // Send empty string to remove image
                    })
                });
                
                if (response.ok) {
                    await refetchCategories();
                }
            } catch (error) {
                console.error('Error removing category image:', error);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!user.is_admin) return;
        if (window.confirm('Are you sure you want to delete this category and all its games?')) {
            try {
                const tokenData = JSON.parse(localStorage.getItem('accessToken'));
                const token = tokenData?.access;
                
                const categoryToDelete = categories.find(c => c.id === categoryId);
                
                const response = await fetch('http://localhost:8000/api/categories/delete/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: categoryToDelete.name })
                });
                
                if (response.ok) {
                    await refetchCategories();
                    if (selectedCategory && selectedCategory.id === categoryId) {
                        setSelectedCategory(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    // ...existing code...
    const handleRenameCategory = async (categoryId, newName) => {
        if (!user.is_admin) return;

        const trimmedName = (newName || '').trim();
        if (!trimmedName) return;

        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            const response = await fetch('http://localhost:8000/api/categories/update/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: categoryId,
                    name: trimmedName
                })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(data.message || 'Failed to rename category');
                return;
            }

            setCategories(prev =>
                prev.map(c => (c.id === categoryId ? { ...c, name: trimmedName } : c))
            );

            if (selectedCategory && selectedCategory.id === categoryId) {
                setSelectedCategory(prev => ({ ...prev, name: trimmedName }));
            }

            setEditingCategory(null);
            await refetchCategories();
        } catch (error) {
            console.error('Error renaming category:', error);
        }
    };

    // Game functions (Admin only)
    const handleAddGameClick = () => {
        setShowAddGamePage(true);
    };

    const handleBackFromAddGame = () => {
        setShowAddGamePage(false);
    };

    const handleGameAdded = async (newGame) => {
        // Refresh current category games
        await refetchProducts();
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
                
                const response = await fetch('http://localhost:8000/api/products/delete/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ id: gameId })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    await refetchProducts();
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
            handleUpdateGame(gameId, { title: newName });
        }
        setEditingGame(null);
    };

    const handleUpdateGame = async (gameId, updatedFields) => {
        if (!user.is_admin) return;

        // Find which category this game belongs to
        let foundCategoryId = null;
        const updatedCategories = categories.map(c => {
            const gameIndex = c.games.findIndex(g => g.id === gameId);
            if (gameIndex !== -1) {
                foundCategoryId = c.id;
                const updatedGames = [...c.games];
                updatedGames[gameIndex] = { ...updatedGames[gameIndex], ...updatedFields };
                return { ...c, games: updatedGames };
            }
            return c;
        });

        setCategories(updatedCategories);
        
        // Update selectedGame if it's the current one
        if (selectedGame && selectedGame.id === gameId) {
            setSelectedGame({ ...selectedGame, ...updatedFields });
        }
        
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            await fetch('http://localhost:8000/api/products/update/', {
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
        } catch (error) {
            console.error('Error updating game:', error);
        }
    };

    const refetchCategories = async () => {
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch('http://localhost:8000/api/categories/', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            
            const categoriesData = await response.json();
            
            // Also fetch products to get games for each category
            const productsResponse = await fetch('http://localhost:8000/api/products/', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const productsData = await productsResponse.json();
            
            // Group products by category
            const productsByCategory = {};
            productsData.forEach(product => {
                const categoryName = product.genre;
                if (!productsByCategory[categoryName]) {
                    productsByCategory[categoryName] = [];
                }
                productsByCategory[categoryName].push({
                    id: product.id,
                    title: product.title,
                    name: product.title,
                    image: product.image,
                    description: product.description,
                    price: product.price,
                    release_date: product.release_date,
                    developer: product.developer,
                    genre: product.genre,
                    quantity: product.quantity
                });
            });
            
            // Format categories with their games
            const formatted = categoriesData.map((category, index) => ({
                id: category.id || index + 1,
                name: category.name,
                image: category.image || '',
                games: productsByCategory[category.name] || []
            }));
            
            setCategories(formatted);
        } catch (err) {
            console.error('Error refetching categories:', err);
        }
    };

    const refetchProducts = async () => {
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

            // Convert to array matching existing structure
            const formatted = Object.entries(grouped).map(([genre, games], index) => ({
                id: index + 1,
                name: genre,
                image: games[0]?.image || '',
                games: games
            }));

            setCategories(formatted);
        } catch (err) {
            console.error('Error refetching products:', err);
        }
    };

    const handleGameClick = (game, category) => {
        setSelectedGame({ ...game, categoryName: category.name, categoryId: category.id });
    };

    const handleBackFromGame = () => {
        setSelectedGame(null);
    };

    const handleAdminOrdersClick = () => {
        setShowAdminOrders(true);
        setShowDropdown(false);
    };

    const handleAddToCart = (gameWithDetails) => {
        console.log('MainPage handleAddToCart received:', gameWithDetails);
        
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Existing cart:', existingCart);
        
        const existingItemIndex = existingCart.findIndex(item => 
            item.id === gameWithDetails.id
        );
        
        if (existingItemIndex >= 0) {
            existingCart[existingItemIndex].quantity += gameWithDetails.quantity;
            console.log('Updated existing item:', existingCart[existingItemIndex]);
        } else {
            existingCart.push(gameWithDetails);
            console.log('Added new item:', gameWithDetails);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        console.log('Cart saved to localStorage');
        
        const total = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
        console.log('Cart count updated to:', total);
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
    
    if (showAdminOrders) {
        return (
            <AdminOrdersPage
                user={user}
                onBack={() => setShowAdminOrders(false)}
            />
        );
    }

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

    if (showProfile) {
    return (
        <ProfilePage
            user={user}
            onBack={handleBackFromProfile}
        />
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
                        <h1 className="page-title-white">{selectedCategory.name} Games</h1>
                        
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
                                    {game.image ? (
                                        <img 
                                            src={game.image}
                                            alt={game.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
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
                                            <div className="admin-item" onClick={handleAdminOrdersClick}>
                                                View All Orders
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
                    <h1 className="page-title-white">Game Categories</h1>
                    
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
                        
                        {/* Image upload section - exactly like AddGamePage */}
                        <div className="form-group">
                            <label>Category Image</label>
                            <div className="image-upload-area">
                                {newCategoryImagePreview ? (
                                    <img 
                                        src={newCategoryImagePreview} 
                                        alt="Preview" 
                                        className="image-preview"
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        No image selected
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="category-image-upload"
                                    accept="image/*"
                                    onChange={handleCategoryImageChange}
                                    className="image-input"
                                />
                                <label htmlFor="category-image-upload" className="image-upload-label">
                                    Choose File
                                </label>
                                <span className="file-name">
                                    {newCategoryImageFile ? newCategoryImageFile.name : 'No file chosen'}
                                </span>
                            </div>
                        </div>
                        
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
                                    {category.image ? (
                                        <img 
                                            src={category.image}
                                            alt={category.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
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
                                        {user.is_admin && editingCategoryImage === category.id ? (
                                            <div className="category-image-edit" style={{ marginTop: '0.5rem' }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setCategoryImageFile(file);
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setEditingCategoryImagePreview(reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    id={`category-image-${category.id}`}
                                                    style={{ display: 'none' }}
                                                />
                                                <label htmlFor={`category-image-${category.id}`} className="btn-rename">
                                                    Choose Image
                                                </label>
                                                
                                                {/* Show preview immediately when image is selected */}
                                                {editingCategoryImagePreview && (
                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <img 
                                                            src={editingCategoryImagePreview} 
                                                            alt="Preview" 
                                                            style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Always show Save/Remove/Cancel when in edit mode, even before image selected */}
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    <button 
                                                        className="btn-save" 
                                                        onClick={() => handleSaveCategoryImage(category.id)}
                                                        disabled={!editingCategoryImagePreview} // Disable if no image selected
                                                    >
                                                        Save
                                                    </button>
                                                    {category.image && (
                                                        <button 
                                                            className="btn-delete" 
                                                            onClick={() => handleRemoveCategoryImage(category.id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn-cancel" 
                                                        onClick={() => {
                                                            setEditingCategoryImage(null);
                                                            setEditingCategoryImagePreview(null);
                                                            setCategoryImageFile(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : user.is_admin && (
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button 
                                                    className="btn-rename" 
                                                    onClick={() => {
                                                        setEditingCategoryImage(category.id);
                                                        setEditingCategoryImagePreview(null); // Reset preview when opening
                                                        setCategoryImageFile(null);
                                                    }}
                                                >
                                                    {category.image ? 'Change Image' : 'Add Image'}
                                                </button>
                                                {category.image && (
                                                    <button 
                                                        className="btn-delete" 
                                                        onClick={() => handleRemoveCategoryImage(category.id)}
                                                    >
                                                        Remove Image
                                                    </button>
                                                )}
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