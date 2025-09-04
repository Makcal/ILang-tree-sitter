Install Node.js, C compiler and Tree-sitter CLI.

```bash
tree-sitter build
```

Now use `parser.so`, `queries` and `snippets` in the desired location.


### NeoVim example
```
.config/nvim
├── parser
│   └── i_lang.so
├── queries
│   └── i_lang
│       └── highlights.scm
└── snippets
    ├── i_lang.json
    └── package.json
```


```lua
-- Project I language
vim.filetype.add({
	extension = {
		il = "i_lang",
	},
})
vim.api.nvim_create_autocmd("Filetype", {
	pattern = "i_lang",
	callback = function(args)
		vim.treesitter.start(args.buf, "i_lang")
	end,
})
require("luasnip.loaders.from_vscode").lazy_load({
	paths = "~/.config/nvim/snippets",
})
```
