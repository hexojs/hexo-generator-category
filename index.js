var merge = require('utils-merge');

hexo.config.category_generator = merge({
  per_page: 10
}, hexo.config.category_generator);

hexo.extend.generator.register('category', require('./lib/generator'));