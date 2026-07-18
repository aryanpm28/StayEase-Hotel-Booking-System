import { useEffect, useState } from "react";
import { getPayments } from "../../api/payments";
import { extractErrorMessage } from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBanner from "../../components/ErrorBanner";

export default function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Payments</h1>
        <span className="rounded-full bg-sage/10 px-4 py-1.5 text-sm text-sage">
          ₹{totalRevenue.toLocaleString("en-IN")} collected
        </span>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Loading payments" />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-dim text-left text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-normal">Guest</th>
                  <th className="px-4 py-3 font-normal">Booking #</th>
                  <th className="px-4 py-3 font-normal">Method</th>
                  <th className="px-4 py-3 font-normal">Amount</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId} className="border-t border-ink/5">
                    <td className="px-4 py-3">{p.customerName}</td>
                    <td className="px-4 py-3 font-mono">#{p.bookingId}</td>
                    <td className="px-4 py-3">{p.paymentMethod.replace("_", " ")}</td>
                    <td className="px-4 py-3 font-mono">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          p.paymentStatus === "SUCCESS"
                            ? "bg-sage/15 text-sage"
                            : "bg-wine/10 text-wine"
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/50">
                      {p.transactionId}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
