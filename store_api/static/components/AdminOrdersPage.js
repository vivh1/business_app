const { useState, useEffect } = React;

function AdminOrdersPage({ user, onBack }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');
    const [filterUser, setFilterUser] = useState('');

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            const response = await fetch('http://localhost:8000/api/all/', {
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

    const getSortedAndFilteredOrders = () => {
        let filtered = [...orders];
        
        // Filter by username if search exists
        if (filterUser.trim()) {
            filtered = filtered.filter(order => 
                order.user?.username?.toLowerCase().includes(filterUser.toLowerCase())
            );
        }
        
        // Sort by date
        if (sortOrder === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        
        return filtered;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const displayedOrders = getSortedAndFilteredOrders();

    return (
        <div className="admin-orders-page">
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
                    <h1 className="page-title">All Orders</h1>
                    
                    <div className="filters-container">
                        <div className="filter-group">
                            <span className="filter-label">Sort by:</span>
                            <select 
                                className="filter-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Filter by username..."
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                            />
                            {filterUser && (
                                <button
                                    className="search-clear-btn"
                                    onClick={() => setFilterUser('')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading orders...</div>
                    ) : displayedOrders.length === 0 ? (
                        <div className="no-orders">
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {displayedOrders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-user">
                                            User: {order.user?.username || 'Unknown'}
                                        </span>
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
                    
                    <div className="total-orders">
                        <p>Total Orders: {orders.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}