import React, { useState } from "react";
import { Users, TriangleAlert } from "lucide-react";

export default function CampaignTypesChart({ users, booked, isAdmin }) {
  const userDetails = [
    ...new Map(booked.map((item) => [item.userId, item])).values(),
  ];

  return (
    <div
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full max-w-md flex flex-col gap-4 
    "
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 ">
            <Users className="w-5 h-5 text-ticket-orange" />
            Users lists
          </h3>
        </div>
      </div>
      {isAdmin && (
        <div>
          {users.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-hidden  overflow-y-scroll p-2">
              {users.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-2xl cursor-pointer transition-all duration-350 animate-fade-in-stagger $
                isSelected 
                   border-ticket-orange bg-slate-50 shadow-sm "
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.userName}
                      </h4>
                      <div className="flex flex-col  gap-2 mt-1 text-[10px] ">
                        <div className="flex gap-5">
                          <h2 className="text-slate-400 font-medium">Email</h2>
                          <h2 className="text-black" font-bold>
                            {" "}
                            {item.email}{" "}
                          </h2>
                        </div>
                        <div className="flex gap-5">
                          <h2 className="text-slate-400 font-medium">Number</h2>
                          <h2 className="text-black" font-bold>
                            {" "}
                            {item.number}{" "}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-200 w-full rounded-md p-5 ">
              <div className="flex gap-2 justify-center items-center">
                <TriangleAlert className="text-rose-500" />
                <h1 className="text-sm">No users available....</h1>
              </div>
            </div>
          )}
        </div>
      )}
      {userDetails.length > 0 ? (
        <div className="flex flex-col gap-4 overflow-hidden  overflow-y-scroll p-2">
          {userDetails.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-2xl cursor-pointer transition-all duration-350 animate-fade-in-stagger $
                isSelected 
                   border-ticket-orange bg-slate-50 shadow-sm "
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                    {item.name}
                  </h4>
                  <div className="flex flex-col  gap-2 mt-1 text-[10px] ">
                    <div className="flex gap-5">
                      <h2 className="text-slate-400 font-medium">Email</h2>
                      <h2 className="text-black" font-bold>
                        {" "}
                        {item.email}{" "}
                      </h2>
                    </div>
                    <div className="flex gap-5">
                      <h2 className="text-slate-400 font-medium">Number</h2>
                      <h2 className="text-black" font-bold>
                        {" "}
                        {item.number}{" "}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-200 w-full rounded-md p-5 ">
          <div className="flex gap-2 justify-center items-center">
            <TriangleAlert className="text-rose-500" />
            <h1 className="text-sm">No users available....</h1>
          </div>
        </div>
      )}
    </div>
  );
}
