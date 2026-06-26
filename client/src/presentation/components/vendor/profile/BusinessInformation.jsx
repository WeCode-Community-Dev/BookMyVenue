import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BusinessInformation = ({ isEditing }) => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Business Information
      </h2>

      {!isEditing ? (
        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-500">
              GST Number
            </p>
            <p className="font-medium">
              29ABCDE1234F1Z5
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Registration Number
            </p>
            <p className="font-medium">
              REG123456
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Website
            </p>
            <p className="font-medium">
              www.bookmyvenue.com
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Business Description
            </p>
            <p className="font-medium">
              Premium venue provider specializing in weddings,
              corporate events, and private celebrations.
            </p>
          </div>

        </div>
      ) : (
        <div className="space-y-4">

          <Input
            defaultValue="29ABCDE1234F1Z5"
          />

          <Input
            defaultValue="REG123456"
          />

          <Input
            defaultValue="www.bookmyvenue.com"
          />

          <Textarea
            defaultValue="Premium venue provider specializing in weddings, corporate events, and private celebrations."
            rows={5}
          />

        </div>
      )}

    </div>
  );
};

export default BusinessInformation;