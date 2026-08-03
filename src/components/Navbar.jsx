import React from 'react';
import { RiHomeSmile2Line } from 'react-icons/ri';
import { BiBasket, BiCategory } from 'react-icons/bi';
import { TbSettings } from 'react-icons/tb';

const Navbar = () => {
  return (
    <div className="w-full px-10 h-20 flex items-center rounded-t-4xl justify-between bg-blue-600 fixed z-10 bottom-0">
      <RiHomeSmile2Line  className="size-9 text-white" />
      <BiCategory className="size-9 text-white"/>
      <BiBasket className="size-9 text-white" />
      <TbSettings className="size-9 text-white"/>
    </div>
  );
};

export default Navbar;
