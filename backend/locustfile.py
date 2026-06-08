from locust import HttpUser, task, between


class BookMyVenueUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def list_venues(self):
        self.client.get("/api/v1/venues/")

    @task(3)
    def read_root(self):
        self.client.get("/")
