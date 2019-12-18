'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');

describe('Category generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  hexo.init();
  const Post = hexo.model('Post');
  const generator = require('../lib/generator').bind(hexo);
  let posts,
    locals;

  // Default config
  hexo.config.category_generator = {
    per_page: 10
  };

  before(() => {
    return Post.insert([
      {source: 'foo', slug: 'foo', date: 1e8},
      {source: 'bar', slug: 'bar', date: 1e8 + 1},
      {source: 'baz', slug: 'baz', date: 1e8 - 1},
      {source: 'boo', slug: 'boo', date: 1e8 + 2}
    ]).then(data => {
      posts = data;

      return posts[0].setCategories(['foo'])
        .then(() => posts[1].setCategories(['bar']))
        .then(() => posts[2].setCategories(['foo']))
        .then(() => posts[3].setCategories(['foo']))
        .then(() => {
          locals = hexo.locals.toObject();
        });
    });
  });

  it('pagination enabled', () => {
    hexo.config.category_generator.per_page = 2;

    const result = generator(locals);

    result.length.should.eql(3);

    for (const i in result) {
      result[i].layout.should.eql(['category', 'archive', 'index']);
    }

    result[0].path.should.eql('categories/foo/');
    result[0].data.base.should.eql('categories/foo/');
    result[0].data.total.should.eql(2);
    result[0].data.current.should.eql(1);
    result[0].data.current_url.should.eql('categories/foo/');
    result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
    result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
    result[0].data.prev.should.eql(0);
    result[0].data.prev_link.should.eql('');
    result[0].data.next.should.eql(2);
    result[0].data.next_link.should.eql('categories/foo/page/2/');
    result[0].data.category.should.eql('foo');

    result[1].path.should.eql('categories/foo/page/2/');
    result[1].data.base.should.eql('categories/foo/');
    result[1].data.total.should.eql(2);
    result[1].data.current.should.eql(2);
    result[1].data.current_url.should.eql('categories/foo/page/2/');
    result[1].data.posts.eq(0)._id.should.eql(posts[2]._id);
    result[1].data.prev.should.eql(1);
    result[1].data.prev_link.should.eql('categories/foo/');
    result[1].data.next.should.eql(0);
    result[1].data.next_link.should.eql('');
    result[1].data.category.should.eql('foo');

    result[2].path.should.eql('categories/bar/');
    result[2].data.base.should.eql('categories/bar/');
    result[2].data.total.should.eql(1);
    result[2].data.current.should.eql(1);
    result[2].data.current_url.should.eql('categories/bar/');
    result[2].data.posts.eq(0)._id.should.eql(posts[1]._id);
    result[2].data.prev.should.eql(0);
    result[2].data.prev_link.should.eql('');
    result[2].data.next.should.eql(0);
    result[2].data.next_link.should.eql('');
    result[2].data.category.should.eql('bar');

    // Restore config
    hexo.config.category_generator.per_page = 10;
  });

  it('pagination disabled', () => {
    hexo.config.category_generator.per_page = 0;

    const result = generator(locals);

    result.length.should.eql(2);

    for (const i in result) {
      result[i].layout.should.eql(['category', 'archive', 'index']);
    }

    result[0].path.should.eql('categories/foo/');
    result[0].data.base.should.eql('categories/foo/');
    result[0].data.total.should.eql(1);
    result[0].data.current.should.eql(1);
    result[0].data.current_url.should.eql('categories/foo/');
    result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
    result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
    result[0].data.posts.eq(2)._id.should.eql(posts[2]._id);
    result[0].data.prev.should.eql(0);
    result[0].data.prev_link.should.eql('');
    result[0].data.next.should.eql(0);
    result[0].data.next_link.should.eql('');
    result[0].data.category.should.eql('foo');

    result[1].path.should.eql('categories/bar/');
    result[1].data.base.should.eql('categories/bar/');
    result[1].data.total.should.eql(1);
    result[1].data.current.should.eql(1);
    result[1].data.current_url.should.eql('categories/bar/');
    result[1].data.posts.eq(0)._id.should.eql(posts[1]._id);
    result[1].data.prev.should.eql(0);
    result[1].data.prev_link.should.eql('');
    result[1].data.next.should.eql(0);
    result[1].data.next_link.should.eql('');
    result[1].data.category.should.eql('bar');

    // Restore config
    hexo.config.category_generator.per_page = 10;
  });

  it('custom pagination_dir', () => {
    hexo.config.category_generator.per_page = 2;
    hexo.config.pagination_dir = 'yo';

    const result = generator(locals);

    result.map(item => item.path).should.eql(['categories/foo/', 'categories/foo/yo/2/', 'categories/bar/']);

    // Restore config
    hexo.config.category_generator.per_page = 10;
    hexo.config.pagination_dir = 'page';
  });
});
