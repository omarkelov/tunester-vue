import { defineStore } from 'pinia';
import { deepmerge } from "deepmerge-ts";

import { fetchRateTrack } from '../api/trackAPI';
import { handleFetching } from '../util/fetching';
import { Track, TrackDeepRating } from '../util/types';


type State = {
    track?: Track;
    isTrackBeingRated: boolean;
}

const mergeRating = (track: Track, rating?: number) => {
    const deepRating: TrackDeepRating = { meta: { comment: { rating } } };

    return deepmerge(track, deepRating);
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
            this.track = mergeRating(this.track, rating);

            const trackPath = this.track.path;
            const { error } = await handleFetching(
                (signal: AbortSignal) => fetchRateTrack(trackPath, rating, signal),
                signal,
            );

            if (error) {
                console.log(error);
                this.track = mergeRating(this.track, currentRating);
                this.isTrackBeingRated = false;
                return;
            }

            this.isTrackBeingRated = false;
        },
    },
});
