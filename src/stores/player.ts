import { deepmerge } from "deepmerge-ts";
import { defineStore } from 'pinia';

import { SERVER_ADDRESS } from '../api/constants';
import { fetchGetNextDirectory, fetchGetPreviousDirectory } from '../api/directoryAPI';
import { fetchGetNextRandomTrack, fetchGetPreviousRandomTrack, fetchRateTrack } from '../api/trackAPI';
import { RepeatState } from '../components/icons/Repeat.vue';
import { ShuffleState } from '../components/icons/Shuffle.vue';
import { abortGroupControllers, createAbortController, removeAbortController } from '../util/aborting';
import { rotate, shuffle, shuffleWithSeed } from '../util/arrays';
import { handleFetching } from '../util/fetching';
import { getRandomInt } from '../util/numbers';
import { Directory, Playlist, Track, TrackDeepRating } from '../util/types';


const PLAYER_STORE_NAME = 'player';

let timerId: number;

type ShuffleIndexes = {
    shuffled: {
        indexes: number[];
        idx: number;
    };
}

type GlobalRandomTrack = {
    seed: number;
    isTrackBeingFetched: boolean;
    track?: Track;
}

type State = {
    playlist?: Playlist & ShuffleIndexes & {
        isPlaylistBeingFetched: boolean;
    };
    globalRandomTrack: GlobalRandomTrack;
    isTrackBeingRated: boolean;
    audioElement?: HTMLAudioElement;
    isPlaying: boolean;
    time: number;
    shuffleState: ShuffleState;
    repeatState: RepeatState;
    volume: number;
}

