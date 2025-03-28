import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const GamesGrid = () => {
  const topRowGames = [
    {
      title: 'Connections',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: false,
      icon: '/game-connections.png',
      iconAlt: 'Connections'
    },
    {
      title: 'Strands',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: false,
      icon: '/game-strands.png',
      iconAlt: 'Strands'
    },
    {
      title: 'Tiles',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: false,
      icon: '/tiles.png',
      iconAlt: 'Tiles'
    }
  ];
  
  const bottomRowGames = [
    {
      title: 'Dewordle',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: true,
      icon: '/dewordle.png',
      iconAlt: 'Dewordle'
    },
    {
      title: 'Letter Boxed',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: false,
      icon: '/letter-boxed.png',
      iconAlt: 'Letter Boxed'
    },
    {
      title: 'Spelling Bee',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      available: false,
      icon: '/spelling bee.png',
      iconAlt: 'Spelling Bee'
    }
  ];

  const GameCard = ({ title, description, available, icon, iconAlt }) => {
    return (
      <div
        className="game-card border-black border-4 rounded-lg overflow-hidden flex flex-col
        hover:scale-105 hover:shadow-2xl hover:z-10 cursor-pointer
        transition-all duration-300 ease-in-out"
      >
        {/* Full-size image with no background */}
        <div className="h-72 overflow-hidden">
          <Image
            width={300}
            height={300}
            src={icon}
            alt={iconAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 bg-white flex-grow">
          <h3 className="text-3xl font-bold">{title}</h3>
          <p className="text-base my-10 mb-4">{description}</p>
          <div className="mt-4 flex ">
            {available ? (
              <Button
                variant="outline"
                className="border-[#29296e] text-[#29296e] hover:bg-[#29296e]/10 rounded-full px-6"
                asChild
              >
                <Link href="/game?id=someid">Play Now</Link>
              </Button>
            ) : (
              <p className="text-indigo-800 font-extrabold text-sm md:text-xl">
                Coming Soon!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-16 px-4 pb-40"> 
      <h1 className="text-5xl text-[#29296e] text-center font-bold mb-6">Play our games today</h1>
      <p className="text-center text-gray-700 text-lg mb-16 max-w-3xl mx-auto">
        Play our Selection of games which include, Dewordle, Spelling Bee, strands, Tiles, and Strands
      </p>

      <div className="max-w-7xl mx-auto">
        {/* Top row of games */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {topRowGames.map((game, index) => (
            <GameCard key={`top-${index}`} {...game} />
          ))}
        </div>

        {/* Bottom row of games */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {bottomRowGames.map((game, index) => (
            <GameCard key={`bottom-${index}`} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesGrid;