import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';

export async function getAutocompleteList() {
  const response = await fetch(
    'https://api.noopschallenge.com/wordbot?set=default&count=1000000'
  );
  const json = await response.json();
  return json['words'];
}

async function getWords(keys) {
  const words = await getAutocompleteList();
  const word = words.filter(e => e.indexOf(keys.toLowerCase()) > -1);
  return word;
}

const wordRequest = keys => of(getWords(keys));

function notNull(x) {
  return x !== null;
}

function truthy(x) {
  return notNull(x) && x !== undefined;
}

export function typeAhead() {
  fromEvent(document.getElementById('searchBox'), 'keyup')
    .pipe(
      debounceTime(200),
      map(e => e.target.value),
      distinctUntilChanged(),
      switchMap(wordRequest),
      tap(c =>
        c.then(res => {
          if (truthy(res)) {
            document.getElementById('defineThis').innerText = res.join('\n');
          }
        })
      )
    )
    .subscribe();
}

export {};
