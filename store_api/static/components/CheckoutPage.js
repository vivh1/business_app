const { useState } = React;

function CheckoutPage({ user, cart, onBack, onOrderPlaced }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0).toFixed(2);
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setMessage('Your cart is empty');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;

            const orderItems = cart.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price_at_purchase: parseFloat(item.price)
            }));

            const response = await fetch('http://localhost:8000/api/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: orderItems,
                    total_price: calculateTotal()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Your order has been placed successfully!');
                
                // Clear cart from localStorage
                localStorage.setItem('cart', JSON.stringify([]));
                
                // Pass the order data back to parent
                if (onOrderPlaced) {
                    onOrderPlaced(data);
                }
                
                // Don't call onBack() here - let the parent handle navigation after message
                setLoading(false);
            } else {
                setMessage(data.message || 'Failed to place order');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setMessage('Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <button className="back-btn" onClick={onBack}>
                        ← Back to Cart
                    </button>
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title">Checkout</h1>
                    
                    <div className="checkout-container">
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            
                            <div className="order-items">
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.platform}`} className="order-item">
                                        <div className="order-item-details">
                                            <h4>{item.name}</h4>
                                            <p>Platform: {item.platform || 'PC'}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="order-item-price">
                                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-total">
                                <strong>Total:</strong>
                                <span>${calculateTotal()}</span>
                            </div>
                        </div>
                        
                        <div className="checkout-actions">
                            {message && (
                                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}
                            
                            <button 
                                className="place-order-btn"
                                onClick={handlePlaceOrder}
                                disabled={loading || cart.length === 0}
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                            
                            <button className="continue-shopping-link" onClick={onBack}>
                                ← Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}