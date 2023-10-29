//
//  API.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation

struct MusicTrack {
  let trackId: Int
  let trackName: String
  let albumId: Int
}

struct MusicAlbum {
  let albumId: Int
  let albumName: String
  let artistId: Int
}

struct ArtistInfo {
  let artistId: Int
  let artistName: String
  let artistDescription: String
}

struct MusicTrackMetaInformation {
  let album: MusicAlbum
  let artist: ArtistInfo
}

protocol MusicViewModel {
  var delegate: MusicViewModelDelegate? { get set }
  func getTrackMeta(forTrack track: MusicTrack) -> MusicTrackMetaInformation?
  func getLastSelectedTopic() -> String?
  func newTopicSelectedOnChat(topic: String)
}

protocol MusicViewModelDelegate {
  func onMusicChanged(track: MusicTrack)
}
