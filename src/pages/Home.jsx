import React from "react";

const Home = ({ isVisible }) => {
  return (
    <section
      className={`bg-cover bg-center h-[580px] flex flex-col justify-start items-center text-center pt-20 relative overflow-hidden transition-all duration-700 ease-in-out origin-top
        ${isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
      `}
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 transition duration-700 ease-in-out group-hover:bg-black/60"></div>
      <h2 className="text-5xl font-bold z-20 max-w-3xl text-white opacity-0 translate-y-4 animate-fadeInUp">
        Vé Máy Bay rẻ nhất đi muôn nơi từ bất kỳ đâu
      </h2>
    </section>
  );
};

export default Home;
