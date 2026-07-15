// AUTO-GENERATED — do not edit. Run `pnpm generate` in packages/api-client to refresh.

export interface paths {
    "/api/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Me */
        get: operations["me_api_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register-owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register Owner */
        post: operations["register_owner_api_auth_register_owner_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/reapply-owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reapply Owner */
        post: operations["reapply_owner_api_auth_reapply_owner_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/profile/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Profile */
        get: operations["get_profile_api_profile_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Profile */
        patch: operations["update_profile_api_profile_me_patch"];
        trace?: never;
    };
    "/api/venues/my/venues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List My Venues */
        get: operations["list_my_venues_api_venues_my_venues_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/my/venues/{venue_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get My Venue */
        get: operations["get_my_venue_api_venues_my_venues__venue_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Venue */
        post: operations["create_venue_api_venues__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Venue */
        delete: operations["delete_venue_api_venues__venue_id__delete"];
        options?: never;
        head?: never;
        /** Update Venue */
        patch: operations["update_venue_api_venues__venue_id__patch"];
        trace?: never;
    };
    "/api/venues/{venue_id}/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Submit Venue */
        post: operations["submit_venue_api_venues__venue_id__submit_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue Availability */
        get: operations["get_venue_availability_api_venues__venue_id__availability_get"];
        /** Bulk Update Availability */
        put: operations["bulk_update_availability_api_venues__venue_id__availability_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/blocked-dates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue Blocked Dates */
        get: operations["get_venue_blocked_dates_api_venues__venue_id__blocked_dates_get"];
        put?: never;
        /** Create Blocked Date */
        post: operations["create_blocked_date_api_venues__venue_id__blocked_dates_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/blocked-dates/{blocked_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Blocked Date */
        delete: operations["delete_blocked_date_api_venues__venue_id__blocked_dates__blocked_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/cancellation-policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue Cancellation Policy */
        get: operations["get_venue_cancellation_policy_api_venues__venue_id__cancellation_policy_get"];
        /** Put Venue Cancellation Policy */
        put: operations["put_venue_cancellation_policy_api_venues__venue_id__cancellation_policy_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/amenities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update Venue Amenities */
        put: operations["update_venue_amenities_api_venues__venue_id__amenities_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/photos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add Venue Photo */
        post: operations["add_venue_photo_api_venues__venue_id__photos_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/photos/bulk-update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Bulk Update Venue Photos */
        put: operations["bulk_update_venue_photos_api_venues__venue_id__photos_bulk_update_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/photos/{photo_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Venue Photo */
        delete: operations["delete_venue_photo_api_venues__venue_id__photos__photo_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Venue Bookings */
        get: operations["list_venue_bookings_api_venues__venue_id__bookings_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/bookings/pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Pending Venue Bookings */
        get: operations["list_pending_venue_bookings_api_venues__venue_id__bookings_pending_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue Categories */
        get: operations["get_venue_categories_api_venues_categories_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/amenities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Platform Amenities */
        get: operations["get_platform_amenities_api_venues_amenities_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{identifier}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue */
        get: operations["get_venue_api_venues__identifier__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/venues/{venue_id}/pricing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Pricing Preview */
        get: operations["get_pricing_preview_api_venues__venue_id__pricing_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search Venues */
        get: operations["search_venues_api_search__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/search/fts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search Fts */
        get: operations["search_fts_api_search_fts_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/search/semantic": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search Semantic */
        get: operations["search_semantic_api_search_semantic_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/search/hybrid": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search Hybrid */
        get: operations["search_hybrid_api_search_hybrid_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List My Bookings */
        get: operations["list_my_bookings_api_bookings__get"];
        put?: never;
        /** Create Booking */
        post: operations["create_booking_api_bookings__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Owner Bookings */
        get: operations["list_owner_bookings_api_bookings_owner_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/venues/{venue_id}/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Venue Bookings */
        get: operations["list_venue_bookings_api_bookings_venues__venue_id__bookings_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/venues/{venue_id}/bookings/pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Pending Venue Bookings */
        get: operations["list_pending_venue_bookings_api_bookings_venues__venue_id__bookings_pending_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Booking */
        get: operations["get_booking_api_bookings__booking_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/cancellation-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Cancellation Preview */
        get: operations["cancellation_preview_api_bookings__booking_id__cancellation_preview_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** User Cancel Booking */
        post: operations["user_cancel_booking_api_bookings__booking_id__cancel_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Owner Accept Booking */
        post: operations["owner_accept_booking_api_bookings__booking_id__accept_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Owner Reject Booking */
        post: operations["owner_reject_booking_api_bookings__booking_id__reject_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/extend-balance-deadline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Owner Extend Deadline */
        post: operations["owner_extend_deadline_api_bookings__booking_id__extend_balance_deadline_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/cancel-forfeit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Owner Cancel Forfeit */
        post: operations["owner_cancel_forfeit_api_bookings__booking_id__cancel_forfeit_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/cancel-goodwill": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Owner Cancel Goodwill */
        post: operations["owner_cancel_goodwill_api_bookings__booking_id__cancel_goodwill_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{booking_id}/owner-notes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Owner Notes */
        patch: operations["update_owner_notes_api_bookings__booking_id__owner_notes_patch"];
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Availability For Date Query */
        get: operations["availability_for_date_query_api_availability_venues__venue_id__availability_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/calendar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Calendar */
        get: operations["calendar_api_availability_venues__venue_id__calendar_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/calendar/owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Owner Calendar */
        get: operations["owner_calendar_api_availability_venues__venue_id__calendar_owner_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/date/{booking_date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Availability For Date */
        get: operations["availability_for_date_api_availability_venues__venue_id__date__booking_date__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/quote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pricing Quote */
        get: operations["pricing_quote_api_availability_venues__venue_id__quote_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/availability/venues/{venue_id}/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Validate Slot */
        post: operations["validate_slot_api_availability_venues__venue_id__validate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notifications/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Notifications */
        get: operations["list_notifications_api_notifications__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notifications/{notification_id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark Read */
        patch: operations["mark_read_api_notifications__notification_id__read_patch"];
        trace?: never;
    };
    "/api/admin/venues/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Venue Stats */
        get: operations["get_venue_stats_api_admin_venues_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/venues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Venues */
        get: operations["list_venues_api_admin_venues_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/venues/{venue_id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Approve Venue */
        patch: operations["approve_venue_api_admin_venues__venue_id__approve_patch"];
        trace?: never;
    };
    "/api/admin/venues/{venue_id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reject Venue */
        patch: operations["reject_venue_api_admin_venues__venue_id__reject_patch"];
        trace?: never;
    };
    "/api/admin/venues/{venue_id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Suspend Venue */
        patch: operations["suspend_venue_api_admin_venues__venue_id__suspend_patch"];
        trace?: never;
    };
    "/api/admin/venues/{venue_id}/reactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reactivate Venue */
        patch: operations["reactivate_venue_api_admin_venues__venue_id__reactivate_patch"];
        trace?: never;
    };
    "/api/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Users */
        get: operations["list_users_api_admin_users_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/users/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get User */
        get: operations["get_user_api_admin_users__user_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/users/{user_id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Suspend User */
        patch: operations["suspend_user_api_admin_users__user_id__suspend_patch"];
        trace?: never;
    };
    "/api/admin/users/{user_id}/reactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reactivate User */
        patch: operations["reactivate_user_api_admin_users__user_id__reactivate_patch"];
        trace?: never;
    };
    "/api/admin/venue-owners/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Owner Stats */
        get: operations["get_owner_stats_api_admin_venue_owners_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/venue-owners/{user_id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Approve Owner */
        patch: operations["approve_owner_api_admin_venue_owners__user_id__approve_patch"];
        trace?: never;
    };
    "/api/admin/venue-owners/{user_id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reject Owner */
        patch: operations["reject_owner_api_admin_venue_owners__user_id__reject_patch"];
        trace?: never;
    };
    "/api/admin/actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Actions */
        get: operations["list_actions_api_admin_actions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/amenities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Amenities */
        get: operations["list_amenities_api_admin_amenities_get"];
        put?: never;
        /** Create Amenity */
        post: operations["create_amenity_api_admin_amenities_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/amenities/{amenity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Amenity */
        delete: operations["delete_amenity_api_admin_amenities__amenity_id__delete"];
        options?: never;
        head?: never;
        /** Update Amenity */
        patch: operations["update_amenity_api_admin_amenities__amenity_id__patch"];
        trace?: never;
    };
    "/api/admin/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Categories */
        get: operations["list_categories_api_admin_categories_get"];
        put?: never;
        /** Create Category */
        post: operations["create_category_api_admin_categories_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/categories/{category_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Category */
        delete: operations["delete_category_api_admin_categories__category_id__delete"];
        options?: never;
        head?: never;
        /** Update Category */
        patch: operations["update_category_api_admin_categories__category_id__patch"];
        trace?: never;
    };
    "/api/admin/categories/{category_id}/banner-image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload Category Banner */
        post: operations["upload_category_banner_api_admin_categories__category_id__banner_image_post"];
        /** Delete Category Banner */
        delete: operations["delete_category_banner_api_admin_categories__category_id__banner_image_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/bookings/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Booking Stats */
        get: operations["get_booking_stats_api_admin_bookings_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Bookings */
        get: operations["list_bookings_api_admin_bookings_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/growth-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Growth Stats */
        get: operations["get_growth_stats_api_admin_growth_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/owner/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Owner Stats */
        get: operations["get_owner_stats_api_payments_owner_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/owner/ledger": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Owner Ledger */
        get: operations["get_owner_ledger_api_payments_owner_ledger_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Payment
         * @description Create a Stripe PaymentIntent for a booking's token advance or balance.
         */
        post: operations["create_payment_api_payments__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stripe Webhook
         * @description Stripe calls this — no auth dependency; verified by signature instead.
         */
        post: operations["stripe_webhook_api_payments_webhook_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/refund": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refund
         * @description Owner/admin full refund of a booking's captured payment.
         */
        post: operations["refund_api_payments_refund_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/{booking_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Payments */
        get: operations["get_payments_api_payments__booking_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/internal/run-jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Run Jobs */
        post: operations["run_jobs_api_internal_run_jobs_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/owner/dashboard/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Owner Dashboard Stats
         * @description Aggregated KPI and financial stats for the owner dashboard.
         */
        get: operations["get_owner_dashboard_stats_api_owner_dashboard_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/owner/dashboard/chart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Owner Dashboard Chart
         * @description Monthly performance chart data for the owner dashboard.
         */
        get: operations["get_owner_dashboard_chart_api_owner_dashboard_chart_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/owner/dashboard/upcoming-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Owner Dashboard Upcoming Events
         * @description Upcoming confirmed events for the owner dashboard.
         */
        get: operations["get_owner_dashboard_upcoming_events_api_owner_dashboard_upcoming_events_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health Check */
        get: operations["health_check_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AdminActionListResponse */
        AdminActionListResponse: {
            /** Items */
            items: components["schemas"]["AdminActionResponse"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total Pages */
            total_pages: number;
        };
        /** AdminActionResponse */
        AdminActionResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Admin Id
             * Format: uuid
             */
            admin_id: string;
            /** Admin Name */
            admin_name: string | null;
            /** Action Type */
            action_type: string;
            /** Target Type */
            target_type: string;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            /** Target Name */
            target_name: string | null;
            /** Reason */
            reason: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** AdminAmenityResponse */
        AdminAmenityResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Icon */
            icon: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Deleted At */
            deleted_at: string | null;
            /** Active Venue Count */
            active_venue_count: number;
        };
        /** AdminBookingListResponse */
        AdminBookingListResponse: {
            /** Items */
            items: components["schemas"]["AdminBookingSummary"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total Pages */
            total_pages: number;
            stats: components["schemas"]["BookingStatsResponse"];
        };
        /** AdminBookingSummary */
        AdminBookingSummary: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /** Venue Name */
            venue_name: string;
            /** Customer Name */
            customer_name: string | null;
            /** Customer Email */
            customer_email: string | null;
            /** Customer Phone */
            customer_phone: string | null;
            /**
             * Owner Id
             * Format: uuid
             */
            owner_id: string;
            /** Owner Name */
            owner_name: string | null;
            /** Owner Email */
            owner_email: string | null;
            /** Owner Phone */
            owner_phone: string | null;
            /** Status */
            status: string;
            /** Payment Status */
            payment_status: string;
            /** Event Date */
            event_date: string;
            /** Guest Count */
            guest_count: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** AdminCategoryResponse */
        AdminCategoryResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Slug */
            slug: string;
            /** Label */
            label: string;
            /** Icon */
            icon: string | null;
            /** Banner Image */
            banner_image: string | null;
            /** Is Active */
            is_active: boolean;
            /** Sort Order */
            sort_order: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Deleted At */
            deleted_at: string | null;
            /** Venue Count */
            venue_count: number;
        };
        /** AdminVenueItem */
        AdminVenueItem: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Slug */
            slug: string | null;
            /** Description */
            description: string | null;
            /** Category Slug */
            category_slug: string;
            /** Address Line1 */
            address_line1: string;
            /** City */
            city: string;
            /** State */
            state: string;
            /** Country */
            country: string;
            /** Min Capacity */
            min_capacity: number | null;
            /** Max Capacity */
            max_capacity: number;
            /** Open Time */
            open_time: string;
            /** Close Time */
            close_time: string;
            /** Pricing Mode */
            pricing_mode: string;
            /** Starting Price Paise */
            starting_price_paise: number | null;
            /** Hourly Rate Paise */
            hourly_rate_paise: number | null;
            /** Advance Pct */
            advance_pct: number;
            /** Platform Commission Pct */
            platform_commission_pct: number;
            /** Status */
            status: string;
            /** Is Active */
            is_active: boolean;
            /** Cover Photo Url */
            cover_photo_url: string | null;
            /** Amenities */
            amenities: string[];
            owner: components["schemas"]["AdminVenueOwner"];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** AdminVenueListResponse */
        AdminVenueListResponse: {
            /** Items */
            items: components["schemas"]["AdminVenueItem"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total Pages */
            total_pages: number;
            stats: components["schemas"]["AdminVenueStats"];
        };
        /** AdminVenueOwner */
        AdminVenueOwner: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Full Name */
            full_name: string | null;
            /** Email */
            email: string | null;
        };
        /** AdminVenueStats */
        AdminVenueStats: {
            /** Total */
            total: number;
            /** Pending Approval */
            pending_approval: number;
            /** Approved */
            approved: number;
            /** Rejected */
            rejected: number;
            /** Suspended */
            suspended: number;
            /** Draft */
            draft: number;
        };
        /** AmenityCreateRequest */
        AmenityCreateRequest: {
            /** Name */
            name: string;
            /** Icon */
            icon?: string | null;
        };
        /** AmenityDeleteResponse */
        AmenityDeleteResponse: {
            /** Deleted */
            deleted: boolean;
            /** Active Venue Count */
            active_venue_count: number;
        };
        /** AmenityListResponse */
        AmenityListResponse: {
            /** Items */
            items: components["schemas"]["AdminAmenityResponse"][];
            /** Total */
            total: number;
        };
        /** AmenityResponse */
        AmenityResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Icon */
            icon?: string | null;
        };
        /** AmenityUpdateRequest */
        AmenityUpdateRequest: {
            /** Name */
            name?: string | null;
            /** Icon */
            icon?: string | null;
        };
        /** AuthMeResponse */
        AuthMeResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Email */
            email: string | null;
            profile: components["schemas"]["app__modules__auth__schemas__ProfileResponse"];
            /** Roles */
            roles: string[];
        };
        /** AvailabilityResponse */
        AvailabilityResponse: {
            /**
             * Date
             * Format: date
             */
            date: string;
            operating_window: components["schemas"]["OperatingWindow"];
            /** Blocked Slots */
            blocked_slots?: components["schemas"]["BlockedRange"][];
        };
        /** BlockedRange */
        BlockedRange: {
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
        };
        /** Body_add_venue_photo_api_venues__venue_id__photos_post */
        Body_add_venue_photo_api_venues__venue_id__photos_post: {
            /** File */
            file: string;
        };
        /** Body_upload_category_banner_api_admin_categories__category_id__banner_image_post */
        Body_upload_category_banner_api_admin_categories__category_id__banner_image_post: {
            /** File */
            file: string;
        };
        /** BookingDisplay */
        BookingDisplay: {
            /** Quoted Price */
            quoted_price: string;
            /** Advance Due */
            advance_due: string;
            /** Balance Due */
            balance_due: string;
            /** Platform Fee */
            platform_fee: string;
            /** Owner Payout */
            owner_payout: string;
        };
        /** BookingOut */
        BookingOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /** Venue Name */
            venue_name: string;
            /** Venue City */
            venue_city: string;
            /** Venue Cover Photo Url */
            venue_cover_photo_url?: string | null;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
            /** User Full Name */
            user_full_name?: string | null;
            /** User Email */
            user_email?: string | null;
            /** User Phone */
            user_phone?: string | null;
            /** Booking Type */
            booking_type: string;
            /** Status */
            status: string;
            /** Payment Status */
            payment_status: string;
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
            /** Created At */
            created_at?: string | null;
            /**
             * Effective Starts At
             * Format: date-time
             */
            effective_starts_at: string;
            /**
             * Effective Ends At
             * Format: date-time
             */
            effective_ends_at: string;
            /** Guest Count */
            guest_count: number;
            /** Event Type */
            event_type?: string | null;
            /** User Notes */
            user_notes?: string | null;
            /** Owner Notes */
            owner_notes?: string | null;
            /** Quoted Price Paise */
            quoted_price_paise: number;
            /** Platform Commission Pct */
            platform_commission_pct: number;
            /** Platform Fee Paise */
            platform_fee_paise: number;
            /** Platform Fee Reversed Paise (sum of platform_fee_reversal ledger credits for this booking) */
            platform_fee_reversed_paise: number;
            /** Owner Payout Paise */
            owner_payout_paise: number;
            /** Final Owner Payout Paise (computed: actual cash after cancellation/refund) */
            final_owner_payout_paise: number;
            /** Advance Pct */
            advance_pct: number;
            /** Advance Due Paise */
            advance_due_paise: number;
            /** Balance Due Paise */
            balance_due_paise: number;
            /** Balance Due Date */
            balance_due_date?: string | null;
            /** Hold Expires At */
            hold_expires_at?: string | null;
            /** Confirmed At */
            confirmed_at?: string | null;
            /** Cancelled At */
            cancelled_at?: string | null;
            /** Expired At */
            expired_at?: string | null;
            /** Amount Paid Paise */
            amount_paid_paise: number;
            /** Refund Amount Paise */
            refund_amount_paise: number;
            /** Stripe Advance Payment Intent Id */
            stripe_advance_payment_intent_id?: string | null;
            /** Stripe Balance Payment Intent Id */
            stripe_balance_payment_intent_id?: string | null;
            /** Deadline Extension Count */
            deadline_extension_count: number;
            /** Balance Overdue At */
            balance_overdue_at?: string | null;
            /** Owner Action Deadline */
            owner_action_deadline?: string | null;
            display: components["schemas"]["BookingDisplay"];
            /** Invoice Url */
            invoice_url?: string | null;
        };
        /** BookingRequestIn */
        BookingRequestIn: {
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /** Venue Name */
            venue_name: string;
            /** Venue Cover Image */
            venue_cover_image: string | null;
            /**
             * Booking Type
             * @enum {string}
             */
            booking_type: "full_day" | "time_slot";
            /** Starts At */
            starts_at?: string | null;
            /** Ends At */
            ends_at?: string | null;
            /** Booking Date */
            booking_date?: string | null;
            /** Guest Count */
            guest_count: number;
            /** Event Type */
            event_type?: string | null;
            /** User Notes */
            user_notes?: string | null;
        };
        /** BookingStatsResponse */
        BookingStatsResponse: {
            /** Total */
            total: number;
            /** Requested */
            requested: number;
            /** Confirmed */
            confirmed: number;
            /** Completed */
            completed: number;
            /** Cancelled */
            cancelled: number;
        };
        /**
         * BookingType
         * @enum {string}
         */
        BookingType: "full_day" | "time_slot";
        /** BulkUpdateAvailabilityRequest */
        BulkUpdateAvailabilityRequest: {
            /** Availabilities */
            availabilities: components["schemas"]["VenueAvailabilityUpdate"][];
        };
        /** BulkUpdateVenuePhotosRequest */
        BulkUpdateVenuePhotosRequest: {
            /** Photos */
            photos: components["schemas"]["UpdateVenuePhotoItem"][];
        };
        /** CalendarBlockedRange */
        CalendarBlockedRange: {
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
            /**
             * Source
             * @enum {string}
             */
            source: "booking" | "venue_block";
            /** Reason */
            reason?: string | null;
        };
        /** CalendarBookingSummary */
        CalendarBookingSummary: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Booking Type */
            booking_type: string;
            /** Status */
            status: string;
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
            /**
             * Effective Starts At
             * Format: date-time
             */
            effective_starts_at: string;
            /**
             * Effective Ends At
             * Format: date-time
             */
            effective_ends_at: string;
            /** Is Blocking */
            is_blocking: boolean;
            /** Guest Count */
            guest_count: number;
            /** Event Type */
            event_type?: string | null;
            /** User Id */
            user_id?: string | null;
        };
        /** CalendarDay */
        CalendarDay: {
            /**
             * Date
             * Format: date
             */
            date: string;
            operating_window: components["schemas"]["OperatingWindow"];
            /**
             * Status
             * @enum {string}
             */
            status: "available" | "partially_booked" | "fully_booked" | "blocked" | "closed";
            /** Is Bookable */
            is_bookable: boolean;
            /** Available For Full Day */
            available_for_full_day: boolean;
            /** Blocked Ranges */
            blocked_ranges?: components["schemas"]["CalendarBlockedRange"][];
            /** Bookings */
            bookings?: components["schemas"]["CalendarBookingSummary"][];
        };
        /** CalendarResponse */
        CalendarResponse: {
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /** Timezone */
            timezone: string;
            /**
             * Start Date
             * Format: date
             */
            start_date: string;
            /**
             * End Date
             * Format: date
             */
            end_date: string;
            /** Days */
            days: components["schemas"]["CalendarDay"][];
        };
        /** CancellationDisplay */
        CancellationDisplay: {
            /** Refund Amount */
            refund_amount: string;
            /** Penalty Amount */
            penalty_amount: string;
        };
        /** CancellationPolicyResponse */
        CancellationPolicyResponse: {
            /** Tier 1 Hours */
            tier_1_hours?: number | null;
            /** Tier 1 Refund Pct */
            tier_1_refund_pct?: string | null;
            /** Tier 2 Hours */
            tier_2_hours?: number | null;
            /** Tier 2 Refund Pct */
            tier_2_refund_pct?: string | null;
            /** Tier 3 Hours */
            tier_3_hours?: number | null;
            /** Tier 3 Refund Pct */
            tier_3_refund_pct?: string | null;
            /** No Show Refund Pct */
            no_show_refund_pct: string;
            /** Platform Fee Refundable */
            platform_fee_refundable: boolean;
            /** Notes */
            notes?: string | null;
        };
        /** CancellationPreviewOut */
        CancellationPreviewOut: {
            /** Refund Amount Paise */
            refund_amount_paise: number;
            /** Penalty Amount Paise */
            penalty_amount_paise: number;
            /** Refund Pct Applied */
            refund_pct_applied: number;
            /** Tier Matched */
            tier_matched: string | null;
            display: components["schemas"]["CancellationDisplay"];
        };
        /** CategoryBannerResponse */
        CategoryBannerResponse: {
            /** Banner Image */
            banner_image: string;
        };
        /** CategoryCreateRequest */
        CategoryCreateRequest: {
            /** Slug */
            slug: string;
            /** Label */
            label: string;
            /** Icon */
            icon?: string | null;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
        };
        /** CategoryDeleteResponse */
        CategoryDeleteResponse: {
            /** Deleted */
            deleted: boolean;
            /** Venue Count */
            venue_count: number;
        };
        /** CategoryListResponse */
        CategoryListResponse: {
            /** Items */
            items: components["schemas"]["AdminCategoryResponse"][];
            /** Total */
            total: number;
        };
        /** CategoryUpdateRequest */
        CategoryUpdateRequest: {
            /** Label */
            label?: string | null;
            /** Icon */
            icon?: string | null;
            /** Sort Order */
            sort_order?: number | null;
            /** Is Active */
            is_active?: boolean | null;
        };
        /** ChartDataPoint */
        ChartDataPoint: {
            /** Month */
            month: string;
            /** Enquiries */
            enquiries: number;
            /** Completed */
            completed: number;
            /** Cancelled */
            cancelled: number;
        };
        /** CreateBlockedDateRequest */
        CreateBlockedDateRequest: {
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
            /** Reason */
            reason?: string | null;
        };
        /** CreatePaymentRequest */
        CreatePaymentRequest: {
            /** Booking Id */
            booking_id: string;
            /**
             * Payment Type
             * @default advance
             * @enum {string}
             */
            payment_type: "advance" | "balance" | "full";
        };
        /** CreateVenueRequest */
        CreateVenueRequest: {
            /** Name */
            name: string;
            /** Description */
            description?: string | null;
            /**
             * Category Id
             * Format: uuid
             */
            category_id: string;
            /** Address Line1 */
            address_line1: string;
            /** Address Line2 */
            address_line2?: string | null;
            /** City */
            city: string;
            /** State */
            state: string;
            /**
             * Country
             * @default India
             */
            country: string;
            /** Postal Code */
            postal_code?: string | null;
            /** Latitude */
            latitude?: number | string | null;
            /** Longitude */
            longitude?: number | string | null;
            /**
             * Timezone
             * @default Asia/Kolkata
             */
            timezone: string;
            /** Min Capacity */
            min_capacity?: number | null;
            /** Max Capacity */
            max_capacity: number;
            /**
             * Open Time
             * Format: time
             */
            open_time: string;
            /**
             * Close Time
             * Format: time
             */
            close_time: string;
            /**
             * Spans Next Day
             * @default false
             */
            spans_next_day: boolean;
            /** Allowed Booking Types */
            allowed_booking_types?: components["schemas"]["BookingType"][];
            /**
             * Min Booking Duration Minutes
             * @default 60
             */
            min_booking_duration_minutes: number;
            /**
             * Max Booking Duration Minutes
             * @default 1440
             */
            max_booking_duration_minutes: number;
            /**
             * Slot Interval Minutes
             * @default 30
             */
            slot_interval_minutes: number;
            /**
             * Pre Buffer Minutes
             * @default 0
             */
            pre_buffer_minutes: number;
            /**
             * Post Buffer Minutes
             * @default 0
             */
            post_buffer_minutes: number;
            /** @default flat */
            pricing_mode: components["schemas"]["PricingMode"];
            /** Starting Price Paise */
            starting_price_paise?: number | null;
            /** Hourly Rate Paise */
            hourly_rate_paise?: number | null;
            /**
             * Advance Pct
             * @default 30.00
             */
            advance_pct: number | string;
            /**
             * Balance Due Days Before Event
             * @default 7
             */
            balance_due_days_before_event: number;
            /**
             * Owner Action Window Hours
             * @default 48
             */
            owner_action_window_hours: number;
            /**
             * Overdue Advance Refund Pct
             * @default 0.00
             */
            overdue_advance_refund_pct: number | string;
            cancellation_policy?: components["schemas"]["UpdateCancellationPolicyRequest"] | null;
            /** Amenity Ids */
            amenity_ids?: string[] | null;
            /**
             * Last Completed Step
             * @default 0
             */
            last_completed_step: number | null;
        };
        /** DashboardStats */
        DashboardStats: {
            /** Active Venues */
            active_venues: number;
            /** Pending Requests */
            pending_requests: number;
            /** Active Bookings */
            active_bookings: number;
            /** Completed Bookings */
            completed_bookings: number;
            /** Cancelled Bookings */
            cancelled_bookings: number;
            /** Gross Volume Paise */
            gross_volume_paise: number;
            /** Net Revenue Paise */
            net_revenue_paise: number;
            /** Available Balance Paise */
            available_balance_paise: number;
            /** Platform Fees Paise */
            platform_fees_paise: number;
            /** Refunds Issued Paise */
            refunds_issued_paise: number;
            /** Payouts Completed Paise */
            payouts_completed_paise: number;
        };
        /** DeleteResponse */
        DeleteResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Deleted
             * @default true
             */
            deleted: boolean;
            /**
             * Message
             * @default Venue deleted successfully
             */
            message: string;
        };
        /** ExtendDeadlineIn */
        ExtendDeadlineIn: {
            /**
             * New Due Date
             * Format: date
             */
            new_due_date: string;
        };
        /** GrowthStatsResponse */
        GrowthStatsResponse: {
            /** Labels */
            labels: string[];
            /** Users */
            users: number[];
            /** Owners */
            owners: number[];
            /** Venues */
            venues: number[];
            /** Bookings */
            bookings: number[];
            /** Totals */
            totals: {
                [key: string]: number;
            };
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** LedgerEntryResponse */
        LedgerEntryResponse: {
            /** Id */
            id: string;
            /** Booking Id */
            booking_id: string;
            /** Venue Id */
            venue_id: string;
            /** Venue Name */
            venue_name?: string | null;
            /** User Full Name */
            user_full_name?: string | null;
            /** Entry Type */
            entry_type: string;
            /** Amount Paise */
            amount_paise: number;
            /** Direction */
            direction: string;
            /** Stripe Pi Ref */
            stripe_pi_ref?: string | null;
            /** Created At */
            created_at: string;
        };
        /** NotificationResponse */
        NotificationResponse: {
            /** Id */
            id: string;
            /** User Id */
            user_id: string;
            /** Booking Id */
            booking_id: string | null;
            /** Type */
            type: string;
            /** Title */
            title: string;
            /** Body */
            body: string;
            /** Read At */
            read_at: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** OperatingWindow */
        OperatingWindow: {
            /** Is Available */
            is_available: boolean;
            /** Opens At */
            opens_at?: string | null;
            /** Closes At */
            closes_at?: string | null;
            /**
             * Spans Next Day
             * @default false
             */
            spans_next_day: boolean;
        };
        /** OwnerApprovalRequest */
        OwnerApprovalRequest: {
            /**
             * Reason
             * @default
             */
            reason: string;
        };
        /** OwnerLedgerStatsResponse */
        OwnerLedgerStatsResponse: {
            /** Gross Volume Paise */
            gross_volume_paise: number;
            /** Platform Fees Paise */
            platform_fees_paise: number;
            /** Refunds Issued Paise */
            refunds_issued_paise: number;
            /** Net Revenue Paise */
            net_revenue_paise: number;
            /** Payouts Completed Paise */
            payouts_completed_paise: number;
            /** Available Balance Paise */
            available_balance_paise: number;
        };
        /** OwnerRejectIn */
        OwnerRejectIn: {
            /** Reason */
            reason: string;
        };
        /** OwnerStatsResponse */
        OwnerStatsResponse: {
            /** Total */
            total: number;
            /** Pending */
            pending: number;
            /** Active */
            active: number;
            /** Rejected */
            rejected: number;
            /** Suspended */
            suspended: number;
        };
        /** Page[SearchResult] */
        Page_SearchResult_: {
            /** Items */
            items: components["schemas"]["SearchResult"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
        };
        /** PaymentIntentResponse */
        PaymentIntentResponse: {
            /** Payment Id */
            payment_id: string;
            /** Booking Id */
            booking_id: string;
            /** Client Secret */
            client_secret: string | null;
            /** Amount Paise */
            amount_paise: number;
            /** Currency */
            currency: string;
            /** Status */
            status: string;
        };
        /** PaymentResponse */
        PaymentResponse: {
            /** Id */
            id: string;
            /** Booking Id */
            booking_id: string;
            /** Amount Paise */
            amount_paise: number;
            /** Currency */
            currency: string;
            /** Status */
            status: string;
            /** Stripe Payment Intent Id */
            stripe_payment_intent_id: string;
        };
        /** PricingDisplay */
        PricingDisplay: {
            /** Quoted Price */
            quoted_price: string;
            /** Advance Due */
            advance_due: string;
            /** Balance Due */
            balance_due: string;
            /** Platform Fee */
            platform_fee: string;
            /** Owner Payout */
            owner_payout: string;
        };
        /**
         * PricingMode
         * @enum {string}
         */
        PricingMode: "flat" | "hourly" | "mixed";
        /** PricingPreviewResponse */
        PricingPreviewResponse: {
            pricing_mode: components["schemas"]["PricingMode"];
            /** Quoted Price Paise */
            quoted_price_paise: number;
            /** Platform Commission Pct */
            platform_commission_pct: number;
            /** Platform Fee Paise */
            platform_fee_paise: number;
            /** Owner Payout Paise */
            owner_payout_paise: number;
            /** Advance Pct */
            advance_pct: number;
            /** Advance Due Paise */
            advance_due_paise: number;
            /** Balance Due Paise */
            balance_due_paise: number;
            display: components["schemas"]["PricingDisplay"];
        };
        /** PricingQuote */
        PricingQuote: {
            /** Quoted Price Paise */
            quoted_price_paise: number;
            /** Platform Commission Pct */
            platform_commission_pct: number;
            /** Platform Fee Paise */
            platform_fee_paise: number;
            /** Owner Payout Paise */
            owner_payout_paise: number;
            /** Advance Pct */
            advance_pct: number;
            /** Advance Due Paise */
            advance_due_paise: number;
            /** Balance Due Paise */
            balance_due_paise: number;
            /** Pricing Mode */
            pricing_mode: string;
        };
        /** PublicVenueBlockedDateResponse */
        PublicVenueBlockedDateResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
        };
        /** ReactivateUserRequest */
        ReactivateUserRequest: {
            /**
             * Reason
             * @default
             */
            reason: string;
        };
        /** RefundRequest */
        RefundRequest: {
            /** Booking Id */
            booking_id: string;
            /** Reason */
            reason?: string | null;
        };
        /** RefundResponse */
        RefundResponse: {
            /** Booking Id */
            booking_id: string;
            /** Refunded Paise */
            refunded_paise: number;
            /** Status */
            status: string;
        };
        /** SearchResult */
        SearchResult: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** City */
            city: string;
            category: components["schemas"]["VenueCategoryResponse"];
            /** Capacity */
            capacity: number;
            /** Pricing Mode */
            pricing_mode: string;
            /** Starting Price Paise */
            starting_price_paise?: number | null;
            /** Cover Photo Url */
            cover_photo_url?: string | null;
        };
        /** SuspendUserRequest */
        SuspendUserRequest: {
            /** Reason */
            reason: string;
        };
        /** UpcomingEventOut */
        UpcomingEventOut: {
            /** Booking Id */
            booking_id: string;
            /** Event Type */
            event_type?: string | null;
            /** Venue Name */
            venue_name: string;
            /** Status */
            status: string;
            /** Starts At */
            starts_at?: string | null;
            /** Guest Count */
            guest_count: number;
        };
        /** UpdateCancellationPolicyRequest */
        UpdateCancellationPolicyRequest: {
            /** Tier 1 Hours */
            tier_1_hours?: number | null;
            /** Tier 1 Refund Pct */
            tier_1_refund_pct?: number | string | null;
            /** Tier 2 Hours */
            tier_2_hours?: number | null;
            /** Tier 2 Refund Pct */
            tier_2_refund_pct?: number | string | null;
            /** Tier 3 Hours */
            tier_3_hours?: number | null;
            /** Tier 3 Refund Pct */
            tier_3_refund_pct?: number | string | null;
            /**
             * No Show Refund Pct
             * @default 0.00
             */
            no_show_refund_pct: number | string;
            /** Notes */
            notes?: string | null;
        };
        /** UpdateOwnerNotesIn */
        UpdateOwnerNotesIn: {
            /** Notes */
            notes: string | null;
        };
        /** UpdateProfileRequest */
        UpdateProfileRequest: {
            /** Full Name */
            full_name?: string | null;
        };
        /** UpdateVenueAmenitiesRequest */
        UpdateVenueAmenitiesRequest: {
            /** Amenity Ids */
            amenity_ids: string[];
        };
        /** UpdateVenuePhotoItem */
        UpdateVenuePhotoItem: {
            /**
             * Photo Id
             * Format: uuid
             */
            photo_id: string;
            /** Sort Order */
            sort_order: number;
            /** Is Cover */
            is_cover: boolean;
        };
        /** UpdateVenueRequest */
        UpdateVenueRequest: {
            /** Name */
            name?: string | null;
            /** Description */
            description?: string | null;
            /** Category Id */
            category_id?: string | null;
            /** Address Line1 */
            address_line1?: string | null;
            /** Address Line2 */
            address_line2?: string | null;
            /** City */
            city?: string | null;
            /** State */
            state?: string | null;
            /** Country */
            country?: string | null;
            /** Postal Code */
            postal_code?: string | null;
            /** Latitude */
            latitude?: number | string | null;
            /** Longitude */
            longitude?: number | string | null;
            /** Timezone */
            timezone?: string | null;
            /** Min Capacity */
            min_capacity?: number | null;
            /** Max Capacity */
            max_capacity?: number | null;
            /** Open Time */
            open_time?: string | null;
            /** Close Time */
            close_time?: string | null;
            /** Spans Next Day */
            spans_next_day?: boolean | null;
            /** Allowed Booking Types */
            allowed_booking_types?: components["schemas"]["BookingType"][] | null;
            /** Min Booking Duration Minutes */
            min_booking_duration_minutes?: number | null;
            /** Max Booking Duration Minutes */
            max_booking_duration_minutes?: number | null;
            /** Slot Interval Minutes */
            slot_interval_minutes?: number | null;
            /** Pre Buffer Minutes */
            pre_buffer_minutes?: number | null;
            /** Post Buffer Minutes */
            post_buffer_minutes?: number | null;
            pricing_mode?: components["schemas"]["PricingMode"] | null;
            /** Starting Price Paise */
            starting_price_paise?: number | null;
            /** Hourly Rate Paise */
            hourly_rate_paise?: number | null;
            /** Advance Pct */
            advance_pct?: number | string | null;
            /** Balance Due Days Before Event */
            balance_due_days_before_event?: number | null;
            /** Owner Action Window Hours */
            owner_action_window_hours?: number | null;
            /** Overdue Advance Refund Pct */
            overdue_advance_refund_pct?: number | string | null;
            /** Last Completed Step */
            last_completed_step?: number | null;
        };
        /** UserListResponse */
        UserListResponse: {
            /** Items */
            items: components["schemas"]["UserSummary"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total Pages */
            total_pages: number;
            stats: components["schemas"]["UserStats"];
        };
        /** UserStats */
        UserStats: {
            /** Total */
            total: number;
            /** Active */
            active: number;
            /** Suspended */
            suspended: number;
            /** Pending */
            pending: number;
            /** Rejected */
            rejected: number;
        };
        /** UserSummary */
        UserSummary: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Full Name */
            full_name: string | null;
            /** Email */
            email: string | null;
            /** Phone */
            phone: string | null;
            /** Status */
            status: string;
            /** Roles */
            roles: string[];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Is Super Admin */
            is_super_admin: boolean;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
            /** Input */
            input?: unknown;
            /** Context */
            ctx?: Record<string, never>;
        };
        /** ValidationResponse */
        ValidationResponse: {
            /** Valid */
            valid: boolean;
            /**
             * Effective Starts At
             * Format: date-time
             */
            effective_starts_at: string;
            /**
             * Effective Ends At
             * Format: date-time
             */
            effective_ends_at: string;
        };
        /** VenueActionRequest */
        VenueActionRequest: {
            /**
             * Reason
             * @default
             */
            reason: string;
        };
        /** VenueAvailabilityResponse */
        VenueAvailabilityResponse: {
            /** Day Of Week */
            day_of_week: number;
            /** Is Available */
            is_available: boolean;
            /** Opens At */
            opens_at?: string | null;
            /** Closes At */
            closes_at?: string | null;
            /** Spans Next Day */
            spans_next_day: boolean;
        };
        /** VenueAvailabilityUpdate */
        VenueAvailabilityUpdate: {
            /** Day Of Week */
            day_of_week: number;
            /** Is Available */
            is_available: boolean;
            /** Opens At */
            opens_at?: string | null;
            /** Closes At */
            closes_at?: string | null;
            /**
             * Spans Next Day
             * @default false
             */
            spans_next_day: boolean;
        };
        /** VenueBlockedDateResponse */
        VenueBlockedDateResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /**
             * Starts At
             * Format: date-time
             */
            starts_at: string;
            /**
             * Ends At
             * Format: date-time
             */
            ends_at: string;
            /** Reason */
            reason?: string | null;
            /**
             * Blocked By
             * Format: uuid
             */
            blocked_by: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** VenueCategoryResponse */
        VenueCategoryResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Slug */
            slug: string;
            /** Label */
            label: string;
            /** Icon */
            icon?: string | null;
            /** Banner Image */
            banner_image?: string | null;
            /** Is Active */
            is_active: boolean;
            /** Sort Order */
            sort_order: number;
        };
        /** VenuePhotoResponse */
        VenuePhotoResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Venue Id
             * Format: uuid
             */
            venue_id: string;
            /** Image Url */
            image_url: string;
            /** Sort Order */
            sort_order: number;
            /** Is Cover */
            is_cover: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** VenueResponse */
        VenueResponse: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Owner Id
             * Format: uuid
             */
            owner_id: string;
            /** Name */
            name: string;
            /** Slug */
            slug?: string | null;
            /** Description */
            description?: string | null;
            category: components["schemas"]["VenueCategoryResponse"];
            /** Address Line1 */
            address_line1: string;
            /** Address Line2 */
            address_line2?: string | null;
            /** City */
            city: string;
            /** State */
            state: string;
            /** Country */
            country: string;
            /** Postal Code */
            postal_code?: string | null;
            /** Latitude */
            latitude?: string | null;
            /** Longitude */
            longitude?: string | null;
            /** Timezone */
            timezone: string;
            /** Min Capacity */
            min_capacity?: number | null;
            /** Max Capacity */
            max_capacity: number;
            /**
             * Open Time
             * Format: time
             */
            open_time: string;
            /**
             * Close Time
             * Format: time
             */
            close_time: string;
            /** Spans Next Day */
            spans_next_day: boolean;
            /** Allowed Booking Types */
            allowed_booking_types: components["schemas"]["BookingType"][];
            /** Min Booking Duration Minutes */
            min_booking_duration_minutes: number;
            /** Max Booking Duration Minutes */
            max_booking_duration_minutes: number;
            /** Slot Interval Minutes */
            slot_interval_minutes: number;
            /** Pre Buffer Minutes */
            pre_buffer_minutes: number;
            /** Post Buffer Minutes */
            post_buffer_minutes: number;
            pricing_mode: components["schemas"]["PricingMode"];
            /** Starting Price Paise */
            starting_price_paise?: number | null;
            /** Hourly Rate Paise */
            hourly_rate_paise?: number | null;
            /** Platform Commission Pct */
            platform_commission_pct: string;
            /** Advance Pct */
            advance_pct: string;
            /** Balance Due Days Before Event */
            balance_due_days_before_event: number;
            /** Owner Action Window Hours */
            owner_action_window_hours: number;
            /** Overdue Advance Refund Pct */
            overdue_advance_refund_pct: string;
            status: components["schemas"]["VenueStatus"];
            /** Is Active */
            is_active: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Last Completed Step */
            last_completed_step: number;
            /** Photos */
            photos?: components["schemas"]["VenuePhotoResponse"][];
            /** Amenities */
            amenities?: components["schemas"]["AmenityResponse"][];
            cancellation_policy?: components["schemas"]["CancellationPolicyResponse"] | null;
        };
        /** VenueStatsResponse */
        VenueStatsResponse: {
            /** Total */
            total: number;
            /** Pending Approval */
            pending_approval: number;
            /** Approved */
            approved: number;
            /** Rejected */
            rejected: number;
            /** Suspended */
            suspended: number;
            /** Draft */
            draft: number;
        };
        /**
         * VenueStatus
         * @enum {string}
         */
        VenueStatus: "draft" | "pending_approval" | "approved" | "rejected" | "suspended";
        /** ProfileResponse */
        app__modules__auth__schemas__ProfileResponse: {
            /** Full Name */
            full_name: string | null;
            /** Phone */
            phone: string | null;
            /** Avatar Url */
            avatar_url: string | null;
            /** Status */
            status: string;
        };
        /** ProfileResponse */
        app__modules__profile__schemas__ProfileResponse: {
            /** Id */
            id: string;
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Full Name */
            full_name: string;
            /** Role */
            role: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    me_api_auth_me_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthMeResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_owner_api_auth_register_owner_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reapply_owner_api_auth_reapply_owner_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_profile_api_profile_me_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["app__modules__profile__schemas__ProfileResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_profile_api_profile_me_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfileRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["app__modules__profile__schemas__ProfileResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_my_venues_api_venues_my_venues_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_my_venue_api_venues_my_venues__venue_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_venue_api_venues__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateVenueRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_venue_api_venues__venue_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeleteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_venue_api_venues__venue_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateVenueRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    submit_venue_api_venues__venue_id__submit_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_venue_availability_api_venues__venue_id__availability_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueAvailabilityResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    bulk_update_availability_api_venues__venue_id__availability_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkUpdateAvailabilityRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueAvailabilityResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_venue_blocked_dates_api_venues__venue_id__blocked_dates_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicVenueBlockedDateResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_blocked_date_api_venues__venue_id__blocked_dates_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBlockedDateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueBlockedDateResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_blocked_date_api_venues__venue_id__blocked_dates__blocked_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
                blocked_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeleteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_venue_cancellation_policy_api_venues__venue_id__cancellation_policy_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CancellationPolicyResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    put_venue_cancellation_policy_api_venues__venue_id__cancellation_policy_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCancellationPolicyRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CancellationPolicyResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_venue_amenities_api_venues__venue_id__amenities_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateVenueAmenitiesRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AmenityResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    add_venue_photo_api_venues__venue_id__photos_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_add_venue_photo_api_venues__venue_id__photos_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenuePhotoResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    bulk_update_venue_photos_api_venues__venue_id__photos_bulk_update_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkUpdateVenuePhotosRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenuePhotoResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_venue_photo_api_venues__venue_id__photos__photo_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
                photo_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeleteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_venue_bookings_api_venues__venue_id__bookings_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_pending_venue_bookings_api_venues__venue_id__bookings_pending_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_venue_categories_api_venues_categories_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueCategoryResponse"][];
                };
            };
        };
    };
    get_platform_amenities_api_venues_amenities_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AmenityResponse"][];
                };
            };
        };
    };
    get_venue_api_venues__identifier__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                identifier: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_pricing_preview_api_venues__venue_id__pricing_get: {
        parameters: {
            query: {
                /** @description ISO 8601 datetime with timezone offset */
                starts_at: string;
                /** @description ISO 8601 datetime with timezone offset */
                ends_at: string;
                /** @description full_day or time_slot */
                booking_type: components["schemas"]["BookingType"];
            };
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PricingPreviewResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_venues_api_search__get: {
        parameters: {
            query?: {
                q?: string;
                city?: string;
                venue_type?: string | null;
                capacity?: number;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Page_SearchResult_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_fts_api_search_fts_get: {
        parameters: {
            query?: {
                q?: string;
                city?: string;
                venue_type?: string | null;
                capacity?: number;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Page_SearchResult_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_semantic_api_search_semantic_get: {
        parameters: {
            query?: {
                q?: string;
                city?: string;
                venue_type?: string | null;
                capacity?: number;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Page_SearchResult_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_hybrid_api_search_hybrid_get: {
        parameters: {
            query?: {
                q?: string;
                city?: string;
                venue_type?: string | null;
                capacity?: number;
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Page_SearchResult_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_my_bookings_api_bookings__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_booking_api_bookings__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookingRequestIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_owner_bookings_api_bookings_owner_get: {
        parameters: {
            query?: {
                tab?: string | null;
                venue_id?: string | null;
                search?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_venue_bookings_api_bookings_venues__venue_id__bookings_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_pending_venue_bookings_api_bookings_venues__venue_id__bookings_pending_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_booking_api_bookings__booking_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    cancellation_preview_api_bookings__booking_id__cancellation_preview_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CancellationPreviewOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    user_cancel_booking_api_bookings__booking_id__cancel_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_accept_booking_api_bookings__booking_id__accept_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_reject_booking_api_bookings__booking_id__reject_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OwnerRejectIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_extend_deadline_api_bookings__booking_id__extend_balance_deadline_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExtendDeadlineIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_cancel_forfeit_api_bookings__booking_id__cancel_forfeit_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_cancel_goodwill_api_bookings__booking_id__cancel_goodwill_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_owner_notes_api_bookings__booking_id__owner_notes_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOwnerNotesIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    availability_for_date_query_api_availability_venues__venue_id__availability_get: {
        parameters: {
            query: {
                date: string;
            };
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    calendar_api_availability_venues__venue_id__calendar_get: {
        parameters: {
            query: {
                start_date: string;
                end_date: string;
            };
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    owner_calendar_api_availability_venues__venue_id__calendar_owner_get: {
        parameters: {
            query: {
                start_date: string;
                end_date: string;
            };
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    availability_for_date_api_availability_venues__venue_id__date__booking_date__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                venue_id: string;
                booking_date: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    pricing_quote_api_availability_venues__venue_id__quote_get: {
        parameters: {
            query: {
                starts_at: string;
                ends_at: string;
                booking_type: components["schemas"]["BookingType"];
            };
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PricingQuote"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    validate_slot_api_availability_venues__venue_id__validate_post: {
        parameters: {
            query: {
                booking_type: components["schemas"]["BookingType"];
                starts_at?: string | null;
                ends_at?: string | null;
                booking_date?: string | null;
                guest_count?: number | null;
            };
            header?: never;
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_notifications_api_notifications__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    mark_read_api_notifications__notification_id__read_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                notification_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_venue_stats_api_admin_venues_stats_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_venues_api_admin_venues_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                status?: string | null;
                search?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminVenueListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_venue_api_admin_venues__venue_id__approve_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VenueActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reject_venue_api_admin_venues__venue_id__reject_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VenueActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    suspend_venue_api_admin_venues__venue_id__suspend_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VenueActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reactivate_venue_api_admin_venues__venue_id__reactivate_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                venue_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VenueActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_users_api_admin_users_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                search?: string | null;
                status?: string | null;
                role?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_user_api_admin_users__user_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    suspend_user_api_admin_users__user_id__suspend_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SuspendUserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reactivate_user_api_admin_users__user_id__reactivate_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReactivateUserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_stats_api_admin_venue_owners_stats_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OwnerStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_owner_api_admin_venue_owners__user_id__approve_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OwnerApprovalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reject_owner_api_admin_venue_owners__user_id__reject_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OwnerApprovalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_actions_api_admin_actions_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                target_type?: string | null;
                action_type?: string | null;
                limit?: number | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminActionListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_amenities_api_admin_amenities_get: {
        parameters: {
            query?: {
                include_deleted?: boolean;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AmenityListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_amenity_api_admin_amenities_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AmenityCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminAmenityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_amenity_api_admin_amenities__amenity_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                amenity_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AmenityDeleteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_amenity_api_admin_amenities__amenity_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                amenity_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AmenityUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminAmenityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_categories_api_admin_categories_get: {
        parameters: {
            query?: {
                include_deleted?: boolean;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_category_api_admin_categories_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CategoryCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminCategoryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_category_api_admin_categories__category_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                category_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDeleteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_category_api_admin_categories__category_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                category_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CategoryUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminCategoryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_category_banner_api_admin_categories__category_id__banner_image_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                category_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_category_banner_api_admin_categories__category_id__banner_image_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryBannerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_category_banner_api_admin_categories__category_id__banner_image_delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                category_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryBannerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_booking_stats_api_admin_bookings_stats_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_bookings_api_admin_bookings_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                status?: string | null;
                search?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminBookingListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_growth_stats_api_admin_growth_stats_get: {
        parameters: {
            query?: {
                period?: string;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GrowthStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_stats_api_payments_owner_stats_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OwnerLedgerStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_ledger_api_payments_owner_ledger_get: {
        parameters: {
            query?: {
                entry_type?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LedgerEntryResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_payment_api_payments__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePaymentRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentIntentResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    stripe_webhook_api_payments_webhook_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    refund_api_payments_refund_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefundRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RefundResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_payments_api_payments__booking_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                booking_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    run_jobs_api_internal_run_jobs_post: {
        parameters: {
            query: {
                /** @description Comma-separated job names, e.g. hold_expiry,payment_reminders */
                jobs: string;
            };
            header?: {
                "X-Job-Token"?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_dashboard_stats_api_owner_dashboard_stats_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DashboardStats"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_dashboard_chart_api_owner_dashboard_chart_get: {
        parameters: {
            query?: {
                time_range?: string;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChartDataPoint"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_owner_dashboard_upcoming_events_api_owner_dashboard_upcoming_events_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpcomingEventOut"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_check_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
