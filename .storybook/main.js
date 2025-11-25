const config = {
  stories: ['../dist/stories/**/*.stories.{js,md,mdx}'],
  framework: {
    name: '@web/storybook-framework-web-components',
  },
  core: {
    builder: '@web/storybook-builder',
  },
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
  ],
};

export default config;