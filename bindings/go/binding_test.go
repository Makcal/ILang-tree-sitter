package tree_sitter_i_lang_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_i_lang "github.com/Makcal/ILang-tree-sitter/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_i_lang.Language())
	if language == nil {
		t.Errorf("Error loading ILang grammar")
	}
}
