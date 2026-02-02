import StripeProvider from "@/components/StripeProvider";
import CheckoutForm from "@/components/CheckoutForm";

async function getClientSecret(): Promise<string> {
  const res = await fetch("http://localhost:5000/v2/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      bookingId: "booking_123",
      amount: 5000,
    }),
  });

  const data = await res.json();
  return data.clientSecret;
}

export default async function PayPage() {
  const clientSecret = await getClientSecret();

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <StripeProvider clientSecret={clientSecret}>
        <CheckoutForm />
      </StripeProvider>
    </div>
  );
}
