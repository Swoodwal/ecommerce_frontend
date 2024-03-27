import React from 'react'
//import { products } from '../data/products';
import { useEffect } from 'react';
import { ProductComponent } from './ProductComponent';
import { useQuery } from '@tanstack/react-query';
import Axios from "axios";
import { useContext, useState } from 'react';
import { ProductsContext } from '../App';

export const AmazonContent = (props) => {

  const { search, click, setClick } = props;
 
  const {products} = useContext(ProductsContext);
  // Function to filter products based on search term
  const filterProducts = () => {
    return products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  };
 
  // State to hold filtered products
  const [filteredProducts, setFilteredProducts] = useState(filterProducts());
 
  // Update filtered products whenever search term changes
  React.useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [click]);
   
  return (
    <div className='main'>
        <div className='products-grid'>
          {filteredProducts.map((product) =>(  
            <ProductComponent  product={product} key={product.id}/>)
          )
          }
           {/*implicit return */}
          </div>
    </div>
  );
}

