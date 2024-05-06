import app from 'flarum/common/app';

app.initializers.add('nodeloc/flarum-process-graph', () => {
  console.log('[nodeloc/flarum-process-graph] Hello, forum and admin!');
});
