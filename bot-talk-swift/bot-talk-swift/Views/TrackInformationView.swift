//
//  TrackInformationView.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import Foundation
import UIKit

class TrackInformationView: UIView {

  lazy var songNameLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 25, weight: .semibold)
    label.text = "----"
    return label
  }()

  lazy var artistLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 15)
    label.text = "---"
    return label
  }()

  lazy var chatButton: UIButton = {
    let button = UIButton(type: .system)
    button.tintColor = .white
    button.backgroundColor = UIColor(named: "chat_button_background")
    button.layer.cornerRadius = 20
    button.clipsToBounds = true
    return button
  }()

  func setupView(){
    let bottom = UIView()
    let chatImage = UIImageView(image: UIImage(named: "chat"))

    artistLabel.translatesAutoresizingMaskIntoConstraints = false
    songNameLabel.translatesAutoresizingMaskIntoConstraints = false
    chatButton.translatesAutoresizingMaskIntoConstraints = false
    bottom.translatesAutoresizingMaskIntoConstraints = false
    chatImage.translatesAutoresizingMaskIntoConstraints = false




    self.addSubview(songNameLabel)
    self.addSubview(artistLabel)
    self.addSubview(chatButton)
    self.addSubview(bottom)
    chatButton.addSubview(chatImage)

    let constraints = [
      songNameLabel.topAnchor.constraint(equalTo: self.topAnchor, constant: 15),
      songNameLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      songNameLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor),

      artistLabel.topAnchor.constraint(equalTo: songNameLabel.bottomAnchor, constant: 5),
      artistLabel.leadingAnchor.constraint(equalTo: songNameLabel.leadingAnchor),
      artistLabel.trailingAnchor.constraint(equalTo: songNameLabel.trailingAnchor),
      artistLabel.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -15),

      self.trailingAnchor.constraint(equalTo: chatButton.trailingAnchor),
      chatButton.centerYAnchor.constraint(equalTo: self.centerYAnchor),
      chatButton.widthAnchor.constraint(equalToConstant: 40),
      chatButton.heightAnchor.constraint(equalToConstant: 40),

      bottom.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      bottom.trailingAnchor.constraint(equalTo: self.trailingAnchor),
      bottom.heightAnchor.constraint(equalToConstant: 1),
      bottom.bottomAnchor.constraint(equalTo: self.bottomAnchor),

      chatImage.topAnchor.constraint(equalTo: chatButton.topAnchor, constant: 10),
      chatImage.leadingAnchor.constraint(equalTo: chatButton.leadingAnchor, constant: 10),
      chatButton.trailingAnchor.constraint(equalTo: chatImage.trailingAnchor, constant: 10),
      chatButton.bottomAnchor.constraint(equalTo: chatImage.bottomAnchor, constant: 10),
    ]
    NSLayoutConstraint.activate(constraints)


    chatButton.layer.borderColor = UIColor(named: "play_background")?.cgColor
    chatButton.layer.borderWidth = 1
    songNameLabel.textColor = UIColor(named: "accent_color")
    artistLabel.textColor = .lightGray
    bottom.backgroundColor = .gray.withAlphaComponent(0.5)

  }
}
