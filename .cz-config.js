module.exports = {
  types: [
    {
      value: 'WIP',
      name: '🖌  WIP:      Work in progress',
    },
    {
      value: 'feat',
      name: '🍺 feat:     A new feature',
    },
    {
      value: 'fix',
      name: '🐞 fix:      A bug fix',
    },
    {
      value: 'build',
      name: '🛠  build:    Changes that affect the build system or external dependencies (example scopes: composer, webpack, go mod)',
    },
    {
      value: 'chore',
      name: '☀️  chore:    Other changes that don\'t modify src or test files',
    },
    {
      value: 'refactor',
      name: '🪓  refactor: A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'docs',
      name: '📚 docs:     Documentation only changes',
    },
    {
      value: 'test',
      name: '⚖️  test:     Add missing tests or correcting existing tests',
    },
    {
      value: 'style',
      name: '💅 style:    Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    },
    {
      value: 'revert',
      name: '⏪ revert:   Revert to a commit',
    },
  ],

  scopes: [],

  allowCustomScopes: true,

  skipQuestions: ['footer'],

  allowBreakingChanges: ['feat', 'fix'],
};
