import React from 'react'
import backgroundofHero from "../assets/orangecart.png"

const Hero = () => {
  return (
    <div >
    <section 
  className="relative h-[70vh] overflow-hidden"
  >
    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-100 "
  style={{ 
    backgroundImage: `url(${backgroundofHero})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed' 
  }}>

  {/* Content Overlay */}
  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
    <div className="text-center px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
        Welcome to Ubay
      </h1>
      <p className="text-xl text-white mb-8 drop-shadow-md">
        Seamless Shopping, Anytime, Anywhere
      </p>
        <button className="bg-orange-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-xl">
        Explore Now
      </button>
    </div>
  </div>
  </div>
</section>

    </div>
  )
}

export default Hero
