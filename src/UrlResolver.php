<?php

namespace GreenCheap\Docs;

use GreenCheap\Application as App;
use GreenCheap\Docs\Model\Docs;
use GreenCheap\Routing\ParamsResolverInterface;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

class UrlResolver implements ParamsResolverInterface
{
    const CACHE_KEY = 'docs.routing';

    /**
     * @var bool
     */
    protected $cacheDirty = false;

    /**
     * @var array
     */
    protected $cacheEntries;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->cacheEntries = App::cache()->fetch(self::CACHE_KEY) ?: [];
    }

    /**
     * {@inheritdoc}
     */
    public function match(array $parameters = [])
    {
        // var_dump($parameters);

        if (isset($parameters['id'])) {
            return $parameters;
        }

        if (!isset($parameters['slug'])) {
            App::abort(404, 'Docs not found.');
        }

        $slug = $parameters['slug'];

        $id = false;
        foreach ($this->cacheEntries as $entry) {
            if ($entry['slug'] === $slug) {
                $id = $entry['id'];
            }
        }

        if (!$id) {

            if (!$post = Docs::where(compact('slug'))->first()) {
                App::abort(404, 'Docs not found.');
            }

            $this->addCache($post);
            $id = $post->id;
        }

        $parameters['id'] = $id;
        // $parameters['alltitle'] = __('All Records');
        return $parameters;
    }

    /**
     * {@inheritdoc}
     */
    public function generate(array $parameters = [])
    {
        $id = $parameters['id'];

        if (!isset($this->cacheEntries[$id])) {

            if (!$post = Docs::where(compact('id'))->first()) {
                throw new RouteNotFoundException('Docs not found!');
            }

            $this->addCache($post);
        }

        $meta = $this->cacheEntries[$id];

        preg_match_all('#{([a-z]+)}#i', self::getPermalink(), $matches);

        if ($matches) {
            foreach($matches[1] as $attribute) {
                if (isset($meta[$attribute])) {
                    $parameters[$attribute] = $meta[$attribute];
                }
            }
        }

        unset($parameters['id']);
        return $parameters;
    }

    public function __destruct()
    {
        if ($this->cacheDirty) {
            App::cache()->save(self::CACHE_KEY, $this->cacheEntries);
        }
    }

    /**
     * Gets the docs's permalink setting.
     *
     * @return string
     */
    public static function getPermalink()
    {
        static $permalink;

        if (null === $permalink) {

            $docs = App::module('docs');
            $permalink = $docs->config('permalink.type');

            if ($permalink == 'custom') {
                $permalink = $docs->config('permalink.custom');
            }

        }

        return $permalink;
    }

    protected function addCache($post)
    {
        $this->cacheEntries[$post->id] = [
            'id'     => $post->id,
            'slug'   => $post->slug,
            'year'   => $post->date->format('Y'),
            'month'  => $post->date->format('m'),
            'day'    => $post->date->format('d'),
            'hour'   => $post->date->format('H'),
            'minute' => $post->date->format('i'),
            'second' => $post->date->format('s'),
        ];

        $this->cacheDirty = true;
    }
}
