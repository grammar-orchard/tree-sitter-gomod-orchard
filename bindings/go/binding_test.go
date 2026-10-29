package tree_sitter_gomod_orchard_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_gomod_orchard "codeberg.org/grammar-orchard/tree-sitter-gomod-orchard/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gomod_orchard.Language())
	if language == nil {
		t.Errorf("Error loading go.mod grammar")
	}
}
