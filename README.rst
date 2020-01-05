Type Ahead Word Challenge
#########################

Create a typeahead textbox using RxJs and React components.


Main Libraries Used
###################

| ``rxjs``
| ``react``
| ``material-ui``


What you will need
##################

You will need your own `env.js` file in the `src` directory 
that contains a `const` called `keys` and then nodes for your 
endpoints and Merriam-Webster keys.

It should end up looking something like:

.. code-block:: javascript

   export const keys = {
    dictionaryKey: 'your dictionary key here',
    thesaurusKey: 'your thesaurus key here',
    merriamWebsterDictApi: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
    merriamWebsterThesApi: 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/'
   }


Haiku
#####
| stop typing so much
| let us observe and help you
| compose all your thoughts
