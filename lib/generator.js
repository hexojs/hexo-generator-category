'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals){
  var config = this.config;
  var perPage = config.category_generator.per_page;
  var paginationDir = config.pagination_dir || 'page';
  var categories = locals.categories;
  var categoryDir;

  var pages = categories.reduce(function(result, category){
    if (!category.length) return result;

    var posts = category.posts.sort('-date');
    var data = pagination(category.path, posts, {
      perPage: perPage,
      layout: ['category', 'archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        category: category.name
      }
    });

    return result.concat(data);
  }, []);

  // generate category index page, usually /categories/index.html
  if (config.category_generator.enable_index_page) {
    categoryDir = config.category_dir;
    if (categoryDir[categoryDir.length - 1] !== '/') {
      categoryDir += '/';
    }

  pages.push({
    path: categoryDir,
    layout: ['category-index'],
    posts: locals.posts,
    data: {
      base: categoryDir,
      total: 1,
      current: 1,
      current_url: categoryDir,
      posts: locals.posts,
      prev: 0,
      prev_link: '',
      next: 0,
      next_link: '',
      categories: categories
    }
  });
}

return pages;
};