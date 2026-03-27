import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-plugin-prettier";

// parsers
const tsParser = tseslint.parser;
const astroParser = astro.parser;

export default defineConfig([
	// Global configuration
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	// Base configs
	js.configs.recommended,
	tseslint.configs.recommended,

	// Prettier config
	{
		plugins: {
			prettier: prettier,
		},
		rules: {
			"prettier/prettier": "off",
			"@typescript-eslint/no-explicit-any": "off", // you may want this as it can get annoying
			"@typescript-eslint/no-unused-vars": "off", // I sometimes purposely have unused vars as this is a template
			"@typescript-eslint/ban-ts-comment": "off",
		},
	},

	// astro setup
	astro.configs.recommended,
	astro.configs["jsx-a11y-recommended"],
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: [".astro"],
				sourceType: "module",
				ecmaVersion: "latest",
				project: "./tsconfig.json",
			},
		},
		rules: {
			"no-undef": "off", // Disable "not defined" errors for specific Astro types that are globally available (ImageMetadata)
			"@typescript-eslint/no-explicit-any": "off", // you may want this as it can get annoying
			"@typescript-eslint/no-unused-vars": "off", // I sometimes purposely have unused vars as this is a template
			"astro/jsx-a11y/anchor-is-valid": "off", // Disable anchor-is-valid rule for Astro files as this is a template
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},

	// Ignore patterns
	{
		ignores: [
			"dist/**",
			"**/*.d.ts",
			".tours/",
			"src/docs/scripts/**",
			"scripts/",
			"public/pagefind/",
			".github/",
			".netlify/",
			".changeset/",
		],
	},
]);
