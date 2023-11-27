import { defineStore } from 'pinia';

import { fetchRateTrack } from '../api/trackAPI';
import { useFetching } from '../hooks/useFetching';
import { Track, TrackDeepRating } from '../util/types';


type State = {
    track?: Track;
    isTrackBeingRated: boolean;
}

export const usePlayerStore = defineStore({
    id: 'player',
    state: (): State => ({
        track: undefined,
        isTrackBeingRated: false,
    }),
    actions: {
        setTrack(track: Track) {
            this.track = track;
        },
        async rateTrack(rating: number, signal: AbortSignal) {
            if (!this.track) {
                return;
            }

            const currentRating = this.track.meta.comment?.rating;

            if (currentRating === rating) {
                return;
            }

            this.isTrackBeingRated = true;
            Object.assign(this.track, { meta: { comment: { rating } } } as TrackDeepRating);

            const trackPath = this.track.path;
            const { error } = await useFetching(
                (signal: AbortSignal) => fetchRateTrack(trackPath, rating, signal),
                signal,
            );

            if (error) {
                console.log(error);
                Object.assign(this.track, { meta: { comment: { currentRating } } } as TrackDeepRating);
                this.isTrackBeingRated = false;
                return;
            }

            this.isTrackBeingRated = false;
        },
    },
});
