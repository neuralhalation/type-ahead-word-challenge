import { DefinitionCard } from './definitionCard';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { getWordDefinition, getFromThesaurus } from '../services/definitions';
import { typeAhead } from '../services/words';
import TextField from '@material-ui/core/TextField';

export class DictionaryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            stems: [],
            pos: '',
            definitions: [],
            defFound: true,
            synonyms: null,
            synFound: true,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getDefinition = this.getDefinition.bind(this);
        this.fillOutDefinitionCard = this.fillOutDefinitionCard.bind(this);
        this.fillOutSynonymCard = this.fillOutSynonymCard.bind(this);
        this.getSynonyms = this.getSynonyms.bind(this);
        this.fillOutCards = this.fillOutCards.bind(this);
    }

    async handleSubmit() {
        this.setState({definition: await this.getDefinition()})
    }

    handleChange(event) {
        this.setState({text: event.target.value});
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
            this.setState({synFound: true});
            this.setState({synonyms: synonymData['meta']['syns']});
        } else {
            this.setState({synFound: false});
        }
    }

    async fillOutDefinitionCard() {
        const definitionData = await this.getDefinition();
        if (this.truthy(definitionData['meta'])) {
            console.log(definitionData['meta']);
            this.setState({defFound: true})
            this.setState({text: definitionData['meta']['id']})
            this.setState({stems: definitionData['meta']['stems']});
            this.setState({pos: definitionData['fl']})
            this.setState({definitions: definitionData['shortdef']});
        } else {
            this.setState({defFound: false})
        }  
    }

    async fillOutCards() {
        await this.fillOutDefinitionCard();
        await this.fillOutSynonymCard();
    }

    listStems(stems) {
        let stemList = '';
        stems.forEach(stem => {
            stemList += `[${stem}] `
        })
        return stemList;
    }

    listDefinitions(definitions) {
        const defs = definitions.map((def) => <ListItem>{def}</ListItem>)
        return (
            <List>
                {defs}
            </List>
        )
    }

    listSynonyms(synonyms) {
        if (this.truthy(this.state.synonyms)) {
            const syns = synonyms.map((synlist) => synlist.map((syn) => <ListItem>{syn}</ListItem>));
            return (
                <List>
                    {syns}
                </List>
            )
        } 
    }

    renderSynonymsCard() {
        return (
            <Card>
                <CardContent>{this.listSynonyms(this.state.synonyms)}</CardContent>
            </Card>
        )
    }

    renderDefinitionCard() {
        return (
            <Card>
                <h4 id='word'>{this.state.text}</h4>
                <CardContent><ul id='stems'>{this.listStems(this.state.stems)}</ul></CardContent>
                <CardContent id='pos'>{this.state.pos}</CardContent>
                <CardContent id='shortDef'>{this.listDefinitions(this.state.definitions)}</CardContent>
            </Card>
        )
    }

    renderNotFoundCard() {
        return (
            <Card>
                <h4>Oops, didn't find that. Maybe find a print dictionary or thesaurus?</h4>
            </Card>
        )
    }

    render() {
        return (
            <div>
                <TextField id='searchBox' value={this.state.text} onChange={this.handleChange} label='Search for a word' />
                <Box id='defineThisBox'>
                    <h4>Suggested words</h4>
                    <List id='defineThis'></List>
                </Box>
                <Button variant='contained' onClick={this.fillOutCards}/>
                <Box class='cardContainer'>
                    {this.state.defFound ? this.renderDefinitionCard() : this.renderNotFoundCard()}
                </Box>
                <Box class='cardContainer'>
                    { this.state.synFound ? this.renderSynonymsCard() : this.renderNotFoundCard()}
                </Box>
                
            </div>
        )
    }
}

export {};