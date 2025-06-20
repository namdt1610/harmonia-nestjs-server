"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatbotService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const track_schema_1 = require("../schemas/track.schema");
const artist_schema_1 = require("../schemas/artist.schema");
const album_schema_1 = require("../schemas/album.schema");
const genre_schema_1 = require("../schemas/genre.schema");
const playlist_schema_1 = require("../schemas/playlist.schema");
let ChatbotService = ChatbotService_1 = class ChatbotService {
    trackModel;
    artistModel;
    albumModel;
    genreModel;
    playlistModel;
    logger = new common_1.Logger(ChatbotService_1.name);
    chatContexts = new Map();
    constructor(trackModel, artistModel, albumModel, genreModel, playlistModel) {
        this.trackModel = trackModel;
        this.artistModel = artistModel;
        this.albumModel = albumModel;
        this.genreModel = genreModel;
        this.playlistModel = playlistModel;
    }
    async sendMessage(userId, message) {
        const context = this.getOrCreateContext(userId);
        const intent = this.detectIntent(message);
        let response;
        let confidence = 1.0;
        try {
            switch (intent) {
                case 'recommend_music':
                    response = await this.handleMusicRecommendation(message, context);
                    break;
                case 'search_artist':
                    response = await this.handleArtistSearch(message);
                    break;
                case 'search_song':
                    response = await this.handleSongSearch(message);
                    break;
                case 'search_album':
                    response = await this.handleAlbumSearch(message);
                    break;
                case 'mood_music':
                    response = await this.handleMoodMusic(message, context);
                    break;
                case 'popular_music':
                    response = await this.handlePopularMusic();
                    break;
                case 'new_releases':
                    response = await this.handleNewReleases();
                    break;
                case 'genre_music':
                    response = await this.handleGenreMusic(message);
                    break;
                case 'playlist_help':
                    response = await this.handlePlaylistHelp(message);
                    break;
                case 'app_help':
                    response = this.handleAppHelp(message);
                    break;
                case 'greeting':
                    response = this.handleGreeting();
                    break;
                default:
                    response = await this.handleGeneralQuery(message);
                    confidence = 0.5;
            }
        }
        catch (error) {
            this.logger.error(`Error processing message for user ${userId}:`, error);
            response =
                "I'm sorry, I encountered an error while processing your request. Please try again.";
            confidence = 0.1;
        }
        const chatMessage = {
            id: Date.now().toString(),
            userId,
            message,
            response,
            timestamp: new Date(),
            intent,
            confidence,
        };
        context.conversation.push(chatMessage);
        context.lastQuery = message;
        if (context.conversation.length > 20) {
            context.conversation = context.conversation.slice(-20);
        }
        this.chatContexts.set(userId, context);
        this.logger.log(`Chatbot response for user ${userId}: ${intent} (confidence: ${confidence})`);
        return chatMessage;
    }
    getOrCreateContext(userId) {
        let context = this.chatContexts.get(userId);
        if (!context) {
            context = {
                userId,
                conversation: [],
                preferences: {
                    genres: [],
                    artists: [],
                },
            };
            this.chatContexts.set(userId, context);
        }
        return context;
    }
    detectIntent(message) {
        const lowerMessage = message.toLowerCase();
        if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(lowerMessage)) {
            return 'greeting';
        }
        if (/recommend|suggest|similar|like/.test(lowerMessage) &&
            /music|song|track/.test(lowerMessage)) {
            return 'recommend_music';
        }
        if (/(find|search|look for|show me) .*(artist|singer|band)/.test(lowerMessage)) {
            return 'search_artist';
        }
        if (/(find|search|look for|show me) .*(song|track|music)/.test(lowerMessage)) {
            return 'search_song';
        }
        if (/(find|search|look for|show me) .*(album|record)/.test(lowerMessage)) {
            return 'search_album';
        }
        if (/(mood|feeling|emotion)/.test(lowerMessage) ||
            /(happy|sad|angry|excited|calm|relaxed|energetic|romantic)/.test(lowerMessage)) {
            return 'mood_music';
        }
        if (/(popular|trending|top|hit|chart)/.test(lowerMessage)) {
            return 'popular_music';
        }
        if (/(new|latest|recent|fresh) .*(release|music|song|album)/.test(lowerMessage)) {
            return 'new_releases';
        }
        if (/(genre|style|type) .*(music|song)/.test(lowerMessage) ||
            /(rock|pop|jazz|classical|electronic|hip.hop|country|blues)/.test(lowerMessage)) {
            return 'genre_music';
        }
        if (/(playlist|queue)/.test(lowerMessage) &&
            /(create|make|help|how)/.test(lowerMessage)) {
            return 'playlist_help';
        }
        if (/(help|how|guide|tutorial)/.test(lowerMessage)) {
            return 'app_help';
        }
        return 'general';
    }
    async handleMusicRecommendation(message, context) {
        const genres = await this.genreModel.find({});
        const artists = await this.artistModel.find({}).limit(50);
        let recommendedTracks = [];
        const mentionedGenres = genres.filter((genre) => message.toLowerCase().includes(genre.name.toLowerCase()));
        const mentionedArtists = artists.filter((artist) => message.toLowerCase().includes(artist.name.toLowerCase()));
        if (mentionedGenres.length > 0) {
            recommendedTracks = await this.trackModel
                .find({ genre: { $in: mentionedGenres.map((g) => g._id) } })
                .populate('artist album genre')
                .limit(5)
                .sort({ playCount: -1 });
            const genreNames = mentionedGenres.map((g) => g.name).join(', ');
            return this.formatMusicRecommendations(recommendedTracks, `Based on your interest in ${genreNames}, here are some recommendations:`);
        }
        if (mentionedArtists.length > 0) {
            const artist = mentionedArtists[0];
            recommendedTracks = await this.trackModel
                .find({ artist: artist._id })
                .populate('artist album genre')
                .limit(5)
                .sort({ playCount: -1 });
            return this.formatMusicRecommendations(recommendedTracks, `Here are some popular tracks by ${artist.name}:`);
        }
        recommendedTracks = await this.trackModel
            .find({})
            .populate('artist album genre')
            .limit(5)
            .sort({ playCount: -1 });
        return this.formatMusicRecommendations(recommendedTracks, 'Here are some popular tracks you might enjoy:');
    }
    async handleArtistSearch(message) {
        const searchTerm = this.extractSearchTerm(message, [
            'artist',
            'band',
            'singer',
        ]);
        if (!searchTerm) {
            return "Please specify which artist you're looking for. For example: 'Find artist Taylor Swift'";
        }
        const artists = await this.artistModel
            .find({ name: new RegExp(searchTerm, 'i') })
            .limit(5);
        if (artists.length === 0) {
            return `I couldn't find any artists matching "${searchTerm}". Try different spelling or keywords.`;
        }
        const artistList = artists.map((artist) => `• ${artist.name}`).join('\n');
        return `I found these artists:\n${artistList}\n\nWould you like me to recommend some of their popular tracks?`;
    }
    async handleSongSearch(message) {
        const searchTerm = this.extractSearchTerm(message, [
            'song',
            'track',
            'music',
        ]);
        if (!searchTerm) {
            return "Please specify which song you're looking for. For example: 'Find song Bohemian Rhapsody'";
        }
        const tracks = await this.trackModel
            .find({ title: new RegExp(searchTerm, 'i') })
            .populate('artist album')
            .limit(5);
        if (tracks.length === 0) {
            return `I couldn't find any songs matching "${searchTerm}". Try different spelling or keywords.`;
        }
        return this.formatMusicRecommendations(tracks, `I found these songs matching "${searchTerm}":`);
    }
    async handleAlbumSearch(message) {
        const searchTerm = this.extractSearchTerm(message, ['album', 'record']);
        if (!searchTerm) {
            return "Please specify which album you're looking for. For example: 'Find album Dark Side of the Moon'";
        }
        const albums = await this.albumModel
            .find({ title: new RegExp(searchTerm, 'i') })
            .populate('artist')
            .limit(5);
        if (albums.length === 0) {
            return `I couldn't find any albums matching "${searchTerm}". Try different spelling or keywords.`;
        }
        const albumList = albums
            .map((album) => {
            const artistName = album.artist?.name || 'Unknown';
            return `• ${album.title} by ${artistName} (${album.releaseDate?.getFullYear() || 'Unknown year'})`;
        })
            .join('\n');
        return `I found these albums:\n${albumList}\n\nWould you like me to show you tracks from any of these albums?`;
    }
    async handleMoodMusic(message, context) {
        const moodKeywords = {
            happy: ['happy', 'joyful', 'cheerful', 'upbeat', 'positive'],
            sad: ['sad', 'melancholy', 'depressed', 'blue', 'down'],
            energetic: ['energetic', 'pumped', 'excited', 'hyped', 'active'],
            calm: ['calm', 'peaceful', 'relaxed', 'chill', 'tranquil'],
            romantic: ['romantic', 'love', 'intimate', 'tender', 'passionate'],
            angry: ['angry', 'mad', 'furious', 'rage', 'aggressive'],
        };
        let detectedMood = 'happy';
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            if (keywords.some((keyword) => message.toLowerCase().includes(keyword))) {
                detectedMood = mood;
                break;
            }
        }
        const tracks = await this.trackModel
            .find({})
            .populate('artist album genre')
            .limit(5)
            .sort({ playCount: -1 });
        context.preferences = context.preferences || { genres: [], artists: [] };
        context.preferences.mood = detectedMood;
        return this.formatMusicRecommendations(tracks, `Perfect! Here are some ${detectedMood} vibes for you:`);
    }
    async handlePopularMusic() {
        const popularTracks = await this.trackModel
            .find({})
            .populate('artist album genre')
            .limit(8)
            .sort({ playCount: -1 });
        return this.formatMusicRecommendations(popularTracks, 'Here are the most popular tracks right now:');
    }
    async handleNewReleases() {
        const recentTracks = await this.trackModel
            .find({})
            .populate('artist album genre')
            .limit(6)
            .sort({ createdAt: -1 });
        return this.formatMusicRecommendations(recentTracks, 'Check out these fresh new releases:');
    }
    async handleGenreMusic(message) {
        const genres = await this.genreModel.find({});
        const mentionedGenre = genres.find((genre) => message.toLowerCase().includes(genre.name.toLowerCase()));
        if (!mentionedGenre) {
            const genreList = genres
                .slice(0, 10)
                .map((g) => g.name)
                .join(', ');
            return `I can help you find music by genre! Popular genres include: ${genreList}. Which one interests you?`;
        }
        const tracks = await this.trackModel
            .find({ genre: mentionedGenre._id })
            .populate('artist album genre')
            .limit(6)
            .sort({ playCount: -1 });
        return this.formatMusicRecommendations(tracks, `Here are some great ${mentionedGenre.name} tracks:`);
    }
    async handlePlaylistHelp(message) {
        return `I can help you with playlists! Here's what you can do:

• **Create a playlist**: Go to the Playlists section and click "Create New"
• **Add songs**: Use the "+" button next to any track to add it to a playlist
• **Make it public**: Share your playlists with friends by making them public
• **Follow playlists**: Discover and follow playlists from other users

Would you like me to recommend some tracks for a specific type of playlist?`;
    }
    handleAppHelp(message) {
        return `I'm here to help you with Harmonia! Here's what I can do:

🎵 **Music Discovery**:
• Find songs, artists, or albums
• Recommend music based on your mood
• Show you popular and new releases

🎶 **Personalized Recommendations**:
• Suggest similar artists and tracks
• Help you discover new genres
• Create mood-based playlists

📱 **App Features**:
• Queue management and playback controls
• Playlist creation and sharing
• Music search and filtering

Just ask me things like:
• "Recommend some jazz music"
• "Find songs by Taylor Swift"
• "I'm feeling happy, what should I listen to?"
• "Show me new releases"

What would you like to explore today?`;
    }
    handleGreeting() {
        const greetings = [
            "Hello! I'm your music assistant. What kind of music are you in the mood for today?",
            'Hi there! Ready to discover some amazing music? What can I help you find?',
            "Hey! I'm here to help you find the perfect soundtrack for your day. What's your vibe?",
            'Welcome to your personal music companion! What musical journey shall we embark on?',
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    async handleGeneralQuery(message) {
        return `I'm not sure I understand that request. I'm here to help you with music! Try asking me things like:

• "Recommend some music for working out"
• "Find songs by [artist name]"
• "I'm feeling sad, what should I listen to?"
• "Show me popular songs"
• "Help me create a playlist"

What musical adventure can I help you with today?`;
    }
    extractSearchTerm(message, keywords) {
        const lowerMessage = message.toLowerCase();
        for (const keyword of keywords) {
            const regex = new RegExp(`(?:find|search|look for|show me)\\s+(?:the\\s+)?${keyword}\\s+(.+)`, 'i');
            const match = message.match(regex);
            if (match) {
                return match[1].trim();
            }
        }
        const quotedMatch = message.match(/"([^"]+)"/);
        if (quotedMatch) {
            return quotedMatch[1];
        }
        return null;
    }
    formatMusicRecommendations(tracks, intro) {
        if (tracks.length === 0) {
            return "I couldn't find any tracks to recommend at the moment. Please try a different request.";
        }
        const trackList = tracks
            .map((track, index) => `${index + 1}. **${track.title}** by ${track.artist?.name || 'Unknown Artist'}\n   Album: ${track.album?.title || 'Unknown Album'}`)
            .join('\n\n');
        return `${intro}\n\n${trackList}\n\nWould you like me to add any of these to your queue or recommend similar tracks?`;
    }
    async getChatHistory(userId, limit = 10) {
        const context = this.chatContexts.get(userId);
        if (!context) {
            return [];
        }
        return context.conversation.slice(-limit);
    }
    async clearChatHistory(userId) {
        const context = this.chatContexts.get(userId);
        if (context) {
            context.conversation = [];
            context.lastQuery = undefined;
            return true;
        }
        return false;
    }
    getUserPreferences(userId) {
        const context = this.chatContexts.get(userId);
        return context?.preferences || { genres: [], artists: [], mood: null };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(1, (0, mongoose_1.InjectModel)(artist_schema_1.Artist.name)),
    __param(2, (0, mongoose_1.InjectModel)(album_schema_1.Album.name)),
    __param(3, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(4, (0, mongoose_1.InjectModel)(playlist_schema_1.Playlist.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map