import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },

                public_id: {
                    type: String,
                    required: true,
                },
            },
        ],
        coverImage: {
            url: {
                type: String,
                default: "",
            },

            public_id: {
                type: String,
                default: "",
            },
        },
        venueType: {
            type: String,
            enum: ["offline", "online", "hybrid"],
            default: "offline",
        },

        indoorOutdoor: {
            type: String,
            enum: ["indoor", "outdoor", "both"],
            default: "indoor",
        },

        price: {
            type: Number,
            required: true,
        },

        pricingUnit: {
            type: String,
            enum: ["perhour", "perday"],
            default: "perhour",
        },

        capacity: {
            type: Number,
            required: true,
        },

        amenities: [
            {
                type: String,
            },
        ],
        rules: [
            {
                type: String,
            },
        ],

        address: {
            type: String,
            required: true,
        },

        city: String,
        state: String,
        pincode: String,

        location: {
            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },
        },

        averageRating: {
            type: Number,
            default: 0,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const venueModel = mongoose.model("Venue", venueSchema);
export default venueModel;