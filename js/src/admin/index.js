import app from 'flarum/admin/app';

app.initializers.add('nodeloc/flarum-process-graph', () => {
  console.log('[nodeloc/flarum-process-graph] Hello, admin!');
});
