//
//  MusicViewModel.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation

class DefaultMusicViewModel {
  let data: PrimeSeventy?
  private let keyLastChatTopic = "LAST_CHAT_TOPIC"

  var delegate: MusicViewModelDelegate? {
    didSet {
      notifyDelegateOfCurrentTrack()
    }
  }

  init(data: PrimeSeventy? = nil) {
    self.data = data ?? PrimeSeventy()
  }

  fileprivate func notifyDelegateOfCurrentTrack() {
    if let track = data?.fetchCurrentMusicTrack() {
      DispatchQueue.main.asyncAfter(deadline: .now() + 1) {[weak self] in
        self?.delegate?.onMusicChanged(track: track)
      }
    }
  }

}

extension DefaultMusicViewModel: MusicViewModel {
  func getLastSelectedTopic() -> String? {
    UserDefaults.standard.string(forKey: keyLastChatTopic)
  }
  
  func newTopicSelectedOnChat(topic: String) {
    UserDefaults.standard.setValue(topic, forKey: keyLastChatTopic)
  }
  

  
  func getTrackMeta(forTrack track: MusicTrack) -> MusicTrackMetaInformation? {
    guard let album = data?.fetchAlbumForTrack(trackId: track.albumId),
          let artist = data?.fetchArtistForAlbum(artistId: album.artistId)
    else {
      return nil
    }
    return MusicTrackMetaInformation(album: album, artist: artist)
  }
  

}

fileprivate extension PrimeSeventy {
  func fetchCurrentMusicTrack()-> MusicTrack? {
    guard   let track = getCurrentTrack(),
            let id = track["id"] as? Int,
            let name = track["name"] as? String,
            let albumId = track["albumId"] as? Int
    else {
      return nil
    }
    return MusicTrack(trackId: id, trackName: name, albumId: albumId)
  }

  func fetchAlbumForTrack(trackId: Int)-> MusicAlbum? {
    guard 
      let album = findAlbum(byId: trackId as NSNumber),
        let id = album["id"] as? Int,
        let name = album["name"] as? String,
        let artistId = album["artistId"] as? Int else {
      return nil
    }

    return MusicAlbum(albumId: id, albumName: name, artistId: artistId)
  }

  func fetchArtistForAlbum(artistId: Int)-> ArtistInfo? {
    guard
      let album = findArtist(byId: artistId as NSNumber),
        let id = album["id"] as? Int,
        let name = album["name"] as? String,
        let description = album["description"] as? String else {
      return nil
    }
    return ArtistInfo(artistId: id, artistName: name, artistDescription: description)
  }
}
