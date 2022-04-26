'use strict';


/**
 * Returns whether or not a pattern exists in a searched string.
 * @param regex - Regex on which to perform the search.
 * @return - true if the pattern exists, false otherwise.
 * @example - `['foo', 'bar', 'noodle'].filter(grep(/oo/)`
 */
const grep = (regex: RegExp): () => boolean => {
  // https://stackoverflow.com/questions/20579033/why-do-i-need-to-write-functionvalue-return-my-functionvalue-as-a-callb
  if (!regex) {
    throw Error('Regex required');
  }
  return RegExp.prototype.test.bind(regex);
};

export = grep;
