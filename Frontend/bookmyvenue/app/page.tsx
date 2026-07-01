import { Banner } from "@/components/banner"
import { Filters } from "@/components/filters"
import { TopRatedVenues } from "@/components/topRatedVenues"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { VenueLister } from "@/components/venueLister"
import { IconBuilding, IconCakeRoll, IconHeart, IconHeartFilled } from "@tabler/icons-react"

export default function Page() {
  return (
    <div className="">
      <Navbar type="user"/>
      <div className="flex  min-w-0 flex-col gap-4 text-sm leading-loose">
        <Filters />
        <div className=" xl:px-0 w-full">
          <TopRatedVenues CarousalData={
            [
              "/1.png",
              "/2.png",
              "/3.png",

            ]
          } />
        </div>
        <div className="py-4 w-full md:max-w-7xl mx-auto md:px-5 px-2">
          <h1 className="font-heading font-bold text-2xl flex items-center gap-2"> <IconBuilding stroke={2} /> Recommanded Venues</h1>
          <VenueLister list={[
            {
              id: 1,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 2,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 3,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 4,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 5,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            }

          ]} />
        </div>
        <div className="py-4 w-full md:max-w-7xl mx-auto md:px-5 px-2">
          <Banner bgImage="/banner.png" />
        </div>
        <div className="py-4 w-full md:max-w-7xl mx-auto md:px-5 px-2">
          <h1 className="font-heading font-bold text-2xl flex items-center gap-2"> <IconCakeRoll stroke={2} /> Celebrating The Age</h1>
          <VenueLister list={[
            {
              id: 1,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 2,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 3,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 4,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 5,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            }

          ]} />
        </div>
        <div className="py-4 w-full md:max-w-7xl mx-auto md:px-5 px-2">
          <Banner bgImage="/banner3.png" />
        </div>
        <div className="py-4 w-full md:max-w-7xl mx-auto md:px-5 px-2">
          <h1 className="font-heading font-bold text-2xl flex items-center gap-2"> <IconHeartFilled stroke={2} className="text-pink-500" /> Start Your Love Life </h1>
          <VenueLister list={[
            {
              id: 1,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 2,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 3,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 4,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 5,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            }

          ]} />
        </div>
      </div>
    </div>
  )
}
