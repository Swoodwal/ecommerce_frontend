import React from 'react';
// import './styles/shared/general.css';
import './styles/shared/amazon-header.css';
import './styles/pages/amazon.css';
import { useState } from 'react';

import { AmazonHeader } from './Amazon/AmazonHeader';
import { AmazonContent } from './Amazon/AmazonContent';

export const Amazon = () => {
  const [search,setSearch]=useState("");
  const [click,setClick]=useState(true);
  console.log('Amazon home');
  return (
    <>
        <AmazonHeader click = {click} setSearch = {setSearch} setClick={setClick} key="1"/>
        <AmazonContent search={search} click = {click} setClick={setClick}key="2"/>
    </>
  );
}