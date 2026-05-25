users

	 id
	 email (UNIQUE)
	 password_hash
	 full_name
	 phone
	 role
	 is_email_verified
	 status
	 created_at

Roles

    ADMIN
    OWNER
    USER
----------------------
venues

	id
	owner_id
	name
	description
	address
	city
	latitude
	longitude
	verification_status
	status
	created_at

 ---                            

venue_availability_rules

    id
    venueId
    From(Enum  MONDAY,TUESDAY,..)
    TO (Enum  -)
    min_duartion(1,2,3hr)
    start time(10)
    endTime(18)
    isCurrentlyActive
              -
----
venue_availabilty_exceptions

	 id
	 venue_id
	 exception_date
	 start_time
	 end_time
	 exception_type
	 reason
	 status

Exception Type

    FULL_DAY_BLOCK
    PARTIAL_BLOCK
    MAINTENANCE
    HOLIDAY
    custom block (later)

 
-----                     -

bookings

	 id
	 venue_id
	 user_id
	 booking_date
	 start_time
	 end_time
	 booking_status
	 payment_status
	 amount
	 created_at

booking_status

	PENDING
	CONFIRMED
	CANCELLED
	FAILED
	EXPIRED
                          
