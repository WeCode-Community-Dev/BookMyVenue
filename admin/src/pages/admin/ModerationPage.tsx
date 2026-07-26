import { useState } from "react";
import { useApiQuery } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/constants";
import { QUERY_KEYS } from "@/config/queryKeys";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, AlertTriangle, Ban, UserX } from "lucide-react";
// Extracted hooks and components
import { useModeration } from "@/hooks/useModeration";
import { useModerationStore } from "@/store/useModerationStore";
import { FlaggedReviewsTable } from "@/components/moderation/FlaggedReviewsTable";
import { HideRequestsTable } from "@/components/moderation/HideRequestsTable";
import { SuspendedVenuesTable } from "@/components/moderation/SuspendedVenuesTable";
import { BannedUsersTable } from "@/components/moderation/BannedUsersTable";
import { ReviewActionDialog } from "@/components/moderation/ReviewActionDialog";
import type { ReviewActionDialogState } from "@/types/ui";
import type { ModerationSummary } from "@/types/moderation.types";
import type { ModerationTab } from "@/store/useModerationStore";

const ModerationPage = () => {
  const { activeTab, setActiveTab } = useModerationStore();

  const [reviewDialog, setReviewDialog] = useState<ReviewActionDialogState>({
    open: false,
    action: "remove",
    reviewId: null,
  });
  const [reviewReason, setReviewReason] = useState("");

  const { data: moderation, isLoading } = useApiQuery<ModerationSummary>(
    QUERY_KEYS.MODERATION_SUMMARY,
    { url: API_ENDPOINTS.MODERATION_SUMMARY, method: "GET" },
  );

  const { moderateReviewMutation, unsuspendVenueMutation, unbanUserMutation } =
    useModeration((opts) => setReviewDialog(opts), setReviewReason);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading moderation data...
      </div>
    );
  }

  const flaggedReviews = moderation?.flaggedReviews || [];
  const hideRequests = moderation?.hideRequests || [];
  const suspendedVenues = moderation?.suspendedVenues || [];
  const bannedUsers = moderation?.bannedUsers || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Moderation Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Review flagged content, manage suspensions, and handle user bans.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className={`p-4 cursor-pointer transition-colors border-[var(--bg-grey)] ${activeTab === "flagged" ? "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200" : "bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)]"}`}
          onClick={() => setActiveTab("flagged")}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center text-[var(--text-secondary)]">
              <AlertCircle className="mr-2 text-yellow-500" size={16} />
              Flagged Reviews
            </h2>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {flaggedReviews.length}
          </p>
        </Card>

        <Card
          className={`p-4 cursor-pointer transition-colors border-[var(--bg-grey)] ${activeTab === "hide_requests" ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200" : "bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)]"}`}
          onClick={() => setActiveTab("hide_requests")}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center text-[var(--text-secondary)]">
              <AlertTriangle className="mr-2 text-orange-500" size={16} />
              Hide Requests
            </h2>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {hideRequests.length}
          </p>
        </Card>

        <Card
          className={`p-4 cursor-pointer transition-colors border-[var(--bg-grey)] ${activeTab === "suspended" ? "bg-gray-50/50 dark:bg-gray-800/20 border-gray-300" : "bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)]"}`}
          onClick={() => setActiveTab("suspended")}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center text-[var(--text-secondary)]">
              <Ban className="mr-2 text-gray-500" size={16} />
              Suspended Venues
            </h2>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {suspendedVenues.length}
          </p>
        </Card>

        <Card
          className={`p-4 cursor-pointer transition-colors border-[var(--bg-grey)] ${activeTab === "banned" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200" : "bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)]"}`}
          onClick={() => setActiveTab("banned")}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center text-[var(--text-secondary)]">
              <UserX className="mr-2 text-red-500" size={16} />
              Banned Users
            </h2>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {bannedUsers.length}
          </p>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as ModerationTab)}
        className="w-full"
      >
        <TabsList className="mb-4" variant="line">
          <TabsTrigger value="flagged">Flagged Reviews</TabsTrigger>
          <TabsTrigger value="hide_requests">Hide Requests</TabsTrigger>
          <TabsTrigger value="suspended">Suspended Venues</TabsTrigger>
          <TabsTrigger value="banned">Banned Users</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged" className="outline-none mt-0">
          <Card className="p-6 border-[var(--bg-grey)] bg-[var(--bg-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center text-[var(--text-primary)]">
                <AlertCircle className="mr-2 text-yellow-500" size={20} />
                Flagged Reviews
              </h2>
              {flaggedReviews.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-300"
                >
                  {flaggedReviews.length} Action
                  {flaggedReviews.length !== 1 ? "s" : ""} Needed
                </Badge>
              )}
            </div>
            <FlaggedReviewsTable
              flaggedReviews={flaggedReviews}
              setReviewDialog={setReviewDialog}
              moderateReviewMutation={moderateReviewMutation}
            />
          </Card>
        </TabsContent>

        <TabsContent value="hide_requests" className="outline-none mt-0">
          <Card className="p-6 border-[var(--bg-grey)] bg-[var(--bg-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center text-[var(--text-primary)]">
                <AlertTriangle className="mr-2 text-orange-500" size={20} />
                Hide Requests
              </h2>
              {hideRequests.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-300"
                >
                  {hideRequests.length} Pending
                </Badge>
              )}
            </div>
            <HideRequestsTable
              hideRequests={hideRequests}
              setReviewDialog={setReviewDialog}
              moderateReviewMutation={moderateReviewMutation}
            />
          </Card>
        </TabsContent>

        <TabsContent value="suspended" className="outline-none mt-0">
          <Card className="p-6 border-[var(--bg-grey)] bg-[var(--bg-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center text-[var(--text-primary)]">
                <Ban className="mr-2 text-gray-500" size={20} />
                Suspended Venues
              </h2>
              {suspendedVenues.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-300"
                >
                  {suspendedVenues.length} Total
                </Badge>
              )}
            </div>
            <SuspendedVenuesTable
              suspendedVenues={suspendedVenues}
              unsuspendVenueMutation={unsuspendVenueMutation}
            />
          </Card>
        </TabsContent>

        <TabsContent value="banned" className="outline-none mt-0">
          <Card className="p-6 border-[var(--bg-grey)] bg-[var(--bg-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center text-[var(--text-primary)]">
                <UserX className="mr-2 text-red-500" size={20} />
                Banned Users
              </h2>
              {bannedUsers.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-300"
                >
                  {bannedUsers.length} Total
                </Badge>
              )}
            </div>
            <BannedUsersTable
              bannedUsers={bannedUsers}
              unbanUserMutation={unbanUserMutation}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <ReviewActionDialog
        reviewDialog={reviewDialog}
        setReviewDialog={setReviewDialog}
        reviewReason={reviewReason}
        setReviewReason={setReviewReason}
        moderateReviewMutation={moderateReviewMutation}
      />
    </div>
  );
};

export default ModerationPage;
