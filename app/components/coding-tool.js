import Ember from 'ember';

let { get, set} = Ember;

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  source: '',
  language: 'c',
  filename: 'main.c',
  showMessage: false,

  processReturnResult(response) {
    let result = '';
    let errorMessage = '';
    let stdout = '';
    let stderr = '';
    let outcome = get(response, 'outcome');

    if (outcome === 15) {
      result = "SUCCESS";
      stdout = get(response, 'stdout');
    } else if (outcome === 11) {
      result = "COMPILE_ERROR";
      errorMessage = get(response, 'cmpinfo');
    } else if (outcome === 12) {
      result = "RUNTIME_ERROR";
      stderr = get(response, 'stderr');
    } else if (outcome === 13) {
      result = "RUNTIME_ERROR";
      stderr = "Your submission took too long to execute.";
    } else if (outcome === 17) {
      result = "RUNTIME_ERROR";
      stderr = get(response, 'stderr');
    } else if (outcome === 19) {
      result = "RUNTIME_ERROR";
      stderr = get(response, 'stderr');
    } else {
      result = "RUNTIME_ERROR";
      stderr = "Unfortunately the compilation engine is not working properly at the moment. Please contact an administrator.";
    }

    set(this, 'result', result);
    set(this, 'errorMessage', errorMessage);
    set(this, 'stdout', stdout);
    set(this, 'stderr', stderr);
    set(this, 'showError', true);
  },

  actions: {
    sendRequest() {
      let source = get(this, 'source');
      let language = get(this, 'language');
      let filename = get(this, 'filename');
      set(this, 'showError', false);

      return this.get('ajax').request('http://52.89.42.128/jobe/index.php/restapi/runs', {
        method: 'POST',
        data: {
          run_spec: {
            sourcecode: source,
            language_id: language,
            sourcefilename: filename
          }
        }
      }).then((response) => {
        this.processReturnResult(response);
      }).catch((error) => {
        this.handleError(error);
      });
    }
  }
});
