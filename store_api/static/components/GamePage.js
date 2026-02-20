const { useState } = React;

function GamePage({ game, categoryName, user, onBack, onAddToCart, onUpdateGame }) {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(game.platform || "PC");
    
    // Editing states
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingPrice, setEditingPrice] = useState(false);
    const [editingReleaseDate, setEditingReleaseDate] = useState(false);
    const [editingDeveloper, setEditingDeveloper] = useState(false);
    const [editingPublisher, setEditingPublisher] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState(false);
    const [editingGenre, setEditingGenre] = useState(false);
    
    // Temp values for editing
    const [tempDescription, setTempDescription] = useState(game.description || "");
    const [tempPrice, setTempPrice] = useState(game.price || "29.99");
    const [tempReleaseDate, setTempReleaseDate] = useState(game.releaseDate || "TBA");
    const [tempDeveloper, setTempDeveloper] = useState(game.developer || "Unknown");
    const [tempPublisher, setTempPublisher] = useState(game.publisher || "Unknown");
    const [tempPlatform, setTempPlatform] = useState(game.platform || "PC");
    const [tempGenre, setTempGenre] = useState(game.genre || categoryName);

    const [editingImage, setEditingImage] = useState(false);
    const [tempImage, setTempImage] = useState(game.image || "");
    const [imageFile, setImageFile] = useState(null);

    const platformOptions = ["PC", "XBOX", "PlayStation 4", "PlayStation 5", "Nintendo Switch", "Mobile"];

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        onAddToCart({
            ...game,
            categoryName,
            quantity,
            platform: selectedPlatform
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleSaveDescription = () => {
        onUpdateGame(game.categoryId, game.id, { description: tempDescription });
        game.description = tempDescription;
        setEditingDescription(false);
    };

    const handleSavePrice = () => {
        onUpdateGame(game.categoryId, game.id, { price: tempPrice });
        game.price = tempPrice;
        setEditingPrice(false);
    };

    const handleSaveReleaseDate = () => {
        onUpdateGame(game.categoryId, game.id, { releaseDate: tempReleaseDate });
        game.releaseDate = tempReleaseDate;
        setEditingReleaseDate(false);
    };

    const handleSaveDeveloper = () => {
        onUpdateGame(game.categoryId, game.id, { developer: tempDeveloper });
        game.developer = tempDeveloper;
        setEditingDeveloper(false);
    };

    const handleSavePublisher = () => {
        onUpdateGame(game.categoryId, game.id, { publisher: tempPublisher });
        game.publisher = tempPublisher;
        setEditingPublisher(false);
    };

    const handleSavePlatform = () => {
        onUpdateGame(game.categoryId, game.id, { platform: tempPlatform });
        game.platform = tempPlatform;
        setSelectedPlatform(tempPlatform);
        setEditingPlatform(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveImage = () => {
        onUpdateGame(game.categoryId, game.id, { image: tempImage });
        game.image = tempImage;
        setEditingImage(false);
        setImageFile(null);
    };

    const handleRemoveImage = () => {
        setTempImage("");
        if (onUpdateGame) {
            onUpdateGame(game.categoryId, game.id, { image: "" });
        }
        game.image = "";
        setEditingImage(false);
        setImageFile(null);
    };

    const handleSaveGenre = () => {
        onUpdateGame(game.categoryId, game.id, { genre: tempGenre });
        game.genre = tempGenre;
        setEditingGenre(false);
    };

    return (
        <div className="game-details-page">
            <div className="navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Cart Icon - Same as MainPage */}
                    <button className="cart-icon" onClick={onCartClick} title="View Cart">
                        🛒
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                    
                    {/* Back button */}
                    <button className="back-btn" onClick={onBack}>
                        ← Back to {categoryName}
                    </button>
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-wrapper">
                    <div className="game-details-container">
                        <div className="game-details-grid">
                            {/* Left Column - Image and Description */}
                            <div className="game-details-info">
                                {/* Image Section */}
                                <div className="game-details-image-section">
                                    {editingImage ? (
                                        <div className="image-edit-section">
                                            <div className="game-details-image">
                                                {tempImage ? (
                                                    <img src={tempImage} alt={game.name} className="game-image-preview" />
                                                ) : (
                                                    <div className="game-details-image-placeholder">
                                                        [No Image]
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="image-upload-controls">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="image-upload-input"
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload" className="image-upload-label">
                                                    Choose Image
                                                </label>
                                                
                                                {tempImage && (
                                                    <button 
                                                        className="btn-delete" 
                                                        onClick={handleRemoveImage}
                                                    >
                                                        Remove Image
                                                    </button>
                                                )}
                                                
                                                <div className="edit-actions">
                                                    <button className="btn-save" onClick={handleSaveImage}>Save</button>
                                                    <button className="btn-cancel" onClick={() => {
                                                        setEditingImage(false);
                                                        setTempImage(game.image || "");
                                                        setImageFile(null);
                                                    }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="game-details-image">
                                                {game.image ? (
                                                    <img src={game.image} alt={game.name} className="game-image-display" />
                                                ) : (
                                                    <div className="game-details-image-placeholder">
                                                        [Image: {game.image || "No Image"}]
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Image Edit Button - Between Image and Description */}
                                            {user?.is_admin && !editingImage && (
                                                <div className="image-edit-button-container">
                                                    <button 
                                                        className="btn-rename image-edit-button" 
                                                        onClick={() => setEditingImage(true)}
                                                    >
                                                        Edit Image
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                {/* Description Section - Now restored */}
                                <div className="game-details-section">
                                    <div className="section-header">
                                        <h3 className="game-details-section-title">Description</h3>
                                        {user?.is_admin && !editingDescription && (
                                            <button 
                                                className="btn-rename" 
                                                onClick={() => setEditingDescription(true)}
                                            >
                                                Edit Description
                                            </button>
                                        )}
                                    </div>
                                    
                                    {editingDescription ? (
                                        <div className="edit-section">
                                            <textarea
                                                className="edit-textarea"
                                                defaultValue={game.description || ""}
                                                onChange={(e) => setTempDescription(e.target.value)}
                                            />
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={handleSaveDescription}>Save</button>
                                                <button className="btn-cancel" onClick={() => setEditingDescription(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="game-details-description">
                                            {game.description || "No description available for this game."}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Right Column - Details */}
                            <div className="game-details-right">
                                <h1 className="game-details-title">{game.name}</h1>
                                
                                <div className="game-details-meta">
                                    <span className="game-details-category">
                                        Category: {categoryName}
                                    </span>
                                    <span className="game-details-id">
                                        Game #{game.id}
                                    </span>
                                </div>
                                
                                {/* Price with Admin Controls */}
                                <div className="game-details-section">
                                    <div className="section-header">
                                        <h3 className="game-details-section-title">Price</h3>
                                        {user?.is_admin && !editingPrice && (
                                            <button className="btn-rename" onClick={() => setEditingPrice(true)}>Edit Price</button>
                                        )}
                                    </div>
                                    
                                    {editingPrice ? (
                                        <div className="edit-section">
                                            <input
                                                type="text"
                                                className="edit-input"
                                                defaultValue={game.price || "29.99"}
                                                onChange={(e) => setTempPrice(e.target.value)}
                                            />
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={handleSavePrice}>Save</button>
                                                <button className="btn-cancel" onClick={() => setEditingPrice(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="game-details-price">${game.price || "29.99"}</div>
                                    )}
                                </div>
                                
                                {/* Platform Selector - For everyone */}
                                <div className="game-details-section">
                                    <h3 className="game-details-section-title">Platform</h3>
                                    <div className="platform-selector">
                                        <select 
                                            className="platform-select"
                                            value={selectedPlatform}
                                            onChange={(e) => setSelectedPlatform(e.target.value)}
                                        >
                                            {platformOptions.map(platform => (
                                                <option key={platform} value={platform}>{platform}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Quantity and Add to Cart */}
                                <div className="game-details-section">
                                    <h3 className="game-details-section-title">Purchase</h3>
                                    <div className="game-details-purchase">
                                        <div className="game-details-quantity">
                                            <label htmlFor="quantity">Quantity:</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                min="1"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="quantity-input"
                                            />
                                        </div>
                                        
                                        <button 
                                            className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                            onClick={handleAddToCart}
                                        >
                                            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Additional Details with Admin Controls */}
                                <div className="game-details-section">
                                    <div className="section-header">
                                        <h3 className="game-details-section-title">Game Details</h3>
                                    </div>
                                    <ul className="game-details-list">
                                        <li>
                                            <strong>Release Date:</strong>
                                            {user?.is_admin && !editingReleaseDate && (
                                                <button className="inline-edit-btn" onClick={() => setEditingReleaseDate(true)}>Edit</button>
                                            )}
                                            {editingReleaseDate ? (
                                                <span className="inline-edit">
                                                    <input
                                                        type="text"
                                                        className="inline-input"
                                                        defaultValue={game.releaseDate || "TBA"}
                                                        onChange={(e) => setTempReleaseDate(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveReleaseDate}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingReleaseDate(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.releaseDate || "TBA"}</span>
                                            )}
                                        </li>
                                        <li>
                                            <strong>Developer:</strong>
                                            {user?.is_admin && !editingDeveloper && (
                                                <button className="inline-edit-btn" onClick={() => setEditingDeveloper(true)}>Edit</button>
                                            )}
                                            {editingDeveloper ? (
                                                <span className="inline-edit">
                                                    <input
                                                        type="text"
                                                        className="inline-input"
                                                        defaultValue={game.developer || "Unknown"}
                                                        onChange={(e) => setTempDeveloper(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveDeveloper}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingDeveloper(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.developer || "Unknown"}</span>
                                            )}
                                        </li>
                                        <li>
                                            <strong>Publisher:</strong>
                                            {user?.is_admin && !editingPublisher && (
                                                <button className="inline-edit-btn" onClick={() => setEditingPublisher(true)}>Edit</button>
                                            )}
                                            {editingPublisher ? (
                                                <span className="inline-edit">
                                                    <input
                                                        type="text"
                                                        className="inline-input"
                                                        defaultValue={game.publisher || "Unknown"}
                                                        onChange={(e) => setTempPublisher(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSavePublisher}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingPublisher(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.publisher || "Unknown"}</span>
                                            )}
                                        </li>
                                        <li>
                                            <strong>Platform:</strong>
                                            {user?.is_admin && !editingPlatform && (
                                                <button className="inline-edit-btn" onClick={() => setEditingPlatform(true)}>Edit</button>
                                            )}
                                            {editingPlatform ? (
                                                <span className="inline-edit">
                                                    <select
                                                        className="inline-select"
                                                        defaultValue={game.platform || "PC"}
                                                        onChange={(e) => setTempPlatform(e.target.value)}
                                                    >
                                                        {platformOptions.map(p => (
                                                            <option key={p} value={p}>{p}</option>
                                                        ))}
                                                    </select>
                                                    <button className="inline-save" onClick={handleSavePlatform}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingPlatform(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.platform || "PC"}</span>
                                            )}
                                        </li>
                                        <li>
                                            <strong>Genre:</strong>
                                            {user?.is_admin && !editingGenre && (
                                                <button className="inline-edit-btn" onClick={() => setEditingGenre(true)}>Edit</button>
                                            )}
                                            {editingGenre ? (
                                                <span className="inline-edit">
                                                    <input
                                                        type="text"
                                                        className="inline-input"
                                                        defaultValue={game.genre || categoryName}
                                                        onChange={(e) => setTempGenre(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveGenre}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingGenre(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.genre || categoryName}</span>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}