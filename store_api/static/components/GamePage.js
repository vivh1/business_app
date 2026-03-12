const { useState } = React;

function GamePage({ game, categoryName, user, onBack, onAddToCart, onUpdateGame }) {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    
    // Editing states
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingPrice, setEditingPrice] = useState(false);
    const [editingReleaseDate, setEditingReleaseDate] = useState(false);
    const [editingDeveloper, setEditingDeveloper] = useState(false);
    const [editingGenre, setEditingGenre] = useState(false);
    const [editingImage, setEditingImage] = useState(false);
    
    // Temp values were here before, now I still use them to initialize data cause I was too lazy to change all the names
    const [tempDescription, setTempDescription] = useState(game.description);
    const [tempPrice, setTempPrice] = useState(game.price);
    const [tempReleaseDate, setTempReleaseDate] = useState(game.release_date);
    const [tempDeveloper, setTempDeveloper] = useState(game.developer);
    const [tempGenre, setTempGenre] = useState(game.genre);
    const [tempImage, setTempImage] = useState(game.image);
    const [imageFile, setImageFile] = useState(null);

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
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleSaveDescription = () => {
        onUpdateGame(game.id, { description: tempDescription });
        setEditingDescription(false);
    };

    const handleSavePrice = () => {
        onUpdateGame(game.id, { price: tempPrice });
        setEditingPrice(false);
    };

    const handleSaveReleaseDate = () => {
        onUpdateGame(game.id, { release_date: tempReleaseDate });
        setEditingReleaseDate(false);
    };

    const handleSaveDeveloper = () => {
        onUpdateGame(game.id, { developer: tempDeveloper });
        setEditingDeveloper(false);
    };

    const handleSaveGenre = () => {
        onUpdateGame(game.id, { genre: tempGenre });
        setEditingGenre(false);
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
        onUpdateGame(game.id, { image: tempImage });
        setEditingImage(false);
        setImageFile(null);
    };

    const handleRemoveImage = () => {
        setTempImage("");
        onUpdateGame(game.id, { image: "" });
        setEditingImage(false);
        setImageFile(null);
    };

    return (
        <div className="game-details-page">
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
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
                                                    <img src={tempImage} alt={game.title} className="game-image-preview" />
                                                ) : (
                                                    <div className="game-details-image-placeholder">
                                                        No Image
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
                                                        setTempImage(game.image);
                                                        setImageFile(null);
                                                    }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="game-details-image">
                                                {game.image ? (
                                                    <img src={ `http://localhost:8000${game.image}`} alt={game.title} className="game-image-display" />
                                                ) : (
                                                    <div className="game-details-image-placeholder">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            
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
                                
                                {/* Description Section */}
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
                                                value={tempDescription}
                                                onChange={(e) => setTempDescription(e.target.value)}
                                            />
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={handleSaveDescription}>Save</button>
                                                <button className="btn-cancel" onClick={() => setEditingDescription(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="game-details-description">
                                            {game.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Right Column - Details */}
                            <div className="game-details-right">
                                <h1 className="game-details-title">{game.title}</h1>
                                
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
                                                type="number"
                                                step="0.01"
                                                className="edit-input"
                                                value={tempPrice}
                                                onChange={(e) => setTempPrice(e.target.value)}
                                            />
                                            <div className="edit-actions">
                                                <button className="btn-save" onClick={handleSavePrice}>Save</button>
                                                <button className="btn-cancel" onClick={() => setEditingPrice(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="game-details-price">${parseFloat(game.price).toFixed(2)}</div>
                                    )}
                                </div>
                                
                                {/* Stock Quantity Display */}
                                <div className="game-details-section">
                                    <h3 className="game-details-section-title">Availability</h3>
                                    <p className="game-details-stock">
                                        {game.quantity > 0 ? `${game.quantity} units in stock` : 'Out of stock'}
                                    </p>
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
                                                max={game.quantity || 1}
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="quantity-input"
                                                disabled={!game.quantity || game.quantity === 0}
                                            />
                                        </div>
                                        
                                        <button 
                                            className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                            onClick={handleAddToCart}
                                            disabled={!game.quantity || game.quantity === 0}
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
                                                        type="date"
                                                        className="inline-input"
                                                        value={tempReleaseDate}
                                                        onChange={(e) => setTempReleaseDate(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveReleaseDate}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingReleaseDate(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.release_date}</span>
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
                                                        value={tempDeveloper}
                                                        onChange={(e) => setTempDeveloper(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveDeveloper}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingDeveloper(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.developer}</span>
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
                                                        value={tempGenre}
                                                        onChange={(e) => setTempGenre(e.target.value)}
                                                    />
                                                    <button className="inline-save" onClick={handleSaveGenre}>✓</button>
                                                    <button className="inline-cancel" onClick={() => setEditingGenre(false)}>✗</button>
                                                </span>
                                            ) : (
                                                <span>{game.genre}</span>
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