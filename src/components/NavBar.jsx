
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Logo, menu, close} from "../assets/"

// this is the nav bar section of the page.

const Navbar = () => {
    // adding a state variables to the navbar component
    //this shows the naviagation links in white if active
    const [active, setActive] = useState("");
    // this will show the navigation menu and close it when nav links have been clicked
    const [toggle, setToggle] = useState(false);
    // this will scroll to the desired seciton in the page
    const [scrolled, setScrolled] = useState(false);
    //allows you to perform side effects in your components. 
    useEffect(() => {
        // logs the vertical scroll position of the window whenever it is scrolled.
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        // event lisnter for the logo when clicked to back to the top of the page
        window.addEventListener("scroll", handleScroll);
        // returns back to normal 
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        // nav container
        <nav className="sm:px-16 px-6 w-full flex items-center py-4 fixed top-0 z-20 bg-primary">
            {/* logo with scroll event that takes user to top of the page */}
            <div className="w-full flex justify-between items-center max-w-8xl mx-auto">
                <Link to="/" className="flex items-center gap-2"
                    onClick={() => {
                        setActive("");
                        window.scroll(0, 0);
                    }} >
                    <img src={Logo} alt="logo" className="w-auto h-11 object-contain" />
                    <p className="text-white text-[16px] font bold cursor-pointer flex"></p>
                </Link>

                {/* Navigation links*/}

                <ul className='list-none hidden sm:flex flex-row gap-10'>
                    <li>Ear Training</li>
                </ul>

                {/* Menu */}
                <div className='sm:hidden flex flex-1 justify-end items-center'>
                    <img
                        src={toggle ? close : menu}
                        alt='menu'
                        className='w-[18spx] h-[18px] object-contain'
                        onClick={() => setToggle(!toggle)}
                    />
                    {/* The menu navigation list for mobile */}
                    <div
                        className={`${!toggle ? "hidden" : "flex"} p-6 bg-red-600 absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
                    >
                        {/* This are the navigation list with links that scroll to desired section. */}
                        <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
                            <li>Ear Training</li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar