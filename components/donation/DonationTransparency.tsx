const tiers = [
  { amount: "₹100", desc: "Plants 1 Tree" },
  { amount: "₹500", desc: "Plants 5 Trees" },
  { amount: "₹1000", desc: "Plants 12 Trees" },
];

export default function DonationTransparency() {
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8">Where Your Donation Goes 💚</h2>
      <div className="container mx-auto grid md:grid-cols-3 gap-6 px-6">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold">{tier.amount}</h3>
            <p className="text-gray-600 mt-2">{tier.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
