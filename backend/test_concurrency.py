import asyncio
import httpx
import time

API_URL = "http://localhost:8000/api/v1/venues"


async def book_venue(client: httpx.AsyncClient, venue_id: int, user_id: int):
    """Attempt to book a venue."""
    payload = {
        "venue_id": venue_id,
        "user_name": f"User_{user_id}",
        "event_date": "2026-10-31T20:00:00Z",
    }
    response = await client.post(f"{API_URL}/book", json=payload)
    return response.status_code, response.json()


async def main():
    print("Testing Concurrency...")

    async with httpx.AsyncClient() as client:
        # First create a venue
        print("Creating venue with capacity 1...")
        v_res = await client.post(
            f"{API_URL}/",
            json={"name": "The Great Hall", "location": "Downtown", "capacity": 1},
        )

        if v_res.status_code != 200:
            print("Failed to create venue:", v_res.json())
            return

        venue_id = v_res.json()["id"]
        print(f"Venue created with ID {venue_id}. Attempting 50 concurrent bookings...")

        # Fire 50 concurrent booking requests
        start_time = time.time()
        tasks = [book_venue(client, venue_id, i) for i in range(50)]
        results = await asyncio.gather(*tasks)

        successes = [r for r in results if r[0] == 200]
        failures = [r for r in results if r[0] != 200]

        print(f"\n--- Results in {time.time() - start_time:.2f}s ---")
        print(f"Successful bookings: {len(successes)}")
        print(f"Failed bookings: {len(failures)}")
        if failures:
            print(f"First failure reason: {failures[0][1]}")

        if len(successes) == 1:
            print("SUCCESS! Only exactly one booking went through due to row locking.")
        else:
            print(f"FAILURE: {len(successes)} bookings went through instead of 1.")


if __name__ == "__main__":
    asyncio.run(main())
