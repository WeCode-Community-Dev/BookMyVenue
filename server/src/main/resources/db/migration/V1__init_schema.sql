CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       phone VARCHAR(20) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);


CREATE TABLE venue_category (
                                id BIGSERIAL PRIMARY KEY,
                                name VARCHAR(100) NOT NULL UNIQUE,
                                description TEXT,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE venue (
                       id BIGSERIAL PRIMARY KEY,

                       owner_id UUID NOT NULL,
                       category_id BIGINT NOT NULL,

                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       address TEXT NOT NULL,
                       district VARCHAR(100),
                       capacity INTEGER NOT NULL,

                       price_per_slot DECIMAL(10,2) NOT NULL,

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_venue_owner
                           FOREIGN KEY (owner_id)
                               REFERENCES users(id),

                       CONSTRAINT fk_venue_category
                           FOREIGN KEY (category_id)
                               REFERENCES venue_category(id)
);



CREATE TABLE venue_image (
                             id BIGSERIAL PRIMARY KEY,

                             venue_id BIGINT NOT NULL,

                             image_url VARCHAR(1000) NOT NULL,

                             is_primary BOOLEAN NOT NULL DEFAULT FALSE,

                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_venue_image_venue
                                 FOREIGN KEY (venue_id)
                                     REFERENCES venue(id)
);


CREATE TABLE venue_availability_template (
                                             id BIGSERIAL PRIMARY KEY,

                                             venue_id BIGINT NOT NULL,

                                             day_of_week VARCHAR(20) NOT NULL,

                                             start_time TIME NOT NULL,
                                             end_time TIME NOT NULL,

                                             active BOOLEAN NOT NULL DEFAULT TRUE,

                                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                             CONSTRAINT fk_template_venue
                                                 FOREIGN KEY (venue_id)
                                                     REFERENCES venue(id)
                                                     ON DELETE CASCADE
);


CREATE TABLE booking (
                         id BIGSERIAL PRIMARY KEY,

                         user_id UUID NOT NULL,
                         venue_id BIGINT NOT NULL,

                         booking_date DATE NOT NULL,

                         start_time TIME NOT NULL,
                         end_time TIME NOT NULL,

                         status VARCHAR(50) NOT NULL,

                         total_amount DECIMAL(10,2) NOT NULL,

                         expires_at TIMESTAMP,

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_booking_user
                             FOREIGN KEY (user_id)
                                 REFERENCES users(id),

                         CONSTRAINT fk_booking_venue
                             FOREIGN KEY (venue_id)
                                 REFERENCES venue(id)
);


CREATE TABLE payment (
                         id BIGSERIAL PRIMARY KEY,

                         booking_id BIGINT NOT NULL,

                         amount DECIMAL(10,2) NOT NULL,

                         status VARCHAR(50) NOT NULL,

                         gateway_payment_id VARCHAR(255),

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_payment_booking
                             FOREIGN KEY (booking_id)
                                 REFERENCES booking(id)
);