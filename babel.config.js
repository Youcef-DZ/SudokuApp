module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Temporarily disabled - causing bundling issues
            // 'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    alias: {
                        'react-native': 'react-native-web',
                    },
                },
            ],
        ],
    };
};
