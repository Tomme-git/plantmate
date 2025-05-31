export default function Header() {
    return (
      <header className="flex justify-center items-center p-6 bg-[#F7F4ED]">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-4">
          {/* Add your logo image here */}
          <img
            src="/bison.png" // Replace with your logo path
            alt="Plantmate Logo"
            className="w-12 h-12" // Adjust logo size as needed
          />
          <h1 className="text-3xl font-bold text-[#466A39]">Plantmate</h1>
        </div>
      </header>
    );
  }
  