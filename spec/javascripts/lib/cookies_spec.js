describe('jquery.cookie with zepto', function() {
  it('sets', function() {
    $.cookie('monster', 'not really');
    expect(document.cookie).toMatch(/monster/);
  });

  it('gets', function() {
    $.cookie('monster', 'not really');
    expect($.cookie('monster')).toBe('not really');
  });
});
