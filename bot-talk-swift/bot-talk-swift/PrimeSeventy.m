//
//  PrimeSeventy.m
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

#import <Foundation/Foundation.h>
#import "PrimeSeventy.h"

NSDictionary *mockData = @{
    @"currentTrack": @{
        @"id": @123,
        @"name": @"Sample Song",
        @"albumId": @456
    },
    @"albums": @[
        @{
            @"id": @456,
            @"name": @"Sample Album",
            @"artistId": @789
        }
    ],
    @"artists": @[
        @{
            @"id": @789,
            @"name": @"Sample Artist",
            @"description": @"Description about Sample Artist"
        }
    ]
};

@implementation PrimeSeventy

-(NSDictionary*) findAlbumById: (NSNumber*) albumId {
    NSArray *albums = mockData[@"albums"];
    for (NSDictionary *album in albums) {
        if ([album[@"id"] isEqualToNumber:albumId]) {
            return album;
        }
    }
    return nil;
}

-(NSDictionary*) findArtistById: (NSNumber*) artistId {
    NSArray *artists = mockData[@"artists"];
    for (NSDictionary *artist in artists) {
        if ([artist[@"id"] isEqualToNumber:artistId]) {
            return artist;
        }
    }
    return nil;
}

-(NSDictionary*) getCurrentTrack {
  NSDictionary *currentTrack = mockData[@"currentTrack"];
  return currentTrack;
}

@end
