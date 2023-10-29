//
//  MusicPage.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation
import UIKit

class MusicPage: UIView {
  lazy var albumLabel: UILabel = {
    let label = UILabel()
    label.text = "---"
    return label
  }()

  lazy var albumImage: UIImageView = {
    let imageView = UIImageView()
    imageView.image = UIImage(named: "banner")    
    return imageView
  }()

  lazy var player: PlayerView = {
    let player = PlayerView()
    player.setupView()
    return player
  }()

  func setupView() {
    layoutComponents()

    albumLabel.font = .systemFont(ofSize: 30, weight: .bold)
    albumLabel.textAlignment = .center

    albumImage.clipsToBounds = true
    albumImage.layer.cornerRadius = 30
    albumImage.contentMode = .scaleAspectFill
    self.backgroundColor = UIColor(named: "background")
  }

  func startPlaying(track: MusicTrack, meta: MusicTrackMetaInformation) {
    albumLabel.text = meta.album.albumName
    player.playTrack(track: track, meta: meta)
  }

  func layoutComponents() {
    self.addSubview(albumLabel)
    self.addSubview(albumImage)
    self.addSubview(player)

    albumLabel.translatesAutoresizingMaskIntoConstraints = false
    albumImage.translatesAutoresizingMaskIntoConstraints = false
    player.translatesAutoresizingMaskIntoConstraints = false

    let constraints = [
      albumLabel.topAnchor.constraint(equalTo: self.safeAreaLayoutGuide.topAnchor, constant: 20),
      albumLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 30),
      self.trailingAnchor.constraint(equalTo: albumLabel.trailingAnchor, constant: 30),
      albumImage.topAnchor.constraint(equalTo: albumLabel.bottomAnchor, constant: 40),
      albumImage.leadingAnchor.constraint(equalTo: albumLabel.leadingAnchor),
      albumImage.trailingAnchor.constraint(equalTo: albumLabel.trailingAnchor),
      albumImage.heightAnchor.constraint(equalTo: self.heightAnchor, multiplier: 0.4),

      player.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 0),
      self.trailingAnchor.constraint(equalTo: player.trailingAnchor, constant: 0),
      self.bottomAnchor.constraint(equalTo: player.bottomAnchor),

    ]

    NSLayoutConstraint.activate(constraints)
  }
}

#Preview {
  let view = MusicPage()
  view.setupView()
  view.albumLabel.text = "Demo Album"

  view.player.trackInformationView.artistLabel.text = "Sample Artist"
  view.player.trackInformationView.songNameLabel.text = "My Hitting"

  return view
}
