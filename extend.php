<?php


namespace Nodeloc\ProcessGraph;

use Flarum\Extend;
use Flarum\Frontend\Document;
use Psr\Http\Message\ServerRequestInterface as Request;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->content(function (Document $document, Request $request) {
            // 检查当前路由是否是插件定义的路由
            $requestUri = $request->getUri()->getPath();
            $routeName = $request->getAttribute('routeName');
            if (strpos($requestUri, '/process-graph') !== false) {
                // 如果是插件定义的路由，则添加 JavaScript 引用
                $document->head[] = '<script src="https://fastly.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>';
            }
        }),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Routes('api'))
        ->get('/process-graph', 'process-graph', Controllers\ApiProcessGraphController::class)
];
