import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminProductPage() {

    const [products, setProducts] = useState(sampleProducts)
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(
        () => {
            if(isLoading == true){
                axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res) => {
                    console.log(res.data);
                    setProducts(res.data);
                    setIsLoading(false);
                });
            }
        }, [isLoading]
    );

    function deleteProduct(productId) {
        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("Please login first");
            return
        }
        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(() => {
            toast.success("Product deleted successfully");
            setIsLoading(true);
        }).catch((e) => {
            toast.error(e.response.data.message);
        })
    }

    return (
        <div className="w-full h-full max-h-full overflow-y-scroll p-4 relative">
            <Link to="/admin/add-product" className="absolute text-xl cursor-pointer bottom-5 right-5 bg-green-500 text-white font-bold py-2 px-4 rounded text-center flex justify-center items-center">+</Link> 
            {
                isLoading ?
                <div className="w-full h-full flex justify-center items-center"> 
                    <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-blue-900 rounded-full animate-spin">
                    </div>
                </div> :
                <table className="min-w-full text-center bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Product ID</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Name</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Image</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Labelled Price</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Price</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Stock</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
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
                                            <td>
                                                <div className="flex justify-center items-center w-full">
                                                    <FaTrash onClick={()=>{
                                                        deleteProduct(item.productId);
                                                    }} className="text-[20px] text-red-500 mx-2 cursor-pointer"/>
                                                    <FaEdit onClick={()=>{
                                                        navigate("/admin/edit-product" , {
                                                            state: item
                                                        })
                                                    }} className="text-[20px] text-blue-500 mx-2 cursor-pointer"/>
                                                </div> 
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </div>
    );
}