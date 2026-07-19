import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/presentation/components/admin/common/PageHeader";

import PaymentStats from "@/presentation/components/admin/paymentManagement/PaymentStats";
import PaymentFilters from "@/presentation/components/admin/paymentManagement/PaymentFilters";
import PaymentTable from "@/presentation/components/admin/paymentManagement/PaymentTable";

import Pagination from "@/presentation/components/common/Pagination";

import useDebounce from "@/hooks/useDebounce";

import {
  getPayments,
  getPaymentStats,
} from "@/redux/slices/AdminPaymentSlice";

const PaymentManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    payments,
    statistics,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.adminPayment);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getPayments({
        search: debouncedSearch,
        paymentStatus,
        paymentType,
        page,
        limit,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    paymentStatus,
    paymentType,
    page,
  ]);

  useEffect(() => {
    dispatch(getPaymentStats());
  }, [dispatch]);

  const handleView = (payment) => {
    navigate(`/admin/payments/${payment._id}`);
  };

  return (
    <div>
      <PageHeader
        title="Payment Management"
        subtitle="Manage platform payments"
      />

      <div className="mb-8">
        <PaymentStats stats={statistics} />
      </div>

      <PaymentFilters
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(value) => {
          setPaymentStatus(value);
          setPage(1);
        }}
        paymentType={paymentType}
        onPaymentTypeChange={(value) => {
          setPaymentType(value);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          {error}
        </div>
      ) : (
        <>
          <PaymentTable
            payments={payments}
            onView={handleView}
          />

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentManagement;