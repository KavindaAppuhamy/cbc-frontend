import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import axios from "axios";
import { Package, Upload, DollarSign, Hash, FileText, Tag, Image, BarChart3, Info } from "lucide-react"; // Added Info icon for description placeholder hint

export default function AddProductPage() {
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState([]);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [labelledPrice, setLabelledPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const navigate = useNavigate();

    async function AddProduct() {
        const token = localStorage.getItem("token");
        if (token == null) {
            toast.error("Please login First");
            return;
        }

        if (images.length <= 0) {
            toast.error("Please upload at least one image");
            return;
        }

        const promisesArray = [];

        for (let i = 0; i < images.length; i++) {
            promisesArray[i] = mediaUpload(images[i]);
        }
        try {
            const imageUrls = await Promise.all(promisesArray);
            console.log(imageUrls);

            // Ensure altNames is handled correctly as an array for the product object
            const altNamesArray = Array.isArray(altNames) ? altNames.map(name => name.trim()) : altNames.split(",").map(name => name.trim());

            const product = {
                productId: productId,
                name: name,
                altNames: altNamesArray,
                description: description,
                images: imageUrls,
                labelledPrice: Number(labelledPrice), // Ensure numbers are numbers
                price: Number(price), // Ensure numbers are numbers
                stock: Number(stock), // Ensure numbers are numbers
            };
            axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", product, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then(() => {
                toast.success("Product added successfully");
                navigate("/admin/products");
            }).catch((e) => {
                toast.error(e.response.data.message);
            });
        } catch (e) {
            console.log(e);
            toast.error("An error occurred during product creation."); // Generic error message
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 font-sans antialiased">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl mb-6 shadow-xl animate-fade-in-down">
                        <Package className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight mb-3 animate-fade-in-up">
                        Add New Product
                    </h1>
                    <p className="text-gray-600 text-lg max-w-md mx-auto animate-fade-in">Craft compelling listings for your inventory effortlessly.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/75 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
                    <div className="space-y-7"> {/* Increased spacing */}
                        {/* Product ID */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-blue-700">
                                <Hash className="w-4 h-4 mr-2 text-blue-500 group-focus-within:text-blue-700 transition-colors duration-200" />
                                Product ID
                            </label>
                            <input
                                type="text"
                                placeholder="Enter a unique product identifier (e.g., SKU-001)"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                value={productId}
                                onChange={(e) => { setProductId(e.target.value); }}
                            />
                        </div>

                        {/* Product Name */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-green-700">
                                <Tag className="w-4 h-4 mr-2 text-green-500 group-focus-within:text-green-700 transition-colors duration-200" />
                                Product Name
                            </label>
                            <input
                                type="text"
                                placeholder="Clearly describe the product"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                value={name}
                                onChange={(e) => { setName(e.target.value); }}
                            />
                        </div>

                        {/* Alternative Names */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-purple-700">
                                <FileText className="w-4 h-4 mr-2 text-purple-500 group-focus-within:text-purple-700 transition-colors duration-200" />
                                Alternative Names
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., shoe, sneaker, kicks (comma-separated)"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                value={Array.isArray(altNames) ? altNames.join(", ") : altNames} // Ensure it always displays joined strings
                                onChange={(e) => { setAltNames(e.target.value.split(",").map(s => s.trim())); }}
                            />
                        </div>

                        {/* Description */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-indigo-700">
                                <Info className="w-4 h-4 mr-2 text-indigo-500 group-focus-within:text-indigo-700 transition-colors duration-200" />
                                Product Description
                            </label>
                            <textarea // Changed to textarea for better multi-line input
                                placeholder="Provide a detailed description of the product features, benefits, and specifications."
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base h-32 resize-y" // Increased height
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); }}
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-pink-700">
                                <Image className="w-4 h-4 mr-2 text-pink-500 group-focus-within:text-pink-700 transition-colors duration-200" />
                                Product Images
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-gray-300 focus:border-pink-600 focus:ring-4 focus:ring-pink-200/50 transition-all duration-200 bg-white/30 backdrop-blur-sm text-gray-900
                                                file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 transition-colors duration-200 cursor-pointer"
                                    onChange={(e) => setImages(Array.from(e.target.files))}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            {images.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1.5 ml-0.5">Selected: {Array.from(images).map(file => file.name).join(', ')}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">Upload high-quality images (JPG, PNG, up to 5MB each)</p>
                        </div>

                        {/* Pricing Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-orange-700">
                                    <DollarSign className="w-4 h-4 mr-2 text-orange-500 group-focus-within:text-orange-700 transition-colors duration-200" />
                                    Labelled Price (Optional)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 99.99"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                    value={labelledPrice}
                                    onChange={(e) => { setLabelledPrice(e.target.value); }}
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-emerald-700">
                                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500 group-focus-within:text-emerald-700 transition-colors duration-200" />
                                    Selling Price
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 79.99"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                    value={price}
                                    onChange={(e) => { setPrice(e.target.value); }}
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2.5 transition-colors duration-200 group-focus-within:text-cyan-700">
                                <BarChart3 className="w-4 h-4 mr-2 text-cyan-500 group-focus-within:text-cyan-700 transition-colors duration-200" />
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 150"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-200/50 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-base"
                                value={stock}
                                onChange={(e) => { setStock(e.target.value); }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mt-10 pt-6 border-t border-gray-200">
                        <Link
                            to="/admin/products"
                            className="w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 text-center border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                            Cancel
                        </Link>
                        <button
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/70"
                            onClick={AddProduct}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}