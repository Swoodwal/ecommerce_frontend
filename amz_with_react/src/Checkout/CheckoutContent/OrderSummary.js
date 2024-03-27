import { useCart, deliveryOptions, removeFromCart, saveAddCartQuantity, updateDeliveryOption } from '../../data/Cart.js';
//import { products } from '../../data/products.js';
import dayjs from 'dayjs';
import OrderComponent from './OrderSummary/OrderComponent.js';
import { useContext, useState, useEffect } from 'react';
import { ProductsContext } from '../../App.js';
import { CartContext } from '../../App.js';
import Axios from "axios";

export const OrderSummary =()=>{
    const {products} =useContext(ProductsContext);
   
    // const [products, setProducts] = useState([]);

    // useEffect( async () => {
    //   await Axios.get("http://localhost:8060/product/api/product")
    //     .then((res) => {
    //       setProducts(res.data);
    //     })
    // }, []);

    console.log("products in order summary: ", products);
    const {cart}=useContext(CartContext);
    // console.log("ordersummary");
    // console.log(cart);
    const orderComponents = cart.map((item) => {
        let matchingProduct = products.find((product) => product.id == item.productId);
        console.log('matching prod: ',matchingProduct);
        const deliveryOptionId = item.deliveryDate;
        const deliveryOption = deliveryOptions.find((option) => option.id == deliveryOptionId);
        // const deliveryOption = deliveryOptions.find((option) => option.id === 1);
    
        let dateString = '';
        if (deliveryOption) {
          const today = dayjs();
          const deliveryDate = today.add(deliveryOption.deliveryTime, 'days');
          dateString = deliveryDate.format('dddd,MMMM d') || 'Tuesday, June 21';
        }
    
        return (
          <OrderComponent
            key={item.productId}
            dateString={dateString}
            matchingProduct={matchingProduct}
            item={item}
          />
        );
      });

      return (
        <>
            {orderComponents}
        </>
    );
}