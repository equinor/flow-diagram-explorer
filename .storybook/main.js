module.exports = {
    framework: {
        name: "@storybook/react-webpack5",
        options: { fastRefresh: true },
    },
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    webpackFinal: async (config, { configType }) => {
        const rules = config.module.rules;
        const fileLoaderRule = rules.find((rule) => rule.test.test(".svg"));
        fileLoaderRule.exclude = /\.svg$/;

        rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
};
