module.exports = {
	env: {
		es2020: true,
	},
	extends: [
		"eslint:recommended",
		"prettier/@typescript-eslint",
		"prettier",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
	],
	plugins: ["@typescript-eslint", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"prettier/prettier": "error",
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@typescript-eslint/explicit-function-return-type": "off",
	},
	overrides: [
		{
			files: ["./*.js"],
			env: {
				node: true,
				"commonjs": true,
			},
			rules: {
				"@typescript-eslint/no-var-requires": "off",
			}
		}
	]
};
