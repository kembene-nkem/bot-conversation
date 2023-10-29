//
//  Configuration.swift
//  bot-talk-swift
//
//  Created by Kembene Nkem on 10/29/23.
//

import Foundation

enum AppConfig {
  fileprivate static var info: [String: Any] = {
    Bundle.main.infoDictionary ?? [:]
  }()

  static var botURL: String? {
    return (info["CODY_URL"] as? String)?.replacingOccurrences(of: "\\/\\/", with: "//")
  }
}
