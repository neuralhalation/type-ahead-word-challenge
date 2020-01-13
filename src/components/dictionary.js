import { Box, Container, Grid, Typography } from '@material-ui/core';
import { getFromThesaurus, getWordDefinition } from '../services/definitions';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { typeAhead } from '../services/words';

const initialState = {
  text: '',
  stems: [],
  pos: '',
  definitions: [],
  defFound: false,
  synonyms: null,
  synFound: false
};

export class DictionaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getDefinition = this.getDefinition.bind(this);
    this.fillOutDefinitionCard = this.fillOutDefinitionCard.bind(this);
    this.fillOutSynonymCard = this.fillOutSynonymCard.bind(this);
    this.getSynonyms = this.getSynonyms.bind(this);
    this.fillOutCards = this.fillOutCards.bind(this);
  }

  async handleSubmit() {
    this.setState({ definition: await this.getDefinition() });
  }

  handleChange(event) {
    this.setState(initialState);
    this.setState({ text: event.target.value });
    typeAhead();
  }

  async getDefinition() {
    const definitionData = await getWordDefinition(this.state.text);
    return definitionData[0];
  }

  async getSynonyms() {
    const synonymData = await getFromThesaurus(this.state.text);
    return synonymData[0];
  }

  notNull(x) {
    return x !== null;
  }

  truthy(x) {
    return this.notNull(x) && x !== undefined;
  }

  async fillOutSynonymCard() {
    const synonymData = await this.getSynonyms();
    if (this.truthy(synonymData['meta'])) {
      this.setState({ synFound: true });
      this.setState({ synonyms: synonymData['meta']['syns'] });
    } else {
      this.setState({ synFound: false });
    }
  }

  async fillOutDefinitionCard() {
    const definitionData = await this.getDefinition();
    if (this.truthy(definitionData)) {
      console.log(definitionData);
      this.setState({ defFound: true });
      this.setState({ syll: definitionData['hwi']['hw'].replace('*', '•') });
      this.setState({ prs: definitionData['hwi']['prs'][0]['mw'] });
      this.setState({ stems: definitionData['meta']['stems'] });
      this.setState({ pos: definitionData['fl'] });
      this.setState({ definitions: definitionData['shortdef'] });
    } else {
      this.setState({ defFound: false });
    }
  }

  async fillOutCards() {
    await this.fillOutDefinitionCard();
    await this.fillOutSynonymCard();
  }

  listStems(stems) {
    let stemList = '';
    stems.forEach(stem => {
      stemList += `[${stem}] `;
    });
    return stemList;
  }

  listDefinitions(definitions) {
    const defs = definitions.map(def => <ListItem>{def}</ListItem>);
    return <List>{defs}</List>;
  }

  listSynonyms(synonyms) {
    if (this.truthy(this.state.synonyms)) {
      const syns = synonyms.map(synlist =>
        synlist.map(syn => <ListItem>{syn}</ListItem>)
      );
      return <List>{syns}</List>;
    }
  }

  renderSynonymsCard() {
    return this.state.synFound ? (
      <Box>
        <Typography component="span" variant="subtitle1">
          Synonyms:
        </Typography>
        {this.listSynonyms(this.state.synonyms)}
      </Box>
    ) : null;
  }

  renderDefinitionCard() {
    return this.state.defFound ? (
      <Box component="div">
        <Typography component="span" variant="h6">
          {this.state.text}{' '}
          <span style={{ fontStyle: 'italic', color: 'blue' }}>
            {this.state.pos}
          </span>
        </Typography>
        <Typography component="div" variant="subtitle1">
          {this.state.syll} | {this.state.prs}
        </Typography>
        <Typography component="div" variant="subtitle1">
          {this.listStems(this.state.stems)}
        </Typography>
        {this.listDefinitions(this.state.definitions)}
      </Box>
    ) : null;
  }

  renderNotFoundCard() {
    return (
      <h4>
        Oops, didn't find that. Maybe find a print dictionary or thesaurus?
      </h4>
    );
  }

  render() {
    return (
      <Container>
        <Typography component="div" variant="h5">
          Type Ahead Dictionary
        </Typography>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <Paper elevation={2}>
            <Typography component="div" variant="h6">
              1: Search for a Word
            </Typography>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <TextField
                id="searchBox"
                value={this.state.text}
                onChange={this.handleChange}
                label="Search for a word"
              />
              <Button variant="contained" onClick={this.fillOutCards}>
                Go
              </Button>
            </Grid>
          </Paper>
          <Paper elevation={2}>
            <Typography component="div" variant="h6">
              2: Perhaps one of these words?
            </Typography>
            <List id="defineThis"></List>
          </Paper>
          <Paper elevation={2}>
            <Typography component="div" variant="h6">
              3: Definition
            </Typography>
            {this.renderDefinitionCard()}
            {this.renderSynonymsCard()}
          </Paper>
        </Grid>
      </Container>
    );
  }
}

export {};
