import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [cart, setCart] = useState([]);

    // Helper to get current cart key
    const getCartKey = () => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        return user && user.id ? `cart_${user.id}` : "cart_guest";
    };

    // Initial Load & Auth Change Listener
    useEffect(() => {
        const loadCart = () => {
            const key = getCartKey();
            const stored = localStorage.getItem(key);
            setCart(stored ? JSON.parse(stored) : []);
            setIsInitialized(true); 
        };

       
        loadCart();

      
        window.addEventListener("authChange", loadCart);
        return () => window.removeEventListener("authChange", loadCart);
    }, []);

    //  Sync cart to localStorage whenever it changes (but ONLY if initialized)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(getCartKey(), JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

   
    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((item) => item._id === product._id);
            if (exists) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

  
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item._id !== productId));
    };

   
    const decreaseQty = (productId) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(getCartKey());
    };

   
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, decreaseQty, clearCart, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
