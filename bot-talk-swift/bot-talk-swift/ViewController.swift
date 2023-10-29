//
//  ViewController.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/28/23.
//

import UIKit

class ViewController: UIViewController {

  var viewModel: MusicViewModel?

  lazy var musicView: MusicPage = {
    guard let page = view as? MusicPage else {
      fatalError("Did you forget to create the MusicPage")
    }
    return page
  }()

  override func loadView() {
    let controllerView = MusicPage()
    view = controllerView
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    overrideUserInterfaceStyle = .light
    self.setupView()
    self.loadViewModel()
    // Do any additional setup after loading the view.
  }

  func setupView() {
    musicView.setupView()
    musicView.player.onChatRequested = {[weak self] (track, meta) in
      self?.didRequestChat(track: track, meta: meta)
    }
  }

  func loadViewModel() {
    if viewModel == nil {
      viewModel = DefaultMusicViewModel()
    }
    viewModel?.delegate = self
  }

  func didRequestChat(track: MusicTrack, meta: MusicTrackMetaInformation) {
    guard let url = AppConfig.botURL else {
      return
    }
    let controller = BotChatViewController()
    controller.urlString = url
    controller.track = track
    controller.meta = meta
    controller.lastSelectedTopic = viewModel?.getLastSelectedTopic()
    controller.modalPresentationStyle = .overCurrentContext
    controller.onNewTopicSelected = {[weak self] (newTopic) in
      self?.didSelectNewTopic(topic: newTopic)
    }
    self.present(controller, animated: true)
  }

  func didSelectNewTopic(topic: String) {
    viewModel?.newTopicSelectedOnChat(topic: topic)
  }

}


extension ViewController: MusicViewModelDelegate {
  func onMusicChanged(track: MusicTrack) {
    if let meta = viewModel?.getTrackMeta(forTrack: track) {
      musicView.startPlaying(track: track, meta: meta)
    }
  }

}
