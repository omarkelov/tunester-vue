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
    trackMeta: TrackMeta;
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
    trackMetaComment?: TrackMetaComment;
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
