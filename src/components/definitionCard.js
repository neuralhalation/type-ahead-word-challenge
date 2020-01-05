import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import { DynamicDefinition } from './definition';

export class DefinitionCard extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <Card className='definitionCard'>
                <DynamicDefinition></DynamicDefinition>
                <CardContent id='etymology'></CardContent>
            </Card>
        )
    }
}