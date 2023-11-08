module.exports = {
    framework: {
        name: '@storybook/react-webpack5',
        options: { fastRefresh: true }
    },
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    webpackFinal: async (config, { configType }) => {
        config.module.rules.forEach((rule) => {
            if (rule.loader) {
                if (rule.loader.includes("file-loader")) {
                    rule.test = /\.(ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/;
                }
            }
        });
        config.module.rules.push({
            test: /\.svg$/,
            exclude: /node_modules/,
            loader: require.resolve("@svgr/webpack"),
        });

        return config;
    },
};

// main.ts 

// import type { StorybookConfig } from "@storybook/react-webpack5";

// const config: StorybookConfig = {
//     stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
//     addons: [
//         "@storybook/addon-links",
//         "@storybook/addon-essentials",
//         "@storybook/addon-onboarding",
//         "@storybook/addon-interactions",
//     ],
//     framework: {
//         name: "@storybook/react-webpack5",
//         options: {},
//     },
//     docs: {
//         autodocs: "tag",
//     },
// };
// export default config;
