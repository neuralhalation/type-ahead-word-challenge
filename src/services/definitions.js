import * as env from '../env';

const dictionaryKey = env.keys.dictionaryKey;
const thesaurusKey = env.keys.thesaurusKey;
const merriamWebsterDictApi = env.keys.merriamWebsterDictApi;
const merriamWebsterThesApi = env.keys.merriamWebsterThesApi;

function notNull(x) {
  return x !== null;
}

function truthy(x) {
  return notNull(x) && x !== undefined;
}

export async function getWordDefinition(word) {
  const url = `${merriamWebsterDictApi}/${word}?key=${dictionaryKey}`;
  let response = await fetch(url);
  let json = await response.json();
  return truthy(json) ? json : null;
}

export async function getFromThesaurus(word) {
  const url = `${merriamWebsterThesApi}/${word}?key=${thesaurusKey}`;
  let response = await fetch(url);
  let json = await response.json();
  return truthy(json) ? json : null;
}
