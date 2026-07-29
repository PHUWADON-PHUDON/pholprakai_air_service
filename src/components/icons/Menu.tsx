interface PropsType {
    color?: string;
}

export default function Menu({color = "black"}:PropsType) {
    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-menu-icon lucide-menu"
        >
            <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
        </svg>
    );
}