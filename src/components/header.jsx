import UserData from "./userData";

export default function Header(){
    console.log("Header component loaded")
    return(
        <header className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-8 shadow-lg rounded-b-3xl">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                    Crystal Beauty Clear
                </h1>
                <p className="text-base md:text-lg font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea quisquam soluta quas odio harum ratione delectus eveniet! Qui, natus maxime?
                </p>
                <div className="mt-6">
                    <UserData />
                </div>
            </div>
        </header>
    )
}