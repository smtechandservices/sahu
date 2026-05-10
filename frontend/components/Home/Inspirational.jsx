import Image from 'next/image';

const figures = [
  {
    name: 'Daanveer Bhamashah',
    title: 'Symbol of Generosity',
    image: '/assets/figures/bhamashah.jpg',
  },
  {
    name: 'Baba Badal Nayak',
    title: 'Legendary Leader',
    image: '/assets/figures/badal_nayak.png',
  },
  {
    name: 'Maa Karma',
    title: 'Sant Shiromani',
    image: '/assets/figures/maa_karma.png',
  }
];

const Inspirational = () => {
  return (
    <section className="section-padding bg-white">
      <div className="px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Inspirational Figures</h2>
          <p className="text-xl text-[#564337]">community's pride and eternal guiding lights</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {figures.map((figure, index) => (
            <div key={index} className="bg-[#FFFBF7] overflow-hidden shadow-base hover:-translate-y-2 hover:shadow-md transition-all duration-300">
              <div className="relative h-[650px] w-full">
                <Image 
                  src={figure.image} 
                  alt={figure.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{figure.name}</h3>
                <p className="text-sm font-medium text-primary-dark uppercase tracking-wider">{figure.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inspirational;
