const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:8080';

// List of 5 owners and their corresponding venues
const demoOwners = [
  {
    fullName: "Arthur Pendragon",
    email: "arthur@bookmyvenue.com",
    password: "ownerPassword123!",
    phone: "+1 (555) 101-0001",
    venue: {
      name: "Camelot Royal Conference Hall V2",
      description: "A prestigious and grand round-table boardroom equipped with high-end acoustics, wireless presentation displays, and premium seating. Ideal for executive councils, corporate board meetings, and high-profile strategic planning.",
      address: "100 Roundtable Blvd",
      city: "San Francisco",
      venueType: "CONFERENCE",
      parking: true,
      seatingCapacity: 28,
      amenities: ["WIFI", "AC", "PROJECTOR"],
      pricePerHour: "120",
      maxAdvanceBookingDays: 60,
      rules: {
        durationType: "HOURLY",
        durationHour: 2,
        weekStartDay: "MONDAY",
        weekEndDay: "FRIDAY",
        operatingStartTime: "08:00",
        operatingEndTime: "20:00",
        weekdayDayRate: 120,
        weekdayNightRate: 150,
        weekendDayRate: 180,
        weekendNightRate: 220
      }
    }
  },
  {
    fullName: "Bruce Wayne",
    email: "bruce@bookmyvenue.com",
    password: "ownerPassword123!",
    phone: "+1 (555) 101-0002",
    venue: {
      name: "Gotham Skyline Rooftop Lounge V2",
      description: "A luxurious and private open-air rooftop with breathtaking, unobstructed views of the city skyline. Features designer lounge seating, outdoor heating firepits, and a fully equipped cocktail bar setup for corporate socials and private events.",
      address: "1007 Mountain Drive",
      city: "New York",
      venueType: "ROOFTOP",
      parking: true,
      seatingCapacity: 120,
      amenities: ["WIFI", "AC"],
      pricePerHour: "350",
      maxAdvanceBookingDays: 90,
      rules: {
        durationType: "FULL_DAY",
        durationHour: null,
        weekStartDay: "THURSDAY",
        weekEndDay: "SUNDAY",
        operatingStartTime: "17:00",
        operatingEndTime: "23:59",
        weekdayDayRate: 300,
        weekdayNightRate: 350,
        weekendDayRate: 450,
        weekendNightRate: 500
      }
    }
  },
  {
    fullName: "Charles Xavier",
    email: "charles@bookmyvenue.com",
    password: "ownerPassword123!",
    phone: "+1 (555) 101-0003",
    venue: {
      name: "Cerebro Collaborative Coworking Space V2",
      description: "A state-of-the-art interactive coworking studio featuring modular workspaces, private booths, ultra-fast fiber connection, and continuous coffee/refreshments for teams seeking high focus and collaboration.",
      address: "1407 Graymalkin Lane",
      city: "Austin",
      venueType: "COWORKING",
      parking: true,
      seatingCapacity: 75,
      amenities: ["WIFI", "AC", "PROJECTOR"],
      pricePerHour: "85",
      maxAdvanceBookingDays: 45,
      rules: {
        durationType: "HOURLY",
        durationHour: 1,
        weekStartDay: "MONDAY",
        weekEndDay: "FRIDAY",
        operatingStartTime: "09:00",
        operatingEndTime: "18:00",
        weekdayDayRate: 85,
        weekdayNightRate: 100,
        weekendDayRate: 120,
        weekendNightRate: 140
      }
    }
  },
  {
    fullName: "Diana Prince",
    email: "diana@bookmyvenue.com",
    password: "ownerPassword123!",
    phone: "+1 (555) 101-0004",
    venue: {
      name: "Themyscira Botanical Garden Oasis V2",
      description: "A lush, romantic, and beautifully landscaped outdoor botanical garden filled with exotic flowers, water fountains, and rustic pergolas. Perfect for wedding receptions, photography sessions, and elegant afternoon tea gatherings.",
      address: "777 Gateway Road",
      city: "Miami",
      venueType: "GARDEN",
      parking: false,
      seatingCapacity: 150,
      amenities: ["WIFI"],
      pricePerHour: "200",
      maxAdvanceBookingDays: 120,
      rules: {
        durationType: "FULL_DAY",
        durationHour: null,
        weekStartDay: "SUNDAY",
        weekEndDay: "SATURDAY",
        operatingStartTime: "08:00",
        operatingEndTime: "18:00",
        weekdayDayRate: 180,
        weekdayNightRate: 200,
        weekendDayRate: 250,
        weekendNightRate: 300
      }
    }
  },
  {
    fullName: "Elena Rostova",
    email: "elena@bookmyvenue.com",
    password: "ownerPassword123!",
    phone: "+1 (555) 101-0005",
    venue: {
      name: "Lumina High-Key Photography Studio V2",
      description: "A fully equipped professional blackout and daylight studio designed for fashion shoots, commercials, and video productions. Features a multi-color seamless backdrop system, strobe lighting grids, and dedicated changing rooms.",
      address: "450 Production Row",
      city: "Los Angeles",
      venueType: "STUDIO",
      parking: true,
      seatingCapacity: 20,
      amenities: ["WIFI", "AC"],
      pricePerHour: "65",
      maxAdvanceBookingDays: 30,
      rules: {
        durationType: "HOURLY",
        durationHour: 2,
        weekStartDay: "MONDAY",
        weekEndDay: "SATURDAY",
        operatingStartTime: "08:00",
        operatingEndTime: "21:00",
        weekdayDayRate: 65,
        weekdayNightRate: 80,
        weekendDayRate: 90,
        weekendNightRate: 110
      }
    }
  }
];

