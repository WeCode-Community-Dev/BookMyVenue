import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class VenueNotificationsService {
    // A Subject is a built-in RxJS class that acts as both an emitter and a listener
    private readonly statusChange$ = new Subject<{ venueId: string; status: string; reviewNotes?: string }>();

    // Call this to trigger/emit the change
    emitStatusChange(venueId: string, status: string, reviewNotes?: string) {
        this.statusChange$.next({ venueId, status, reviewNotes });
    }

    // SSE controller endpoint will subscribe to this
    subscribeToVenue(venueId: string): Observable<any> {
        return this.statusChange$.asObservable().pipe(
            filter((event) => event.venueId === venueId)
        );
    }
}
