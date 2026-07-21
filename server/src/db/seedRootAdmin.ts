import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const seedRootAdmin = async () => {
  try {
    const rootAdminEmail = "rootadmin@bookmyvenue.com";
    const rootAdminPassword = "rootadmin123";

    const hashedPassword = await bcrypt.hash(rootAdminPassword, 10);

    const existingRootAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND role = $2",
      [rootAdminEmail, "root_admin"]
    );

    if (existingRootAdmin.rows.length > 0) {
      await pool.query(
        `UPDATE users
         SET password = $1, status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE email = $3 AND role = $4`,
        [hashedPassword, "active", rootAdminEmail, "root_admin"]
      );

      console.log("Root admin password reset successfully");
      console.log("Login email:", rootAdminEmail);
      console.log("Login password:", rootAdminPassword);
      return;
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, status`,
      ["Root Admin", rootAdminEmail, hashedPassword, "root_admin", "active"]
    );

    console.log("Root admin created successfully:");
    console.log(result.rows[0]);
    console.log("Login email:", rootAdminEmail);
    console.log("Login password:", rootAdminPassword);
  } catch (error) {
    console.error("Error seeding root admin:", error);
  } finally {
    await pool.end();
  }
};

seedRootAdmin();