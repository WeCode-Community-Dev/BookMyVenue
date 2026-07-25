// components/admin/PendingVenueCard.tsx

"use client";

import {
    CalendarDays,
    IndianRupee,
    MapPin,
    User,
    Users,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import Image from "next/image";
import { PendingVenueCardProps } from "@/types/Venue";
import { approvalCardStyle } from "./ApprovalCardStyle";

export default function PendingVenueCard({
    id,
    imageUrl,
    venueName,
    venueLocation,
    capacity,
    price,
    owner,
    submittedOn,
    onApprove,
    onReject,
}: PendingVenueCardProps) {
    return (
        <div className={approvalCardStyle.card}>

            {/* Image */}
            <div className={approvalCardStyle.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={venueName}
                    fill
                    className={approvalCardStyle.image}
                />

                <span className={approvalCardStyle.statusBadge}>
                    <AppText textName="STATUS_PENDING" textModule="LABEL" />
                </span>
            </div>

            {/* Content */}
            <div className={approvalCardStyle.content}>

                <h3 className={approvalCardStyle.title}>
                    {venueName}
                </h3>

                <div className={approvalCardStyle.locationWrapper}>
                    <MapPin className={approvalCardStyle.icon} />
                    {venueLocation}
                </div>

                <div className={approvalCardStyle.infoWrapper}>

                    <div className={approvalCardStyle.infoRow}>
                        <span className={approvalCardStyle.infoLabelWrapper}>
                            <Users className={approvalCardStyle.icon} />
                            <AppText textName="CAPACITY" textModule="LABEL" />
                        </span>

                        <span className={approvalCardStyle.infoValue}>
                            <AppText textName="GUEST_COUNT" textModule="LABEL" 
                                append={{ count: capacity.toString() }} />
                        </span>
                    </div>

                    <div className={approvalCardStyle.infoRow}>
                        <span className={approvalCardStyle.infoLabelWrapper}>
                            <IndianRupee className={approvalCardStyle.icon} />
                            <AppText textName="PRICE" textModule="LABEL" />
                        </span>

                        <span className={approvalCardStyle.infoValue}>
                            <AppText textName="PRICE_PER_DAY" textModule="LABEL" 
                                append={{ price: price.toLocaleString() }} />
                        </span>
                    </div>

                    <div className={approvalCardStyle.infoRow}>
                        <span className={approvalCardStyle.infoLabelWrapper}>
                            <User className={approvalCardStyle.icon} />
                            <AppText textName="OWNER" textModule="LABEL" />
                        </span>

                        <span className={approvalCardStyle.infoValue}>
                            {owner}
                        </span>
                    </div>

                    <div className={approvalCardStyle.infoRow}>
                        <span className={approvalCardStyle.infoLabelWrapper}>
                            <CalendarDays className={approvalCardStyle.icon} />
                            <AppText textName="SUBMITTED" textModule="LABEL" />
                        </span>

                        <span className={approvalCardStyle.infoValue}>
                            {submittedOn}
                        </span>
                    </div>

                </div>

                {/* Actions */}
                <div className={approvalCardStyle.actionsWrapper}>

                    <button
                        onClick={() => {
                            return onReject(id); 
                        }}
                        className={approvalCardStyle.rejectBtn}
                    >
                        <AppText textName="REJECT" textModule="BUTTON" />
                    </button>

                    <button
                        onClick={() => {
                            return onApprove(id); 
                        }}
                        className={approvalCardStyle.approveBtn}
                    >
                        <AppText textName="APPROVE" textModule="BUTTON" />
                    </button>

                </div>

            </div>
        </div>
    );
}
