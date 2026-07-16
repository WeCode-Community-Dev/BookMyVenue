import React, { useEffect, useState } from "react";
import { Await, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useAuth from "../Auth/useAuth";
import AXIOS_API from "../Api/api";
import DetailModal from "./NewVenues/DetailModal";
import VenueAddModal from "./Venues/VenueAddModal";
import EditModal from "./Venues/EditModal";
import BookingCard from "./Bookings/BookingCard";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";
  const userId = user.userId;

  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [venues, setVenues] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [detailModal, setDetailModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [error, setError] = useState("");

  const [editData, setEditData] = useState("");
  const [editModal, setEditModal] = useState(false);

  const [bookedVenues, setBookedVenues] = useState([]);

  const [bookingDetailModal, setBookingDetailModal] = useState(false);
  const [bookingData, setBookingData] = useState("")

  const handleUserFetch = async () => {
    try {
      if (isAdmin) {
        const userResponse = await AXIOS_API.get("/api/v1/register/getAll");
        setUsers(
          userResponse.data.users.filter((item) => item.role === "user"),
        );
        setOrganizers(
          userResponse.data.users.filter((item) => item.role === "organizer"),
        );
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleApprove = (data) => {
    setSelectedVenue("");
    setSelectedVenue(data);
    setDetailModal(true);
  };

  const handleVenueFetch = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const venueRes = await AXIOS_API.get("/api/v2/list/getAll");
        setVenues(venueRes.data.venue);
      }

      if (isOrganizer) {
        const venueRes = await AXIOS_API.get(`/api/v2/list/venueOrg/${userId}`);
        setVenues(venueRes.data.venue);
      }
    } catch (error) {
      console.error("Failed to fetch venues", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const response = await AXIOS_API.put(`/api/v2/list/verify/${id}`);
      handleVenueFetch();

      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setDetailModal(false);
    }
  };

  const org = organizers.filter(
    (i) => i.organiZerId === selectedVenue?.organiZerId,
  );

  const handleAdd = (id) => {
    setAddModal(true);
    setOrgId(id);
  };

  const addVenue = async (formData) => {
    console.log(formData.image);

    const submitData = new FormData();

    submitData.append("organiZerId", formData.organiZerId);
    submitData.append("name", formData.name);
    submitData.append("place", formData.place);
    submitData.append("type", formData.type);
    submitData.append("rating", formData.rating);
    submitData.append("price", formData.price);
    submitData.append("capacity", formData.capacity);
    submitData.append("description", formData.description);
    submitData.append("isApproved", formData.isApproved);
    submitData.append("image", formData.image);
    submitData.append("spec", JSON.stringify(formData.spec));
    submitData.append("slots", JSON.stringify(formData.slots));

    setError("");
    setIsLoading(true);
    try {
      const response = await AXIOS_API.post(
        "/api/v2/list/register",
        submitData,
      );
      handleVenueFetch();
      setAddModal(false);
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVenueDelete = async (id) => {
    try {
      await AXIOS_API.delete(`/api/v2/list/delete/${id}`);
      handleVenueFetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    setDetailModal(false);
    setEditData(data);
    setEditModal(true);
  };

  const editVenue = async (formData) => {
    setIsLoading(true);
    setError("");

    const submitData = new FormData();

    submitData.append("_id", formData.venueId);
    submitData.append("organiZerId", formData.organiZerId);
    submitData.append("name", formData.name);
    submitData.append("place", formData.place);
    submitData.append("type", formData.type);
    submitData.append("rating", formData.rating);
    submitData.append("price", formData.price);
    submitData.append("capacity", formData.capacity);
    submitData.append("description", formData.description);
    submitData.append("isApproved", formData.isApproved);
    submitData.append("image", formData.image);
    submitData.append("spec", JSON.stringify(formData.spec));
    submitData.append("slots", JSON.stringify(formData.slots));

    try {
      const response = await AXIOS_API.put(
        `/api/v2/list/edit/${formData.venueId}`,
        submitData,
      );
      console.log(response);
      handleVenueFetch();
      setEditModal(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookedVenues = async () => {
    setIsLoading(true);
    try {
      const response = await AXIOS_API.get(
        `/api/v2/list/${user.userId}/venueBook`,
      );

      setBookedVenues(response?.data?.Bookings);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (data) => {
    setBookingDetailModal(true);
    setBookingData(data)
  };

  console.log("there....", bookedVenues);

  useEffect(() => {
    handleUserFetch();
    handleVenueFetch();
    fetchBookedVenues();
  }, []);

  return (
    <div
      className="h-screen w-full flex bg-gradient-to-b from-[#D4CEB8] via-[#F4F1E6] to-[#FAF9F6]
     text-slate-800 font-sans overflow-hidden animate-fade-in-up"
    >
      <div className="hidden xl:flex flex-shrink-0 h-full">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col bg-[#F7F5EE] w-64 h-full animate-slide-in-left z-50">
            <Sidebar
              sidebarOpen={true}
              setSidebarOpen={() => {}}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {addModal && (
        <VenueAddModal
          orgId={orgId}
          onClose={() => setAddModal(false)}
          onSubmit={addVenue}
          error={error}
          isLoading={isLoading}
        />
      )}

      {detailModal && (
        <DetailModal
          venue={selectedVenue}
          organizer={org}
          onClose={() => setDetailModal(false)}
          fetchVenue={handleVenueFetch}
          verify={handleVerify}
          user={users}
          edit={handleEdit}
          deleteVenue={handleVenueDelete}
        />
      )}

      {editModal && (
        <EditModal
          venue={editData}
          onClose={() => setEditModal(false)}
          isLoading={isLoading}
          error={error}
          onSubmit={editVenue}
        />
      )}

      {bookingDetailModal && (
        <BookingCard
        data={bookingData}
        onClose={() => setBookingDetailModal(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 p-5 space-y-4 custom-scrollbar">
          <Outlet
            context={{
              user,
              users,
              setUsers,
              organizers,
              setOrganizers,
              venues,
              setVenues,
              handleApprove,
              isLoading,
              handleVerify,
              handleAdd,
              handleVenueDelete,
              handleEdit,
              bookedVenues,
              handleBooking,
            }}
          />
        </main>
      </div>
    </div>
  );
}
