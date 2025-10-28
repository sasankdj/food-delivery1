import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Delicious Food, Delivered To You.
          </h1>
          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Order your favorite meals from our wide selection of Indian and Chinese cuisines and enjoy a fast and reliable delivery service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;