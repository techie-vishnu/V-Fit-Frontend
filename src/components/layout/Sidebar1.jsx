import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { FaAngleLeft } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { RxPerson } from "react-icons/rx";
import { RxGear } from "react-icons/rx";
import logo from "../../assets/logo.png";
import { NavLink, useNavigate } from 'react-router';


function Sidebar1({ isCollapsed, toggleSidebar }) {
    let navigate = useNavigate();
    const Menus = [
        { title: "Dashboard", icon: <RxDashboard />, link: '/' },
        { title: "Users", icon: <RxPerson />, link: '/users' },
        // { title: "Loyalty Cards", src: "Card", gap: true },
        // { title: "Subscriptions", src: "Calendar" },
        // { title: "Debts", src: "Debt" },
        // { title: "Legal information", src: "Legal" },
        // { title: "Notifications ", src: "Notifications", gap: true },
        { title: "Settings", icon: <RxGear />, link: '/' },
    ];

    return (
        <div className="tw:flex">
            <div className={` ${isCollapsed ? "tw:w-0 tw:md:w-20" : "tw:w-72"} tw:bg-gray-300 tw:dark:bg-gray-800 tw:h-full tw:md:p-4 tw:pt-5 tw:absolute tw:md:relative tw:duration-300 shadow-md`}>

                <Button variant="outline-secondary" className={`btn btn-light p-1 tw:md:visible tw:absolute tw:cursor-pointer tw:-right-3 tw:top-15 ${isCollapsed && "tw:rotate-180"} ${isCollapsed ? "tw:invisible" : "tw:visible"}`} onClick={toggleSidebar}>
                    <FaAngleLeft />
                </Button>

                <div className="tw:flex tw:gap-x-4 tw:items-center">
                    <img src={logo} width={35} className={`tw:cursor-pointer tw:duration-500 ${!isCollapsed && "tw:rotate-[360deg]"}`} />
                    <h1 className={`text-white tw:cursor-pointer tw:origin-left tw:font-medium tw:text-xl tw:duration-200 ${isCollapsed && "tw:scale-0"}`}>
                        Vfit App
                    </h1>
                </div >
                <ul className={`tw:pt-6 ${isCollapsed && "ps-2"}`}>
                    {
                        Menus.map((Menu, index) => (
                            <li key={index} onClick={() => { navigate(Menu.link)}}
                                className={`tw:flex tw:rounded-md tw:p-2 tw:cursor-pointer hover:tw:bg-light-white tw:text-black tw:dark:text-gray-300 tw:text-lg tw:font-medium tw:items-center tw:gap-x-4 ${Menu.gap ? " tw:mt-9" : " tw:mt-2"} ${index === 0 && "tw:bg-light-white "} `}>
                                {Menu.src && <img src={`/assets/${Menu.src}.svg`} />}
                                {Menu.icon && Menu.icon}
                                <span className={`${isCollapsed && "tw:hidden"} tw:origin-left tw:duration-200`}>
                                    {Menu.title}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar1