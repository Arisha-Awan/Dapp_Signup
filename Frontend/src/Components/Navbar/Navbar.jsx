import React, { useState, useContext } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { SearchCard } from '../Index';
import { InscribleContext } from '../../Context/Context';

const Navbar = ({ childern }) => {

    const { getAllAppUser, userList, connectedAccount, currentUsername } = useContext(InscribleContext);

    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(false);

    const Menu = [
        {
            path: '/inscrible',
            element: 'Home',
            icon: <span className="material-symbols-outlined">home</span>
        },
        {
            path: '/explore',
            element: 'Explore',
            icon: <span className="material-symbols-outlined">explore</span>
        },
        {
            path: '/reels',
            element: 'Reels',
            icon: <span className="material-symbols-outlined">movie</span>
        },
        {
            path: '/create',
            element: 'Create',
            icon: <span className="material-symbols-outlined">add_circle</span>
        },
        {
            path: 'message',
            element: 'Message',
            icon: <span className="material-symbols-outlined">sms</span>
        },
        {
            path: `/profile/${connectedAccount}/${currentUsername}`,
            element: 'Profile',
            icon: <span className="material-symbols-outlined">account_circle</span>
        }
    ];

    const secondMenu = [
        {
            path: '/inscrible',
            element: 'Home',
            icon: <span className="material-symbols-outlined">home</span>
        },
        {
            path: '/explore',
            element: 'Explore',
            icon: <span className="material-symbols-outlined">explore</span>
        },
        {
            path: '/reels',
            element: 'Reels',
            icon: <span className="material-symbols-outlined">movie</span>
        },
        {
            path: '/search',
            element: 'Search',
            icon: <span className="material-symbols-outlined">search</span>
        },
        {
            path: '/create',
            element: 'Create',
            icon: <span className="material-symbols-outlined">add_circle</span>
        },
        {
            path: 'message',
            element: 'Message',
            icon: <span className="material-symbols-outlined">sms</span>
        },
        {
            path: `/profile/${connectedAccount}/${currentUsername}`,
            element: 'Profile',
            icon: <span className="material-symbols-outlined">account_circle</span>
        }
    ];

    return (
        <>
            {/* MOBILE MENU */}
            <div className='navbar-mobile'>
                <div className="navbar-mobile-header">
                    <h1>Inscrible</h1>
                </div>

                <div className="navbar-mobile-search-field">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" className='navbar-mobile-search-field_input' placeholder='Search'
                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                        onClick={async () => {
                            await getAllAppUser;
                            if (search === true) {
                                setSearch(false);
                            }
                            else{
                                setSearch(true);
                            }
                        }}
                    >
                    </input>
                </div>
            </div>

            <div className={search ? "nav-search-div" : 'd-none'}>
                {userList
                    .filter((user) =>
                        user.username.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((item) => (
                        <SearchCard
                            username={item.username}
                            address={item.accountAddress}
                            filteruser={item.username}
                            filterUserAdress={item.address}
                            key={item.id}
                        />
                    ))}
            </div>

            <div className="navbar-mobile-menu">
                <ul className='navbar-mobile-menu_list'>
                    {
                        Menu.map((item, i) => (
                            <li className='navbar-mobile-menu_list-item' key={i}>
                                <NavLink to={item.path} className='navbar-mobile-menu_list-item-link' activeclassname='active-b'>
                                    {item.icon}

                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </div>


            {/* DESKTOP MENU */}

            <div className="navbar-desktop">
                <div className="navbar-desktop-header">
                    <h1>Inscrible</h1>
                </div>
                <hr />

                <div className="navbar-desktop-menu">
                    <ul className='navbar-desktop-menu_list'>
                        {
                            secondMenu.map((item, i) => (
                                <li className="navbar-desktop-menu_list-item" key={i}>
                                    <NavLink to={item.path} className="navbar-desktop-menu_list-item_link" activeclassname='active'>
                                        {item.icon}
                                        {item.element}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>

                </div>
            </div>

            {/* TABLET MENU */}

            <div className="navbar-tablet">
                <div className="navbar-desktop-header">
                    {/* <h1>Inscrible</h1> */}
                </div>

                <div className="navbar-desktop-menu">
                    <ul className='navbar-desktop-menu_list'>
                        {
                            secondMenu.map((item, i) => (
                                <li className="navbar-desktop-menu_list-item" key={i}>
                                    <NavLink to={item.path} className="navbar-desktop-menu_list-item_link" activeclassname='active-b'>
                                        {item.icon}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>

                </div>
            </div>


            <main>{childern}</main>

        </>

    );
};

export default Navbar;