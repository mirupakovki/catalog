import React, { useState } from 'react';
import img from '../assets/img.jpg';
import { BiBasket } from 'react-icons/bi';
import { IoAdd, IoRemove } from 'react-icons/io5';

const ProductCard = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(1);
  };

  const handleAdd = () => {
    setCount((prev) => prev + 1);
  };

  const handleRemove = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <div className="flex shadow-md  rounded-2xl">
      <div className="w-1/3 p-1 flex justify-center items-center rounded-2xl">
        <img className="rounded-2xl object-contain" src={img} alt="" />
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start">
          <div className='w-3/5 '>
            <h2 className="text-sm font-medium">Вояж Желтый 120л</h2>
            <p className='text-xs text-gray-500'>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <span className="px-2 py-1 bg-blue-50 text-blue-800 font-semibold rounded-2xl text-[10px]">
            Мус. пакеты
          </span>
        </div>
        <div className='flex justify-between items-center'>
            <h2 className='text-blue-800 font-semibold'>30₽ за шт</h2>
          {count === 0 ? (
            <button
              className="p-2 flex items-center justify-between border border-blue-800 rounded-full"
              onClick={handleClick}
            >
              <BiBasket className="size-5 text-blue-800" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="p-2 border border-blue-800 rounded-full flex items-center justify-between"
                onClick={handleRemove}
              >
                <IoRemove className="size-5 text-blue-800" />
              </button>
              {count}
              <button
                className="p-2 border border-blue-800 rounded-full flex items-center justify-between"
                onClick={handleAdd}
              >
                <IoAdd className="size-5 text-blue-800" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
