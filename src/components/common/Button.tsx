interface PropsType {
    name: string;
}

export default function Button({name}:PropsType) {
    return(
        <div>
            <button className="" >{name}</button>
        </div>
    );
}