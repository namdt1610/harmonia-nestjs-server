import { Injectable, Logger } from '@nestjs/common';
import { TrackRepository } from '../tracks/track.repository';
import { ArtistRepository } from '../artists/artist.repository';
import { AlbumRepository } from '../albums/album.repository';
import { GenreRepository } from '../genres/genre.repository';
import { PlaylistRepository } from '../playlists/playlist.repository';

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

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private chatContexts: Map<string, ChatContext> = new Map();

  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
    private readonly playlistRepository: PlaylistRepository,
  ) {}

  async sendMessage(userId: string, message: string): Promise<ChatMessage> {
    const context = this.getOrCreateContext(userId);
    const intent = this.detectIntent(message);

    let response: string;
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
    } catch (error) {
      this.logger.error(`Error processing message for user ${userId}:`, error);
      response =
        "I'm sorry, I encountered an error while processing your request. Please try again.";
      confidence = 0.1;
    }

    const chatMessage: ChatMessage = {
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

    // Keep only the last 20 messages
    if (context.conversation.length > 20) {
      context.conversation = context.conversation.slice(-20);
    }

    this.chatContexts.set(userId, context);

    this.logger.log(
      `Chatbot response for user ${userId}: ${intent} (confidence: ${confidence})`,
    );
    return chatMessage;
  }

  private getOrCreateContext(userId: string): ChatContext {
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

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Greetings
    if (
      /^(hi|hello|hey|good morning|good afternoon|good evening)/.test(
        lowerMessage,
      )
    ) {
      return 'greeting';
    }

    // Music recommendations
    if (
      /recommend|suggest|similar|like/.test(lowerMessage) &&
      /music|song|track/.test(lowerMessage)
    ) {
      return 'recommend_music';
    }

    // Search intents
    if (
      /(find|search|look for|show me) .*(artist|singer|band)/.test(lowerMessage)
    ) {
      return 'search_artist';
    }

    if (
      /(find|search|look for|show me) .*(song|track|music)/.test(lowerMessage)
    ) {
      return 'search_song';
    }

    if (/(find|search|look for|show me) .*(album|record)/.test(lowerMessage)) {
      return 'search_album';
    }

    // Mood-based music
    if (
      /(mood|feeling|emotion)/.test(lowerMessage) ||
      /(happy|sad|angry|excited|calm|relaxed|energetic|romantic)/.test(
        lowerMessage,
      )
    ) {
      return 'mood_music';
    }

    // Popular music
    if (/(popular|trending|top|hit|chart)/.test(lowerMessage)) {
      return 'popular_music';
    }

    // New releases
    if (
      /(new|latest|recent|fresh) .*(release|music|song|album)/.test(
        lowerMessage,
      )
    ) {
      return 'new_releases';
    }

    // Genre-based
    if (
      /(genre|style|type) .*(music|song)/.test(lowerMessage) ||
      /(rock|pop|jazz|classical|electronic|hip.hop|country|blues)/.test(
        lowerMessage,
      )
    ) {
      return 'genre_music';
    }

    // Playlist help
    if (
      /(playlist|queue)/.test(lowerMessage) &&
      /(create|make|help|how)/.test(lowerMessage)
    ) {
      return 'playlist_help';
    }

    // App help
    if (/(help|how|guide|tutorial)/.test(lowerMessage)) {
      return 'app_help';
    }

    return 'general';
  }

  private async handleMusicRecommendation(
    message: string,
    context: ChatContext,
  ): Promise<string> {
    // Extract artist or genre mentions from the message
    const genresResult = await this.genreRepository.findAll(1, 50);
    const artistsResult = await this.artistRepository.findAll(1, 50);

    let recommendedTracks: any[] = [];

    // Simple keyword matching for genres and artists
    const mentionedGenres = genresResult.genres.filter((genre) =>
      message.toLowerCase().includes(genre.name.toLowerCase()),
    );

    const mentionedArtists = artistsResult.artists.filter((artist) =>
      message.toLowerCase().includes(artist.name.toLowerCase()),
    );

    if (mentionedGenres.length > 0) {
      // Recommend based on genre
      recommendedTracks = await this.trackRepository.findByGenre(
        mentionedGenres[0].id,
      );
      recommendedTracks = recommendedTracks.slice(0, 5);

      const genreNames = mentionedGenres.map((g) => g.name).join(', ');
      return this.formatMusicRecommendations(
        recommendedTracks,
        `Here are some great ${genreNames} tracks for you:`,
      );
    }

    if (mentionedArtists.length > 0) {
      // Recommend similar artists or tracks from the same genre
      const artist = mentionedArtists[0];
      recommendedTracks = await this.trackRepository.findByArtist(artist.id);
      recommendedTracks = recommendedTracks.slice(0, 5);

      return this.formatMusicRecommendations(
        recommendedTracks,
        `Here are some tracks by ${artist.name}:`,
      );
    }

    // Fallback: recommend popular tracks
    recommendedTracks = await this.trackRepository.findPopular(5);

    return this.formatMusicRecommendations(
      recommendedTracks,
      'Here are some popular tracks you might enjoy:',
    );
  }

  private async handleArtistSearch(message: string): Promise<string> {
    const searchTerm = this.extractSearchTerm(message, [
      'artist',
      'singer',
      'band',
      'musician',
    ]);

    if (!searchTerm) {
      return "I couldn't understand which artist you're looking for. Can you please specify the artist name?";
    }

    const result = await this.artistRepository.findAll(1, 5, searchTerm);
    const artists = result.artists;

    if (artists.length === 0) {
      return `I couldn't find any artists matching "${searchTerm}". Try searching for a different artist.`;
    }

    const artistList = artists
      .map((artist, index) => `${index + 1}. ${artist.name}`)
      .join('\n');

    return `I found these artists for "${searchTerm}":\n${artistList}\n\nWould you like to hear tracks from any of these artists?`;
  }

  private async handleSongSearch(message: string): Promise<string> {
    const searchTerm = this.extractSearchTerm(message, [
      'song',
      'track',
      'music',
    ]);

    if (!searchTerm) {
      return "I couldn't understand which song you're looking for. Can you please specify the song title?";
    }

    const tracks = await this.trackRepository.search(searchTerm, 5);

    if (tracks.length === 0) {
      return `I couldn't find any songs matching "${searchTerm}". Try searching for a different song.`;
    }

    return this.formatMusicRecommendations(
      tracks,
      `I found these songs for "${searchTerm}":`,
    );
  }

  private async handleAlbumSearch(message: string): Promise<string> {
    const searchTerm = this.extractSearchTerm(message, ['album', 'record']);

    if (!searchTerm) {
      return "I couldn't understand which album you're looking for. Can you please specify the album title?";
    }

    const result = await this.albumRepository.findAll(1, 5, {
      search: searchTerm,
    });
    const albums = result.albums;

    if (albums.length === 0) {
      return `I couldn't find any albums matching "${searchTerm}". Try searching for a different album.`;
    }

    const albumList = albums
      .map(
        (album, index) =>
          `${index + 1}. ${album.title} by ${album.artist?.name || 'Unknown Artist'}`,
      )
      .join('\n');

    return `I found these albums for "${searchTerm}":\n${albumList}\n\nWould you like to hear tracks from any of these albums?`;
  }

  private async handleMoodMusic(
    message: string,
    context: ChatContext,
  ): Promise<string> {
    // This is a simplified mood-based recommendation
    // In a real app, you'd have mood tags on tracks or use AI to analyze audio features
    const tracks = await this.trackRepository.findPopular(5);

    context.preferences = context.preferences || { genres: [], artists: [] };
    context.preferences.mood = this.extractMoodFromMessage(message);

    return this.formatMusicRecommendations(
      tracks,
      `Here are some tracks that might match your ${context.preferences.mood || 'current'} mood:`,
    );
  }

  private async handlePopularMusic(): Promise<string> {
    const popularTracks = await this.trackRepository.findPopular(8);

    return this.formatMusicRecommendations(
      popularTracks,
      'Here are the most popular tracks right now:',
    );
  }

  private async handleNewReleases(): Promise<string> {
    const recentTracks = await this.trackRepository.findRecent(6);

    return this.formatMusicRecommendations(
      recentTracks,
      'Here are the latest releases:',
    );
  }

  private async handleGenreMusic(message: string): Promise<string> {
    const genresResult = await this.genreRepository.findAll(1, 50);
    const genres = genresResult.genres;

    const mentionedGenre = genres.find((genre) =>
      message.toLowerCase().includes(genre.name.toLowerCase()),
    );

    if (!mentionedGenre) {
      const genreList = genres
        .slice(0, 10)
        .map((g) => g.name)
        .join(', ');
      return `I couldn't identify a specific genre from your message. Here are some available genres: ${genreList}`;
    }

    const tracks = await this.trackRepository.findByGenre(mentionedGenre.id);
    const limitedTracks = tracks.slice(0, 6);

    return this.formatMusicRecommendations(
      limitedTracks,
      `Here are some popular ${mentionedGenre.name} tracks:`,
    );
  }

  private async handlePlaylistHelp(message: string): Promise<string> {
    return `I can help you with playlists! Here's what you can do:

• **Create a playlist**: Go to the Playlists section and click "Create New"
• **Add songs**: Use the "+" button next to any track to add it to a playlist
• **Make it public**: Share your playlists with friends by making them public
• **Follow playlists**: Discover and follow playlists from other users

Would you like me to recommend some tracks for a specific type of playlist?`;
  }

  private handleAppHelp(message: string): string {
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

  private handleGreeting(): string {
    const greetings = [
      "Hello! I'm your music assistant. What kind of music are you in the mood for today?",
      'Hi there! Ready to discover some amazing music? What can I help you find?',
      "Hey! I'm here to help you find the perfect soundtrack for your day. What's your vibe?",
      'Welcome to your personal music companion! What musical journey shall we embark on?',
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private async handleGeneralQuery(message: string): Promise<string> {
    return `I'm not sure I understand that request. I'm here to help you with music! Try asking me things like:

• "Recommend some music for working out"
• "Find songs by [artist name]"
• "I'm feeling sad, what should I listen to?"
• "Show me popular songs"
• "Help me create a playlist"

What musical adventure can I help you with today?`;
  }

  private extractMoodFromMessage(message: string): string {
    const moodKeywords = {
      happy: ['happy', 'joyful', 'cheerful', 'upbeat', 'positive'],
      sad: ['sad', 'melancholy', 'depressed', 'blue', 'down'],
      energetic: ['energetic', 'pumped', 'excited', 'hyped', 'active'],
      calm: ['calm', 'peaceful', 'relaxed', 'chill', 'tranquil'],
      romantic: ['romantic', 'love', 'intimate', 'tender', 'passionate'],
      angry: ['angry', 'mad', 'furious', 'rage', 'aggressive'],
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((keyword) => message.toLowerCase().includes(keyword))) {
        return mood;
      }
    }

    return 'happy'; // default mood
  }

  private extractSearchTerm(
    message: string,
    keywords: string[],
  ): string | null {
    const lowerMessage = message.toLowerCase();

    for (const keyword of keywords) {
      const regex = new RegExp(
        `(?:find|search|look for|show me)\\s+(?:the\\s+)?${keyword}\\s+(.+)`,
        'i',
      );
      const match = message.match(regex);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: try to extract quoted terms
    const quotedMatch = message.match(/"([^"]+)"/);
    if (quotedMatch) {
      return quotedMatch[1];
    }

    return null;
  }

  private formatMusicRecommendations(tracks: any[], intro: string): string {
    if (tracks.length === 0) {
      return "I couldn't find any tracks to recommend at the moment. Please try a different request.";
    }

    const trackList = tracks
      .map(
        (track, index) =>
          `${index + 1}. **${track.title}** by ${track.artist?.name || 'Unknown Artist'}\n   Album: ${track.album?.title || 'Unknown Album'}`,
      )
      .join('\n\n');

    return `${intro}\n\n${trackList}\n\nWould you like me to add any of these to your queue or recommend similar tracks?`;
  }

  async getChatHistory(
    userId: string,
    limit: number = 10,
  ): Promise<ChatMessage[]> {
    const context = this.chatContexts.get(userId);
    if (!context) {
      return [];
    }

    return context.conversation.slice(-limit);
  }

  async clearChatHistory(userId: string): Promise<boolean> {
    const context = this.chatContexts.get(userId);
    if (context) {
      context.conversation = [];
      context.lastQuery = undefined;
      return true;
    }
    return false;
  }

  getUserPreferences(userId: string): any {
    const context = this.chatContexts.get(userId);
    return context?.preferences || { genres: [], artists: [], mood: null };
  }
}
