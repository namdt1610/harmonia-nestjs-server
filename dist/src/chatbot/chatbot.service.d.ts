import { Model } from 'mongoose';
import { Track } from '../schemas/track.schema';
import { Artist } from '../schemas/artist.schema';
import { Album } from '../schemas/album.schema';
import { Genre } from '../schemas/genre.schema';
import { Playlist } from '../schemas/playlist.schema';
export interface ChatMessage {
    id: string;
    userId: string;
    message: string;
    response: string;
    timestamp: Date;
    intent?: string;
    confidence?: number;
}
export interface ChatContext {
    userId: string;
    lastQuery?: string;
    preferences?: {
        genres: string[];
        artists: string[];
        mood?: string;
    };
    conversation: ChatMessage[];
}
export declare class ChatbotService {
    private trackModel;
    private artistModel;
    private albumModel;
    private genreModel;
    private playlistModel;
    private readonly logger;
    private chatContexts;
    constructor(trackModel: Model<Track>, artistModel: Model<Artist>, albumModel: Model<Album>, genreModel: Model<Genre>, playlistModel: Model<Playlist>);
    sendMessage(userId: string, message: string): Promise<ChatMessage>;
    private getOrCreateContext;
    private detectIntent;
    private handleMusicRecommendation;
    private handleArtistSearch;
    private handleSongSearch;
    private handleAlbumSearch;
    private handleMoodMusic;
    private handlePopularMusic;
    private handleNewReleases;
    private handleGenreMusic;
    private handlePlaylistHelp;
    private handleAppHelp;
    private handleGreeting;
    private handleGeneralQuery;
    private extractSearchTerm;
    private formatMusicRecommendations;
    getChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;
    clearChatHistory(userId: string): Promise<boolean>;
    getUserPreferences(userId: string): any;
}
