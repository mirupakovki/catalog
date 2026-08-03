import React from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
    return (
        <div className='flex flex-col gap-5'>
            <h2 className='text-2xl font-bold'>Мусорные мешки</h2>
            <div className='grid grid-cols-1 gap-5'>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
        </div>
    );
};

export default ProductList;