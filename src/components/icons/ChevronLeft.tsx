interface PropsType {
    color?: string;
}

export default function ChevronLeft({color = "black"}:PropsType) {
    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color}
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-chevron-left preview-icon"
        >
            <path d="m15 18-6-6 6-6"/>
        </svg>
    );
}