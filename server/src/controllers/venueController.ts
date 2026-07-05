import { Request,Response } from "express";
import {pool} from "../config/db.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";

export const createVenue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const {
      name,
      category,
      description,
      address,
      city,
      capacity,
      base_price,
    } = req.body;

    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    if (
      !name ||
      !category ||
      !address ||
      !city ||
      capacity === undefined ||
      base_price === undefined
    ) {
      res.status(400).json({
        message:
          "Name, category, address, city, capacity, and base price are required",
      });
      return;
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (
      !files ||
      !files.owner_id_proof ||
      !files.ownership_proof ||
      !files.business_registration
    ) {
      res.status(400).json({
        message:
          "Owner ID proof, ownership proof, and business registration documents are required",
      });
      return;
    }

    if (Number(capacity) <= 0) {
      res.status(400).json({
        message: "Capacity must be greater than 0",
      });
      return;
    }

    if (Number(base_price) < 0) {
      res.status(400).json({
        message: "Base price cannot be negative",
      });
      return;
    }

    await client.query("BEGIN");

    const venueResult = await client.query(
      `INSERT INTO venues (
        owner_id,
        name,
        category,
        description,
        address,
        city,
        capacity,
        base_price,
        approval_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING
        id,
        owner_id,
        name,
        category,
        description,
        address,
        city,
        capacity,
        base_price,
        approval_status,
        is_active,
        created_at`,
      [
        req.user.id,
        name,
        category,
        description || null,
        address,
        city,
        Number(capacity),
        Number(base_price),
      ]
    );

    const venue = venueResult.rows[0];

    const documentFiles = [
      {
        document_type: "owner_id_proof",
        file: files.owner_id_proof[0],
      },
      {
        document_type: "ownership_proof",
        file: files.ownership_proof[0],
      },
      {
        document_type: "business_registration",
        file: files.business_registration[0],
      },
    ];

    for (const document of documentFiles) {
      await client.query(
        `INSERT INTO venue_documents (
          venue_id,
          document_type,
          file_name,
          file_path,
          mime_type
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          venue.id,
          document.document_type,
          document.file.originalname,
          document.file.path,
          document.file.mimetype,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message:
        "Venue added successfully with documents and waiting for admin approval",
      venue,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create venue error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};


export const getMyVenues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    const result = await pool.query(
      `SELECT
        id,
        owner_id,
        name,
        category,
        description,
        address,
        city,
        capacity,
        base_price,
        approval_status,
        is_active,
        created_at,
        updated_at
      FROM venues
      WHERE owner_id = $1
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      message: "Owner venues fetched successfully",
      count: result.rows.length,
      venues: result.rows,
    });
  } catch (error) {
    console.error("Get my venues error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPendingVenues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT
        v.id,
        v.owner_id,
        u.name AS owner_name,
        u.email AS owner_email,
        v.name,
        v.category,
        v.description,
        v.address,
        v.city,
        v.capacity,
        v.base_price,
        v.approval_status,
        v.is_active,
        v.created_at,
        v.updated_at
      FROM venues v
      JOIN users u
      ON v.owner_id = u.id
      WHERE v.approval_status = 'pending'
      ORDER BY v.created_at DESC`
    );

    res.status(200).json({
      message: "Pending venues fetched successfully",
      count: result.rows.length,
      venues: result.rows,
    });
  } catch (error) {
    console.error("Get pending venues error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getVenueDetailsForAdmin = async (
    req :AuthRequest,
    res :Response
): Promise<void> => {
    try{
        const venueId = Number(req.params.id);

        if (isNaN(venueId)){
            res.status(400).json({
                message : "invalid venue id",
            });

            return;
        }

        const venueResult = await pool.query(
         `SELECT
         v.id,
         v.owner_id,
         u.name AS owner_name,
         u.email AS owner_email,
         v.name,
         v.category,
         v.description,
         v.address,
         v.city,
         v.capacity,
         v.base_price,
         v.approval_status,
         v.is_active,
         v.created_at,
         v.updated_at
         FROM venues v
         JOIN users u
         ON v.owner_id = u.id
         WHERE v.id = $1`,
         [venueId]
         );

         if(venueResult.rows.length ===0){
            res.status(404).json({
                message : "venue not found",
            });
            return;
         }

        const documentsResult = await pool.query(
          `SELECT
            id,
            venue_id,
            document_type,
            file_name,
            mime_type,
            uploaded_at
            FROM venue_documents
            WHERE venue_id = $1
            ORDER BY uploaded_at ASC`,
            [venueId]
        );

        res.status(200).json({
            message : "venues fetched successfully",
            venue : venueResult.rows[0],
            documents : documentsResult.rows,
        });
    }catch(error){
         console.error("Get venue details for admin error:", error);

         res.status(500).json({
            message :"Internal server error",
         });
    }
};

export const viewVenueDocumentForAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const documentId = Number(req.params.documentId);

    if (isNaN(documentId)) {
      res.status(400).json({
        message: "Invalid document id",
      });
      return;
    }

    const documentResult = await pool.query(
      `SELECT
        id,
        venue_id,
        document_type,
        file_name,
        file_path,
        mime_type
      FROM venue_documents
      WHERE id = $1`,
      [documentId]
    );

    if (documentResult.rows.length === 0) {
      res.status(404).json({
        message: "Document not found",
      });
      return;
    }

    const document = documentResult.rows[0];

    const uploadsRoot = path.resolve(
      process.cwd(),
      "uploads",
      "venue-documents"
    );

    const fullFilePath = path.resolve(process.cwd(), document.file_path);

    if (!fullFilePath.startsWith(uploadsRoot)) {
      res.status(403).json({
        message: "Access denied",
      });
      return;
    }

    if (!fs.existsSync(fullFilePath)) {
      res.status(404).json({
        message: "Document file not found on server",
      });
      return;
    }

    res.setHeader("Content-Type", document.mime_type);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.file_name}"`
    );

    res.sendFile(fullFilePath);
  } catch (error) {
    console.error("View venue document error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const approveVenue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const venueId = Number(req.params.id);

    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    if (isNaN(venueId)) {
      res.status(400).json({
        message: "Invalid venue id",
      });
      return;
    }

    const existingVenue = await pool.query(
      `SELECT id, approval_status
       FROM venues
       WHERE id = $1`,
      [venueId]
    );

    if (existingVenue.rows.length === 0) {
      res.status(404).json({
        message: "Venue not found",
      });
      return;
    }

    if (existingVenue.rows[0].approval_status !== "pending") {
      res.status(400).json({
        message: "Only pending venues can be approved",
      });
      return;
    }

    const result = await pool.query(
      `UPDATE venues
       SET approval_status = 'approved',
           rejection_reason = NULL,
           reviewed_by = $2,
           reviewed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING
        id,
        owner_id,
        name,
        category,
        approval_status,
        rejection_reason,
        reviewed_by,
        reviewed_at,
        updated_at`,
      [venueId, req.user.id]
    );

    res.status(200).json({
      message: "Venue approved successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Approve venue error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const rejectVenue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const venueId = Number(req.params.id);
    const { rejection_reason } = req.body;

    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    if (isNaN(venueId)) {
      res.status(400).json({
        message: "Invalid venue id",
      });
      return;
    }

    if (!rejection_reason || rejection_reason.trim() === "") {
      res.status(400).json({
        message: "Rejection reason is required",
      });
      return;
    }

    const existingVenue = await pool.query(
      `SELECT id, approval_status
       FROM venues
       WHERE id = $1`,
      [venueId]
    );

    if (existingVenue.rows.length === 0) {
      res.status(404).json({
        message: "Venue not found",
      });
      return;
    }

    if (existingVenue.rows[0].approval_status !== "pending") {
      res.status(400).json({
        message: "Only pending venues can be rejected",
      });
      return;
    }

    const result = await pool.query(
      `UPDATE venues
       SET approval_status = 'rejected',
           rejection_reason = $2,
           reviewed_by = $3,
           reviewed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING
        id,
        owner_id,
        name,
        category,
        approval_status,
        rejection_reason,
        reviewed_by,
        reviewed_at,
        updated_at`,
      [venueId, rejection_reason.trim(), req.user.id]
    );

    res.status(200).json({
      message: "Venue rejected successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Reject venue error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getApprovedVenues = async (
  req : AuthRequest,
  res : Response
): Promise<void> =>{
  try{
    const{
      category,
      city,
      min_capacity,
      max_capacity,
      min_price,
      max_price,
      search,
    }= req.query;

    const conditions: string[] = [
      "approval_status ='approved'",
      "is_active =true",
    ];

    const values : unknown[] = [];

    if(category){
      values.push(String(category));
      conditions.push(`category = $${values.length}`);
    }

    if(city){
      values.push(String(city));
      conditions.push(`LOWER(city) = LOWER($${values.length})`);
    }

    if(min_capacity){
      
      const minCapacity = Number(min_capacity);

      if (isNaN(minCapacity) || minCapacity<0 ){
        res.status(400).json({
          message :"min_capacity must be a valid positive number",
        });
        return;
      }

      values.push(minCapacity);
      conditions.push(`capacity >= $${values.length}`);
    }

    if (max_capacity){
      const maxCapacity = Number(max_capacity);

            if (isNaN(maxCapacity) || maxCapacity < 0) {
        res.status(400).json({
          message: "max_capacity must be a valid positive number",
        });
        return;
    }

      values.push(maxCapacity);
      conditions.push(`capacity <= $${values.length}`);
  }

  if (min_price) {
      const minPrice = Number(min_price);

      if (isNaN(minPrice) || minPrice < 0) {
        res.status(400).json({
          message: "min_price must be a valid positive number",
        });
        return;
      }

      values.push(minPrice);
      conditions.push(`base_price >= $${values.length}`);
    }

      if (max_price) {
      const maxPrice = Number(max_price);

      if (isNaN(maxPrice) || maxPrice < 0) {
        res.status(400).json({
          message: "max_price must be a valid positive number",
        });
        return;
      }

      values.push(maxPrice);
      conditions.push(`base_price <= $${values.length}`);
    }

    if (search) {
      values.push(`%${String(search)}%`);
      conditions.push(
        `(name ILIKE $${values.length} OR description ILIKE $${values.length} OR address ILIKE $${values.length})`
      );
    }

        const query = `
      SELECT
        id,
        owner_id,
        name,
        category,
        description,
        address,
        city,
        capacity,
        base_price,
        approval_status,
        is_active,
        created_at,
        updated_at
      FROM venues
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
    `;


    const result = await pool.query(query, values);

     res.status(200).json({
      message: "Approved venues fetched successfully",
      count: result.rows.length,
      filters: {
        category: category || null,
        city: city || null,
        min_capacity: min_capacity || null,
        max_capacity: max_capacity || null,
        min_price: min_price || null,
        max_price: max_price || null,
        search: search || null,
      },
      venues: result.rows,
    });

} catch(error){
  console.error("Get approved venues error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPublicVenueDetails = async (
  req : Request,
  res : Response
): Promise<void> => {

  const venueId = Number(req.params.id);

  if(!venueId || Number.isNaN(venueId)){
    res.status(400).json({
      message : "valid venue id required",
    });
    return;
  }

  try{
    const result = await pool.query(
    `
       SELECT
        v.id,
        v.name,
        v.category,
        v.description,
        v.address,
        v.city,
        v.capacity,
        v.base_price,
        v.approval_status,
        v.is_active,
        v.created_at,
        v.updated_at,

        u.id AS owner_id,
        u.name AS owner_name
      FROM venues v
      JOIN users u ON u.id = v.owner_id
      WHERE v.id = $1
        AND v.approval_status = 'approved'
        AND v.is_active = true
    `,
    [venueId]  
    );

    if(result.rows.length ===0 ){
      res.status(404).json({
        message : "Venue not found or not available",
      });
    }

    res.status(200).json({
      message : "venues fetched successfully",
      venue : result.rows[0],     
    });
  }catch(error){

    console.error("Get public venues details error", error);

    res.status(500).json({
      message : "Something went wrong while fetching venue details",
    });
  }
};

