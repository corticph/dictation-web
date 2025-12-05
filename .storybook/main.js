export default {
  stories: ['../dist/stories/**/*.stories.{js,md,mdx}'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@web/storybook-framework-web-components',
  },
  core: {
    builder: '@web/storybook-builder',
  },
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
