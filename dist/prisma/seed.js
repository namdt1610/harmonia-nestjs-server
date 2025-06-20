"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('Creating genres...');
    const genres = await Promise.all([
        prisma.genre.upsert({
            where: { name: 'Pop' },
            update: {},
            create: {
                name: 'Pop',
                description: 'Popular music with catchy melodies',
                image: 'https://example.com/images/pop.jpg',
            },
        }),
        prisma.genre.upsert({
            where: { name: 'Rock' },
            update: {},
            create: {
                name: 'Rock',
                description: 'Rock and roll music',
                image: 'https://example.com/images/rock.jpg',
            },
        }),
        prisma.genre.upsert({
            where: { name: 'Jazz' },
            update: {},
            create: {
                name: 'Jazz',
                description: 'Jazz music with improvisation',
                image: 'https://example.com/images/jazz.jpg',
            },
        }),
        prisma.genre.upsert({
            where: { name: 'Electronic' },
            update: {},
            create: {
                name: 'Electronic',
                description: 'Electronic and digital music',
                image: 'https://example.com/images/electronic.jpg',
            },
        }),
        prisma.genre.upsert({
            where: { name: 'Hip Hop' },
            update: {},
            create: {
                name: 'Hip Hop',
                description: 'Hip hop and rap music',
                image: 'https://example.com/images/hiphop.jpg',
            },
        }),
    ]);
    console.log('Creating artists...');
    const artists = await Promise.all([
        prisma.artist.upsert({
            where: { name: 'Taylor Swift' },
            update: {},
            create: {
                name: 'Taylor Swift',
                bio: 'American singer-songwriter known for her versatile artistry and personal songwriting.',
                image: 'https://example.com/images/taylor-swift.jpg',
                website: 'https://taylorswift.com',
                verified: true,
            },
        }),
        prisma.artist.upsert({
            where: { name: 'The Beatles' },
            update: {},
            create: {
                name: 'The Beatles',
                bio: 'English rock band formed in Liverpool in 1960.',
                image: 'https://example.com/images/beatles.jpg',
                website: 'https://thebeatles.com',
                verified: true,
            },
        }),
        prisma.artist.upsert({
            where: { name: 'Miles Davis' },
            update: {},
            create: {
                name: 'Miles Davis',
                bio: 'American trumpeter, bandleader, and composer.',
                image: 'https://example.com/images/miles-davis.jpg',
                verified: true,
            },
        }),
        prisma.artist.upsert({
            where: { name: 'Daft Punk' },
            update: {},
            create: {
                name: 'Daft Punk',
                bio: 'French electronic music duo.',
                image: 'https://example.com/images/daft-punk.jpg',
                website: 'https://daftpunk.com',
                verified: true,
            },
        }),
    ]);
    console.log('Creating albums...');
    const albums = await Promise.all([
        prisma.album.upsert({
            where: { title: '1989' },
            update: {},
            create: {
                title: '1989',
                description: 'Fifth studio album by Taylor Swift',
                image: 'https://example.com/images/1989.jpg',
                releaseDate: new Date('2014-10-27'),
                artistId: artists[0].id,
            },
        }),
        prisma.album.upsert({
            where: { title: 'Abbey Road' },
            update: {},
            create: {
                title: 'Abbey Road',
                description: 'Eleventh studio album by The Beatles',
                image: 'https://example.com/images/abbey-road.jpg',
                releaseDate: new Date('1969-09-26'),
                artistId: artists[1].id,
            },
        }),
        prisma.album.upsert({
            where: { title: 'Kind of Blue' },
            update: {},
            create: {
                title: 'Kind of Blue',
                description: 'Studio album by Miles Davis',
                image: 'https://example.com/images/kind-of-blue.jpg',
                releaseDate: new Date('1959-08-17'),
                artistId: artists[2].id,
            },
        }),
        prisma.album.upsert({
            where: { title: 'Random Access Memories' },
            update: {},
            create: {
                title: 'Random Access Memories',
                description: 'Fourth studio album by Daft Punk',
                image: 'https://example.com/images/ram.jpg',
                releaseDate: new Date('2013-05-17'),
                artistId: artists[3].id,
            },
        }),
    ]);
    console.log('Creating tracks...');
    const tracks = await Promise.all([
        prisma.track.create({
            data: {
                title: 'Shake It Off',
                file: 'https://example.com/audio/shake-it-off.mp3',
                image: 'https://example.com/images/shake-it-off.jpg',
                duration: 219,
                lyrics: 'I stay out too late, got nothing in my brain...',
                artistId: artists[0].id,
                albumId: albums[0].id,
                playCount: 1000000,
            },
        }),
        prisma.track.create({
            data: {
                title: 'Come Together',
                file: 'https://example.com/audio/come-together.mp3',
                image: 'https://example.com/images/come-together.jpg',
                duration: 259,
                lyrics: 'Here come old flat top, he come grooving up slowly...',
                artistId: artists[1].id,
                albumId: albums[1].id,
                playCount: 800000,
            },
        }),
        prisma.track.create({
            data: {
                title: 'So What',
                file: 'https://example.com/audio/so-what.mp3',
                image: 'https://example.com/images/so-what.jpg',
                duration: 563,
                artistId: artists[2].id,
                albumId: albums[2].id,
                playCount: 500000,
            },
        }),
        prisma.track.create({
            data: {
                title: 'Get Lucky',
                file: 'https://example.com/audio/get-lucky.mp3',
                image: 'https://example.com/images/get-lucky.jpg',
                duration: 247,
                lyrics: 'Like the legend of the phoenix, all ends with beginnings...',
                artistId: artists[3].id,
                albumId: albums[3].id,
                playCount: 1200000,
            },
        }),
    ]);
    console.log('Connecting tracks to genres...');
    await Promise.all([
        prisma.trackGenre.create({
            data: { trackId: tracks[0].id, genreId: genres[0].id },
        }),
        prisma.trackGenre.create({
            data: { trackId: tracks[1].id, genreId: genres[1].id },
        }),
        prisma.trackGenre.create({
            data: { trackId: tracks[2].id, genreId: genres[2].id },
        }),
        prisma.trackGenre.create({
            data: { trackId: tracks[3].id, genreId: genres[3].id },
        }),
    ]);
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'admin@harmonia.com' },
            update: {},
            create: {
                email: 'admin@harmonia.com',
                username: 'admin',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                isStaff: true,
                isSuperuser: true,
                bio: 'Administrator of Harmonia music platform',
                image: 'https://example.com/images/admin.jpg',
            },
        }),
        prisma.user.upsert({
            where: { email: 'john@example.com' },
            update: {},
            create: {
                email: 'john@example.com',
                username: 'john_doe',
                password: hashedPassword,
                firstName: 'John',
                lastName: 'Doe',
                bio: 'Music lover and playlist curator',
                image: 'https://example.com/images/john.jpg',
            },
        }),
        prisma.user.upsert({
            where: { email: 'jane@example.com' },
            update: {},
            create: {
                email: 'jane@example.com',
                username: 'jane_smith',
                password: hashedPassword,
                firstName: 'Jane',
                lastName: 'Smith',
                bio: 'Jazz enthusiast and music teacher',
                image: 'https://example.com/images/jane.jpg',
            },
        }),
    ]);
    console.log('Creating subscription plans...');
    const plans = await Promise.all([
        prisma.subscriptionPlan.upsert({
            where: { name: 'Free' },
            update: {},
            create: {
                name: 'Free',
                description: 'Basic free tier with limited features',
                price: 0,
                interval: 'monthly',
                features: ['Basic streaming', 'Limited skips', 'Ads included'],
            },
        }),
        prisma.subscriptionPlan.upsert({
            where: { name: 'Premium' },
            update: {},
            create: {
                name: 'Premium',
                description: 'Premium subscription with full features',
                price: 9.99,
                interval: 'monthly',
                features: [
                    'Unlimited streaming',
                    'No ads',
                    'Offline downloads',
                    'High quality audio',
                ],
            },
        }),
        prisma.subscriptionPlan.upsert({
            where: { name: 'Premium Annual' },
            update: {},
            create: {
                name: 'Premium Annual',
                description: 'Annual premium subscription with discount',
                price: 99.99,
                interval: 'yearly',
                features: [
                    'Unlimited streaming',
                    'No ads',
                    'Offline downloads',
                    'High quality audio',
                    'Early access to new features',
                ],
            },
        }),
    ]);
    console.log('Creating playlists...');
    const playlists = await Promise.all([
        prisma.playlist.create({
            data: {
                name: 'My Favorites',
                description: 'Collection of my favorite songs',
                image: 'https://example.com/images/favorites.jpg',
                isPublic: true,
                userId: users[1].id,
            },
        }),
        prisma.playlist.create({
            data: {
                name: 'Jazz Classics',
                description: 'Timeless jazz masterpieces',
                image: 'https://example.com/images/jazz-classics.jpg',
                isPublic: true,
                userId: users[2].id,
            },
        }),
    ]);
    console.log('Adding tracks to playlists...');
    await Promise.all([
        prisma.playlistTrack.create({
            data: {
                playlistId: playlists[0].id,
                trackId: tracks[0].id,
                position: 0,
            },
        }),
        prisma.playlistTrack.create({
            data: {
                playlistId: playlists[0].id,
                trackId: tracks[3].id,
                position: 1,
            },
        }),
        prisma.playlistTrack.create({
            data: {
                playlistId: playlists[1].id,
                trackId: tracks[2].id,
                position: 0,
            },
        }),
    ]);
    console.log('Creating user favorites...');
    await Promise.all([
        prisma.userFavoriteTrack.create({
            data: { userId: users[1].id, trackId: tracks[0].id },
        }),
        prisma.userFavoriteTrack.create({
            data: { userId: users[1].id, trackId: tracks[3].id },
        }),
        prisma.userFavoriteArtist.create({
            data: { userId: users[1].id, artistId: artists[0].id },
        }),
        prisma.userFavoriteAlbum.create({
            data: { userId: users[2].id, albumId: albums[2].id },
        }),
    ]);
    console.log('Creating stream queues...');
    const streamQueues = await Promise.all([
        prisma.streamQueue.create({
            data: {
                userId: users[1].id,
                currentIndex: 0,
                shuffle: false,
                repeat: 'off',
            },
        }),
        prisma.streamQueue.create({
            data: {
                userId: users[2].id,
                currentIndex: 1,
                shuffle: true,
                repeat: 'playlist',
            },
        }),
    ]);
    await Promise.all([
        prisma.streamQueueTrack.create({
            data: {
                queueId: streamQueues[0].id,
                trackId: tracks[0].id,
                position: 0,
            },
        }),
        prisma.streamQueueTrack.create({
            data: {
                queueId: streamQueues[0].id,
                trackId: tracks[1].id,
                position: 1,
            },
        }),
        prisma.streamQueueTrack.create({
            data: {
                queueId: streamQueues[1].id,
                trackId: tracks[2].id,
                position: 0,
            },
        }),
    ]);
    console.log('Creating user activities...');
    await Promise.all([
        prisma.userActivity.create({
            data: {
                userId: users[1].id,
                action: 'play',
                metadata: { trackId: tracks[0].id, duration: 219 },
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0 (Chrome)',
            },
        }),
        prisma.userActivity.create({
            data: {
                userId: users[2].id,
                action: 'like',
                metadata: { trackId: tracks[2].id },
                ipAddress: '192.168.1.2',
                userAgent: 'Mozilla/5.0 (Firefox)',
            },
        }),
    ]);
    console.log('✅ Database seeding completed successfully!');
    console.log(`Created:`);
    console.log(`- ${genres.length} genres`);
    console.log(`- ${artists.length} artists`);
    console.log(`- ${albums.length} albums`);
    console.log(`- ${tracks.length} tracks`);
    console.log(`- ${users.length} users`);
    console.log(`- ${plans.length} subscription plans`);
    console.log(`- ${playlists.length} playlists`);
    console.log(`- ${streamQueues.length} stream queues`);
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map