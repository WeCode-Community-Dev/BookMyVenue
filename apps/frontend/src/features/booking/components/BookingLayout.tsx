/* eslint-disable */

import BookingHeader from "./BookingHeader";
import BookingSummary from "./BookingSummary";
import BookingVenueCard from "./BookingVenueCard";

type SectionPlaceholderProps = {
    title: string;
    description: string;
};

const SectionPlaceholder = ({ title, description }: SectionPlaceholderProps) => {
    return (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
        </section>
    );
};

type RightCardPlaceholderProps = {
    title: string;
    description: string;
    heightClassName: string;
};

const RightCardPlaceholder = ({
    title,
    description,
    heightClassName,
}: RightCardPlaceholderProps) => {
    return (
        <section
            className={`rounded-xl border border-dashed border-slate-300 bg-white p-5 shadow-sm ${heightClassName}`}
        >
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">{description}</p>
        </section>
    );
};


const BookingLayout = () => {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-2 sm:px-6 lg:px-8">
                <BookingHeader currentStep={1} />

                <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
                    <section className="min-w-0 space-y-5">
                        <BookingVenueCard />



                        <SectionPlaceholder
                            title="When is your event?"
                            description="Calendar date selection component will come here."
                        />

                        <SectionPlaceholder
                            title="Choose your booking package"
                            description="Package cards component will come here."
                        />
                    </section>

                    <aside className="min-w-0 space-y-5 lg:sticky lg:top-6 lg:self-start">
                        <BookingSummary />
                        
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default BookingLayout;
