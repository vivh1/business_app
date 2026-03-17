const { useState, useEffect } = React;

function CartPage({ user, onBack, onUpdateCart }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
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
                console.log('Cart data from backend:', data);
                setCartItems(data);
                if (onUpdateCart) onUpdateCart(data);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch(`http://localhost:8000/api/cart/update/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            
            if (response.ok) {
                await loadCart(); // Reload cart from backend
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch(`http://localhost:8000/api/cart/remove/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                await loadCart(); // Reload cart from backend
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;
        
        try {
            const tokenData = JSON.parse(localStorage.getItem('accessToken'));
            const token = tokenData?.access;
            
            const response = await fetch('http://localhost:8000/api/cart/clear/', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                await loadCart(); // Reload cart from backend
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.08; // 8% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const handleOrderPlaced = (orderData) => {
        console.log('Order placed:', orderData);
        loadCart(); // Refresh cart after order
        window.dispatchEvent(new Event('storage'));
        setTimeout(() => {
            setShowCheckout(false);
        }, 2000);
    };

    const handleBackFromCheckout = () => {
        setShowCheckout(false);
    };

    if (showCheckout) {
        return (
            <CheckoutPage
                user={user}
                cart={cartItems}
                onBack={handleBackFromCheckout}
                onOrderPlaced={handleOrderPlaced}
            />
        );
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();

    return (
        <div className="cart-page">
            <div className="navbar">
                <div className="nav-content">
                    <div className="logo">Game Shop</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="back-btn" onClick={onBack}>
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title-grey">Your Shopping Cart</h1>
                    
                    {loading ? (
                        <div className="loading-spinner">Loading cart...</div>
                    ) : cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added any games yet.</p>
                            <button className="continue-shopping-btn" onClick={onBack}>
                                Browse Games
                            </button>
                        </div>
                    ) : (
                        <div className="cart-container">
                            {/* Cart Items List */}
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            {item.product_image ? (
                                                <img src={item.product_image} alt={item.product_title} />
                                            ) : (
                                                <div className="cart-item-image-placeholder">
                                                    [Image]
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-title">{item.product_title}</h3>
                                        </div>
                                        
                                        <div className="cart-item-price">
                                            ${(parseFloat(item.price) || 0).toFixed(2)}
                                        </div>
                                        
                                        <div className="cart-item-quantity">
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="cart-item-total">
                                            ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                        </div>
                                        
                                        <button 
                                            className="cart-item-remove"
                                            onClick={() => removeItem(item.id)}
                                            title="Remove item"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Cart Actions */}
                                <div className="cart-actions">
                                    <button className="clear-cart-btn" onClick={clearCart}>
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="order-summary">
                                <h2 className="summary-title">Order Summary</h2>
                                
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                
                                <div className="summary-row">
                                    <span>Tax (8%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                
                                <div className="summary-row total">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                
                                <button className="checkout-btn" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>
                                
                                <button className="continue-shopping-link" onClick={onBack}>
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}