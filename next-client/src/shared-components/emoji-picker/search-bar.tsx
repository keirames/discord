import React from 'react';
import { BiSearch } from 'react-icons/bi';

export const SearchBar = () => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-md bg-dark-700 p-2">
      <input
        className="flex-1 bg-dark-700 focus:outline-none"
        placeholder=":tired_face:"
      />
      <BiSearch className="mx-2 text-gray-300" size={20} />
    </div>
  );
};
