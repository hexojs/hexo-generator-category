var pagination = require('hexo-pagination');

function categoryGenerator(locals){
  var config = this.config;

  return locals.categories.map(function(category){
    if (!category.length) return [];

    var posts = category.posts.sort('-date');

    return pagination(category.path, posts, {
      perPage: config.category_generator.per_page || config.per_page,
      layout: ['category', 'archive', 'index'],
      data: {
        category: category.name
      }
    });
  }).then(function(data){
    return Array.prototype.concat.apply([], data);
  });
}

module.exports = categoryGenerator;