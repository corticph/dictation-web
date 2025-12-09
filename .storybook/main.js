export default {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y'],
  framework:  '@storybook/web-components-vite',

  wdsFinal: async (config) => {
    return {
      ...config,
      nodeResolve: {
        ...config.nodeResolve,
        exportConditions: ['browser', 'development'],
        browser: true,
        mainFields: ['browser', 'module', 'main'],
        preferBuiltins: false,
      },
      plugins: [
        ...(config.plugins || []),
        {
          name: 'resolve-ws',
          resolveImport({ source }) {
            if (source === 'ws') {
              return 'data:text/javascript,export const WebSocket = globalThis.WebSocket;';
            }
          },
        },
      ],
    };
  },
};
