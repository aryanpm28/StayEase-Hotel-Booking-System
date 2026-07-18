import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CircleCheck, CreditCard } from "lucide-react";
import { getBookingById } from "../api/bookings";
import { makePayment } from "../api/payments";
import { notifyPaymentCompleted } from "../realtime/socket";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";

const methods = [
  { value: "CREDIT_CARD", label: "Credit card" },
  { value: "DEBIT_CARD", label: "Debit card" },
  { value: "UPI", label: "UPI" },
  { value: "NET_BANKING", label: "Net banking" },
  { value: "CASH", label: "Pay at hotel" },
];

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("CREDIT_CARD");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    getBookingById(bookingId)
      .then(setBooking)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [bookingId]);

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payment = await makePayment({
        bookingId: Number(bookingId),
        paymentMethod: method,
      });

      notifyPaymentCompleted({
        customerId: user?.id,
        customerName: user ? `${user.firstName} ${user.lastName}` : booking?.customerName,
        amount: payment.amount,
        paymentStatus: payment.paymentStatus,
        bookingId: payment.bookingId,
      });

      setReceipt(payment);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading booking" />;
  if (error && !booking)
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <ErrorBanner message={error} />
      </div>
    );

  if (receipt) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <CircleCheck className="mx-auto text-sage" size={48} />
        <h1 className="mt-4 font-display text-3xl text-ink">Payment confirmed</h1>
        <p className="mt-2 text-sm text-ink/60">
          Transaction <span className="font-mono">{receipt.transactionId}</span>
        </p>
        <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 text-left text-sm">
          <div className="flex justify-between py-1">
            <span className="text-ink/50">Amount</span>
            <span className="font-mono">₹{Number(receipt.amount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink/50">Method</span>
            <span>{receipt.paymentMethod.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink/50">Status</span>
            <span className="text-sage">{receipt.paymentStatus}</span>
          </div>
        </div>
        <Link
          to="/my-bookings"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-ivory"
        >
          View my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <div className="flex items-center gap-2 text-brass">
        <CreditCard size={20} />
        <span className="font-mono text-xs uppercase tracking-widest">Payment</span>
      </div>
      <h1 className="mt-2 font-display text-3xl text-ink">Complete your booking</h1>

      {booking && (
        <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-ink/50">Room</span>
            <span>
              {booking.roomType} · {booking.roomNumber}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink/50">Dates</span>
            <span>
              {booking.checkInDate} → {booking.checkOutDate}
            </span>
          </div>
          <div className="flex justify-between border-t border-dashed border-ink/15 py-2 pt-3">
            <span className="text-ink/50">Total due</span>
            <span className="font-mono text-lg text-ink">
              ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handlePay} className="mt-6 flex flex-col gap-4">
        <span className="text-sm text-ink/60">Choose a payment method</span>
        <div className="grid grid-cols-2 gap-3">
          {methods.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                method === m.value
                  ? "border-brass bg-brass/10 text-ink"
                  : "border-ink/15 text-ink/70 hover:border-ink/30"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-wine py-3 text-ivory transition hover:bg-wine-light disabled:opacity-60"
        >
          {submitting ? "Processing…" : "Pay now"}
        </button>
      </form>
    </div>
  );
}