async function createDemoData() {
  console.log("Starting demo data seeding script...");
  
  // Create dummy image file for upload
  const dummyImagePath = path.join(__dirname, 'dummy_venue.jpg');
  fs.writeFileSync(dummyImagePath, 'dummy-image-binary-content-data-here-12345');
  
  for (const owner of demoOwners) {
    try {
      console.log(`\n----------------------------------------`);
      console.log(`Processing Owner: ${owner.fullName} (${owner.email})`);
      
      // 1. Register Owner
      const registerRes = await fetch(`${BACKEND_URL}/owner/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: owner.fullName,
          email: owner.email,
          password: owner.password,
          phone: owner.phone
        })
      });
      
      const regText = await registerRes.text();
      console.log(`Registration Response: ${registerRes.status} - ${regText}`);
      
      // 2. Login Owner
      const loginRes = await fetch(`${BACKEND_URL}/owner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: owner.email,
          password: owner.password
        })
      });
      
      if (!loginRes.ok) {
        throw new Error(`Login failed for ${owner.email}`);
      }
      
      const loginData = await loginRes.json();
      const token = loginData.token;
      console.log(`Login Successful. JWT Token acquired.`);
      
      // 3. Create Venue
      const requestPayload = {
        name: owner.venue.name,
        description: owner.venue.description,
        address: owner.venue.address,
        city: owner.venue.city,
        venueType: owner.venue.venueType,
        parking: owner.venue.parking,
        seatingCapacity: owner.venue.seatingCapacity,
        amenities: owner.venue.amenities,
        pricePerHour: owner.venue.pricePerHour,
        maxAdvanceBookingDays: owner.venue.maxAdvanceBookingDays,
        venueAvailabilityRulesRequest: {
          durationType: owner.venue.rules.durationType,
          durationHour: owner.venue.rules.durationHour,
          weekStartDay: owner.venue.rules.weekStartDay,
          weekEndDay: owner.venue.rules.weekEndDay,
          operatingStartTime: owner.venue.rules.operatingStartTime,
          operatingEndTime: owner.venue.rules.operatingEndTime,
          weekdayDayRate: owner.venue.rules.weekdayDayRate,
          weekdayNightRate: owner.venue.rules.weekdayNightRate,
          weekendDayRate: owner.venue.rules.weekendDayRate,
          weekendNightRate: owner.venue.rules.weekendNightRate
        }
      };
      
      // Construct Multipart Form Data
      const formData = new global.FormData();
      formData.append(
        "request",
        new global.Blob([JSON.stringify(requestPayload)], { type: "application/json" })
      );
      
      // Add fake image file
      const fileBuffer = fs.readFileSync(dummyImagePath);
      const imageBlob = new global.Blob([fileBuffer], { type: "image/jpeg" });
      formData.append("images", imageBlob, "venue.jpg");
      
      const venueRes = await fetch(`${BACKEND_URL}/api/owner/venue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const venueText = await venueRes.text();
      console.log(`Create Venue Response: ${venueRes.status}`);
      if (venueRes.ok) {
        console.log(`Success: Created "${owner.venue.name}" for host "${owner.fullName}"`);
      } else {
        console.error(`Error details: ${venueText}`);
      }
    } catch (err) {
      console.error(`Failed to process owner ${owner.fullName}:`, err.message);
    }
  }
  
  // Cleanup dummy image
  try {
    fs.unlinkSync(dummyImagePath);
  } catch (e) {}
  
  console.log("\nFinished seeding demo data.");
}

createDemoData();
