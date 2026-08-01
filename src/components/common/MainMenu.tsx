"use client";
import { useEffect, useState } from "react";
import { MenuList } from "@/lib/utils/MenuList";
import Menu from "../icons/Menu";

export default function MainMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 730) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <>
            <div>
                <div className={`
                    flex gap-3.5
                    max-[730px]:hidden    
                `}>
                    {MenuList.map((item, i) => (
                        <a key={i} href={item.path} className="font-bold">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className={`
                    hidden
                    max-[730]:block
                `}>
                    <div onClick={() => toggleMenu()} className="cursor-pointer">
                        <Menu color="var(--blue-1)"/>
                    </div>
                </div>
            </div>
            <div>
                <div
                    onClick={closeMenu}
                    className={`fixed inset-0 z-40 transition-colors duration-200 ${
                        isOpen ? "bg-black/50 pointer-events-auto" : "bg-black/0 pointer-events-none"
                    }`}
                />
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed top-0 left-0 h-full w-[200px] z-50 bg-blue-2 p-[20px] flex flex-col gap-[20px] transition-transform duration-200 ${
                        isOpen ? "translate-x-0" : "-translate-x-[200px]"
                    }`}
                >
                    {MenuList.map((item, i) => (
                        <a key={i} href={item.path} className="font-bold text-white" onClick={closeMenu}>
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}