import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import Axios from "axios";
// import { useContext } from 'react';
// import { CartContext } from '../App';

// export let orders = JSON.parse(localStorage.getItem('orders'))||
//                 [{  id:"srgvedscszfcdscz", 
//                     datePlaced:"August 12", 
//                     totalPrice:100,
//                     orderDetails:[
//                         {
//                             productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 
//                             quantity: 1, 
//                             deliveryOptionId: 1
//                         },
//                         {
//                             productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d", 
//                             quantity: 1, 
//                             deliveryOptionId: 1
//                         }
//                     ]
//                 }];

// {
//   "userId": "1",
//   "ordersList": 
//     {
//       "orderId": "22",
//       "datePlaced": "13 oct 21",
//       "orderDetails": [
//         {
//           "productId": "1",
//           "quantity": 4,
//           "deliveryOptionId": 2
//         },
//         {
//           "productId": "76",
//           "quantity": 2,
//           "deliveryOptionId": 3
//         }
//       ]
//     }
// }

// get orders: http://localhost:8060/order/api/order/userId
// post orders: http://localhost:8060/order/api/order/createOrder
// update orders: http://localhost:8060/order/api/order/updateOrder
export const useOrderCart = (initialVal = [], cart, initializeCart, userId) => {
    const [orderCart, setOrderCart] = useState(initialVal);
    const [orderQuantity,setOrderQuantity] = useState(0);
    const [orderCartInDatabase, setOrderCartInDatabase] = useState(false);

    const getOrderCart = async () => {
      try{
      const data = (await Axios.get(`http://localhost:8060/order/api/order/${userId}`).then((res)=>res.data));
      // await new Promise(resolve => setTimeout(resolve, 10000));
      console.log( 'get order data:', data);
      return data;
      }
      catch(error){
        console.log('user order not created yet');
        return null;
      }
    }
  
    const postOrderCart = async (orderCartList) => {
      const requestData = {userId:userId, ordersList:orderCartList};
      const data = (await Axios.post("http://localhost:8060/order/api/order/createOrder",requestData).then((res)=>res.data));
      console.log( ' sent order post data:', data);
      initializeCart();
    }
  
    const updateCart = async (orderCartList) =>{
      const requestData = {userId:userId, ordersList:orderCartList};
      const data = (await Axios.put(`http://localhost:8060/order/api/order/updateOrder`,requestData).then((res)=>res.data));
      console.log('updated order cart: ',data);
      initializeCart();
    }
    const setOrderCartForUser = (orderCart) => {
        const orderCarts = JSON.parse(localStorage.getItem("orderCarts")) || {};
        orderCarts[userId] = orderCart;
        localStorage.setItem("orderCarts", JSON.stringify(orderCarts));
    };
    
    // // Function to get cart for a user from local storage
    // const getOrderCartForUser = () => {
    //     const orderCarts = JSON.parse(localStorage.getItem("orderCarts")) || {};
    //     return orderCarts[userId] || [];
    // };

    const initializeOrderCart = async ()=>{
      const rawOrderCartData = await getOrderCart() || {};
      console.log("raw order get data: ", rawOrderCartData);
      const orderCartData= (rawOrderCartData && rawOrderCartData?.ordersList) || [];
      console.log("order get data: ", orderCartData);
      setOrderCart(orderCartData);  
      if(Object.keys(rawOrderCartData).length === 0){
        console.log('USER ORDRE NOT CREATED YETTTTT');
        setOrderCartInDatabase(false);
      }
      else{
        setOrderCartInDatabase(true);
      }
    }
    const initializeOrderQuantity =()=>{
        saveAddOrderQuantity();
      //setOrderQuantity(JSON.parse(localStorage.getItem('orderQuantity')) || 0 );
    }
  
    const saveToOrderCart = (updatedOrderCart,orderList) => {
      setOrderCartForUser(updatedOrderCart);
      //localStorage.setItem("orderCart", JSON.stringify(updatedOrderCart));
      console.log("save to order cart");
      console.log(orderCart);
      console.log((localStorage.getItem("orderCarts"))[userId]);

      if(!orderCartInDatabase){
        console.log('POST orderList');
        postOrderCart(orderList);
        setOrderCartInDatabase(true);
      }
      else{
        console.log('UPDATE orderList');
        updateCart(orderList);
      }
      initializeCart();
    };
  
    const saveAddOrderQuantity = () => {
      let orderQuantity = 0;
      orderQuantity=orderCart.length;
      localStorage.setItem("orderQuantity", JSON.stringify(orderQuantity));
      setOrderQuantity(orderQuantity);
    };
  
    // const emptyCart = () => {
    //   clearCart();
    // };

    // Function to generate a random orderId
    const generateOrderId = () => {
        return uuidv4();
    };

    const addToOrderCart = async (totalPrice,datePlaced) => {
        const newOrder = {
            orderId: generateOrderId(),
            datePlaced: datePlaced, // Implement a function to get the current date
            // totalPrice: totalPrice,
            orderDetails: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              deliveryOptionId: item.deliveryDate
            })),
          };
        // Wrap saveToOrderCart inside a promise
        await new Promise((resolve, reject) => {
          try {
              // Call saveToOrderCart and resolve the promise when it's done
              saveToOrderCart([...orderCart, newOrder], newOrder);
              resolve();
          } catch (error) {
              // If an error occurs, reject the promise
              reject(error);
          }
        });
        setOrderCart((prevOrders) => [...prevOrders, newOrder]);
        //saveAddOrderQuantity();
        // emptyCart();
    };
  
    return {orderCart, orderQuantity, initializeOrderCart, initializeOrderQuantity, addToOrderCart, saveToOrderCart, saveAddOrderQuantity};
  };
  