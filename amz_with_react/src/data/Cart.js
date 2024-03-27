import { useState} from "react";
// import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import { get } from "react-hook-form";

// get user cart=>"http://localhost:8060/cart/api/cart/userId"
// create user cart => "http://localhost:8060/cart/api/cart/create"
// delete user cart => "http://localhost:8060/cart/api/cart/delete/userId"
// update user cart => "http://localhost:8060/cart/api/cart/update/userId"

export const useCart = (initialVal = [], userId) => {

//   [
//     {
//         "cts": [
//             {
//                 "productId": "87",
//                 "quantity": 50,
//                 "deliveryDate": "2024-03-15"
//             },
//             {
//                 "productId": "82",
//                 "quantity": 13,
//                 "deliveryDate": "2024-03-15"
//             }
//         ]
//     }
// ]
  const [cart, setCart] = useState(initialVal);
  const [cartQuantity,setCartQuantity] = useState(0);
  const [cartInDatabase, setCartInDatabase] = useState(false);

  const getCart = async () => {
    try{
      const data = (await Axios.get(`http://localhost:8060/cart/api/cart/${userId}`).then((res)=>res.data));
      // await new Promise(resolve => setTimeout(resolve, 10000));
      console.log( 'get data:', data);
      return data;
    }
    catch(error){
      console.log('cart for user not created yet');
      return null;
    }
  }

  const postCart = async (cartItem) => {
    const requestData = {userId:userId, item:cartItem};
    const data = (await Axios.post("http://localhost:8060/cart/api/cart/create",requestData).then((res)=>res.data));
    console.log( ' sent post data:', data);
  }

  const deleteCart = async (productId) =>{
    const data = (await Axios.delete(`http://localhost:8060/cart/api/cart/delete/${userId}`,{ data: { productId: productId }}).then((res)=>res.data));
    console.log('deleted data: ',data);
  }

  const updateCart = async (cartItem) =>{
    const requestData = cartItem;
    const data = (await Axios.put(`http://localhost:8060/cart/api/cart/update/${userId}`,requestData).then((res)=>res.data));
    console.log('updated cart: ',data);
  }

  const initializeCart = async ()=>{
    const rawCartData = await getCart() || [];
    console.log("raw get data: ", rawCartData);
    const cartData= (rawCartData && rawCartData[0]?.["cts"]) || [];
    setCart(cartData);  
    if(rawCartData.length===0){
      setCartInDatabase(false);
    }
    else{
      setCartInDatabase(true);
    }
  }

  const initializeCartQuantity =()=>{
      saveAddCartQuantity();
  }

// Function to set cart for a user in local storage
  const setCartForUser = (updatedCart, itemForDB) => {
    const carts = JSON.parse(localStorage.getItem("carts")) || {};
    carts[userId] = updatedCart;
    localStorage.setItem("carts", JSON.stringify(carts));


    if(!cartInDatabase){
      postCart(itemForDB);
      setCartInDatabase(true);
    }
    else{
      updateCart(itemForDB);
    }
  };

  const saveAddCartQuantity = () => {
    let cartQuantity = 0;
    console.log('use state cart: ', cart);
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });
    localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
    setCartQuantity(cartQuantity);
  };


  const addToCart = (productId) => {
    setCart((prevCart) => 
    {
      let tempCart;
      let matchingItem, itemfordb;
      // const prevCart = [...cart];
      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          matchingItem = { ...item, quantity: item.quantity + 1 };
          return matchingItem;
        }
        return item;
      });
  
      if (!matchingItem) {
        matchingItem = {
          productId: productId,
          quantity: 1,
          deliveryDate: "1"
        };

        itemfordb = {
          productId: productId,
          quantity: 1,
          deliveryDate: "1"
        };
        updatedCart.push(matchingItem);
        // tempCart=updateCart;
      }
      else{
        itemfordb={
          productId: productId,
          quantity :matchingItem.quantity,
          deliveryDate: "1"
        }
      }
      
      setCartForUser(updatedCart,itemfordb);
  
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    const matchingIndex = cart.findIndex((item) => item.productId === productId);
    if (matchingIndex !== -1) {
      cart.splice(matchingIndex, 1);
      //setCartForUser(cart);
      deleteCart(productId);
      setCart([...cart]);
    }
  };

  const updateDeliveryOption = (productId, deliveryDate) => {
    let itemTemp;
    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        itemTemp = { ...item, deliveryDate }
        return { ...item, deliveryDate };
      }
      return item;
    });

    let itemfordb={
      productId: productId,
      quantity :itemTemp.quantity,
      deliveryDate: itemTemp.deliveryDate
    };
    setCartForUser(updatedCart,itemfordb);
    setCart(updatedCart);
  };

  // const clearCart = () =>{
  //   const localCarts = JSON.parse(localStorage.getItem("carts")) || {};
  //   delete localCarts[userId];
  //   localStorage.setItem("carts", JSON.stringify(localCarts));
  //   // localStorage.removeItem('cart');
  //   localStorage.removeItem('cartQuantity');
  //   setCart([]);
  //   setCartQuantity(0);
  // }

  return { cart,cartQuantity, initializeCart,initializeCartQuantity, addToCart, removeFromCart, saveAddCartQuantity, updateDeliveryOption};
};

// export let cart=JSON.parse(localStorage.getItem('cart')) || [{id:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6", quantity:1,  deliveryOptionId:2}];


// export function addToCart(productId){
//     const [cart,setCart]=useCart();
//     let matchingItem;
//     cart.forEach((item)=>{
//         if(item.id===productId){
//             matchingItem=item;
//         }
//     });

//     if(!matchingItem) {
//         matchingItem = {
//             id: productId,
//             // name: event.target.parentNode.parentNode.querySelector('.product-name').textContent,
//             // priceCents: event.target.parentNode.parentNode.querySelector('.product-price').textContent,
//             // image: event.target.parentNode.parentNode.querySelector('.product-image').src,
//             quantity: 1,
//             deliveryOptionId:1
//         };
//         cart.push(matchingItem);
//     } else {
//     matchingItem.quantity++;
//     }
//     setCart(cart);
//     saveToCart();
// }

// export function removeFromCart(productId){
//     const [cart,setCart]=useCart();
//     let matchingIndex;
//     cart.find((item,index)=>{
//         if(item.id === productId) 
//         {
//             matchingIndex=index;
//         }
//     });
//     cart.splice(matchingIndex,1);
//     setCart(cart);
//     saveToCart(cart);
// }
// export function saveToCart(cart){
//     localStorage.setItem('cart',JSON.stringify(cart));
// }

// export const saveAddCartQuantity=()=>{
//     const [cart,setCart]=useCart();
//     let cartQuantity=0;
//     cart.forEach((item)=>{
//         cartQuantity+=item.quantity;
//     });
//     localStorage.setItem('cartQuantity',JSON.stringify(cartQuantity));
// }

// export function updateDeliveryOption(productId,deliveryOptionId){
//     const [cart,setCart]=useCart();
//     let matchingItem = cart.find(item => item.id == productId);
//     matchingItem.deliveryOptionId=deliveryOptionId;
//     setCart(cart);
//     saveToCart();
// }

export const deliveryOptions=[
    {
        id: 1,
        deliveryTime: 7,
        deliveryPriceCents: 0
    },
    {
        id: 2,
        deliveryTime: 3,
        deliveryPriceCents: 499
    },
    {
        id: 3,
        deliveryTime: 1,
        deliveryPriceCents: 999
    }
];