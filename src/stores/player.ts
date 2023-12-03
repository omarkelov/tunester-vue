import { deepmerge } from "deepmerge-ts";
import { defineStore } from 'pinia';

import { fetchRateTrack } from '../api/trackAPI';
import { handleFetching } from '../util/fetching';
import { Track, TrackDeepRating } from '../util/types';


const PLAYER_STORE_NAME = 'player';

let timerId: number;

type State = {
    track?: Track;
    isTrackBeingRated: boolean;
    audioElement?: HTMLAudioElement;
    isPlaying: boolean;
    time: number;
    volume: number;
}

export const usePlayerStore = defineStore({
    id: PLAYER_STORE_NAME,
    state: (): State => ({
        track: undefined,
        isTrackBeingRated: false,
        audioElement: undefined,
        isPlaying: false,
        time: 0,
        volume: 0.5,
    }),
    getters: {
        duration: state => state.track?.meta.duration || 0,
    },
    actions: {
        setTrack(track: Track) {
            this.stop();
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
        setAudioElement(audioElement: HTMLAudioElement | undefined) {
            this.stop();
            this.audioElement = audioElement;
            this.setVolume(this.volume);
        },
        toggle() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        play() {
            if (!this.audioElement || !this.track || this.isPlaying) {
                return;
            }

            this.isPlaying = true;
            this.audioElement.play();

            timerId = setInterval(() => {
                if (!this.audioElement || !this.track || !this.audioElement.duration) {
                    return;
                }

                this.time = this.audioElement.currentTime / this.audioElement.duration;
            }, 100);
        },
        pause() {
            if (!this.audioElement || !this.track || !this.isPlaying) {
                return;
            }

            this.isPlaying = false;
            this.audioElement.pause();
            clearInterval(timerId);
        },
        stop() {
            this.pause();
            this.seek(0);
        },
        replay() {
            this.play();
            this.seek(0);
        },
        seek(seconds: number) {
            if (!this.audioElement || !this.track) {
                return;
            }

            this.audioElement.currentTime = seconds * this.audioElement.duration;
            this.time = seconds;
        },
        setVolume(volume: number) {
            if (!this.audioElement) {
                return;
            }

            this.volume = volume;
            this.audioElement.volume = volume / 2;
        },
    },
});

const mergeRating = (track: Track, rating?: number) => {
    const deepRating: TrackDeepRating = { meta: { comment: { rating } } };

    return deepmerge(track, deepRating);
}
