import { bookingModel } from "../Models/bookingModel.js";
import { guestModel } from "../Models/guestModel.js";
import { userModel } from "../Models/registerModel.js";
import { venueModel } from "../Models/venueModel.js";
import { uploadCloudinary } from "../utilities/cloudinaryUtility.js";
import fs from "fs";

const getAll = async (req, res) => {
  try {
    const venues = await venueModel.find();
    if (!venues) {
      return res.status(400).json({
        message: "No venues found..",
      });
    }

    return res.status(200).json({
      message: "Got venues",
      venue: venues,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await venueModel.findOne({ _id: id });
    if (!response) {
      return res.status(400).json({
        message: "venue not found",
      });
    }
    return res.status(200).json({
      message: "got the venue",
      venue: response,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

const handleRegister = async (req, res) => {
  try {
    const {
      organiZerId,
      name,
      place,
      capacity,
      description,
      spec,
      rating,
      type,
      price,
      slots,
    } = req.body;
    if (
      (!organiZerId,
      !name,
      !place,
      !capacity,
      !description,
      !spec,
      !rating,
      !price,
      !type,
      !slots)
    ) {
      return res.status(400).json({
        message: "All fields are required..",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image not provided..",
      });
    }

    const imageURL = await uploadCloudinary(req.file.path);

    const newVenue = await venueModel.create({
      organiZerId,
      name,
      place,
      capacity,
      description,
      spec: JSON.parse(req.body.spec),
      rating,
      type,
      price,
      image: imageURL,
      slots: JSON.parse(req.body.slots),
    });

    return res.status(200).json({
      message: "venue created..",
      venue: newVenue,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { venueId } = req.params;
    if (!venueId) {
      return res.status(404).json({
        message: "No id found..",
      });
    }

    const deleteRes = await venueModel.findByIdAndDelete({ _id: venueId });
    if (!deleteRes) {
      return res.status(400).json({
        message: "No venue found..",
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      venue: deleteRes,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleEdit = async (req, res) => {
  try {
    const { venueId } = req.params;

    const updateData = { ...req.body };
    updateData.spec = JSON.parse(req.body.spec);
    updateData.slots = JSON.parse(req.body.slots);

    if (req.file) {
      const courseUrl = await uploadCloudinary(req.file.path);
      updateData.image = courseUrl;
      fs.unlinkSync(req.file.path);
    }
    const editRes = await venueModel.findByIdAndUpdate(
      venueId,
      {
        $set: updateData,
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Data edited..",
      venue: editRes,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const verifyVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const verify = await venueModel.findByIdAndUpdate(
      id,
      { $set: { isApproved: "yes" } },
      { new: true },
    );

    if (!verify) {
      return res.status(400).json({
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      message: "Venue verified..",
    });
  } catch (error) {
    return res.status(200).json({
      message: error,
    });
  }
};

const getVenueOrg = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await venueModel.find({ organiZerId: id });
    if (!response) {
      return res.status(400).json({
        message: "Listed venue not found",
      });
    }

    return res.status(200).json({
      venue: response,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: error,
    });
  }
};

const getBookedDates = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ venueId: req.params.id })
      .select("bookedRanges");
    if (!bookings) return res.status(404).json({ error: "Venue not found" });

    const bookedRanges = bookings.flatMap((booking) => booking.bookedRanges);

    res.status(200).json(bookedRanges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dates" });
  }
};

const bookVenue = async (req, res) => {
  try {
    const {
      bookedRanges,
      userId,
      venueId,
      venueName,
      name,
      email,
      number,
      price,
      organizerId,
    } = req.body;
    const { id } = req.params;

    if (!name || !email || !number) {
      return res.status(400).json({
        message: "All fields are required..",
      });
    }

    const reqStart = new Date(bookedRanges[0].startDate);
    const reqEnd = new Date(bookedRanges[0].endDate);

    const isBooked = await bookingModel.findOne({
      venueId: id,
      bookedRanges: {
        $elemMatch: {
          startDate: { $lte: reqEnd },
          endDate: { $gte: reqStart },
        },
      },
    });

    if (isBooked) {
      return res.status(400).json({
        message: "Dates are no longer available.",
      });
    }

    const booking = await bookingModel.create({
      userId,
      venueId: id,
      venueName,
      name,
      email,
      number,
      bookedRanges,
      organizerId,
      price,
    });

    res.status(200).json({ message: "Booking successful!", booking });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getBookedVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await bookingModel.find({ organizerId: id });
    if (!response) {
      return res.status(404).json({
        message: "No Bookings found",
      });
    }
    res.status(200).json({
      Bookings: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};


export {
  getAll,
  handleRegister,
  handleDelete,
  handleEdit,
  getOne,
  verifyVenue,
  getVenueOrg,
  getBookedDates,
  bookVenue,
  getBookedVenue,
};


