export default function Features() {
    const features = [
        {
            title: "customize",
            description:
                "Design custom event registration flows, create event ticketing tiers or VIP experiences, or use custom event templates to effortlessly create free events. Design your own event website or online invitations.",
            gradient: "bg-gradient-to-r from-blue-300 to-blue-100",
        },
        {
            title: "control",
            description:
                "Quickly create a custom and completely secure event planning experience with features like multi-part events, custom tags, custom questions, and more to handle complex events or VIP guest lists.",
            gradient: "bg-gradient-to-b from-blue-300 to-blue-100",
        },
        {
            title: "automate",
            description:
                "Streamline communications with automated email reminders and confirmations. Add event collaborators to host dozens of events in a single dashboard. Export all event data with a click to automate reporting and track event ROI.",
            gradient: "bg-gradient-to-l from-blue-300 to-blue-100",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-2xl shadow-lg transition-all duration-300 border border-gray-700 bg-gray-800 hover:shadow-xl hover:scale-105`}
                    >
                        <h3 className="text-xl font-bold text-white mb-2 capitalize">
                            {feature.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}