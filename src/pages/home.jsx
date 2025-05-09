export default function HomePage() {
    return (
        <div className="w-full h-screen bg-gradient-to-r from-blue-500 to-white-400 flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome to the Home Page</h2>
                <p className="text-gray-700 mb-4">This is the home page of our application.</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Go to Products
                </button>
            </div>
        </div>
    )
}