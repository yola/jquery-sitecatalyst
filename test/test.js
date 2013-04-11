var s = {};
s.t = function() {};
s.clearVars = function() {};
var pn = window.document.URL +': '+ document.title;

describe("Tracking with no data", function () {
  var fixture;

  beforeEach(function () {
    spyOn(s, 't');
    spyOn(s, 'clearVars');

    fixture = $('<div class="track">Track Something</div>');
    fixture.sitecatalyst();
  });

  it('should call onmiture track method', function () {
    expect(s.t).toHaveBeenCalled();
  });

  it('should clear tracked data', function () {
    expect(s.clearVars).toHaveBeenCalled();
  });

  it('should set the pageName property to default', function() {
      expect(s.pageName).toEqual(pn);
  });

  it('should set the channel property to default', function() {
      expect(s.channel).toEqual('Website');
  });
});

describe('Tracking with data', function() {
  var fixture;

  beforeEach(function () {
    spyOn(s, 't');
    spyOn(s, 'clearVars');
    fixture = $('<div class="track2" data-omniture_evar2="html-override" data-omniture_evar3="html-override">Track Something</div>');

    fixture.sitecatalyst({
        'default_data': {
            'eVar1': 'evar',
            'eVar2': 'evar2',
            'sProp1': 'sprop',
            'sProp2': 'sprop2',
            'pageName': 'homepage',
            'purchaseID': 122
        }
    });
  });

  it('Overrides default pageName with passed spec', function() {
      expect(s.pageName).toEqual('homepage');
  });

  it('Data attributes overrides passed spec', function() {
    expect(s.eVar2).toEqual('html-override');
  });

  it('Data attributes append', function() {
    expect(s.eVar3).toEqual('html-override');
  });

  it('Sets sProp1 from passed spec', function() {
    expect(s.sProp1).toEqual('sprop');
  });

});