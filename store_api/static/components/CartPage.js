const { useState, useEffect } = React;

function CartPage({ user, onBack, onUpdateCart }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        setLoading(false);
    };

    const updateQuantity = (itemId, platform, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cartItems.map(item => 
            (item.id === itemId && item.platform === platform) 
                ? { ...item, quantity: newQuantity } 
                : item
        );
        
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        if (onUpdateCart) onUpdateCart(updatedCart);
    };

    const removeItem = (itemId, platform) => {
        const updatedCart = cartItems.filter(item => 
            !(item.id === itemId && item.platform === platform)
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        if (onUpdateCart) onUpdateCart(updatedCart);
    };

    const clearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            setCartItems([]);
            localStorage.setItem('cart', JSON.stringify([]));
            if (onUpdateCart) onUpdateCart([]);
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
        alert('Proceeding to checkout! This would connect to payment processing.');
        // In a real app, this would redirect to checkout page
    };

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
                    <h1 className="page-title">Your Shopping Cart</h1>
                    
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
                                    <div key={`${item.id}-${item.platform}`} className="cart-item">
                                        <div className="cart-item-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <div className="cart-item-image-placeholder">
                                                    [Image]
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-title">{item.name}</h3>
                                            <p className="cart-item-category">{item.categoryName}</p>
                                            <p className="cart-item-platform">Platform: {item.platform || "PC"}</p>
                                        </div>
                                        
                                        <div className="cart-item-price">
                                            ${(parseFloat(item.price) || 0).toFixed(2)}
                                        </div>
                                        
                                        <div className="cart-item-quantity">
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.platform, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.platform, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="cart-item-total">
                                            ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                        </div>
                                        
                                        <button 
                                            className="cart-item-remove"
                                            onClick={() => removeItem(item.id, item.platform)}
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