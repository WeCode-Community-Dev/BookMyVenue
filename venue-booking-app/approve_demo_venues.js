const BACKEND_URL = 'http://localhost:8080';

async function approveVenues() {
  console.log("Starting admin approval script...");

  try {
    // 1. Login as Admin
    const loginRes = await fetch(`${BACKEND_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "admin@bookmyvenue.com",
        password: "admin123"
      })
    });

    if (!loginRes.ok) {
      throw new Error(`Admin login failed: ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Logged in successfully as Admin.");

    // 2. Fetch pending venues
    const pendingRes = await fetch(`${BACKEND_URL}/api/admin/venue/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!pendingRes.ok) {
      throw new Error(`Failed to fetch pending venues: ${pendingRes.status}`);
    }

    const venues = await pendingRes.json();
    console.log(`Found ${venues.length} pending venues.`);

    // 3. Approve venues with "V2" in their name
    for (const venue of venues) {
      if (venue.name && venue.name.includes("V2")) {
        console.log(`Approving venue: "${venue.name}" (ID: ${venue.id})...`);
        const approveRes = await fetch(`${BACKEND_URL}/api/admin/venue/${venue.id}/approve`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (approveRes.ok) {
          console.log(`Successfully approved "${venue.name}"`);
        } else {
          console.error(`Failed to approve "${venue.name}": ${approveRes.status}`);
        }
      }
    }

  } catch (error) {
    console.error("Error during admin approval flow:", error.message);
  }

  console.log("Finished admin approval script.");
}

approveVenues();
