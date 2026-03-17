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
            
            console.log('Token:', token ? 'exists' : 'missing');
            console.log('Cart items:', cart);

            const orderItems = cart.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price_at_purchase: parseFloat(item.price)
            }));
            
            console.log('Order items being sent:', orderItems);
            console.log('Total price:', calculateTotal());

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

            console.log('Response status:', response.status);
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            let data;
            try {
                data = JSON.parse(text);
                console.log('Parsed data:', data);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                setMessage('Server error: ' + text.substring(0, 100));
                setLoading(false);
                return;
            }

            if (response.ok) {
                setMessage('Your order has been placed successfully!');
                
                // Clear cart from backend
                await fetch('http://localhost:8000/api/cart/clear/', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (onOrderPlaced) {
                    onOrderPlaced(data);
                }
                
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
                    <h1 className="page-title-grey">Checkout</h1>
                    
                    <div className="checkout-container">
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            
                            <div className="order-items">
                                {cart.map(item => (
                                    <div key={item.id} className="order-item">
                                        <div className="order-item-details">
                                            <h4>{item.product_title}</h4>
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