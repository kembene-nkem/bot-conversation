//
//  PlayerControls.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation
import UIKit

typealias ChatRequestedCallback = (_ track: MusicTrack, _ meta: MusicTrackMetaInformation) -> Void

class PlayerView: UIView {


  var onChatRequested: ChatRequestedCallback?
  private var track: MusicTrack?
  private var meta: MusicTrackMetaInformation?

  lazy var contentView: UIView = {
    let view = UIView()
    return view
  }()

  lazy var playerControl: PlayerControlsView = {
    let view = PlayerControlsView()
    view.setupView()
    return view
  }()

  lazy var trackInformationView: TrackInformationView = {
    let view = TrackInformationView()
    view.setupView()
    return view
  }()

  lazy var playedTimeLabel: UILabel = {
    let label = UILabel()
    return label
  }()

  lazy var remainingTimeLabel: UILabel = {
    let label = UILabel()
    return label
  }()

  func playTrack(track: MusicTrack, meta: MusicTrackMetaInformation) {
    self.track = track
    self.meta = meta
    trackInformationView.artistLabel.text = "By: \(meta.artist.artistName)"
    trackInformationView.songNameLabel.text = track.trackName
    trackInformationView.chatButton.isHidden = false
  }

  func setupView() {
    layoutViewItems()
    self.backgroundColor = UIColor.clear
    contentView.backgroundColor = .init(named: "player_background")
    contentView.layer.cornerRadius = 40
    trackInformationView.chatButton.addTarget(self, action: #selector(self.didRequestChat), for: .touchUpInside)
    trackInformationView.chatButton.isHidden = true
  }

  @objc func didRequestChat() {
    if let track = self.track, let meta = self.meta {
      onChatRequested?(track, meta)
    }
  }

  func layoutViewItems() {

    let waveView = buildMusicWave()
    let timing = buildTimerView()
    self.addSubview(contentView)
    contentView.addSubview(playerControl)
    contentView.addSubview(waveView)
    contentView.addSubview(timing)
    contentView.addSubview(trackInformationView)
    contentView.translatesAutoresizingMaskIntoConstraints = false
    playerControl.translatesAutoresizingMaskIntoConstraints = false
    waveView.translatesAutoresizingMaskIntoConstraints = false
    timing.translatesAutoresizingMaskIntoConstraints = false
    trackInformationView.translatesAutoresizingMaskIntoConstraints = false

    let constraints = [
      contentView.topAnchor.constraint(equalTo: self.topAnchor, constant: 30),
      contentView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      self.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
      self.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: 0),

      trackInformationView.leadingAnchor.constraint(equalTo: playerControl.leadingAnchor),
      trackInformationView.trailingAnchor.constraint(equalTo: playerControl.trailingAnchor),
      trackInformationView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
      trackInformationView.bottomAnchor.constraint(equalTo: waveView.topAnchor, constant: 20),

      waveView.leadingAnchor.constraint(equalTo: playerControl.leadingAnchor),
      waveView.trailingAnchor.constraint(equalTo: playerControl.trailingAnchor),
      timing.topAnchor.constraint(equalTo: waveView.bottomAnchor),

      timing.leadingAnchor.constraint(equalTo: playerControl.leadingAnchor),
      timing.trailingAnchor.constraint(equalTo: playerControl.trailingAnchor),
      playerControl.topAnchor.constraint(equalTo: timing.bottomAnchor, constant: 10),

      playerControl.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
      contentView.trailingAnchor.constraint(equalTo: playerControl.trailingAnchor, constant: 20),
      contentView.bottomAnchor.constraint(equalTo: playerControl.bottomAnchor, constant: 30),
    ]

    NSLayoutConstraint.activate(constraints)
  }

  func buildTimerView()-> UIView {
    let view = UIView()


    // could have used layers here too
    let top = UIView()
    let bottom = UIView()

    playedTimeLabel.translatesAutoresizingMaskIntoConstraints = false
    remainingTimeLabel.translatesAutoresizingMaskIntoConstraints = false
    top.translatesAutoresizingMaskIntoConstraints = false
    bottom.translatesAutoresizingMaskIntoConstraints = false

    view.addSubview(playedTimeLabel)
    view.addSubview(remainingTimeLabel)
    view.addSubview(top)
    view.addSubview(bottom)

    let constraints = [
      playedTimeLabel.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
      playedTimeLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      view.bottomAnchor.constraint(equalTo: playedTimeLabel.bottomAnchor, constant: 20),

      remainingTimeLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
      remainingTimeLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor),

      top.leadingAnchor.constraint(equalTo: playedTimeLabel.leadingAnchor),
      top.trailingAnchor.constraint(equalTo: remainingTimeLabel.trailingAnchor),
      top.heightAnchor.constraint(equalToConstant: 1),
      top.topAnchor.constraint(equalTo: view.topAnchor),

      bottom.leadingAnchor.constraint(equalTo: top.leadingAnchor),
      bottom.trailingAnchor.constraint(equalTo: top.trailingAnchor),
      bottom.heightAnchor.constraint(equalToConstant: 1),
      bottom.bottomAnchor.constraint(equalTo: view.bottomAnchor)
    ]

    top.backgroundColor = .gray.withAlphaComponent(0.5)
    bottom.backgroundColor = .gray.withAlphaComponent(0.5)

    playedTimeLabel.text = "0:00"
    remainingTimeLabel.text = "0:00"

    playedTimeLabel.textColor = .lightGray
    remainingTimeLabel.textColor = .lightGray

    NSLayoutConstraint.activate(constraints)

    return view
  }

  func buildMusicWave()-> UIView {
    let wave = UIView()
    let image = UIImageView(image: UIImage(named: "music-wave"))
    wave.addSubview(image)
    image.translatesAutoresizingMaskIntoConstraints = false
    image.contentMode = .scaleAspectFit


    let constraints = [
      image.topAnchor.constraint(equalTo: wave.topAnchor, constant: 30),
      image.leadingAnchor.constraint(equalTo: wave.leadingAnchor),
      image.heightAnchor.constraint(equalToConstant: 100),
      wave.trailingAnchor.constraint(equalTo: image.trailingAnchor),
      wave.bottomAnchor.constraint(equalTo: image.bottomAnchor, constant: 0)
    ]

    NSLayoutConstraint.activate(constraints)

    return wave
  }
  
}

#Preview {
  let control = PlayerView()
  control.setupView()
  control.trackInformationView.artistLabel.text = "Sample Artist"
  control.trackInformationView.songNameLabel.text = "My Hitting"
  return control
}
