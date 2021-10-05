module.exports = {
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
