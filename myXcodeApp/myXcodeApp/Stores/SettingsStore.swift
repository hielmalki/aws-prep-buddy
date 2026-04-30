import Foundation
import Combine
import SwiftUI

@MainActor
final class SettingsStore: ObservableObject {
    static let shared = SettingsStore()

    @AppStorage("settings.theme") var theme: String = "system"
    @AppStorage("settings.dailyGoal") var dailyGoal: Int = 10
    @AppStorage("settings.openAIKey") var openAIKey: String = ""

    var colorScheme: ColorScheme? {
        switch theme {
        case "light": return .light
        case "dark": return .dark
        default: return nil
        }
    }

    private init() {}
}
