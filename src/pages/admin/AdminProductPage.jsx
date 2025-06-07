import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminProductPage() {

    const [products, setProducts] = useState(sampleProducts)

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res) => {
                console.log(res.data);
                setProducts(res.data);
            });
        },[]
    );

    return (
        <div className="w-full h-full max-h-full overflow-y-scroll p-4 relative">
            <Link to="/admin/add-product" className="absolute text-xl cursor-pointer bottom-5 right-5 bg-green-500 text-white font-bold py-2 px-4 rounded text-center flex justify-center items-center">+</Link>
            <table className="min-w-full text-center bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Product ID</th>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Name</th>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Image</th>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Labelled Price</th>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Price</th>
                        <th className="py-3 px-4 uppercase font-semibold text-sm">Stock</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {
                        products.map(
                            (item,index)=>{
                                return(
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-4">{item.productId}</td>
                                        <td className="py-3 px-4 font-medium">{item.name}</td>
                                        <td className="py-3 px-4 flex justify-center items-center">
                                            <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md shadow-sm"/>
                                        </td>
                                        <td className="py-3 px-4 line-through text-gray-500">${item.labelledPrice}</td>
                                        <td className="py-3 px-4 font-bold text-green-600">${item.price}</td>
                                        <td className="py-3 px-4">{item.stock}</td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}