export function VenueOwnerBenefitCard({ icon: Icon, title, text }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 drop-shadow-lg hover:shadow-md transition-all">
            <div className="mb-3 inline-flex rounded-lg bg-red-50 p-2 text-red-600">
                <Icon size={22} />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
}
