import { Link } from "react-router";
import { LuHouse } from "react-icons/lu";
import { IoChatboxOutline } from "react-icons/io5";
import { BsCollection } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";


export default function Navbar() {
    return (
        <div className="p-4 bg-[#F7F4ED] fixed bottom-0 w-full flex justify-center items-center shadow-md">
            <ul className="flex space-x-20 justify-center items-center">
                <li className="text-green-700 hover:text-green-500 transition-colors">
                    <Link to="/">
                        <LuHouse size={28} />
                    </Link>
                </li>
                <li className="text-green-700 hover:text-green-500 transition-colors">
                    <Link to="/chatroom">
                        <IoChatboxOutline size={28} />
                    </Link>
                </li>
                <li className="text-green-700 hover:text-green-500 transition-colors">
                    <Link to="/collections">
                        <BsCollection size={28} />
                    </Link>
                </li>
                <li className="text-green-700 hover:text-green-500 transition-colors">
                    <Link to="/profile">
                        <RxAvatar size={32} />
                    </Link>
                </li>
            </ul>
        </div>
    );
    
}
