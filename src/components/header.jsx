import UserData from "./userData";

export default function Header(){
    console.log("Header component loaded")
    return(
        <header className="bg-gradient-to-r from-blue-500 to-white-400 text-white p-8 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                    Eventora 
                </h1>
                <p className="text-base md:text-lg font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                   At Eventora, we blend creativity and precision to design unforgettable experiences seamlessly managing every detail so you can enjoy the moment.
                </p>
                <div className="mt-6">
                    <UserData />
                </div>
            </div>
        </header>
    )
}