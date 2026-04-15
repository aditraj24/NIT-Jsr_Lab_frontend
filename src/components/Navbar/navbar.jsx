'use client';

import Image from "next/image";
import logo from "../../assets/images/logo.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import AchievementsHoverDropdown from "./components/AchievementsHoverDropdown";
import MembersHoverDropdown from "./components/MembersHoverDropdown";
import ResearchHoverDropdown from "./components/ResearchHoverDropdown";
import './styles.css';

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (item) => setHoveredItem(item);
  const handleMouseLeave = () => setHoveredItem(null);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scaleY: 0,
      transformOrigin: "top",
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      transformOrigin: "top",
    },
    exit: {
      opacity: 0,
      scaleY: 0,
      transformOrigin: "top",
    },
  };

  return (
    <nav className="fixed top-0 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex-shrink-0">
            <Image src={logo} width={80} height={80} alt="Lab Logo" />
          </Link>

          <div className="hidden lg:flex space-x-8">
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('Research')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/Research" className="text-gray-700 hover:text-blue-600 font-semibold">
                RESEARCH
              </Link>
              <AnimatePresence>
                {hoveredItem === 'Research' && (
                  <motion.div
                    className="absolute top-full left-0 w-48"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <ResearchHoverDropdown />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('Members')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-gray-700 hover:text-blue-600 font-semibold cursor-pointer">
                MEMBERS
              </span>
              <AnimatePresence>
                {hoveredItem === 'Members' && (
                  <motion.div
                    className="absolute top-full left-0 w-48"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <MembersHoverDropdown />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('Achievements')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/Achievements" className="text-gray-700 hover:text-blue-600 font-semibold">
                ACHIEVEMENTS
              </Link>
              <AnimatePresence>
                {hoveredItem === 'Achievements' && (
                  <motion.div
                    className="absolute top-full left-0 w-48"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <AchievementsHoverDropdown />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/Gallery" className="text-gray-700 hover:text-blue-600 font-semibold">
              GALLERY
            </Link>

            <Link href="/Updates" className="text-gray-700 hover:text-blue-600 font-semibold">
              UPDATES
            </Link>
          </div>

          <Link href="/admin/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}