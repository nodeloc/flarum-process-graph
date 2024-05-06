import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import GraphPage from "./pages/GraphPage";
import LinkButton from 'flarum/common/components/LinkButton';
app.initializers.add('nodeloc/flarum-process-graph', () => {
  app.routes['user.process-graph'] = {
    path: '/u/:username/process-graph',
    component: GraphPage
  };
  extend(UserPage.prototype, 'navItems', function (items) {
    items.add(
      'process-graph',
      LinkButton.component(
        {
          href: app.route('user.process-graph', { username: this.user.username() }),
          icon: 'fas fa-chart-line',
        },
        [
          app.translator.trans('nodeloc-process-graph.forum.label.process_graph'),
        ]
      )
    );
  });
});