export const usePlayerStore = defineStore({
    id: PLAYER_STORE_NAME,
    state: (): State => ({
        playlist: undefined,
        globalRandomTrack: {
            // seed: getRandomInt(0, 1_000_000),
            seed: 1, // TODO: Switch to "getRandomInt" after testing
            isTrackBeingFetched: false,
            track: undefined,
        },
        isTrackBeingRated: false,
        audioElement: undefined,
        isPlaying: false,
        time: 0,
        shuffleState: ShuffleState.NO,
        repeatState: RepeatState.NO,
        volume: 0.5,
    }),
    getters: {
        track: state => state.globalRandomTrack.track ?? state.playlist?.tracks[state.playlist.idx],
        duration(): number {
            return this.track?.meta.duration ?? 0;
        },
    },
    actions: {
        setPlaylist(playlist: Playlist) {
            if (this.playlist?.tracks === playlist.tracks && this.playlist.idx === playlist.idx) {
                this.globalRandomTrack.track = undefined;
                return;
            }

            this.stop();

            if (this.playlist?.tracks === playlist.tracks) {
                this.playlist.idx = playlist.idx;
            } else {
                // TODO: Switch to "shuffle" after testing
                // const shuffledIndexes = shuffle([...Array(playlist.tracks.length)].map((_, idx) => idx));
                const shuffledIndexes = shuffleWithSeed([...Array(playlist.tracks.length)].map((_, idx) => idx), 1);

                this.playlist = {
                    ...playlist,
                    shuffled: {
                        indexes: shuffledIndexes,
                        idx: 0,
                    },
                    isPlaylistBeingFetched: false,
                };
            }

            if (this.shuffleState === ShuffleState.SHUFFLE_DIRECTORY) {
                this.syncShuffledIndexes();
            }

            this.globalRandomTrack.track = undefined;

            this.play();
        },
        syncShuffledIndexes() {
            if (!this.playlist) {
                return;
            }

            const idxShift = this.playlist.shuffled.indexes.findIndex(si => si === this.playlist!.idx);

            this.playlist.shuffled = {
                indexes: rotate(this.playlist.shuffled.indexes, -idxShift),
                idx: 0,
            };
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

                if (!this.audioElement.ended) {
                    this.time = this.audioElement.currentTime / this.audioElement.duration;
                    return;
                }

                if (this.repeatState === RepeatState.SINGLE) {
                    this.seek(0);
                    this.audioElement.play();
                } else {
                    this.playNext();
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
            if (this.shuffleState === ShuffleState.SHUFFLE_GLOBALLY) {
                this.playGlobalRandom(false);
                return;
            }

            if (!this.playlist) {
                return;
            }

            let previousIdx: number;

            if (this.shuffleState === ShuffleState.NO) {
                previousIdx = this.playlist.idx - 1;

                if (previousIdx < 0) {
                    if (this.repeatState === RepeatState.NO) {
                        this.setAdjacentPlaylist(false);
                        return;
                    }

                    // RepeatState.CYCLE
                    previousIdx = this.playlist.tracks.length - 1;
                }
            } else { // ShuffleState.SHUFFLE_DIRECTORY
                let shuffledIndexesIdx = this.playlist.shuffled.idx - 1;

                if (shuffledIndexesIdx < 0) {
                    if (this.repeatState === RepeatState.NO) {
                        this.setAdjacentPlaylist(false);
                        return;
                    }

                    // RepeatState.CYCLE
                    shuffledIndexesIdx = this.playlist.shuffled.indexes.length - 1;
                }

                this.playlist.shuffled.idx = shuffledIndexesIdx;
                previousIdx = this.playlist.shuffled.indexes[shuffledIndexesIdx];
            }

            this.stop();
            this.globalRandomTrack.track = undefined;
            this.playlist.idx = previousIdx;
            this.play();
        },
        playNext() {
            if (this.shuffleState === ShuffleState.SHUFFLE_GLOBALLY) {
                this.playGlobalRandom(true);
                return;
            }

            if (!this.playlist) {
                return;
            }

            let nextIdx: number;

            if (this.shuffleState === ShuffleState.NO) {
                nextIdx = this.playlist.idx + 1;

                if (nextIdx >= this.playlist.tracks.length) {
                    if (this.repeatState === RepeatState.NO) {
                        this.setAdjacentPlaylist(true);
                        return;
                    }

                    // RepeatState.CYCLE
                    nextIdx = 0;
                }
            } else { // ShuffleState.SHUFFLE_DIRECTORY
                let shuffledIndexesIdx = this.playlist.shuffled.idx + 1;

                if (shuffledIndexesIdx >= this.playlist.shuffled.indexes.length) {
                    if (this.repeatState === RepeatState.NO) {
                        this.setAdjacentPlaylist(true);
                        return;
                    }

                    // RepeatState.CYCLE
                    shuffledIndexesIdx = 0;
                }

                this.playlist.shuffled.idx = shuffledIndexesIdx;
                nextIdx = this.playlist.shuffled.indexes[shuffledIndexesIdx];
            }

            this.stop();
            this.globalRandomTrack.track = undefined;
            this.playlist.idx = nextIdx;
            this.play();
        },
        async playGlobalRandom(isNext: boolean) {
            if (!this.track) {
                return;
            }

            this.stop();

            this.globalRandomTrack.isTrackBeingFetched = true;

            const trackPath = this.track.path;
            const abortController = createAbortController(PLAYER_STORE_NAME);
            const { result: newTrack, error } = await handleFetching<Track>(
                (signal: AbortSignal) => (
                    isNext ? fetchGetNextRandomTrack : fetchGetPreviousRandomTrack
                )(trackPath, 0, this.globalRandomTrack.seed, signal), // TODO: rating
                abortController.signal,
            );

            this.globalRandomTrack.isTrackBeingFetched = false;
            removeAbortController(PLAYER_STORE_NAME, abortController);

            if (error || !newTrack) {
                console.log(error || 'No track');
                return;
            }

            this.globalRandomTrack.track = newTrack;

            this.play();
        },
        async setAdjacentPlaylist(isNext: boolean) {
            if (!this.playlist) {
                return;
            }

            this.stop();

            this.playlist.isPlaylistBeingFetched = true;

            const directoryPath = this.playlist.path;
            const abortController = createAbortController(PLAYER_STORE_NAME);
            const { result: newDirectory, error } = await handleFetching<Directory>(
                (signal: AbortSignal) => (
                    isNext ? fetchGetNextDirectory : fetchGetPreviousDirectory
                )(directoryPath, 0, signal), // TODO: rating
                abortController.signal,
            );

            this.playlist.isPlaylistBeingFetched = false;
            removeAbortController(PLAYER_STORE_NAME, abortController);

            if (error || !newDirectory?.tracks.length) {
                console.log(error || 'No tracks');
                return;
            }

            this.setPlaylist({
                path: newDirectory.path,
                tracks: newDirectory.tracks,
                idx: isNext ? 0 : newDirectory.tracks.length - 1,
            });
        },
        switchShuffleState() {
            switch (this.shuffleState) {
                case ShuffleState.NO:
                    this.shuffleState = ShuffleState.SHUFFLE_DIRECTORY;
                    this.syncShuffledIndexes();
                    break;
                case ShuffleState.SHUFFLE_DIRECTORY:
                    this.shuffleState = ShuffleState.SHUFFLE_GLOBALLY;
                    break;
                case ShuffleState.SHUFFLE_GLOBALLY:
                    this.shuffleState = ShuffleState.NO;
                    break;
            }
        },
        switchRepeatState() {
            switch (this.repeatState) {
                case RepeatState.NO:
                    this.repeatState = RepeatState.CYCLE;
                    break;
                case RepeatState.CYCLE:
                    this.repeatState = RepeatState.SINGLE;
                    break;
                case RepeatState.SINGLE:
                    this.repeatState = RepeatState.NO;
                    break;
            }
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
