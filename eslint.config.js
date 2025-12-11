const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const _import = require("eslint-plugin-import");

const {
    fixupPluginRules,
    fixupConfigRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    files: ['**/*.ts'],
    languageOptions: {
        parser: tsParser,
        sourceType: "module",

        parserOptions: {
            project: ["./tsconfig.json"],
        },

        globals: {
            ...globals.node,
            ...globals.jest,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        import: fixupPluginRules(_import),
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
    )),

    settings: {
        "import/resolver": {
            typescript: {},
        },
    },

    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-explicit-any": "off",

        "import/order": ["warn", {
            groups: ["builtin", "external", "internal"],
            "newlines-between": "always",
        }],
    },
}]);
