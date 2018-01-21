import ExtendableError from 'es6-error';

class InvalidPageError extends ExtendableError {
  constructor(message = 'An invalid pagination page number was requested') {
    super(message);
  }
}

export default InvalidPageError;
