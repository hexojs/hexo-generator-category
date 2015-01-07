var merge = require('utils-merge');

hexo.config.category_generator = merge({
  per_page: hexo.config.per_page
}, hexo.config.category_generator);

hexo.extend.generator.register('category', require('./lib/generator'));