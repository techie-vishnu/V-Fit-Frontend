import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { FaAngleLeft } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { RxPerson } from "react-icons/rx";
import { RxGear } from "react-icons/rx";
import { GiWeightLiftingUp } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { HiOutlineAdjustments } from "react-icons/hi";
import logo from "../../assets/logo.png";
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';


function Sidebar1({ isCollapsed, toggleSidebar }) {
    let navigate = useNavigate();
    const userData = useSelector(state => state.user.userData);
    const [Menus, setMenus] = useState([]);

    const buildSideMenu = () => {
        if (userData.roles.indexOf('Admin') !== -1) {
            setMenus([
                { title: "Dashboard", icon: <RxDashboard />, link: '/' },
                // { title: "Settings", icon: <RxGear />, link: '/', gap: true },
                { title: "Users", icon: <RxPerson />, link: '/users' },
                { title: "Memberships", icon: <RiMoneyRupeeCircleLine />, link: '/memberships' },
                { title: "Plans", icon: <HiOutlineAdjustments />, link: '/plans' },
                { title: "Workouts", icon: <GiWeightLiftingUp />, link: '/workouts' }

            ])
        }
        else if (userData.roles.indexOf('Receptionist') !== -1) {
            setMenus([
                { title: "Dashboard", icon: <RxDashboard />, link: '/' },
                { title: "Memberships", icon: <RiMoneyRupeeCircleLine />, link: '/users' },
                { title: "Clients", icon: <GiWeightLiftingUp />, link: '/' }
            ])
        }
        else if (userData.roles.indexOf('Trainer') !== -1) {
            setMenus([
                { title: "Dashboard", icon: <RxDashboard />, link: '/' },
                { title: "My Clients", icon: <GiWeightLiftingUp />, link: '/' },
            ])
        }
        else {
            setMenus([
                { title: "Home", icon: <RxDashboard />, link: '/' },
                { title: "Workouts", icon: <GiWeightLiftingUp />, link: '/workouts' }

            ])
        }
    }

    useEffect(() => {
        if (userData)
            buildSideMenu();
    }, [userData]);


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
                            <li key={index} onClick={() => { navigate(Menu.link) }}
                                className={`tw:flex tw:rounded-md tw:p-2 tw:cursor-pointer tw:text-black tw:dark:text-gray-300 tw:text-lg tw:font-medium tw:items-center tw:gap-x-4 ${Menu.gap ? " tw:mt-9" : " tw:mt-2"} ${index === 0 && "tw:bg-light-white "} `}>
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