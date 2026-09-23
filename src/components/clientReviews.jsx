import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import api, { extractList, getErrorMessage } from "../utils/api";
import { getUser, isLoggedIn } from "../utils/auth";

function Stars({ value = 0, interactive = false, onChange }) {
  return <div className="flex gap-1">{[1,2,3,4,5].map((n) => <button key={n} type="button" disabled={!interactive} onClick={() => onChange?.(n)} aria-label={`${n} stars`} className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}><Star size={interactive ? 25 : 18} fill={n <= value ? "currentColor" : "none"} className={n <= value ? "text-amber-400" : "text-gray-300"}/></button>)}</div>;
}

export default function ClientReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try { const response = await api.get(`/api/reviews/${productId}`); setReviews(extractList(response.data, "reviews")); }
    catch (error) { toast.error(getErrorMessage(error, "Could not load reviews.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [productId]);

  const summary = useMemo(() => {
    const counts = [1,2,3,4,5].map((n) => reviews.filter((r) => Number(r.rating) === n).length);
    const total = reviews.length;
    return { total, average: total ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total : 0, counts };
  }, [reviews]);

  const submit = async (event) => {
    event.preventDefault();
    if (!isLoggedIn()) { toast.error("Please login to write a review."); return; }
    if (!rating || comment.trim().length < 3) { toast.error("Choose a star rating and write a short review."); return; }
    const user = getUser();
    setSubmitting(true);
    try {
      await api.post("/api/reviews", { productId, userId: user?._id || user?.userId || user?.id, userName: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Customer", rating, comment: comment.trim() });
      setRating(0); setComment(""); toast.success("Review submitted for approval."); await load();
    } catch (error) { toast.error(getErrorMessage(error, "Could not submit your review.")); }
    finally { setSubmitting(false); }
  };

  return <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-gray-100 pb-7">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent-dark">Customer feedback</p><h2 className="mt-1 text-2xl sm:text-3xl font-bold">Reviews & ratings</h2><p className="mt-2 text-sm text-ink-soft">Real feedback from customers who have reviewed this product.</p></div>
      <Link to={`/reviews/${productId}`} className="rounded-full border border-accent/30 px-5 py-2.5 text-sm font-semibold hover:bg-secondary">View all reviews →</Link>
    </div>
    <div className="grid lg:grid-cols-[260px_1fr] gap-8 py-7">
      <div className="rounded-2xl bg-secondary/70 p-6 text-center"><div className="text-5xl font-black">{summary.average.toFixed(1)}</div><Stars value={Math.round(summary.average)}/><p className="mt-2 text-sm text-ink-soft">{summary.total} published review{summary.total === 1 ? "" : "s"}</p></div>
      <div className="space-y-2">{[5,4,3,2,1].map((n) => { const count = summary.counts[n-1]; const pct = summary.total ? count / summary.total * 100 : 0; return <div key={n} className="flex items-center gap-3 text-sm"><span className="w-8 font-semibold">{n}★</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-amber-400" style={{width:`${pct}%`}}/></div><span className="w-8 text-right text-ink-soft">{count}</span></div>; })}</div>
    </div>
    {loading ? <p className="py-6 text-center text-sm text-ink-soft">Loading reviews…</p> : reviews.length ? <div className="grid md:grid-cols-2 gap-4">{reviews.slice(0,4).map((review) => <article key={review._id} className="rounded-2xl border border-gray-100 p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{review.userName || "Customer"}</p><p className="text-xs text-ink-soft">{review.date ? new Date(review.date).toLocaleDateString() : ""}</p></div><Stars value={Number(review.rating)}/></div><p className="mt-4 text-sm leading-6 text-gray-700">{review.comment}</p>{review.adminReply && <div className="mt-4 rounded-xl bg-secondary p-3 text-sm"><strong>Store reply:</strong> {review.adminReply}</div>}</article>)}</div> : <div className="rounded-2xl bg-secondary/60 p-8 text-center text-sm text-ink-soft">No published reviews yet. Be the first to share your experience.</div>}
    <form onSubmit={submit} className="mt-8 rounded-2xl bg-gradient-to-br from-secondary to-white p-5 sm:p-6 border border-gray-100"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h3 className="font-bold">Write a review</h3><p className="text-xs text-ink-soft mt-1">Your review will appear after admin approval.</p></div><Stars value={rating} interactive onChange={setRating}/></div><textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Tell other customers what you liked about this product…" className="mt-4 w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"/><div className="mt-3 flex justify-end"><button disabled={submitting} className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50">{submitting ? "Submitting…" : isLoggedIn() ? "Submit review" : "Login to review"}</button></div></form>
  </section>;
}
