import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../utils/api";
import {
    Package,
    DollarSign,
    Hash,
    FileText,
    Tag,
    BarChart3,
    Info,
    ArrowLeft,
    Save,
    Image as ImageIcon,
} from "lucide-react";
import MultiImagePicker from "../../components/multiImagePicker";

export default function EditProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const incoming = location.state || {};

    const [productId, setProductId] = useState(incoming.productId || "");
    const [name, setName] = useState(incoming.name || "");
    const [altNames, setAltNames] = useState(
        (incoming.altNames || []).join(", ")
    );
    const [description, setDescription] = useState(
        incoming.description || ""
    );
    const [images, setImages] = useState(incoming.images || []);
    const [labelledPrice, setLabelledPrice] = useState(
        incoming.labelledPrice || 0
    );
    const [price, setPrice] = useState(incoming.price || 0);
    const [stock, setStock] = useState(incoming.stock || 0);

    useEffect(() => {
        if (!location.state) {
            navigate("/admin/products", { replace: true });
        }
    }, [location.state, navigate]);

    async function updateProduct() {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first");
            return;
        }

        let imageUrls = [];

        try {
            const uploaded = [];

            for (const item of images) {
                if (typeof item === "string") {
                    uploaded.push(item);
                } else {
                    uploaded.push(await mediaUpload(item));
                }
            }

            imageUrls = uploaded;

            if (!imageUrls.length) {
                toast.error("Please keep at least one product image.");
                return;
            }

            const altNamesArray = Array.isArray(altNames)
                ? altNames.map((a) => a.trim()).filter(Boolean)
                : altNames
                      .split(",")
                      .map((a) => a.trim())
                      .filter(Boolean);

            const product = {
                productId: productId.trim(),
                name: name.trim(),
                altNames: altNamesArray,
                description: description.trim(),
                images: imageUrls,
                labelledPrice: Number(labelledPrice),
                price: Number(price),
                stock: Number(stock),
            };

            await api.put(`/api/products/${productId}`, product);

            toast.success("Product updated successfully!");

            setTimeout(() => {
                navigate("/admin/products");
            }, 600);
        } catch (error) {
            toast.error(getErrorMessage(error, "Update failed"));
        }
    }

    const inputClass =
        "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

    const textareaClass =
        "w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 resize-y";

    const labelClass =
        "mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-700";

    return (
        <div className="min-h-screen bg-[#f6f8fb] px-4 py-6 font-sans text-slate-900 sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-6xl">

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                            <Package className="h-3.5 w-3.5" />
                            Product Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Edit Product
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Update product information, images, pricing and
                            inventory from one place.
                        </p>
                    </div>

                    <Link
                        to="/admin/products"
                        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md sm:self-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </div>

                {/* =====================================================
                    MAIN FORM
                ====================================================== */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.20)]">

                    {/* Top Accent */}
                    <div className="h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400" />

                    <div className="p-5 sm:p-7 lg:p-9">

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================== */}
                        <section>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                                    <Package className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Basic Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Update the information customers see
                                        about this product.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {/* Product ID */}
                                <div>
                                    <label className={labelClass}>
                                        <Hash className="h-4 w-4 text-slate-400" />
                                        Product ID
                                    </label>

                                    <input
                                        type="text"
                                        disabled
                                        value={productId}
                                        className={inputClass}
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Product ID cannot be changed.
                                    </p>
                                </div>

                                {/* Product Name */}
                                <div>
                                    <label className={labelClass}>
                                        <Tag className="h-4 w-4 text-slate-400" />
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        className={inputClass}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Alternative Names */}
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        Alternative Names
                                        <span className="font-normal text-slate-400">
                                            Optional
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. sneaker, kicks, running shoe"
                                        className={inputClass}
                                        value={
                                            Array.isArray(altNames)
                                                ? altNames.join(", ")
                                                : altNames
                                        }
                                        onChange={(e) =>
                                            setAltNames(
                                                e.target.value
                                                    .split(",")
                                                    .map((s) => s.trim())
                                            )
                                        }
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Separate multiple names using commas.
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        <Info className="h-4 w-4 text-slate-400" />
                                        Product Description
                                    </label>

                                    <textarea
                                        placeholder="Describe the product features, benefits, specifications and other useful information..."
                                        className={textareaClass}
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />

                                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                                        <span>
                                            Keep the description clear and
                                            useful for customers.
                                        </span>

                                        <span>
                                            {description.length} characters
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="my-9 border-t border-slate-100" />

                        {/* =================================================
                            PRODUCT IMAGES
                        ================================================== */}
                        <section>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <ImageIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Product Images
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage existing images and add new
                                        product images.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:p-6">
                                <MultiImagePicker
                                    value={images}
                                    onChange={setImages}
                                    existing
                                />

                                <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="flex items-center gap-2">
                                        <Info className="h-3.5 w-3.5" />
                                        Keep at least one product image.
                                    </span>

                                    <span>
                                        The first image becomes the main
                                        product image.
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="my-9 border-t border-slate-100" />

                        {/* =================================================
                            PRICING & INVENTORY
                        ================================================== */}
                        <section>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <DollarSign className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Pricing & Inventory
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Update pricing and current inventory
                                        availability.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                {/* Labelled Price */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                                    <label className={labelClass}>
                                        <DollarSign className="h-4 w-4 text-slate-400" />
                                        Labelled Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={inputClass}
                                        value={labelledPrice}
                                        onChange={(e) =>
                                            setLabelledPrice(e.target.value)
                                        }
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Original / displayed price.
                                    </p>
                                </div>

                                {/* Selling Price */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                                    <label className={labelClass}>
                                        <DollarSign className="h-4 w-4 text-slate-400" />
                                        Selling Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={inputClass}
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Current selling price.
                                    </p>
                                </div>

                                {/* Stock */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                                    <label className={labelClass}>
                                        <BarChart3 className="h-4 w-4 text-slate-400" />
                                        Stock Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className={inputClass}
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(e.target.value)
                                        }
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Number of units currently available.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================== */}
                        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">

                            <Link
                                to="/admin/products"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cancel
                            </Link>

                            <button
                                type="button"
                                onClick={updateProduct}
                                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                            >
                                <Save className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                Update Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Helper */}
                <div className="mt-5 text-center text-xs text-slate-400">
                    Review all changes carefully before updating the product.
                </div>
            </div>
        </div>
    );
}
