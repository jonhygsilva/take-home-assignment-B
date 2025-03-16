import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 shadow-md z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Forms</h1>
        <button
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <ul className={`md:flex gap-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <li>
            <Link to="/forms" className="text-gray-300 hover:text-white transition">Form List</Link>
          </li>
          <li>
          <Link to="/create-form" className="text-gray-300 hover:text-white transition">Create form</Link>
        </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;