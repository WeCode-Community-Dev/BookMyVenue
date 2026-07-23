ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('user', 'owner', 'admin'));
