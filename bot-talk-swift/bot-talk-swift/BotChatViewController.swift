//
//  BotChatViewController.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/29/23.
//

import UIKit
import WebKit

class BotChatViewController: UIViewController {

  lazy var webView: WKWebView = {
    let configuration = WKWebViewConfiguration()
    configuration.websiteDataStore = WKWebsiteDataStore.nonPersistent()
    return WKWebView(frame: .zero, configuration: configuration)
  }()

  lazy var closeButton: UIButton = {
    let button = UIButton(type: .system)
    button.setTitle("Close", for: .normal)
    button.backgroundColor = .black
    button.tintColor = .white
    return button
  }()

  var urlString: String?
  var track: MusicTrack?
  var meta: MusicTrackMetaInformation?
  var lastSelectedTopic: String?

  var onNewTopicSelected: ((_ topic: String)-> Void)?



  override func viewDidLoad() {
    super.viewDidLoad()
    overrideUserInterfaceStyle = .light
    layoutWebViewComponents()

    webView.navigationDelegate = self
    webView.isInspectable = true

    webView.configuration.userContentController.add(self, name: "botHandler")
    if let urlStrong = urlString, let url = URL(string: urlStrong) {
      let request = URLRequest(url: url)
      webView.load(request)
    }

      // Do any additional setup after loading the view.
  }

  func layoutWebViewComponents() {
    let controlHolder = UIView()
    controlHolder.addSubview(closeButton)

    view.addSubview(controlHolder)
    view.addSubview(webView)

    controlHolder.backgroundColor = UIColor(named: "background")

    controlHolder.translatesAutoresizingMaskIntoConstraints = false
    webView.translatesAutoresizingMaskIntoConstraints = false
    closeButton.translatesAutoresizingMaskIntoConstraints = false


    let constraints = [
      controlHolder.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      controlHolder.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      closeButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
      closeButton.widthAnchor.constraint(equalToConstant: 80),
      closeButton.heightAnchor.constraint(equalToConstant: 40),

      closeButton.leadingAnchor.constraint(equalTo: controlHolder.leadingAnchor),
      closeButton.topAnchor.constraint(equalTo: controlHolder.topAnchor, constant: 10),
      controlHolder.bottomAnchor.constraint(equalTo: closeButton.bottomAnchor, constant: 10),
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      webView.topAnchor.constraint(equalTo: controlHolder.bottomAnchor),
      view.safeAreaLayoutGuide.bottomAnchor.constraint(equalTo: webView.bottomAnchor)
    ]
    closeButton.addTarget(self, action: #selector(closeMe), for: .touchUpInside)
    NSLayoutConstraint.activate(constraints)
  }

  @objc func closeMe() {
    self.dismiss(animated: true)
  }


    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

extension BotChatViewController: WKNavigationDelegate {
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation) {
    let contentToLoad: [String: Any?] = [
      "trackId": track?.trackId,
      "artistId": meta?.artist.artistId,
      "albumId": meta?.album.albumId,
      "currentTrack": track?.trackName,
      "albumName": meta?.album.albumName,
      "artistName": meta?.artist.artistName,
      "lastChatTopic": lastSelectedTopic ?? "Jokes"
    ]
    guard let jsonData = try? JSONSerialization.data(withJSONObject: contentToLoad, options: []),
          let jsonString = String(data: jsonData, encoding: .utf8) else {
      return
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
      let invocation = "$prime.triggerEvent('PLAYLIST_INFO_LOADED', \(jsonString));console.log('here')"
      self.webView.evaluateJavaScript(invocation) { (result, error) in
          if let error = error {
              print("Error calling JavaScript function: \(error)")
          }
      }
    }
  }
}

extension BotChatViewController: WKScriptMessageHandler {
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    print(message.body)
    if message.name != "botHandler" {
      return
    }
    guard let data = message.body as? [String: Any?], 
            let event = data["event"] as? String else {
      return
    }

    if event != "TOPIC_SELECTED" {
      return
    }

    let info = data["data"] as? [String: Any?] ?? [:]

    if let name = info["name"] as? String {
      onNewTopicSelected?(name)
    }

  }
}

#Preview {
  return BotChatViewController()
}
