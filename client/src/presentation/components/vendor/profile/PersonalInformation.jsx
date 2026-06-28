import React from "react";
import { Input } from "@/components/ui/input";

const PersonalInformation = ({ isEditing }) => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Personal Information
      </h2>

      {!isEditing ? (
        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              First Name
            </p>
            <p className="font-medium">
              Arjun
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Name
            </p>
            <p className="font-medium">
              Kapoor
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email Address
            </p>
            <p className="font-medium">
              arjun@email.com
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone Number
            </p>
            <p className="font-medium">
              +91 9876543210
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Business Name
            </p>
            <p className="font-medium">
              BookMyVenue
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Business Type
            </p>
            <p className="font-medium">
              Venue Owner
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Address
            </p>
            <p className="font-medium">
              Mumbai, India
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              City
            </p>
            <p className="font-medium">
              Mumbai
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              State
            </p>
            <p className="font-medium">
              Maharashtra
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Postal Code
            </p>
            <p className="font-medium">
              400001
            </p>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">

          <Input defaultValue="Arjun" />
          <Input defaultValue="Kapoor" />

          <Input defaultValue="arjun@email.com" />
          <Input defaultValue="+91 9876543210" />

          <Input defaultValue="BookMyVenue" />
          <Input defaultValue="Venue Owner" />

          <Input defaultValue="Mumbai, India" />
          <Input defaultValue="Mumbai" />

          <Input defaultValue="Maharashtra" />
          <Input defaultValue="400001" />

        </div>
      )}

    </div>
  );
};

export default PersonalInformation;