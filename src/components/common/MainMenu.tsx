"use client";
import { useEffect, useRef } from "react";
import { MenuList } from "@/lib/utils/MenuList";
import Menu from "../icons/Menu";

export default function MainMenu() {
    const bgMobileMenu = useRef<HTMLDivElement | null>(null);
    const navMobileMenu = useRef<HTMLDivElement | null>(null);
    const timeoutRefs = useRef<(NodeJS.Timeout | undefined)[]>([]);
    const isToggle = useRef(false);

    const clickMenu = () => {
        let time1: NodeJS.Timeout | undefined
        let time2: NodeJS.Timeout | undefined
        let time3: NodeJS.Timeout | undefined

        timeoutRefs.current.forEach((t) => t && clearTimeout(t));
        timeoutRefs.current = [];

        if (!isToggle.current) {
            time1 = setTimeout(() => {
                if (!bgMobileMenu.current) return;
                bgMobileMenu.current.style.display = "block";
            },10);
    
            time2 = setTimeout(() => {
                if (!bgMobileMenu.current) return;
                bgMobileMenu.current.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            },20);
    
            time3 = setTimeout(() => {
                if (!navMobileMenu.current) return;
                navMobileMenu.current.style.transform = "translateX(200px)";
            },30);

            isToggle.current = true;
        }
        else if (isToggle.current) {
            time1 = setTimeout(() => {
                if (!bgMobileMenu.current) return;
                if (!navMobileMenu.current) return;
                navMobileMenu.current.style.transform = "translateX(-200px)";
                bgMobileMenu.current.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
            },10);

            time2 = setTimeout(() => {
                if (!bgMobileMenu.current) return;
                bgMobileMenu.current.style.display = "none";
            },200);

            isToggle.current = false;
        }

        timeoutRefs.current = [time1, time2, time3];
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 730) {
                if (!bgMobileMenu.current) return;
                if (!navMobileMenu.current) return;

                timeoutRefs.current.forEach((t) => t && clearTimeout(t));
                timeoutRefs.current = [];

                navMobileMenu.current.style.transform = "translateX(-200px)";
                bgMobileMenu.current.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
                bgMobileMenu.current.style.display = "none";

                isToggle.current = false;
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            timeoutRefs.current.forEach((t) => clearTimeout(t));
        };
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
                    <div onClick={() => clickMenu()} className="cursor-pointer">
                        <Menu/>
                    </div>
                </div>
            </div>
            <div onClick={() => clickMenu()} ref={bgMobileMenu} className={`
                hidden fixed top-0 left-0 w-full h-full overflow-hidden duration-200
            `}>
                <div ref={navMobileMenu} onClick={(e) => e.stopPropagation()} className={`
                    w-[200px] translate-x-[-200px] bg-blue-2 h-full p-[20px] flex flex-col gap-[20px] duration-200
                `}>
                    {MenuList.map((item, i) => (
                        <a key={i} href={item.path} className="font-bold text-white">
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}