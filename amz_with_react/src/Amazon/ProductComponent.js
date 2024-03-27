import React, { useContext, useState } from 'react'
import { CartContext } from '../App';

export const ProductComponent = ({product}) => {
  
  const context=useContext(CartContext) || null;
  const addToCart = context?.addToCart;

  const [productQuantity,setProductQuantity] = useState(product.quantity);

  const handleAdd=(id) => {
    if(addToCart && productQuantity){
      addToCart(id);
      setProductQuantity((prev)=>prev-1);
    }
  }

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img className="product-image"
          src={product.imageUrl}/>
      </div>

      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      <div className="product-rating-container">
        <img className="product-rating-stars"
          src={`images/ratings/rating-${product.ratings.stars * 10}.png`}/>
        <div className="product-rating-count link-primary">
          {product.ratings.count}
        </div> 
      </div>

      <div className="product-price">
        ${(product.price/100).toFixed(2)}
      </div>

      <div className="product-quantity-container">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className="added-to-cart">
        <img src="images/icons/checkmark.png"/>
        Added
      </div>

      <button className="add-to-cart-button button-primary" data-product-id="{product.id}" onClick={()=>handleAdd(product.id)}>
        Add to Cart
      </button>
    </div>
    );
}

