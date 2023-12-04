import { DeepPick } from 'ts-deep-pick';


export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export type User = {
    username: string;
    role: UserRole;
}

export type Credentials = {
    login: string;
    password: string;
}

export type Directory = {
    path: string;
    lastUpdated: string;
    size: number;
    directories: Directory[];
    tracks: Track[];
}

export type Track = {
    path: string;
    lastUpdated: string;
    meta: TrackMeta;
}

export type TrackMeta = {
    filename?: string;
    size?: number;
    bitRate?: number;
    duration?: number;
    artist?: string;
    title?: string;
    album?: string;
    genre?: string;
    track?: number;
    date?: string;
    comment?: TrackMetaComment;
}

export type TrackMetaComment = {
    version?: number;
    rating?: number;
    cut?: TrackMetaCommentCut;
}

export type TrackMetaCommentCut = {
    originalDuration?: number;
    start?: number;
    end?: number;
}

export type TrackDeepRating = DeepPick<Track, 'meta.comment.rating'>;

export type Playlist = {
    tracks: Track[];
    idx: number;
}
