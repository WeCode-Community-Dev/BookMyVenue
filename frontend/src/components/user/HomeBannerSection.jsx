import { Link } from "react-router-dom"

export default function HomeBannerSection() {
    return (
        <section className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-red-600 via-red-700 to-neutral-900">
            <div className="px-8 py-16 text-white md:px-12">

                <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">
                    Find & Book the Perfect Venue Across Kerala
                </h1>

                <p className="mt-4 max-w-2xl text-lg text-red-100">
                    Wedding halls, auditoriums, resorts, cafés, studios and
                    more — all in one place.
                </p>


                <Link to='/venue'>
                    <button className="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-red-600 transition hover:bg-red-50">
                        Browse Venues
                    </button>
                </Link>

            </div>
        </section>
    )
}