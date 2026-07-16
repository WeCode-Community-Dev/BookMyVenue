import React from "react";
import {
  Users,
  University,
  UserPen,
  CalendarCog,
  CircleDollarSign,
} from "lucide-react";

const Card = ({ title, value, icon: Icon }) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-3xl p-5
         md:p-6 shadow-sm hover:shadow-md hover:border-slate-350
     hover:-translate-y-1.5 transition-all duration-300 group select-none flex flex-col justify-between h-40 
     animate-fade-in-stagger `}
    >
      <div className="flex items-start justify-between w-full">
        <div className="space-y-1.5">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {value}
          </h3>
        </div>

        <div
          className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center
     text-slate-600 group-hover:border-ticket-yellow group-hover:text-ticket-orange transition-all duration-350"
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default function MetricCards({ user, status, booked }) {
  const isAdmin = user?.role === "admin";

  const totalPrice = booked.reduce(
    (sum, product) => sum + Number(product.price),
    0,
  );

  const userIds = [...new Set(booked.map((item) => item.userId))];


  return (
    <div className="space-y-6">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none 
      bg-gradient-to-r from-[#FFFDF5] to-[#FFF9E6] border border-amber-100 p-6 rounded-3xl animate-fade-in-up-stagger
       delay-0"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Welcome back,{" "}
            <span
              className="bg-gradient-to-r from-ticket-orange to-amber-500 bg-clip-text
             text-transparent"
            >
              {user.userName}
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-2.5">
            Welcome back! Here's what's happening today in your space booking &
            marketing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
        <Card
          title="Total venues"
          value={status.venues.length}
          icon={University}
        />
        {isAdmin ? (
          <Card title="Users" value={status.users.length} icon={Users} />
        ) : (
          <Card title="Users" value={userIds.length} icon={Users} />
        )}
        {isAdmin ? (
          <Card
            title="Organizers"
            value={status.organizers.length}
            icon={UserPen}
          />
        ) : (
          <Card title="Revenue" value={totalPrice} icon={CircleDollarSign} />
        )}
        <Card title="Bookings" value={booked.length} icon={CalendarCog} />
      </div>
    </div>
  );
}
