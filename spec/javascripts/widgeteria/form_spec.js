describe('Wheel.Widgeteria.Form', function() {
  var dom, form, Former;

  beforeEach(function() {
    Former = Wheel.Widgeteria.Form.subclass();
    dom =
    "  <form action='/users/new' method='put'>" +
    "    <input type='email' name='user[email]' value='baccigalupi@gmail.com'/>" +
    "    <input type='password' name='user[password]' value='secret'/>" +
    "    <select name='user[referral]'>" +
    "      <option value='friend' selected='selected'>From a Friend</option>" +
    "      <option value='other'>Other</option>" +
    "    </select>" +
    "    <input type='checkbox' name='user[interests]' checked=checked value='social'/>Socialize" +
    "    <input type='checkbox' name='user[interests]' value='professional'/>Professional" +
    "    <input type='checkbox' name='user[interests]' checked=checked value='dating'/>Dating" +
    "    <input type='radio' name='user[gender]' value='male' />Male" +
    "    <input type='radio' name='user[gender]' value='female' />Female" +
    "    <input type='radio' name='user[gender]' value='other' checked='checked'/>Other" +
    "    <textarea name='user[profile]'>I like hiking and fine wine.</textarea>" +
    "    <input type='submit' name='button' value='Create Account'/>" +
    "  </form>";
    form = new Former(dom);
  });

  it("gets its url from the action", function() {
    expect(form.url).toBe("/users/new");
  });

  it("gets its httpMethod from the method attribute", function() {
    expect(form.httpMethod).toBe('put');
  });

  describe("data serialization", function () {
    var data;
    beforeEach(function() {
      data = form.data();
    });

    it("works for checkboxes", function() {
      var interests = data['user[interests]'];
      expect(interests.length).toBe(2);
      expect(interests[0]).toBe('social');
      expect(interests[1]).toBe('dating');
    });

    it("works for radio boxes", function() {
      expect(data['user[gender]']).toBe('other');
    });

    it("works for other inputs with names", function() {
      expect(data['user[email]']).toBe('baccigalupi@gmail.com');
    });

    it("works with selects", function() {
      expect(data['user[referral]']).toBe('friend');
    });

    it("works with textareas", function() {
      expect(data['user[profile]']).toBe("I like hiking and fine wine.");
    });
  });

  describe("the submit event", function () {
    var event;
    beforeEach(function() {
      event = $.Event('submit');
      spyOn(event, 'preventDefault').andCallThrough();
    });

    it("prevents the default submit", function () {
      form.$.trigger(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("calls onSubmit", function() {
      spyOn(form, 'onSubmit');
      form.$.trigger(event);
      expect(form.onSubmit).toHaveBeenCalled();
    });
  });
});
