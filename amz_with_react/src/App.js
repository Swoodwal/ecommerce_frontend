import './App.css';
import './styles/shared/general.css';
import Axios from "axios";

import { Amazon } from './Amazon';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import { Checkout } from './Checkout';
import { Orders } from './Orders';

import { useState,useEffect,createContext } from'react';
import { useCart} from './data/Cart';
import { useOrderCart } from './data/Orders';

import { useUsers } from './data/Users';
import { useSelector } from 'react-redux';

import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { useProducts } from './data/products';

export const CartContext = createContext();
export const UserContext = createContext();
export const ProductsContext = createContext();

function App() {

  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get("http://localhost:8060/product/api/product")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error)=>{
        console.error("error...... ", error);
        setLoading(false);
      });
  }, []);

  //console.log(products);
  const [userIdd,setUserId] = useState(null);
  const { users, initializeUsers, addToUsers, saveToUsers, validateUser} = useUsers([],setUserId);

  useEffect(()=>{
    initializeUsers();
  },[]);

  const userId = useSelector(state => state.user.userId);
  const [isLoggedIn, setLoggedIn]=useState(false);

  useEffect(()=>{
    setLoggedIn(!!userId);
  },[userId])

  console.log(userId, isLoggedIn);

  const { cart,cartQuantity, initializeCart, initializeCartQuantity, addToCart, removeFromCart, saveAddCartQuantity, updateDeliveryOption} = useCart([],userId);
  const {orderCart, orderQuantity, initializeOrderCart, initializeOrderQuantity, addToOrderCart, saveToOrderCart, saveAddOrderQuantity} =useOrderCart([], cart, initializeCart, userId);

  useEffect(()=>{
    if(userId){
      initializeCart();
      initializeCartQuantity();
      initializeOrderCart();
      initializeOrderQuantity();
    }
  },[userId]);

  useEffect(()=>{
    if(userId)
      saveAddCartQuantity();
  },[cart]);

  useEffect(()=>{
    if(userId)
      initializeCart();
  },[orderCart]);

  // console.log('error:',error);
  if(isLoading){
    return (<div>loading........</div>);
  }
  
  return (
    <ProductsContext.Provider value={{products}}>
    <UserContext.Provider value={{ users, addToUsers, saveToUsers, validateUser, isLoggedIn}}>
        {isLoggedIn ? (
          <CartContext.Provider value={{ cart,cartQuantity, initializeCart, initializeCartQuantity, addToCart, removeFromCart, saveAddCartQuantity, updateDeliveryOption, orderCart, orderQuantity, initializeOrderCart, initializeOrderQuantity, addToOrderCart, saveToOrderCart, saveAddOrderQuantity }}>
            <div className="App">
              <Router>
                <Routes>
                  <Route path="/" element={<Amazon/>} />
                  <Route path='/checkout' element={<Checkout/>} />
                  <Route path="/orders" element= {<Orders/>} />
                </Routes>
              </Router>
            </div>
          </CartContext.Provider>
        ) : (
          <div className="App">
            <Router>
              <Routes>
                <Route path="/" element={<Amazon/>} />
              </Routes>
            </Router>
          </div>
        )}
    </UserContext.Provider>
    </ProductsContext.Provider>
  );
}

export default App;

 