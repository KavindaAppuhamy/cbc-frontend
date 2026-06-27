import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";

export default function ProductOverview() {
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading"); // "loading", "error", "loaded"
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
            (response) => {
                console.log(response.data);
                setProduct(response.data);
                setStatus("success");
            }
        ).catch(
            (error)=>{
            console.log(error);
            setStatus("error");
            toast.error("Failed to load product data.");
        });
    }, []);

    return (
        <>
            {status == "success" && (
                <div className="w-full h-full flex">
                    <div className="w-[50%] h-full flex justify-center items-center">
                        <ImageSlider images={product.images}/>
                    </div>
                    <div className="w-[50%] bg-blue-900 h-full">

                    </div>
                </div>
            )}
            {
                status == "loading" && <Loading/>
            }
        </>
    );
}