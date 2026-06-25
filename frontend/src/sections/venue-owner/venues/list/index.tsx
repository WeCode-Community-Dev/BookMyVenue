import { VenueApiService } from "src/api/venue";

import { Label } from "src/components/label";
import { DataTable } from "src/components/data-table";


export function ListVenues() {


    return (
        <DataTable
            dataKey='venues-for-owners-list'
            fetchData={VenueApiService.listMyVenues}
            title='My Venues'
            addBtn={{
                title: 'Add Venue',
                url: '/owner/venues/create'
            }}
            headings={[
                {
                    id: 'name',
                    label: 'Name',
                    component(data) {
                        return (
                            <>
                                <img style={{ borderRadius: '5px', marginRight: '5px' }} src={data.images?.[0]} alt={data.title} width={100} height={60} />
                                <>{data.title}</>
                            </>
                        )
                    },
                },
                {
                    id: 'venueType',
                    label: 'Venue Type',
                    component(data) {
                        return <>{data.venueType}</>
                    },
                },
                {
                    id: 'address',
                    label: 'Address',
                    component(data) {
                        return <>{data.addressLine1}</>
                    },
                },
                {
                    id: 'status',
                    label: "Status",
                    component(data) {
                        return <Label color={(data.status === 'REJECTED' && 'error') || 'success'}>
                            {data.status}
                        </Label>
                    },
                },
            ]}
        />
    )
}