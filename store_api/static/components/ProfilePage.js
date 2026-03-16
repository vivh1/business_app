const { useState, useEffect } = React;

function ProfilePage({ user, onBack }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [editingAvatar, setEditingAvatar] = useState(false);
    const [editingBanner, setEditingBanner] = useState(false);

    const refreshOrders = async () => {
        await fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            const response = await fetch('http://localhost:8000/api/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSortedOrders = () => {
        const sorted = [...orders];
        if (sortOrder === 'newest') {
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        return sorted;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBanner(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page">
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <button className="back-btn" onClick={onBack}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-wrapper">
                    {/* Banner Section */}
                    <div className="profile-banner">
                        {banner ? (
                            <img src={banner} alt="Banner" className="banner-image" />
                        ) : (
                            <div className="banner-placeholder">
                            </div>
                        )}

                    </div>

                    {/* Profile Info Section */}
                    <div className="profile-info-container">
                        <div className="profile-avatar">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="avatar-image" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="profile-details">
                            <h1 className="profile-username">{user.username}</h1>
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-member-since">
                                Member since: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="orders-section">
                        <div className="orders-header">
                            <h2>Your Orders</h2>
                            <div className="sort-orders">
                                <label>Sort by:</label>
                                <select 
                                    value={sortOrder} 
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-spinner">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                                <button className="shop-now-btn" onClick={onBack}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {getSortedOrders().map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <span className="order-id">Order #{order.id}</span>
                                            <span className="order-date">{formatDate(order.created_at)}</span>
                                        </div>
                                        
                                        <div className="order-items-list">
                                            {order.items.map(item => (
                                                <div key={item.id} className="order-item-row">
                                                    <span className="item-name">{item.product_title}</span>
                                                    <span className="item-quantity">x{item.quantity}</span>
                                                    <span className="item-price">
                                                        ${parseFloat(item.price_at_purchase).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="order-footer">
                                            <span className="order-total-label">Total:</span>
                                            <span className="order-total">${order.total_price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}