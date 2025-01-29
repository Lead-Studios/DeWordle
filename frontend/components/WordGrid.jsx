import React from 'react';

function WordGrid() {
  const inputs = Array.from({ length: 25 });

  return (
    <div className='mt-5'>
      <div className="grid grid-cols-5 gap-2 md:gap-4 place-content-center mx-auto bg-white w-[250px] md:w-[350px] ">
        {inputs.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-[5px] bg-[#939B9F4D] text-center"
          />
        ))}
      </div>
    </div>
  );
}

export default WordGrid;
