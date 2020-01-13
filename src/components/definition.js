import Box from '@material-ui/core/Box';
import React from 'react';

export class DynamicDefinition extends React.Component {
  notNull(x) {
    return x !== null;
  }

  truthy(x) {
    return this.notNull(x) && x !== undefined;
  }

  render() {
    return (
      <Box className="definitionContainer">
        <label id="definition">{this.props.value}</label>
      </Box>
    );
  }
}
