'use strict';

var assign = require('object-assign');

hexo.config.category_generator = assign({
  per_page: hexo.config.per_page || 10
}, hexo.config.category_generator);

hexo.extend.generator.register('category', require('./lib/generator'));