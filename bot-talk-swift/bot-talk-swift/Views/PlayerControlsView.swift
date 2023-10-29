//
//  PlayerControls.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation
import UIKit

class PlayerControlsView: UIView {

  lazy var nextButton: UIButton = {
    let button = UIButton(type: .system)
    button.setImage(UIImage(named: "next")?.withRenderingMode(.alwaysTemplate), for: .normal)
    button.tintColor = .white
    button.layer.cornerRadius = 20
    button.clipsToBounds = true
    return button
  }()

  lazy var previousButton: UIButton = {
    let button = UIButton(type: .system)
    button.setImage(UIImage(named: "previous")?.withRenderingMode(.alwaysTemplate), for: .normal)
    button.tintColor = .white
    button.layer.cornerRadius = 20
    button.clipsToBounds = true
    return button
  }()

  lazy var playButton: UIButton = {
    let button = UIButton(type: .system)
    button.tintColor = .white
    button.backgroundColor = UIColor(named: "play_background")
    button.layer.cornerRadius = 30
    button.clipsToBounds = true
    return button
  }()

  func setupView() {
    layoutControls()
  }

  func layoutControls() {
    let parent = self
    let playImage = UIImageView(image: UIImage(named: "play"))
    nextButton.translatesAutoresizingMaskIntoConstraints = false
    previousButton.translatesAutoresizingMaskIntoConstraints = false
    playButton.translatesAutoresizingMaskIntoConstraints = false
    playImage.translatesAutoresizingMaskIntoConstraints = false

    parent.addSubview(nextButton)
    parent.addSubview(previousButton)
    parent.addSubview(playButton)
    playButton.addSubview(playImage)
    playImage.contentMode = .scaleAspectFit

    let constraints = [
      playButton.topAnchor.constraint(equalTo: parent.topAnchor, constant: 10),
      playButton.centerXAnchor.constraint(equalTo: parent.centerXAnchor),
      playButton.widthAnchor.constraint(equalToConstant: 60),
      playButton.heightAnchor.constraint(equalToConstant: 60),
      parent.bottomAnchor.constraint(equalTo: playButton.bottomAnchor),

      nextButton.trailingAnchor.constraint(equalTo: parent.trailingAnchor),
      nextButton.centerYAnchor.constraint(equalTo: parent.centerYAnchor),

      previousButton.leadingAnchor.constraint(equalTo: parent.leadingAnchor),
      previousButton.centerYAnchor.constraint(equalTo: parent.centerYAnchor),

      previousButton.widthAnchor.constraint(equalToConstant: 40),
      previousButton.heightAnchor.constraint(equalToConstant: 40),
      nextButton.widthAnchor.constraint(equalToConstant: 40),
      nextButton.heightAnchor.constraint(equalToConstant: 40),

      playImage.topAnchor.constraint(equalTo: playButton.topAnchor, constant: 10),
      playImage.leadingAnchor.constraint(equalTo: playButton.leadingAnchor, constant: 10),
      playButton.trailingAnchor.constraint(equalTo: playImage.trailingAnchor, constant: 10),
      playButton.bottomAnchor.constraint(equalTo: playImage.bottomAnchor, constant: 10),
    ]
    NSLayoutConstraint.activate(constraints)
  }
}
