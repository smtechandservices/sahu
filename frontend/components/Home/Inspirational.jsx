'use client';

import Image from 'next/image';
import { useState } from 'react';

const figures = [
  {
    name: 'Daanveer Bhamashah',
    title: 'Symbol of Generosity',
    image: '/assets/figures/bhamashah.jpg',
    description:
      'Bhamashah was a legendary minister and philanthropist in the Mewar kingdom who donated his entire personal wealth to Maharana Pratap to fund the fight for independence. His selfless sacrifice became an enduring symbol of generosity and patriotism for the Sahu community.',
  },
  {
    name: 'Baba Badal Nayak',
    title: 'Legendary Leader',
    image: '/assets/figures/badal_nayak.png',
    description:
      'Baba Badal Nayak was a revered spiritual and community leader who guided the Sahu community through challenging times. His wisdom, courage, and unwavering commitment to justice made him a legendary figure whose teachings continue to inspire generations.',
  },
  {
    name: 'Maa Karma',
    title: 'Sant Shiromani',
    image: '/assets/figures/maa_karma.png',
    description:
      'Maa Karma is venerated as a supreme saint and the presiding deity of the Karma festival. Her devotion, compassion, and spiritual teachings have been a guiding light for the community, embodying the values of faith, sacrifice, and love for all living beings.',
  },
];

const Inspirational = () => {
  const [flipped, setFlipped] = useState(null);

  const handleFlip = (index) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <section className="section-padding bg-white">
      <div className="px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Inspirational Figures</h2>
          <p className="text-xl text-[#564337]">community&apos;s pride and eternal guiding lights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {figures.map((figure, index) => (
            <div
              key={index}
              className="cursor-pointer"
              style={{ perspective: '1000px', height: '650px' }}
              onClick={() => handleFlip(index)}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  transform: flipped === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  className="absolute inset-0 bg-[#FFFBF7] overflow-hidden shadow-base hover:-translate-y-2 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-[550px] w-full">
                    <Image
                      src={figure.image}
                      alt={figure.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{figure.name}</h3>
                    <p className="text-sm font-medium text-primary-dark uppercase tracking-wider">{figure.title}</p>
                  </div>
                </div>

                {/* Back */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 bg-[#5C3D2E] overflow-hidden shadow-base flex flex-col items-center justify-center p-10 text-center"
                >
                  <div className="relative h-28 w-28 rounded-full overflow-hidden mb-6 border-4 border-white/30">
                    <Image
                      src={figure.image}
                      alt={figure.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{figure.name}</h3>
                  <p className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6">{figure.title}</p>
                  <p className="text-white/90 text-base leading-relaxed">{figure.description}</p>
                  <p className="mt-8 text-white/40 text-xs">Click to flip back</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inspirational;
