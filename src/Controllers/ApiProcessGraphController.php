<?php

/*
 * This file is part of foskym/flarum-activity-graph.
 *
 * Copyright (c) 2024 FoskyM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
namespace Nodeloc\ProcessGraph\Controllers;
use Flarum\User\User;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
// use Illuminate\Support\Facades\DB;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Group\Group;
use Flarum\Discussion\Discussion;
class ApiProcessGraphController implements RequestHandlerInterface
{
    protected $settings;
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $params = $request->getQueryParams();
        $user_id = Arr::get($params, 'user_id', $actor->id);

        // 查询当前用户发布的 is_lottery = 1 的主题数量
        $total = Discussion::where('user_id', $user_id)
            ->where('is_lottery', 1)
            ->count();

        return new JsonResponse([
            'total' => $total
        ]);
    }
}
