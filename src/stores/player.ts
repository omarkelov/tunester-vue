import { deepmerge } from "deepmerge-ts";
import { defineStore } from 'pinia';

import { SERVER_ADDRESS } from '../api/constants';
import { fetchRateTrack } from '../api/trackAPI';
import { abortGroupControllers, createAbortController, removeAbortController } from '../util/aborting';
import { handleFetching } from '../util/fetching';
import { Playlist, Track, TrackDeepRating } from '../util/types';


const PLAYER_STORE_NAME = 'player';

let timerId: number;

type State = {
    playlist?: Playlist;
    isTrackBeingRated: boolean;
    audioElement?: HTMLAudioElement;
    isPlaying: boolean;
    time: number;
    volume: number;
}

export const usePlayerStore = defineStore({
    id: PLAYER_STORE_NAME,
    state: (): State => ({
        playlist: undefined,
        isTrackBeingRated: false,
        audioElement: undefined,
        isPlaying: false,
        time: 0,
        volume: 0.5,
    }),
    getters: {
        track: state => state.playlist?.tracks[state.playlist.idx],
        duration(): number {
            return this.track?.meta.duration ?? 0;
        },
    },
    actions: {
        setPlaylist(playlist: Playlist) {
            if (this.playlist?.tracks === playlist.tracks && this.playlist.idx === playlist.idx) {
                return;
            }

            this.stop();

            if (this.playlist?.tracks === playlist.tracks) {
                this.playlist.idx = playlist.idx;
            } else {
                this.playlist = playlist;
            }

            this.play();
        },
        async rateTrack(rating: number) {
            if (!this.playlist || !this.track) {
                return;
            }

            const currentRating = this.track.meta.comment?.rating;

            if (currentRating === rating) {
                return;
            }

            this.isTrackBeingRated = true;
            this.playlist.tracks[this.playlist.idx] = mergeRating(this.track, rating);

            const trackPath = this.track.path;
            const abortController = createAbortController(PLAYER_STORE_NAME);
            const { error } = await handleFetching(
                (signal: AbortSignal) => fetchRateTrack(trackPath, rating, signal),
                abortController.signal,
            );

            if (error) {
                console.log(error);
                this.playlist.tracks[this.playlist.idx] = mergeRating(this.track, currentRating);
                this.isTrackBeingRated = false;
                return;
            }

            removeAbortController(PLAYER_STORE_NAME, abortController);
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
            if (!this.audioElement || !this.playlist || !this.track || this.isPlaying) {
                return;
            }

            const trackSrc = encodeURI(`${SERVER_ADDRESS}/api/track/${this.track.path}`);

            if (this.audioElement.src !== trackSrc) {
                this.audioElement.src = trackSrc;
            }

            this.audioElement.play();
            this.isPlaying = true;

            timerId = setInterval(() => {
                if (!this.audioElement || !this.playlist || !this.audioElement.duration) {
                    return;
                }

                if (this.audioElement.ended) {
                    this.playNext();
                } else {
                    this.time = this.audioElement.currentTime / this.audioElement.duration;
                }
            }, 100);
        },
        pause() {
            if (!this.audioElement || !this.playlist || !this.isPlaying) {
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
            if (!this.audioElement || !this.playlist) {
                return;
            }

            this.audioElement.currentTime = seconds * this.audioElement.duration;
            this.time = seconds;
        },
        playPrevious() {
            if (!this.playlist) {
                return;
            }

            let previousIdx = this.playlist.idx - 1;

            if (previousIdx < 0) {
                previousIdx = this.playlist.tracks.length - 1;
            }

            this.stop();
            this.playlist.idx = previousIdx;
            this.play();
        },
        playNext() {
            if (!this.playlist) {
                return;
            }

            let nextIdx = this.playlist.idx + 1;

            if (nextIdx >= this.playlist.tracks.length) {
                nextIdx = 0;
            }

            this.stop();
            this.playlist.idx = nextIdx;
            this.play();
        },
        setVolume(volume: number) {
            if (!this.audioElement) {
                return;
            }

            this.volume = volume;
            this.audioElement.volume = volume / 2;
        },
        dispose() {
            this.stop();
            abortGroupControllers(PLAYER_STORE_NAME);
        },
    },
});

const mergeRating = (track: Track, rating?: number) => {
    const deepRating: TrackDeepRating = { meta: { comment: { rating } } };

    return deepmerge(track, deepRating);
}
