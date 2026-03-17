const { useState, useEffect } = React;

function UserOrdersPage({ user, targetUser, onBack }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            const response = await fetch(`http://localhost:8000/api/user/${targetUser.id}/`, {
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
            console.error('Error fetching user orders:', error);
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

    return (
        <div className="user-orders-page">
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <button className="back-btn" onClick={onBack}>
                        ← Back to Users
                    </button>
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title-grey">
                        Orders from {targetUser.username}
                    </h1>
                    
                    <div className="filters-container" style={{ marginBottom: '2rem' }}>
                        <div className="filter-group">
                            <span className="filter-label">Sort:</span>
                            <select 
                                className="filter-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
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
                            <p>This user hasn't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {getSortedOrders().map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">Order ID: #{order.id}</span>
                                        <span className="order-date">{formatDate(order.created_at)}</span>
                                        <span className={`order-status status-${order.status}`}>
                                            {order.status}
                                        </span>
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
    );
}