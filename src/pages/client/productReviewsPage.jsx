import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";
import api, { extractList, getErrorMessage } from "../../utils/api";
import toast from "react-hot-toast";
import ClientReviews from "../../components/clientReviews";

function Stars({ value }) { return <div className="flex gap-0.5">{[1,2,3,4,5].map((n)=><Star key={n} size={18} fill={n<=value?"currentColor":"none"} className={n<=value?"text-amber-400":"text-gray-300"}/>)}</div> }

export default function ProductReviewsPage(){
 const {id}=useParams(); const [product,setProduct]=useState(null); const [reviews,setReviews]=useState([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([api.get(`/api/products/${id}`),api.get(`/api/reviews/${id}`)]).then(([p,r])=>{setProduct(p.data);setReviews(extractList(r.data,"reviews"));}).catch(e=>toast.error(getErrorMessage(e,"Could not load reviews."))).finally(()=>setLoading(false));},[id]);
 const avg=useMemo(()=>reviews.length?reviews.reduce((s,r)=>s+Number(r.rating||0),0)/reviews.length:0,[reviews]);
 if(loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink-soft">Loading reviews…</div>;
 return <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12"><Link to={`/overview/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-accent-dark mb-7"><ChevronLeft size={16}/> Back to product</Link><div className="rounded-3xl bg-gradient-to-br from-secondary to-white border border-gray-100 p-6 sm:p-10"><div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between"><div><p className="text-xs uppercase tracking-[.2em] font-bold text-accent-dark">Customer reviews</p><h1 className="mt-2 text-3xl sm:text-4xl font-black">{product?.name || "Product reviews"}</h1><p className="mt-2 text-sm text-ink-soft">Detailed ratings and verified customer feedback.</p></div><div className="rounded-2xl bg-white p-6 text-center shadow-sm"><div className="text-5xl font-black">{avg.toFixed(1)}</div><Stars value={Math.round(avg)}/><p className="mt-1 text-xs text-ink-soft">{reviews.length} review{reviews.length===1?"":"s"}</p></div></div></div><div className="mt-8 grid gap-4">{reviews.length ? reviews.map(r=><article key={r._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="flex justify-between gap-4"><div><h2 className="font-bold">{r.userName||"Customer"}</h2><p className="text-xs text-ink-soft mt-1">{r.date?new Date(r.date).toLocaleDateString():""}</p></div><Stars value={Number(r.rating)}/></div><p className="mt-4 text-gray-700 leading-7">{r.comment}</p>{r.adminReply&&<div className="mt-4 rounded-xl bg-secondary p-4 text-sm"><span className="font-bold">Store reply:</span> {r.adminReply}</div>}</article>):<div className="rounded-2xl bg-secondary/60 p-10 text-center text-ink-soft">No published reviews yet.</div>}</div><ClientReviews productId={id}/></div>;
}
