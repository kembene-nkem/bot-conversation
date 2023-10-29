//
//  PrimeSeventy.h
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

#import <Foundation/Foundation.h>

@interface PrimeSeventy : NSObject
  -(NSDictionary*) findAlbumById: (NSNumber*) albumId;
  -(NSDictionary*) findArtistById: (NSNumber*) artistId;
  -(NSDictionary*) getCurrentTrack;
@end
