import XCTest
import SwiftTreeSitter
import TreeSitterILang

final class TreeSitterILangTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_i_lang())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading ILang grammar")
    }
}
