const { useState } = React;

function AddGamePage({ categoryId, categoryName, user, onBack, onGameAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        quantity: 1,
        release_date: '',
        developer: '',
        genre: categoryName || '',
        image: '',
        description: '',
        price: '29.99'
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const genreOptions = [
        'Action', 'Indie', 'RPG', 'Strategy', 
        'Pixel Graphics', 'Horror', 'Metroidvania', 'Survival Horror', 'Fantasy'
    ];

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validation
        if (!formData.title) {
            setMessage('Title is required');
            setLoading(false);
            return;
        }
        if (!formData.release_date) {
            setMessage('Release date is required');
            setLoading(false);
            return;
        }
        if (!formData.genre) {
            setMessage('Genre is required');
            setLoading(false);
            return;
        }

        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            console.log('Sending data:', {
                title: formData.title,
                quantity: parseInt(formData.quantity) || 1,
                release_date: formData.release_date,
                developer: formData.developer || 'Unknown',
                genre: formData.genre.toLowerCase(),
                description: formData.description || '',
                price: parseFloat(formData.price) || 29.99,
                image: imagePreview || ''
            });

            const response = await fetch('http://localhost:8000/api/add_product/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    quantity: parseInt(formData.quantity) || 1,
                    release_date: formData.release_date,
                    developer: formData.developer || 'Unknown',
                    genre: formData.genre.toLowerCase(),
                    description: formData.description || '',
                    price: parseFloat(formData.price) || 29.99,
                    image: imagePreview || ''
                })
            });

            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                setMessage('Game added successfully!');
                
                // Reset form
                setFormData({
                    title: '',
                    quantity: 1,
                    release_date: '',
                    developer: '',
                    genre: categoryName || '',
                    image: '',
                    description: '',
                    price: '29.99'
                });
                setImagePreview(null);
                setImageFile(null);
                
                if (onGameAdded) {
                    onGameAdded(data);
                }
                
                setTimeout(() => {
                    onBack();
                }, 1500);
            } else {
                setMessage(data.message || `Failed to add game: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding game:', error);
            setMessage('Failed to add game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-game-page">
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
                    <h1 className="page-title">Add New Game to {categoryName}</h1>
                    
                    <div className="add-game-container">
                        <form onSubmit={handleSubmit} className="add-game-form">
                            <div className="form-grid">
                                {/* Left Column */}
                                <div className="form-left">
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Game title"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                min="1"
                                                step="1"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Price ($)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Release Date *</label>
                                        <input
                                            type="date"
                                            name="release_date"
                                            value={formData.release_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Developer</label>
                                        <input
                                            type="text"
                                            name="developer"
                                            value={formData.developer}
                                            onChange={handleChange}
                                            placeholder="Developer name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Genre *</label>
                                        <select
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">--- Select Genre ---</option>
                                            {genreOptions.map(genre => (
                                                <option key={genre} value={genre}>
                                                    {genre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="form-right">
                                    <div className="form-group">
                                        <label>Image</label>
                                        <div className="image-upload-area">
                                            {imagePreview ? (
                                                <img 
                                                    src={imagePreview} 
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
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="image-input"
                                            />
                                            <label htmlFor="image-upload" className="image-upload-label">
                                                Choose File
                                            </label>
                                            <span className="file-name">
                                                {imageFile ? imageFile.name : 'No file chosen'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="6"
                                            placeholder="Game description"
                                        />
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'SAVE'}
                                </button>
                                <button type="button" className="save-another-btn" disabled={loading}>
                                    Save and add another
                                </button>
                                <button type="button" className="save-continue-btn" disabled={loading}>
                                    Save and continue editing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}