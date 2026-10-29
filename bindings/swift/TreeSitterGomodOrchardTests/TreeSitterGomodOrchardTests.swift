import XCTest
import SwiftTreeSitter
import TreeSitterGomodOrchard

final class TreeSitterGomodOrchardTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_gomod_orchard())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading go.mod grammar")
    }
}
