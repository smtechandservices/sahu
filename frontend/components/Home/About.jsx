import Image from 'next/image';

const About = () => {
  return (
    <section className="section-padding bg-bg-section mx-8">
      <div className="px-8 flex flex-col lg:flex-row items-center gap-20">
        <div className="relative">
          <div className="rounded-lg overflow-hidden shadow-md border-4 border-white">
            <Image src="/assets/president.jpg" alt="President Ranvijay Sahu" width={200} height={300} className='w-200' />
          </div>
          <div className='mt-4'>
            <h3 className="text-xl font-bold mb-1">Ranvijay Sahu</h3>
            <p className="text-md opacity-90">President</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-4xl mb-6 text-primary-dark font-bold">Message from our President</h2>
          <div className="w-[60px] h-1 bg-primary mb-8"></div>
          <p className="text-xl md:text-2xl leading-relaxed italic text-gray-600 mb-10">
            "Our community stands on the pillars of unity, hard work, and mutual support. Sahu Sabha is more than an organization; it's a family dedicated to preserving our rich heritage while paving the way for a modern, empowered future. We are committed to educational growth, career opportunities, and social harmony for every member of our community."
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
